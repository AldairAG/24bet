package com._bet.service.apuesta;

import com._bet.entity.EventoDeportivo;
import com._bet.entity.Equipo;
import com._bet.entity.Momio;
import com._bet.entity.Momio.TipoApuesta;
import com._bet.entity.Momio.FuenteMomio;
import com._bet.repository.MomioRepository;
import com._bet.repository.EventoDeportivoRepository;
import com._bet.repository.EquipoRepository;
import com._bet.service.theSportsDb.TheSportsDbService;
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
 * Servicio para calcular momios automáticamente basado en estadísticas de equipos
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MomioCalculatorService {

    private final MomioRepository momioRepository;
    private final EventoDeportivoRepository eventoDeportivoRepository;
    private final EquipoRepository equipoRepository;
    private final TheSportsDbService theSportsDbService;

    @Value("${betting.margin.default:0.10}")
    private BigDecimal margenCasa = BigDecimal.valueOf(0.10); // 10% margen de la casa

    @Value("${betting.minimum.odds:1.01}")
    private BigDecimal momioMinimo = BigDecimal.valueOf(1.01);

    @Value("${betting.maximum.odds:50.00}")
    private BigDecimal momioMaximo = BigDecimal.valueOf(50.00);

    /**
     * Calcula y crea momios para eventos sin momios existentes
     */
    @Transactional
    public void calcularMomiosParaEventosSinMomios() {
        log.info("Iniciando cálculo de momios para eventos sin momios...");
        
        LocalDateTime ahora = LocalDateTime.now();
        List<EventoDeportivo> eventosSinMomios = eventoDeportivoRepository.findEventosSinMomios(ahora);
        
        log.info("Encontrados {} eventos sin momios", eventosSinMomios.size());
        
        for (EventoDeportivo evento : eventosSinMomios) {
            try {
                calcularMomiosParaEvento(evento);
                log.debug("Momios calculados para evento: {} vs {}", 
                    evento.getEquipoLocal().getNombre(), 
                    evento.getEquipoVisitante().getNombre());
            } catch (Exception e) {
                log.error("Error calculando momios para evento {}: {}", evento.getId(), e.getMessage());
            }
        }
        
        log.info("Cálculo de momios completado");
    }

    /**
     * Calcula momios para un evento específico
     */
    @Transactional
    public void calcularMomiosParaEvento(EventoDeportivo evento) {
        // Obtener estadísticas actualizadas de los equipos
        actualizarEstadisticasEquipos(evento);
        
        // Calcular probabilidades basadas en estadísticas
        ProbabilidadesEvento probabilidades = calcularProbabilidades(evento);
        
        // Crear momios para diferentes tipos de apuesta
        crearMomiosParaEvento(evento, probabilidades);
    }

    /**
     * Actualiza las estadísticas de los equipos desde TheSportsDB
     * Por ahora usaremos probabilidades base, más adelante se puede implementar
     * la obtención de estadísticas reales desde la API
     */
    private void actualizarEstadisticasEquipos(EventoDeportivo evento) {
        try {
            // TODO: Implementar obtención dee stadísticas específicas desde TheSportsDB
            // Para la implementación inicial, usamos el servicio existente
            log.debug("Estadísticas de equipos para evento {}: datos base", evento.getId());
        } catch (Exception e) {
            log.warn("Error actualizando estadísticas de equipos para evento {}: {}", evento.getId(), e.getMessage());
        }
    }

    /**
     * Calcula las probabilidades de diferentes resultados basadas en datos básicos
     * Implementación inicial con probabilidades base que se pueden mejorar más adelante
     */
    private ProbabilidadesEvento calcularProbabilidades(EventoDeportivo evento) {
        Equipo equipoLocal = evento.getEquipoLocal();
        Equipo equipoVisitante = evento.getEquipoVisitante();
        
        // Por ahora usamos probabilidades base hasta implementar estadísticas completas
        // Estas se pueden ajustar basándose en:
        // 1. Ranking de equipos si está disponible
        // 2. Historial de enfrentamientos
        // 3. Racha reciente (cuando se implemente)
        
        // Probabilidades base con ligera ventaja para el equipo local
        BigDecimal probabilidadVictoriaLocal = BigDecimal.valueOf(0.42);    // 42%
        BigDecimal probabilidadVictoriaVisitante = BigDecimal.valueOf(0.33); // 33%
        BigDecimal probabilidadEmpate = BigDecimal.valueOf(0.25);           // 25%
        
        // Aplicar factores de ajuste basados en nombres/ligas conocidas
        // (implementación básica que se puede expandir)
        probabilidadVictoriaLocal = aplicarFactoresConocidos(equipoLocal, equipoVisitante, probabilidadVictoriaLocal);
        
        // Asegurar que las probabilidades sumen 1
        BigDecimal total = probabilidadVictoriaLocal.add(probabilidadVictoriaVisitante).add(probabilidadEmpate);
        if (total.compareTo(BigDecimal.ONE) != 0) {
            // Normalizar
            probabilidadVictoriaLocal = probabilidadVictoriaLocal.divide(total, 4, RoundingMode.HALF_UP);
            probabilidadVictoriaVisitante = probabilidadVictoriaVisitante.divide(total, 4, RoundingMode.HALF_UP);
            probabilidadEmpate = probabilidadEmpate.divide(total, 4, RoundingMode.HALF_UP);
        }
        
        return new ProbabilidadesEvento(
            probabilidadVictoriaLocal,
            probabilidadVictoriaVisitante,
            probabilidadEmpate
        );
    }

    /**
     * Aplica factores de ajuste básicos basados en información conocida de los equipos
     */
    private BigDecimal aplicarFactoresConocidos(Equipo equipoLocal, Equipo equipoVisitante, BigDecimal probabilidadBase) {
        // Factor base para equipos locales
        BigDecimal factor = BigDecimal.valueOf(1.0);
        
        // Ajustar basándose en información disponible del equipo
        // Por ejemplo, si tenemos información de la liga, país, etc.
        
        if (equipoLocal.getPais() != null && equipoVisitante.getPais() != null) {
            if (!equipoLocal.getPais().equals(equipoVisitante.getPais())) {
                // Ventaja adicional para equipo local en partidos internacionales
                factor = factor.multiply(BigDecimal.valueOf(1.1));
            }
        }
        
        return probabilidadBase.multiply(factor);
    }

    /**
     * Crea los momios para un evento basado en las probabilidades calculadas
     */
    private void crearMomiosParaEvento(EventoDeportivo evento, ProbabilidadesEvento probabilidades) {
        LocalDateTime ahora = LocalDateTime.now();
        
        // Momio para victoria del equipo local
        BigDecimal momioVictoriaLocal = calcularMomioConMargen(probabilidades.getProbabilidadVictoriaLocal());
        crearMomio(evento, TipoApuesta.GANADOR_PARTIDO, momioVictoriaLocal, 
                  probabilidades.getProbabilidadVictoriaLocal(), ahora, "LOCAL");
        
        // Momio para victoria del equipo visitante
        BigDecimal momioVictoriaVisitante = calcularMomioConMargen(probabilidades.getProbabilidadVictoriaVisitante());
        crearMomio(evento, TipoApuesta.GANADOR_PARTIDO, momioVictoriaVisitante, 
                  probabilidades.getProbabilidadVictoriaVisitante(), ahora, "VISITANTE");
        
        // Momio para empate
        BigDecimal momioEmpate = calcularMomioConMargen(probabilidades.getProbabilidadEmpate());
        crearMomio(evento, TipoApuesta.GANADOR_PARTIDO, momioEmpate, 
                  probabilidades.getProbabilidadEmpate(), ahora, "EMPATE");
        
        // Momios adicionales para over/under goles
        crearMomiosOverUnder(evento, ahora);
    }

    /**
     * Calcula el momio aplicando el margen de la casa
     */
    private BigDecimal calcularMomioConMargen(BigDecimal probabilidad) {
        if (probabilidad.compareTo(BigDecimal.ZERO) == 0) {
            return momioMaximo;
        }
        
        // Aplicar margen de la casa: momio = 1 / (probabilidad + margen)
        BigDecimal probabilidadConMargen = probabilidad.add(margenCasa);
        BigDecimal momio = BigDecimal.ONE.divide(probabilidadConMargen, 2, RoundingMode.HALF_UP);
        
        // Aplicar límites
        if (momio.compareTo(momioMinimo) < 0) {
            return momioMinimo;
        }
        if (momio.compareTo(momioMaximo) > 0) {
            return momioMaximo;
        }
        
        return momio;
    }

    /**
     * Crea momios para Over/Under de goles
     */
    private void crearMomiosOverUnder(EventoDeportivo evento, LocalDateTime ahora) {
        // Usar un promedio base de goles para calcular Over/Under
        // Esto se puede mejorar más adelante con estadísticas reales
        BigDecimal promedioGolesEvento = BigDecimal.valueOf(2.5); // Promedio base
        
        // Crear momios para diferentes líneas de Over/Under
        crearMomioOverUnder(evento, BigDecimal.valueOf(2.5), promedioGolesEvento, ahora);
        crearMomioOverUnder(evento, BigDecimal.valueOf(1.5), promedioGolesEvento, ahora);
        crearMomioOverUnder(evento, BigDecimal.valueOf(3.5), promedioGolesEvento, ahora);
    }

    /**
     * Calcula el promedio de goles de un equipo (implementación base)
     */
    private BigDecimal calcularPromedioGoles(Equipo equipo) {
        // Por ahora retornamos un valor base
        // TODO: Implementar cálculo real basado en estadísticas del equipo
        return BigDecimal.valueOf(1.5); // Valor por defecto
    }

    /**
     * Crea momio específico para Over/Under
     */
    private void crearMomioOverUnder(EventoDeportivo evento, BigDecimal linea, BigDecimal promedioTotal, LocalDateTime ahora) {
        // Calcular probabilidad de Over basada en el promedio de goles
        BigDecimal probabilidadOver = calcularProbabilidadOver(promedioTotal, linea);
        BigDecimal probabilidadUnder = BigDecimal.ONE.subtract(probabilidadOver);
        
        BigDecimal momioOver = calcularMomioConMargen(probabilidadOver);
        BigDecimal momioUnder = calcularMomioConMargen(probabilidadUnder);
        
        // Crear momios Over y Under
        crearMomio(evento, TipoApuesta.OVER_UNDER, momioOver, probabilidadOver, ahora, "OVER", linea);
        crearMomio(evento, TipoApuesta.OVER_UNDER, momioUnder, probabilidadUnder, ahora, "UNDER", linea);
    }

    /**
     * Calcula la probabilidad de Over para una línea específica
     */
    private BigDecimal calcularProbabilidadOver(BigDecimal promedioGoles, BigDecimal linea) {
        // Simplificación: si el promedio es mayor que la línea, mayor probabilidad de Over
        if (promedioGoles.compareTo(linea) > 0) {
            return BigDecimal.valueOf(0.55); // 55% probabilidad
        } else if (promedioGoles.compareTo(linea) == 0) {
            return BigDecimal.valueOf(0.50); // 50% probabilidad
        } else {
            return BigDecimal.valueOf(0.45); // 45% probabilidad
        }
    }

    /**
     * Crea un momio individual
     */
    private void crearMomio(EventoDeportivo evento, TipoApuesta tipoApuesta, BigDecimal valorMomio, 
                           BigDecimal probabilidad, LocalDateTime ahora, String resultado) {
        crearMomio(evento, tipoApuesta, valorMomio, probabilidad, ahora, resultado, null);
    }

    /**
     * Crea un momio individual con línea específica
     */
    private void crearMomio(EventoDeportivo evento, Momio.TipoApuesta tipoApuesta, BigDecimal valorMomio, 
                           BigDecimal probabilidad, LocalDateTime ahora, String resultado, BigDecimal linea) {
        Momio momio = new Momio();
        momio.setEventoDeportivo(evento);
        momio.setTipoApuesta(tipoApuesta);
        momio.setValor(valorMomio);
        momio.setProbabilidadImplicita(probabilidad);
        momio.setMargenCasa(margenCasa);
        momio.setFuente(Momio.FuenteMomio.CALCULADO);
        momio.setFechaUltimaActualizacion(ahora);
        momio.setActivo(true);
        
        // Establecer resultado basado en el string
        momio.setResultado(Momio.ResultadoMomio.valueOf(resultado.toUpperCase()));
        
        // Nota: No hay campo línea en la entidad Momio actual
        // Si necesitas agregar línea, debes modificar la entidad
        
        momioRepository.save(momio);
    }

    /**
     * Actualiza momios existentes para eventos próximos
     */
    @Transactional
    public void actualizarMomiosEventosProximos() {
        log.info("Actualizando momios para eventos próximos...");
        
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteActualizacion = ahora.plusHours(2);
        
        List<EventoDeportivo> eventosProximos = eventoDeportivoRepository
            .findEventosProximosParaApuestas(ahora, limiteActualizacion);
        
        for (EventoDeportivo evento : eventosProximos) {
            try {
                // Eliminar momios existentes (desactivar en lugar de borrar)
                List<Momio> momiosExistentes = momioRepository.findByEventoDeportivoAndActivoTrue(evento);
                for (Momio momioExistente : momiosExistentes) {
                    momioExistente.setActivo(false);
                    momioRepository.save(momioExistente);
                }
                
                // Recalcular momios
                calcularMomiosParaEvento(evento);
                
                log.debug("Momios actualizados para evento: {} vs {}", 
                    evento.getEquipoLocal().getNombre(), 
                    evento.getEquipoVisitante().getNombre());
            } catch (Exception e) {
                log.error("Error actualizando momios para evento {}: {}", evento.getId(), e.getMessage());
            }
        }
        
        log.info("Actualización de momios completada para {} eventos", eventosProximos.size());
    }

    /**
     * Clase interna para almacenar probabilidades de un evento
     */
    private static class ProbabilidadesEvento {
        private final BigDecimal probabilidadVictoriaLocal;
        private final BigDecimal probabilidadVictoriaVisitante;
        private final BigDecimal probabilidadEmpate;

        public ProbabilidadesEvento(BigDecimal probabilidadVictoriaLocal, 
                                   BigDecimal probabilidadVictoriaVisitante, 
                                   BigDecimal probabilidadEmpate) {
            this.probabilidadVictoriaLocal = probabilidadVictoriaLocal;
            this.probabilidadVictoriaVisitante = probabilidadVictoriaVisitante;
            this.probabilidadEmpate = probabilidadEmpate;
        }

        public BigDecimal getProbabilidadVictoriaLocal() { return probabilidadVictoriaLocal; }
        public BigDecimal getProbabilidadVictoriaVisitante() { return probabilidadVictoriaVisitante; }
        public BigDecimal getProbabilidadEmpate() { return probabilidadEmpate; }
    }
}
