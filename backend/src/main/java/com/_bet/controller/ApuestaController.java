package com._bet.controller;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.request.CrearApuestaRequest;
import com._bet.dto.request.ParlayRequest;
import com._bet.dto.response.ApuestaHistorialResponse;
import com._bet.dto.response.ParlayHistorialResponse;
import com._bet.dto.response.ParlayResponse;
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

    /**
     * Crea un parlay (apuesta múltiple)
     */
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/parlay/crear")
    public ResponseEntity<ApiResponseWrapper<ParlayResponse>> crearParlay(@RequestBody ParlayRequest parlayRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            
            log.info("Creando parlay para usuario: {} con {} apuestas", 
                    usuario.getId(), parlayRequest.getApuestas().size());
            
            ParlayResponse parlayResponse = apuestaService.crearParlay(parlayRequest, usuario);
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Parlay creado exitosamente", parlayResponse));
        } catch (Exception e) {
            log.error("Error creando parlay: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

    /**
     * Obtiene el historial de parlays de un usuario
     */
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/parlay/historial")
    public ResponseEntity<ApiResponseWrapper<List<ParlayHistorialResponse>>> obtenerHistorialParlays() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            
            log.info("Obteniendo historial de parlays para usuario: {}", usuario.getId());

            List<ParlayHistorialResponse> parlays = apuestaService.obtenerHistorialParlays(usuario.getId());

            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Historial obtenido exitosamente", parlays));
        } catch (Exception e) {
            log.error("Error obteniendo historial de parlays: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

    /**
     * Obtiene los parlays activos de un usuario
     */
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/parlay/activos")
    public ResponseEntity<ApiResponseWrapper<List<ParlayResponse>>> obtenerParlaysActivos() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            
            log.info("Obteniendo parlays activos para usuario: {}", usuario.getId());
            
            List<ParlayResponse> parlaysActivos = apuestaService.obtenerParlaysActivos(usuario.getId());
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Parlays activos obtenidos exitosamente", parlaysActivos));
        } catch (Exception e) {
            log.error("Error obteniendo parlays activos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

    /**
     * Obtiene un parlay específico por ID
     */
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/parlay/{parlayId}")
    public ResponseEntity<ApiResponseWrapper<ParlayResponse>> obtenerParlay(@PathVariable Long parlayId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();
            
            log.info("Obteniendo parlay {} para usuario: {}", parlayId, usuario.getId());
            
            ParlayResponse parlay = apuestaService.obtenerParlayPorId(parlayId, usuario.getId());
            
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Parlay obtenido exitosamente", parlay));
        } catch (Exception e) {
            log.error("Error obteniendo parlay: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/historial")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<List<ApuestaHistorialResponse>>> getHistorialApuestas() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) authentication.getPrincipal();

            log.info("Obteniendo historial de apuestas para usuario: {}", usuario.getId());

            List<ApuestaHistorialResponse> historial = apuestaService.obtenerTodasLasApuestasPorUsuario(usuario);

            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Historial obtenido exitosamente", historial));
        } catch (Exception e) {
            log.error("Error obteniendo historial de apuestas: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponseWrapper<>(false, e.getMessage(), null));
        }
    }

}
