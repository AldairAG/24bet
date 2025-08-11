package com._bet.repository;

import com._bet.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.username = :username OR u.email = :username")
    Optional<Usuario> findByUsernameOrEmail(@Param("username") String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.username = :identifier OR u.email = :identifier")
    Optional<Usuario> findByUsernameOrEmailForLogin(@Param("identifier") String identifier);
}
