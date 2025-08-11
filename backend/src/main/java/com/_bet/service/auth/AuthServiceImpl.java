package com._bet.service.auth;

import com._bet.dto.request.LoginRequest;
import com._bet.dto.request.RegistroRequest;
import com._bet.dto.response.JwtResponse;
import com._bet.dto.response.UsuarioResponse;
import com._bet.entity.Usuario;
import com._bet.helpers.JwtHelper;
import com._bet.service.user.UsuarioService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioService usuarioService;
    private final JwtHelper jwtHelper;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UsuarioResponse registrar(RegistroRequest registroRequest) {
        return usuarioService.registrarUsuario(registroRequest);
    }

    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest loginRequest) {
        try {
            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Obtener usuario autenticado
            Usuario usuario = (Usuario) authentication.getPrincipal();

            // Generar token JWT
            String token = jwtHelper.generateToken(usuario);

            // Crear respuesta
            return new JwtResponse(
                    token,
                    usuario.getId(),
                    usuario.getUsername(),
                    usuario.getEmail(),
                    usuario.getRol().name()
            );

        } catch (AuthenticationException e) {
            throw new RuntimeException("Credenciales incorrectas");
        }
    }
}
