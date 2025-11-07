package com._bet.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._bet.controller.AuthController.ApiResponseWrapper;
import com._bet.dto.request.NuevoComentarioRequest;
import com._bet.entity.soporte.Comentario;
import com._bet.entity.soporte.Tiket;
import com._bet.entity.user.Usuario;
import com._bet.service.soporte.SoporteService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/24bet/soporte")
@RequiredArgsConstructor
@Tag(name = "Gestión de Soporte", description = "CRUD para la gestión de tickets de soporte")
@SecurityRequirement(name = "Bearer Authentication")
@CrossOrigin(origins = "*")
public class SoporteController {

    @Autowired
    private SoporteService soporteService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<Tiket>> crearTiket(@RequestBody Tiket tiket) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Tiket nuevoTiket = soporteService.crearTiket(tiket, (Usuario) authentication.getPrincipal());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponseWrapper<>(true, "Ticket creado con éxito", nuevoTiket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al crear el ticket", null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<Tiket>> ActualizarTiket(@PathVariable Long id, @RequestBody Tiket tiket) {
        try {
            Tiket tiketActualizado = soporteService.actualizarTiket(tiket);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Ticket actualizado con éxito", tiketActualizado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al actualizar el ticket", null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<Tiket>> obtenerSoporte(@PathVariable Long id) {
        try {
            Tiket soporte = soporteService.obtenerTiketPorId(id);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Ticket obtenido con éxito", soporte));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener el ticket", null));
        }
    }

    @GetMapping("/usuario")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<List<Tiket>>> getTiketsByUser(@RequestParam String userId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            List<Tiket> tickets = soporteService.obtenerTiketsPorUsuario((Usuario) authentication.getPrincipal());
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Tickets obtenidos con éxito", tickets));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener los tickets", null));
        }
    }

    @GetMapping("/admin/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseWrapper<List<Tiket>>> getAllTicketsForAdmin() {
        try {
            List<Tiket> tickets = soporteService.obtenerTodosLosTiketsCreadosYEnProgreso();
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Tickets obtenidos con éxito", tickets));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al obtener los tickets", null));
        }
    }

    @PostMapping("/comentar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponseWrapper<Comentario>> publicarComentarioEnTiket(
            @RequestBody NuevoComentarioRequest nuevoComentarioRequest) {
        try {
            Comentario comentario = soporteService.publicarComentarioEnTiket(nuevoComentarioRequest);
            return ResponseEntity.ok(new ApiResponseWrapper<>(true, "Comentario publicado con éxito", comentario));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponseWrapper<>(false, "Error al publicar el comentario", null));
        }
    }

}