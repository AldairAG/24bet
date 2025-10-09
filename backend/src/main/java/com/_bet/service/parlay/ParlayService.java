package com._bet.service.parlay;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._bet.dto.request.CrearApuestaRequest;
import com._bet.entity.apuestas.Apuesta;
import com._bet.entity.apuestas.Parlay;
import com._bet.entity.eventoEntity.Valor;
import com._bet.entity.user.Usuario;
import com._bet.repository.MomioRepository;
import com._bet.repository.ParlayRepository;
import com._bet.repository.UsuarioRepository;
import com._bet.repository.ValorRepository;

import jakarta.transaction.Transactional;

@Service
public class ParlayService {
    @Autowired
    private ValorRepository valorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParlayRepository parlayRepository;

    @Autowired
    private MomioRepository momioRepository;

    @Transactional
    public void crearParlay(List<CrearApuestaRequest> requests, Usuario usuario) {
        BigDecimal saldoUsuario = usuario.getSaldoUsd();
        BigDecimal momioTotal = BigDecimal.ZERO;
        List<Apuesta> apuestas = new ArrayList<>();

        // calcular el monto total del parlay
        double montoTotal = requests.stream().mapToDouble(CrearApuestaRequest::getMonto).sum();
        if (BigDecimal.valueOf(montoTotal).compareTo(saldoUsuario) > 0) {
            throw new IllegalArgumentException("Saldo insuficiente para la apuesta");
        }

        for (CrearApuestaRequest dto : requests) {

            // Verificar que el momio exista
            var momioOpt = momioRepository.findById(dto.getId());
            if (momioOpt.isEmpty()) {
                throw new IllegalArgumentException("Momio no encontrado: " + dto.getId());
            }
            Apuesta apuesta = Apuesta.builder()
                    .usuario(usuario)
                    .momio(dto.getOdd())
                    .monto(dto.getMonto())
                    .tipoApuesta(dto.getTipoApuesta())
                    .gananciaPotencial(BigDecimal.valueOf(dto.getMonto()).multiply(BigDecimal.valueOf(dto.getOdd()))
                            .subtract(BigDecimal.valueOf(dto.getMonto())))
                    .gananciaReal(BigDecimal.valueOf(dto.getMonto()).multiply(BigDecimal.valueOf(dto.getOdd()))
                            .subtract(BigDecimal.valueOf(dto.getMonto())))
                    .estado(Apuesta.EstadoApuesta.ACTIVA)
                    .fechaCreacion(LocalDateTime.now())
                    .build();

            apuestas.add(apuesta);
            // Calcular momio total del parlay
            if (momioTotal.equals(BigDecimal.ZERO)) {
                momioTotal = BigDecimal.valueOf(dto.getOdd());
            } else {
                momioTotal = momioTotal.multiply(BigDecimal.valueOf(dto.getOdd()));
            }

            usuario.setSaldoUsd(saldoUsuario.subtract(BigDecimal.valueOf(dto.getMonto())));
            usuarioRepository.save(usuario);

            // Actualizar metadatos de momio
            Valor odd = valorRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("odd no encontrado: " + dto.getId()));

            odd.setNumeroApuestas(odd.getNumeroApuestas() + 1);
            odd.setMontoTotalApostado(odd.getMontoTotalApostado().add(BigDecimal.valueOf(dto.getMonto())));
            valorRepository.save(odd);

        }

        // Crear el parlay
        Parlay parlay = Parlay.builder()
                .usuario(usuario)
                .apuestas(apuestas)
                .momioTotal(momioTotal)
                .montoTotal(montoTotal)
                .gananciaPotencial(
                        BigDecimal.valueOf(montoTotal).multiply(momioTotal).subtract(BigDecimal.valueOf(montoTotal)))
                .gananciaReal(
                        BigDecimal.valueOf(montoTotal).multiply(momioTotal).subtract(BigDecimal.valueOf(montoTotal)))
                .numeroApuestas(apuestas.size())
                .apuestasPendientes(apuestas.size())
                .estado(Parlay.EstadoParlay.ACTIVO)
                .fechaCreacion(LocalDateTime.now())
                .build();

        parlayRepository.save(parlay);

    }

}
