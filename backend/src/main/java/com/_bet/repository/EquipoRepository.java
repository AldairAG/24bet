package com._bet.repository;

import com._bet.entity.datosMaestros.Equipo;
import com._bet.entity.datosMaestros.Liga;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Equipo
 */
@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    
    /**
     * Busca equipos por liga
     */
    List<Equipo> findByLiga(Liga liga);
    
    /**
     * Busca equipos activos por liga
     */
    List<Equipo> findByLigaAndActivoTrue(Liga liga);
    
    /**
     * Busca equipos por país
     */
    List<Equipo> findByPais(String pais);
    
    /**
     * Busca equipos por nombre (case insensitive)
     */
    @Query("SELECT e FROM Equipo e WHERE UPPER(e.nombre) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<Equipo> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
    
    /**
     * Busca equipos activos
     */
    List<Equipo> findByActivoTrue();
    
    /**
     * Busca equipos por ciudad
     */
    List<Equipo> findByCiudad(String ciudad);

    /**
     * Busca un equipo por su ID en ApiSports
     */
    Optional<Equipo> findByApiSportsId(int apiSportsId);
}
