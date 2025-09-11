package com._bet.repository;

import com._bet.entity.Liga;
import com._bet.entity.Deporte;
import com._bet.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Liga
 */
@Repository
public interface LigaRepository extends JpaRepository<Liga, Long> {
    
    /**
     * Busca una liga por su ID en TheSportsDB
     */
    Optional<Liga> findBySportsDbId(String sportsDbId);
    
    /**
     * Busca ligas por deporte
     */
    List<Liga> findByDeporte(Deporte deporte);
    
    /**
     * Busca ligas activas por deporte
     */
    List<Liga> findByDeporteAndActivaTrue(Deporte deporte);
    
    /**
     * Busca ligas por país (usando la relación)
     */
    List<Liga> findByPais(Country pais);
    
    /**
     * Busca ligas activas por país
     */
    List<Liga> findByPaisAndActivaTrue(Country pais);
    
    /**
     * Busca ligas por nombre de país (campo legacy)
     */
    List<Liga> findByPaisNombre(String paisNombre);
    
    /**
     * Busca ligas por deporte y país
     */
    List<Liga> findByDeporteAndPais(Deporte deporte, Country pais);
    
    /**
     * Busca ligas activas por deporte y país
     */
    List<Liga> findByDeporteAndPaisAndActivaTrue(Deporte deporte, Country pais);
    
    /**
     * Busca ligas por nombre (case insensitive)
     */
    @Query("SELECT l FROM Liga l WHERE UPPER(l.nombre) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<Liga> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
    
    /**
     * Busca ligas activas
     */
    List<Liga> findByActivaTrue();
    
    /**
     * Verifica si existe una liga con el ID de TheSportsDB
     */
    boolean existsBySportsDbId(String sportsDbId);
    
    /**
     * Busca ligas por ID de deporte en TheSportsDB
     */
    @Query("SELECT l FROM Liga l WHERE l.deporte.sportsDbId = :deporteSportsDbId")
    List<Liga> findByDeporteSportsDbId(@Param("deporteSportsDbId") String deporteSportsDbId);
}
