package com._bet.service;

import com._bet.entity.*;
import com._bet.entity.Apuesta.TipoApuesta;
import com._bet.entity.Apuesta.EstadoApuesta;
import com._bet.entity.Apuesta.ResultadoFinal;
import com._bet.entity.Parlay.EstadoParlay;
import com._bet.entity.Parlay.ResultadoFinalParlay;
import com._bet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestionar apuestas individuales y parlays
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ApuestaService {

    private final ApuestaRepository apuestaRepository;
    private final ParlayRepository parlayRepository;
    private final MomioRepository momioRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;

    @Value("${betting.minimum.bet:1.00}")
    private BigDecimal apuestaMinima = BigDecimal.valueOf(1.00);

    @Value("${betting.maximum.bet:10000.00}")
    private BigDecimal apuestaMaxima = BigDecimal.valueOf(10000.00);

    @Value("${betting.maximum.parlay.selections:10}")
    private int maximoSeleccionesParlay = 10;

    /**
     * Crea una apuesta individual
     */
    @Transactional
    public Apuesta crearApuesta(Long usuarioId, Long momioId, BigDecimal montoApuesta, TipoApuesta tipoApuesta) {
        log.info("Creando apuesta para usuario {} en momio {} por monto {}", usuarioId, momioId, montoApuesta);

        // Validaciones
        validarMontoApuesta(montoApuesta);
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Momio momio = momioRepository.findById(momioId)
            .orElseThrow(() -> new RuntimeException("Momio no encontrado"));

        // Validar que el evento no haya comenzado
        validarEventoDisponibleParaApuesta(momio.getEventoDeportivo());
        
        // Validar saldo del usuario
        validarSaldoUsuario(usuario, montoApuesta);

        // Crear la apuesta
        Apuesta apuesta = new Apuesta();
        apuesta.setUsuario(usuario);
        apuesta.setEventoDeportivo(momio.getEventoDeportivo());
        apuesta.setTipoApuesta(tipoApuesta);
        apuesta.setResultadoApostado(Apuesta.ResultadoApuesta.valueOf(momio.getResultado().toString()));
        apuesta.setMonto(montoApuesta);
        apuesta.setMomio(momio.getValor());
        apuesta.setGananciaPotencial(calcularGananciaPotencial(montoApuesta, momio.getValor()));
        apuesta.setEstado(Apuesta.EstadoApuesta.ACTIVA);

        // Descontar saldo del usuario
        usuario.setSaldoUsd(usuario.getSaldoUsd().subtract(montoApuesta));
        usuarioRepository.save(usuario);

        // Guardar apuesta
        apuesta = apuestaRepository.save(apuesta);
        
        log.info("Apuesta creada exitosamente con ID: {}", apuesta.getId());
        return apuesta;
    }

    /**
     * Crea un parlay con múltiples selecciones
     */
    @Transactional
    public Parlay crearParlay(Long usuarioId, List<Long> momiosIds, BigDecimal montoApuesta) {
        log.info("Creando parlay para usuario {} con {} selecciones por monto {}", 
            usuarioId, momiosIds.size(), montoApuesta);

        // Validaciones
        validarMontoApuesta(montoApuesta);
        validarSeleccionesParlay(momiosIds);
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Momio> momios = momioRepository.findAllById(momiosIds);
        if (momios.size() != momiosIds.size()) {
            throw new RuntimeException("Uno o más momios no encontrados");
        }

        // Validar que todos los eventos estén disponibles para apostar
        for (Momio momio : momios) {
            validarEventoDisponibleParaApuesta(momio.getEventoDeportivo());
        }
        
        // Validar saldo del usuario
        validarSaldoUsuario(usuario, montoApuesta);

        // Calcular momio combinado
        BigDecimal momioCombinadoTotal = calcularMomioCombinadoParlay(momios);
        BigDecimal gananciaPotencial = calcularGananciaPotencial(montoApuesta, momioCombinadoTotal);

        // Crear el parlay
        Parlay parlay = new Parlay();
        parlay.setUsuario(usuario);
        parlay.setMontoTotal(montoApuesta);
        parlay.setMomioTotal(momioCombinadoTotal);
        parlay.setGananciaPotencial(gananciaPotencial);
        parlay.setEstado(Parlay.EstadoParlay.ACTIVO);
        parlay.setNumeroApuestas(momios.size());

        // Guardar parlay primero para obtener el ID
        parlay = parlayRepository.save(parlay);

        // Crear apuestas individuales asociadas al parlay
        for (Momio momio : momios) {
            Apuesta apuesta = new Apuesta();
            apuesta.setUsuario(usuario);
            apuesta.setParlay(parlay);
            apuesta.setEventoDeportivo(momio.getEventoDeportivo());
            apuesta.setTipoApuesta(Apuesta.TipoApuesta.GANADOR_PARTIDO); // Usar un tipo válido
            apuesta.setResultadoApostado(Apuesta.ResultadoApuesta.valueOf(momio.getResultado().toString()));
            apuesta.setMonto(BigDecimal.ZERO); // En parlay, el monto está en el parlay padre
            apuesta.setMomio(momio.getValor());
            apuesta.setGananciaPotencial(BigDecimal.ZERO); // Calculado a nivel de parlay
            apuesta.setEstado(Apuesta.EstadoApuesta.ACTIVA);
            
            apuestaRepository.save(apuesta);
        }

        // Descontar saldo del usuario
        usuario.setSaldoUsd(usuario.getSaldoUsd().subtract(montoApuesta));
        usuarioRepository.save(usuario);

        log.info("Parlay creado exitosamente con ID: {}", parlay.getId());
        return parlay;
    }

    /**
     * Resuelve una apuesta individual después de que termine el evento
     */
    @Transactional
    public void resolverApuesta(Long apuestaId, Apuesta.ResultadoFinal resultado) {
        log.info("Resolviendo apuesta {} con resultado {}", apuestaId, resultado);

        Apuesta apuesta = apuestaRepository.findById(apuestaId)
            .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));

        if (apuesta.getEstado() != Apuesta.EstadoApuesta.ACTIVA) {
            throw new RuntimeException("La apuesta ya fue resuelta");
        }

        apuesta.setResultadoFinal(resultado);
        apuesta.setEstado(Apuesta.EstadoApuesta.LIQUIDADA);
        apuesta.setFechaLiquidacion(LocalDateTime.now());

        // Si ganó, acreditar ganancia al usuario
        if (resultado == Apuesta.ResultadoFinal.GANADA) {
            Usuario usuario = apuesta.getUsuario();
            BigDecimal ganancia = apuesta.getGananciaPotencial();
            usuario.setSaldoUsd(usuario.getSaldoUsd().add(ganancia));
            usuarioRepository.save(usuario);
            
            log.info("Ganancia de {} acreditada al usuario {}", ganancia, usuario.getId());
        }

        apuestaRepository.save(apuesta);
        log.info("Apuesta {} resuelta como {}", apuestaId, resultado);
    }

    /**
     * Resuelve un parlay completo
     */
    @Transactional
    public void resolverParlay(Long parlayId) {
        log.info("Resolviendo parlay {}", parlayId);

        Parlay parlay = parlayRepository.findById(parlayId)
            .orElseThrow(() -> new RuntimeException("Parlay no encontrado"));

        if (parlay.getEstado() != Parlay.EstadoParlay.ACTIVO) {
            throw new RuntimeException("El parlay ya fue resuelto");
        }

        List<Apuesta> apuestasParlay = apuestaRepository.findByParlayIdAndEstado(parlayId, Apuesta.EstadoApuesta.LIQUIDADA);
        
        if (apuestasParlay.size() != parlay.getNumeroApuestas()) {
            throw new RuntimeException("No todas las apuestas del parlay están resueltas");
        }

        // Verificar si todas las apuestas ganaron
        boolean todasGanaron = apuestasParlay.stream()
            .allMatch(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.GANADA);

        boolean algunaPerdio = apuestasParlay.stream()
            .anyMatch(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.PERDIDA);

        Parlay.ResultadoFinalParlay resultadoParlay;
        if (todasGanaron) {
            resultadoParlay = Parlay.ResultadoFinalParlay.GANADO;
            
            // Acreditar ganancia al usuario
            Usuario usuario = parlay.getUsuario();
            BigDecimal ganancia = parlay.getGananciaPotencial();
            usuario.setSaldoUsd(usuario.getSaldoUsd().add(ganancia));
            usuarioRepository.save(usuario);
            
            log.info("Ganancia de parlay {} acreditada al usuario {}", ganancia, usuario.getId());
        } else if (algunaPerdio) {
            resultadoParlay = Parlay.ResultadoFinalParlay.PERDIDO;
        } else {
            // Caso con empates, se puede manejar según reglas del negocio
            resultadoParlay = Parlay.ResultadoFinalParlay.PARCIAL;
            
            // Devolver monto apostado
            Usuario usuario = parlay.getUsuario();
            usuario.setSaldoUsd(usuario.getSaldoUsd().add(parlay.getMontoTotal()));
            usuarioRepository.save(usuario);
        }

        parlay.setResultadoFinal(resultadoParlay);
        parlay.setEstado(Parlay.EstadoParlay.LIQUIDADO);
        parlay.setFechaLiquidacion(LocalDateTime.now());
        
        parlayRepository.save(parlay);
        log.info("Parlay {} resuelto como {}", parlayId, resultadoParlay);
    }

    /**
     * Cancela una apuesta antes de que comience el evento
     */
    @Transactional
    public void cancelarApuesta(Long apuestaId) {
        log.info("Cancelando apuesta {}", apuestaId);

        Apuesta apuesta = apuestaRepository.findById(apuestaId)
            .orElseThrow(() -> new RuntimeException("Apuesta no encontrada"));

        if (apuesta.getEstado() != Apuesta.EstadoApuesta.ACTIVA) {
            throw new RuntimeException("La apuesta no puede ser cancelada");
        }

        // Verificar que el evento no haya comenzado
        LocalDateTime ahora = LocalDateTime.now();
        if (apuesta.getEventoDeportivo().getFechaEvento().isBefore(ahora)) {
            throw new RuntimeException("No se puede cancelar una apuesta de evento que ya comenzó");
        }

        // Devolver el monto al usuario
        Usuario usuario = apuesta.getUsuario();
        usuario.setSaldoUsd(usuario.getSaldoUsd().add(apuesta.getMonto()));
        usuarioRepository.save(usuario);

        // Marcar apuesta como cancelada
        apuesta.setEstado(Apuesta.EstadoApuesta.CANCELADA);
        apuesta.setFechaLiquidacion(LocalDateTime.now());
        apuestaRepository.save(apuesta);

        log.info("Apuesta {} cancelada, monto {} devuelto al usuario {}", 
            apuestaId, apuesta.getMonto(), usuario.getId());
    }

    /**
     * Obtiene el historial de apuestas de un usuario
     */
    public List<Apuesta> obtenerHistorialApuestas(Long usuarioId) {
        return apuestaRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    /**
     * Obtiene el historial de parlays de un usuario
     */
    public List<Parlay> obtenerHistorialParlays(Long usuarioId) {
        return parlayRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);
    }

    /**
     * Obtiene estadísticas de apuestas de un usuario
     */
    public EstadisticasUsuarioDto obtenerEstadisticasUsuario(Long usuarioId) {
        List<Apuesta> apuestasResueltas = apuestaRepository.findByUsuarioIdAndEstado(usuarioId, Apuesta.EstadoApuesta.LIQUIDADA);
        
        long apuestasGanadas = apuestasResueltas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.GANADA)
            .count();
        
        long apuestasPerdidas = apuestasResueltas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.PERDIDA)
            .count();
        
        BigDecimal totalApostado = apuestasResueltas.stream()
            .map(Apuesta::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalGanado = apuestasResueltas.stream()
            .filter(apuesta -> apuesta.getResultadoFinal() == Apuesta.ResultadoFinal.GANADA)
            .map(Apuesta::getGananciaPotencial)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new EstadisticasUsuarioDto(
            apuestasGanadas,
            apuestasPerdidas,
            totalApostado,
            totalGanado,
            apuestasResueltas.size()
        );
    }

    // Métodos de validación y cálculo

    private void validarMontoApuesta(BigDecimal monto) {
        if (monto.compareTo(apuestaMinima) < 0) {
            throw new RuntimeException("El monto mínimo de apuesta es " + apuestaMinima);
        }
        if (monto.compareTo(apuestaMaxima) > 0) {
            throw new RuntimeException("El monto máximo de apuesta es " + apuestaMaxima);
        }
    }

    private void validarSeleccionesParlay(List<Long> momiosIds) {
        if (momiosIds.size() < 2) {
            throw new RuntimeException("Un parlay debe tener al menos 2 selecciones");
        }
        if (momiosIds.size() > maximoSeleccionesParlay) {
            throw new RuntimeException("Un parlay no puede tener más de " + maximoSeleccionesParlay + " selecciones");
        }
    }

    private void validarEventoDisponibleParaApuesta(EventoDeportivo evento) {
        LocalDateTime ahora = LocalDateTime.now();
        if (evento.getFechaEvento().isBefore(ahora)) {
            throw new RuntimeException("No se puede apostar en un evento que ya comenzó");
        }
        if (!evento.getActivo()) {
            throw new RuntimeException("El evento no está disponible para apuestas");
        }
    }

    private void validarSaldoUsuario(Usuario usuario, BigDecimal montoApuesta) {
        if (usuario.getSaldoUsd().compareTo(montoApuesta) < 0) {
            throw new RuntimeException("Saldo insuficiente para realizar la apuesta");
        }
    }

    private BigDecimal calcularGananciaPotencial(BigDecimal montoApuesta, BigDecimal momio) {
        return montoApuesta.multiply(momio).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calcularMomioCombinadoParlay(List<Momio> momios) {
        return momios.stream()
            .map(Momio::getValor)
            .reduce(BigDecimal.ONE, BigDecimal::multiply)
            .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * DTO para estadísticas de usuario
     */
    public static class EstadisticasUsuarioDto {
        private final long apuestasGanadas;
        private final long apuestasPerdidas;
        private final BigDecimal totalApostado;
        private final BigDecimal totalGanado;
        private final int totalApuestas;

        public EstadisticasUsuarioDto(long apuestasGanadas, long apuestasPerdidas, 
                                     BigDecimal totalApostado, BigDecimal totalGanado, int totalApuestas) {
            this.apuestasGanadas = apuestasGanadas;
            this.apuestasPerdidas = apuestasPerdidas;
            this.totalApostado = totalApostado;
            this.totalGanado = totalGanado;
            this.totalApuestas = totalApuestas;
        }

        // Getters
        public long getApuestasGanadas() { return apuestasGanadas; }
        public long getApuestasPerdidas() { return apuestasPerdidas; }
        public BigDecimal getTotalApostado() { return totalApostado; }
        public BigDecimal getTotalGanado() { return totalGanado; }
        public int getTotalApuestas() { return totalApuestas; }
        
        public BigDecimal getPorcentajeExito() {
            if (totalApuestas == 0) return BigDecimal.ZERO;
            return BigDecimal.valueOf(apuestasGanadas)
                .divide(BigDecimal.valueOf(totalApuestas), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        }
        
        public BigDecimal getGananciaNeta() {
            return totalGanado.subtract(totalApostado);
        }
    }
}
