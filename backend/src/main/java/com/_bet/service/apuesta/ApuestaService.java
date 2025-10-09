package com._bet.service.apuesta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._bet.dto.request.CrearApuestaRequest;
import com._bet.entity.apuestas.Apuesta;
import com._bet.entity.eventoEntity.Valor;
import com._bet.entity.user.Usuario;
import com._bet.repository.ApuestaRepository;
import com._bet.repository.MomioRepository;
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
    private MomioRepository momioRepository;

    @Autowired
    private ValorRepository valorRepository;

    @Transactional
    public void crearMultiplesApuestasSimples(List<CrearApuestaRequest> requests, Usuario usuario) {
        BigDecimal saldoUsuario = usuario.getSaldoUsd();

        for (CrearApuestaRequest dto : requests) {
            if (dto.getMonto().compareTo(saldoUsuario.doubleValue()) > 0) {
                throw new IllegalArgumentException("Saldo insuficiente para la apuesta");
            }

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
                    .gananciaPotencial(BigDecimal.valueOf(dto.getMonto()).multiply(BigDecimal.valueOf(dto.getOdd())).subtract(BigDecimal.valueOf(dto.getMonto())))
                    .gananciaReal(BigDecimal.valueOf(dto.getMonto()).multiply(BigDecimal.valueOf(dto.getOdd())).subtract(BigDecimal.valueOf(dto.getMonto())))
                    .estado(Apuesta.EstadoApuesta.ACTIVA)
                    .fechaCreacion(LocalDateTime.now())
                    .build();

            // Crear la apuesta
            apuestaRepository.save(apuesta);

            //Actualizar el saldo del usuario
            usuario.setSaldoUsd(saldoUsuario.subtract(BigDecimal.valueOf(dto.getMonto())));
            usuarioRepository.save(usuario);

            //Actualizar metadatos de momio
            Valor odd = valorRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("odd no encontrado: " + dto.getId())) ;

            odd.setNumeroApuestas(odd.getNumeroApuestas() + 1);
            odd.setMontoTotalApostado(odd.getMontoTotalApostado().add(BigDecimal.valueOf(dto.getMonto())));
            valorRepository.save(odd);

            // Actualizar el saldo del usuario
            saldoUsuario = saldoUsuario.subtract(BigDecimal.valueOf(dto.getMonto()));
        }
    }

}
