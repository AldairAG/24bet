package com._bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com._bet.entity.datosMaestros.Deporte;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Deporte
 */
@Repository
public interface DeporteRepository extends JpaRepository<Deporte, Long> {
    
    /**
     * Busca un deporte por su ID en TheSportsDB
     */
    Optional<Deporte> findBySportsDbId(String sportsDbId);
    
    /**
     * Busca deportes por nombre (case insensitive)
     */
    @Query("SELECT d FROM Deporte d WHERE UPPER(d.nombre) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<Deporte> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
    
    /**
     * Busca un deporte por nombre en inglés exacto
     */
    Optional<Deporte> findByNombreIngles(String nombreIngles);
    
    /**
     * Busca un deporte por nombre exacto (case insensitive)
     */
    Optional<Deporte> findByNombreIgnoreCase(String nombre);
    
    /**
     * Busca un deporte por nombre en inglés (case insensitive)
     */
    Optional<Deporte> findByNombreInglesIgnoreCase(String nombreIngles);
    
    /**
     * Busca deportes activos
     */
    List<Deporte> findByActivoTrue();
    
    /**
     * Busca deportes por formato
     */
    List<Deporte> findByFormato(String formato);
    
    /**
     * Verifica si existe un deporte con el ID de TheSportsDB
     */
    boolean existsBySportsDbId(String sportsDbId);
}
