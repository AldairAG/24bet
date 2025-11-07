package com._bet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._bet.entity.soporte.Tiket;

@Repository
public interface TiketRepository extends JpaRepository<Tiket, Long> {
    List<Tiket> findByUsuario(com._bet.entity.user.Usuario usuario);
    
    List<Tiket> findByEstadoIn(List<Tiket.estadoTiket> estados);
}
