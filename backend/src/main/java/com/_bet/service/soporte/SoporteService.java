package com._bet.service.soporte;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._bet.dto.request.NuevoComentarioRequest;
import com._bet.entity.soporte.Comentario;
import com._bet.entity.soporte.Tiket;
import com._bet.entity.user.Usuario;
import com._bet.repository.TiketRepository;

@Service
public class SoporteService {
    @Autowired
    private TiketRepository tiketRepository;

    @Transactional
    public Tiket crearTiket(Tiket tiket, Usuario usuario) {
        tiket.setUsuario(usuario);
        tiket.setFechaCreacion(LocalDateTime.now());
        tiket.setEstado(Tiket.estadoTiket.CREADO);

        tiketRepository.save(tiket);
        return tiket;
    }

    @Transactional
    public Tiket actualizarTiket(Tiket tiket) {
        tiketRepository.save(tiket);
        return tiket;
    }

    @Transactional(readOnly = true)
    public Tiket obtenerTiketPorId(Long id) {
        return tiketRepository.findById(id).orElseThrow(() -> new RuntimeException("Tiket no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Tiket> obtenerTiketsPorUsuario(Usuario usuario) {
        return tiketRepository.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public List<Tiket> obtenerTodosLosTiketsCreadosYEnProgreso() {
        return tiketRepository.findByEstadoIn(List.of(Tiket.estadoTiket.CREADO, Tiket.estadoTiket.EN_PROGRESO));
    }

    @Transactional
    public Comentario publicarComentarioEnTiket(NuevoComentarioRequest comentarioRequest) {
        Tiket tiket = obtenerTiketPorId(comentarioRequest.getTiketId());

        Comentario comentario = new Comentario();
        comentario.setContenido(comentarioRequest.getContenido());
        comentario.setAutor(comentarioRequest.getAutor());
        comentario.setFechaCreacion(LocalDateTime.now());
        comentario.setTiket(tiket);

        tiket.getComentarios().add(comentario);
        tiketRepository.save(tiket);
        return comentario;
    }
}
