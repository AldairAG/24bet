package com._bet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._bet.entity.eventoEntity.Valor;

@Repository
public interface ValorRepository extends JpaRepository<Valor, Long> {

}