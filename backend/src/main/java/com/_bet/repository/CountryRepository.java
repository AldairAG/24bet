package com._bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com._bet.entity.datosMaestros.Country;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    
    /**
     * Buscar país por nombre en inglés
     */
    Optional<Country> findByName(String name);
    
    /**
     * Buscar país por código ISO
     */
    Optional<Country> findByCountryCode(String countryCode);
    
    /**
     * Buscar país por código ISO 3
     */
    Optional<Country> findByCountryCode3(String countryCode3);
    
    /**
     * Buscar países activos
     */
    List<Country> findByActivoTrue();
    
    /**
     * Buscar país por cualquier nombre (case insensitive)
     */
    @Query("SELECT c FROM Country c WHERE " +
           "LOWER(c.name) = LOWER(:nombre) OR " +
           "LOWER(c.nameEs) = LOWER(:nombre) OR " +
           "LOWER(c.nameFr) = LOWER(:nombre) OR " +
           "LOWER(c.nameDe) = LOWER(:nombre)")
    Optional<Country> findByAnyName(@Param("nombre") String nombre);
    
    /**
     * Buscar países que contengan el texto en cualquier idioma
     */
    @Query("SELECT c FROM Country c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(c.nameEs) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(c.nameFr) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(c.nameDe) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Country> findByNombreContaining(@Param("texto") String texto);
}
