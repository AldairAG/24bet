package com._bet.service.apuesta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com._bet.dto.request.CrearApuestaRequest;
import com._bet.dto.request.ParlayRequest;
import com._bet.dto.response.ApuestaHistorialResponse;
import com._bet.dto.response.ParlayResponse;
import com._bet.entity.apuestas.Apuesta;
import com._bet.entity.apuestas.Parlay;
import com._bet.entity.eventoEntity.Valor;
import com._bet.entity.user.Usuario;
import com._bet.repository.ApuestaRepository;
import com._bet.repository.ParlayRepository;
import com._bet.repository.UsuarioRepository;
import com._bet.repository.ValorRepository;

import jakarta.transaction.Transactional;

@Service
public class ApuestaService {

        @Autowired
        private ApuestaRepository apuestaRepository;

        @Autowired
        private UsuarioRepository usuarioRepository;

        @Autowired
        private ValorRepository valorRepository;

        @Autowired
        private ParlayRepository parlayRepository;

        @Transactional
        public void crearMultiplesApuestasSimples(List<CrearApuestaRequest> requests, Usuario usuario) {
                BigDecimal saldoUsuario = usuario.getSaldoUsd();

                for (CrearApuestaRequest dto : requests) {
                        if (dto.getMonto().compareTo(saldoUsuario.doubleValue()) > 0) {
                                throw new IllegalArgumentException("Saldo insuficiente para la apuesta");
                        }

                        Valor odd = valorRepository.findById(dto.getId())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "odd no encontrado: " + dto.getId()));

                        String descripcionResultado = odd.getValor()
                                        .replace("home", String
                                                        .valueOf(odd.getMomio().getEventoDeportivo().getEquipoLocal()))
                                        .replace("away", String.valueOf(
                                                        odd.getMomio().getEventoDeportivo().getEquipoVisitante()))
                                        .replace("draw", "Empate");

                        Apuesta apuesta = Apuesta.builder()
                                        .usuario(usuario)
                                        .momio(dto.getOdd())
                                        .monto(dto.getMonto())
                                        .tipoApuesta(dto.getTipoApuesta())
                                        .resultadoApostado(odd.getValor())
                                        .gananciaPotencial(BigDecimal.valueOf(dto.getMonto())
                                                        .multiply(BigDecimal.valueOf(dto.getOdd())))
                                        .gananciaReal(BigDecimal.valueOf(dto.getMonto())
                                                        .multiply(BigDecimal.valueOf(dto.getOdd()))
                                                        .subtract(BigDecimal.valueOf(dto.getMonto())))
                                        .estado(Apuesta.EstadoApuesta.ACTIVA)
                                        .descripcionResultado(descripcionResultado)
                                        .fechaCreacion(LocalDateTime.now())
                                        .eventoDeportivo(odd.getMomio().getEventoDeportivo())
                                        .build();

                        // Crear la apuesta
                        apuestaRepository.save(apuesta);

                        // Actualizar el saldo del usuario
                        usuario.setSaldoUsd(saldoUsuario.subtract(BigDecimal.valueOf(dto.getMonto())));
                        usuarioRepository.save(usuario);

                        odd.setNumeroApuestas((odd.getNumeroApuestas() != null ? odd.getNumeroApuestas() : 0) + 1);
                        odd.setMontoTotalApostado(
                                        (odd.getMontoTotalApostado() != null ? odd.getMontoTotalApostado()
                                                        : BigDecimal.ZERO)
                                                        .add(BigDecimal.valueOf(dto.getMonto())));
                        valorRepository.save(odd);

                        // Actualizar el saldo del usuario
                        saldoUsuario = saldoUsuario.subtract(BigDecimal.valueOf(dto.getMonto()));
                }
        }

        /**
         * Crea un nuevo parlay con múltiples apuestas
         */
        @Transactional
        public ParlayResponse crearParlay(ParlayRequest parlayRequest, Usuario usuario) {
                // Validar saldo suficiente
                BigDecimal saldoUsuario = usuario.getSaldoUsd();
                if (parlayRequest.getMontoApostar().compareTo(saldoUsuario.doubleValue()) > 0) {
                        throw new IllegalArgumentException("Saldo insuficiente para el parlay");
                }

                // Validar mínimo 2 apuestas para parlay
                if (parlayRequest.getApuestas().size() < 2) {
                        throw new IllegalArgumentException("Un parlay debe tener al menos 2 apuestas");
                }

                // Calcular momio total del parlay (multiplicación de todos los momios)
                BigDecimal momioTotal = parlayRequest.getApuestas().stream()
                                .map(apuesta -> BigDecimal.valueOf(apuesta.getOdd()))
                                .reduce(BigDecimal.ONE, BigDecimal::multiply);

                // Calcular ganancia potencial
                BigDecimal gananciaPotencial = BigDecimal.valueOf(parlayRequest.getMontoApostar())
                                .multiply(momioTotal);

                // Crear el parlay
                Parlay parlay = Parlay.builder()
                                .usuario(usuario)
                                .montoTotal(parlayRequest.getMontoApostar())
                                .momioTotal(momioTotal)
                                .gananciaPotencial(gananciaPotencial)
                                .numeroApuestas(parlayRequest.getApuestas().size())
                                .apuestasGanadas(0)
                                .apuestasPerdidas(0)
                                .apuestasPendientes(parlayRequest.getApuestas().size())
                                .estado(Parlay.EstadoParlay.ACTIVO)
                                .fechaCreacion(LocalDateTime.now())
                                .build();

                // Guardar el parlay
                Parlay parlayGuardado = parlayRepository.save(parlay);

                // Crear las apuestas individuales del parlay
                List<Apuesta> apuestasParlay = new ArrayList<>();
                for (CrearApuestaRequest apuestaReq : parlayRequest.getApuestas()) {
                        // Verificar que el valor exista
                        Valor valor = valorRepository.findById(apuestaReq.getId())
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Opción de apuesta no encontrada: " + apuestaReq.getId()));

                        // Crear apuesta individual
                        Apuesta apuesta = Apuesta.builder()
                                        .usuario(usuario)
                                        .parlay(parlayGuardado)
                                        .momio(apuestaReq.getOdd())
                                        .monto(0.0) // En parlays, el monto está en el parlay padre
                                        .tipoApuesta(apuestaReq.getTipoApuesta())
                                        .estado(Apuesta.EstadoApuesta.ACTIVA)
                                        .fechaCreacion(LocalDateTime.now())
                                        .eventoDeportivo(valor.getMomio().getEventoDeportivo())
                                        .build();

                        apuestasParlay.add(apuestaRepository.save(apuesta));

                        // Actualizar metadatos del valor
                        valor.setNumeroApuestas(
                                        (valor.getNumeroApuestas() != null ? valor.getNumeroApuestas() : 0) + 1);
                        valorRepository.save(valor);
                }

                // Actualizar saldo del usuario
                usuario.setSaldoUsd(saldoUsuario.subtract(BigDecimal.valueOf(parlayRequest.getMontoApostar())));
                usuarioRepository.save(usuario);

                // Convertir a response
                return convertirParlayAResponse(parlayGuardado, apuestasParlay);
        }

        /**
         * Obtiene el historial de parlays de un usuario (paginado)
         */
        public List<ParlayResponse> obtenerHistorialParlays(Long usuarioId, Pageable pageable) {
                List<Parlay> parlays = parlayRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId);

                return parlays.stream()
                                .map(parlay -> convertirParlayAResponse(parlay, parlay.getApuestas()))
                                .collect(Collectors.toList());
        }

        /**
         * Obtiene los parlays activos de un usuario
         */
        public List<ParlayResponse> obtenerParlaysActivos(Long usuarioId) {
                List<Parlay> parlaysActivos = parlayRepository.findByUsuarioIdAndEstado(usuarioId,
                                Parlay.EstadoParlay.ACTIVO);

                return parlaysActivos.stream()
                                .map(parlay -> convertirParlayAResponse(parlay, parlay.getApuestas()))
                                .collect(Collectors.toList());
        }

        /**
         * Obtiene un parlay específico por ID
         */
        public ParlayResponse obtenerParlayPorId(Long parlayId, Long usuarioId) {
                Parlay parlay = parlayRepository.findByIdAndUsuarioId(parlayId, usuarioId);
                if (parlay == null) {
                        throw new IllegalArgumentException("Parlay no encontrado o no pertenece al usuario");
                }

                return convertirParlayAResponse(parlay, parlay.getApuestas());
        }

        /**
         * Convierte una entidad Parlay a ParlayResponse
         */
        private ParlayResponse convertirParlayAResponse(Parlay parlay, List<Apuesta> apuestas) {
                List<ParlayResponse.ApuestaParlayResponse> apuestasResponse = apuestas != null ? apuestas.stream()
                                .map(apuesta -> ParlayResponse.ApuestaParlayResponse.builder()
                                                .id(apuesta.getId())
                                                .eventoId(apuesta.getEventoDeportivo() != null
                                                                ? apuesta.getEventoDeportivo().getId()
                                                                : null)
                                                .nombreEvento(apuesta.getEventoDeportivo() != null
                                                                ? apuesta.getEventoDeportivo().getEquipoLocal() + " vs "
                                                                                + apuesta.getEventoDeportivo()
                                                                                                .getEquipoVisitante()
                                                                : "Evento no disponible")
                                                .tipoApuesta(apuesta.getTipoApuesta())
                                                .descripcion(null) // Campo no disponible en Apuesta
                                                .momio(apuesta.getMomio())
                                                .estado(apuesta.getEstado().toString())
                                                .resultado(null) // Campo no disponible en Apuesta
                                                .fechaCreacion(apuesta.getFechaCreacion())
                                                .build())
                                .collect(Collectors.<ParlayResponse.ApuestaParlayResponse>toList()) : new ArrayList<>();

                return ParlayResponse.builder()
                                .id(parlay.getId())
                                .montoTotal(parlay.getMontoTotal())
                                .momioTotal(parlay.getMomioTotal())
                                .gananciaPotencial(parlay.getGananciaPotencial())
                                .gananciaReal(parlay.getGananciaReal())
                                .numeroApuestas(parlay.getNumeroApuestas())
                                .apuestasGanadas(parlay.getApuestasGanadas())
                                .apuestasPerdidas(parlay.getApuestasPerdidas())
                                .apuestasPendientes(parlay.getApuestasPendientes())
                                .estado(parlay.getEstado())
                                .resultadoFinal(parlay.getResultadoFinal())
                                .fechaCreacion(parlay.getFechaCreacion())
                                .fechaLiquidacion(parlay.getFechaLiquidacion())
                                .observaciones(parlay.getObservaciones())
                                .usuarioId(parlay.getUsuario().getId())
                                .apuestas(apuestasResponse)
                                .build();
        }

        public List<ApuestaHistorialResponse> obtenerTodasLasApuestasPorUsuario(Usuario usuario) {
                List<Apuesta> apuestas = apuestaRepository.findByUsuarioAndActivaTrue(usuario);
                return apuestas.stream()
                                .map(this::convertirApuestaAHistorialResponse)
                                .collect(Collectors.toList());
        }

        /**
         * Convierte una entidad Apuesta a ApuestaHistorialResponse
         */
        private ApuestaHistorialResponse convertirApuestaAHistorialResponse(Apuesta apuesta) {
                return ApuestaHistorialResponse.builder()
                                .tipoApuesta(apuesta.getTipoApuesta())
                                .resultadoApostado(apuesta.getResultadoApostado())
                                .montoApostado(apuesta.getMonto())
                                .momio(apuesta.getMomio())
                                .estadoApuesta(apuesta.getEstado())
                                .fechaApuesta(apuesta.getFechaCreacion())
                                .nombreEvento(apuesta.getEventoDeportivo() != null
                                                ? apuesta.getEventoDeportivo().getNombre()
                                                : null)
                                .build();
        }
}
