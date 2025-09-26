package com._bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
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
     * Buscar países activos
     */
    List<Country> findByActivoTrue();

}
