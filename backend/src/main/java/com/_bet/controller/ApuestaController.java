package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.request.CrearApuestaRequest;
import com._bet.entity.apuestas.Apuesta;
import com._bet.entity.user.Usuario;
import com._bet.repository.ApuestaRepository;
import com._bet.service.apuesta.ApuestaService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar apuestas
 */
@RestController
@RequestMapping("/24bet/apuestas")
@Slf4j
@CrossOrigin(origins = "*")
public class ApuestaController {

    @Autowired
    private ApuestaRepository apuestaRepository;
    @Autowired
    private ApuestaService apuestaService;

    /**
     * Obtiene el historial de apuestas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<Apuesta>> obtenerHistorialApuestas(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        log.info("Obteniendo historial de apuestas para usuario: {}", usuarioId);

        Page<Apuesta> apuestas = apuestaRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId, pageable);
        return ResponseEntity.ok(apuestas);
    }

    /**
     * Obtiene apuestas activas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<List<Apuesta>> obtenerApuestasActivas(@PathVariable Long usuarioId) {
        log.info("Obteniendo apuestas activas para usuario: {}", usuarioId);

        List<Apuesta> apuestas = apuestaRepository.findByUsuarioIdAndEstado(usuarioId, Apuesta.EstadoApuesta.ACTIVA);
        return ResponseEntity.ok(apuestas);
    }

    /**
     * Crea una lista de apuestas simples
     */
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/crear")
    public ResponseEntity<ApiResponseWrapper<Void>> crearApuesta(@RequestBody List<CrearApuestaRequest> dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            apuestaService.crearMultiplesApuestasSimples(dto, usuario);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true,"Apuestas creadas exitosamente", null));
        } catch (Exception e) {
            log.error("Error creando apuesta: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

}
