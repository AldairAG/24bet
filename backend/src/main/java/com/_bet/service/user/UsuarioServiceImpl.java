package com._bet.service.user;

import com._bet.dto.request.CambiarPasswordRequest;
import com._bet.dto.request.EditarPerfilRequest;
import com._bet.dto.request.EditarUsuarioAdminRequest;
import com._bet.dto.request.InformacionPersonalRequest;
import com._bet.dto.request.RegistroRequest;
import com._bet.dto.response.InformacionPersonalResponse;
import com._bet.dto.response.UsuarioResponse;
import com._bet.entity.InformacionPersonal;
import com._bet.entity.Usuario;
import com._bet.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByUsernameOrEmailForLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorUsernameOEmail(String identifier) {
        return usuarioRepository.findByUsernameOrEmailForLogin(identifier);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional
    public UsuarioResponse registrarUsuario(RegistroRequest registroRequest) {
        // Validar que el username no exista
        if (usuarioRepository.existsByUsername(registroRequest.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        // Validar que el email no exista
        if (usuarioRepository.existsByEmail(registroRequest.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(registroRequest.getUsername());
        usuario.setEmail(registroRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroRequest.getPassword()));
        usuario.setNombre(registroRequest.getNombre());
        usuario.setApellido(registroRequest.getApellido());
        usuario.setLadaTelefono(registroRequest.getLadaTelefono());
        usuario.setNumeroTelefono(registroRequest.getNumeroTelefono());
        usuario.setFechaNacimiento(registroRequest.getFechaNacimiento());
        usuario.setActivo(true);
        usuario.setRol(Usuario.Rol.USER);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return convertirAUsuarioResponse(usuarioGuardado);
    }

    private UsuarioResponse convertirAUsuarioResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setUsername(usuario.getUsername());
        response.setEmail(usuario.getEmail());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setLadaTelefono(usuario.getLadaTelefono());
        response.setNumeroTelefono(usuario.getNumeroTelefono());
        response.setRol(usuario.getRol().name());
        response.setActivo(usuario.getActivo());
        
        // Mapear información personal si existe
        if (usuario.getInformacionPersonal() != null) {
            response.setInformacionPersonal(convertirAInformacionPersonalResponse(usuario.getInformacionPersonal()));
        }
        
        return response;
    }
    
    private InformacionPersonalResponse convertirAInformacionPersonalResponse(InformacionPersonal informacionPersonal) {
        InformacionPersonalResponse response = new InformacionPersonalResponse();
        response.setId(informacionPersonal.getId());
        response.setPrimerNombre(informacionPersonal.getPrimerNombre());
        response.setSegundoNombre(informacionPersonal.getSegundoNombre());
        response.setApellidoPaterno(informacionPersonal.getApellidoPaterno());
        response.setApellidoMaterno(informacionPersonal.getApellidoMaterno());
        response.setFechaNacimiento(informacionPersonal.getFechaNacimiento());
        response.setGenero(informacionPersonal.getGenero());
        response.setTelefono(informacionPersonal.getTelefono());
        response.setTelefonoMovil(informacionPersonal.getTelefonoMovil());
        response.setCalle(informacionPersonal.getCalle());
        response.setNumeroExterior(informacionPersonal.getNumeroExterior());
        response.setNumeroInterior(informacionPersonal.getNumeroInterior());
        response.setColonia(informacionPersonal.getColonia());
        response.setCodigoPostal(informacionPersonal.getCodigoPostal());
        response.setCiudad(informacionPersonal.getCiudad());
        response.setEstado(informacionPersonal.getEstado());
        response.setPais(informacionPersonal.getPais());
        response.setRfc(informacionPersonal.getRfc());
        response.setCurp(informacionPersonal.getCurp());
        response.setEstadoCivil(informacionPersonal.getEstadoCivil());
        response.setOcupacion(informacionPersonal.getOcupacion());
        response.setNacionalidad(informacionPersonal.getNacionalidad());
        response.setFechaCreacion(informacionPersonal.getFechaCreacion());
        response.setFechaActualizacion(informacionPersonal.getFechaActualizacion());
        
        // Agregar campos calculados
        response.setNombreCompleto(informacionPersonal.getNombreCompleto());
        response.setDireccionCompleta(informacionPersonal.getDireccionCompleta());
        
        return response;
    }
    
    private void actualizarInformacionPersonal(Usuario usuario, InformacionPersonalRequest request) {
        if (request == null) {
            return;
        }
        
        InformacionPersonal informacionPersonal = usuario.getInformacionPersonal();
        if (informacionPersonal == null) {
            informacionPersonal = new InformacionPersonal();
            usuario.setInformacionPersonal(informacionPersonal);
            informacionPersonal.setUsuario(usuario);
        }
        
        // Actualizar campos básicos
        if (request.getPrimerNombre() != null) {
            informacionPersonal.setPrimerNombre(request.getPrimerNombre());
        }
        if (request.getSegundoNombre() != null) {
            informacionPersonal.setSegundoNombre(request.getSegundoNombre());
        }
        if (request.getApellidoPaterno() != null) {
            informacionPersonal.setApellidoPaterno(request.getApellidoPaterno());
        }
        if (request.getApellidoMaterno() != null) {
            informacionPersonal.setApellidoMaterno(request.getApellidoMaterno());
        }
        if (request.getFechaNacimiento() != null) {
            informacionPersonal.setFechaNacimiento(request.getFechaNacimiento());
        }
        if (request.getGenero() != null) {
            informacionPersonal.setGenero(request.getGenero());
        }
        
        // Actualizar información de contacto
        if (request.getTelefono() != null) {
            informacionPersonal.setTelefono(request.getTelefono());
        }
        if (request.getTelefonoMovil() != null) {
            informacionPersonal.setTelefonoMovil(request.getTelefonoMovil());
        }
        
        // Actualizar dirección
        if (request.getCalle() != null) {
            informacionPersonal.setCalle(request.getCalle());
        }
        if (request.getNumeroExterior() != null) {
            informacionPersonal.setNumeroExterior(request.getNumeroExterior());
        }
        if (request.getNumeroInterior() != null) {
            informacionPersonal.setNumeroInterior(request.getNumeroInterior());
        }
        if (request.getColonia() != null) {
            informacionPersonal.setColonia(request.getColonia());
        }
        if (request.getCodigoPostal() != null) {
            informacionPersonal.setCodigoPostal(request.getCodigoPostal());
        }
        if (request.getCiudad() != null) {
            informacionPersonal.setCiudad(request.getCiudad());
        }
        if (request.getEstado() != null) {
            informacionPersonal.setEstado(request.getEstado());
        }
        if (request.getPais() != null) {
            informacionPersonal.setPais(request.getPais());
        }
        
        // Actualizar información fiscal
        if (request.getRfc() != null) {
            informacionPersonal.setRfc(request.getRfc());
        }
        if (request.getCurp() != null) {
            informacionPersonal.setCurp(request.getCurp());
        }
        
        // Actualizar información adicional
        if (request.getEstadoCivil() != null) {
            informacionPersonal.setEstadoCivil(request.getEstadoCivil());
        }
        if (request.getOcupacion() != null) {
            informacionPersonal.setOcupacion(request.getOcupacion());
        }
        if (request.getNacionalidad() != null) {
            informacionPersonal.setNacionalidad(request.getNacionalidad());
        }
    }

    // Métodos CRUD adicionales

    @Override
    @Transactional(readOnly = true)
    public Page<UsuarioResponse> obtenerTodosLosUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(this::convertirAUsuarioResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return convertirAUsuarioResponse(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponse editarPerfil(Long userId, EditarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el email ya existe en otro usuario
        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("El email ya está en uso por otro usuario");
            }
            usuario.setEmail(request.getEmail());
        }

        // Actualizar solo los campos permitidos para el usuario
        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }
        if (request.getApellido() != null) {
            usuario.setApellido(request.getApellido());
        }
        if (request.getLadaTelefono() != null) {
            usuario.setLadaTelefono(request.getLadaTelefono());
        }
        if (request.getNumeroTelefono() != null) {
            usuario.setNumeroTelefono(request.getNumeroTelefono());
        }
        if (request.getFechaNacimiento() != null) {
            usuario.setFechaNacimiento(request.getFechaNacimiento());
        }
        
        // Actualizar información personal
        actualizarInformacionPersonal(usuario, request.getInformacionPersonal());

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirAUsuarioResponse(usuarioActualizado);
    }

    @Override
    @Transactional
    public UsuarioResponse editarUsuarioComoAdmin(Long userId, EditarUsuarioAdminRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el username ya existe en otro usuario
        if (!request.getUsername().equals(usuario.getUsername())) {
            if (usuarioRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("El nombre de usuario ya está en uso");
            }
            usuario.setUsername(request.getUsername());
        }

        // Verificar si el email ya existe en otro usuario
        if (!request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("El email ya está en uso");
            }
            usuario.setEmail(request.getEmail());
        }

        // Actualizar todos los campos
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setLadaTelefono(request.getLadaTelefono());
        usuario.setNumeroTelefono(request.getNumeroTelefono());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        
        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }
        if (request.getRol() != null) {
            usuario.setRol(request.getRol());
        }
        
        // Actualizar información personal
        actualizarInformacionPersonal(usuario, request.getInformacionPersonal());

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirAUsuarioResponse(usuarioActualizado);
    }

    @Override
    @Transactional
    public void cambiarPassword(Long userId, CambiarPasswordRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Verificar que las nuevas contraseñas coincidan
        if (!request.getNuevaPassword().equals(request.getConfirmarPassword())) {
            throw new RuntimeException("Las contraseñas nuevas no coinciden");
        }

        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void desactivarUsuario(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void activarUsuario(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void eliminarUsuario(Long userId) {
        if (!usuarioRepository.existsById(userId)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(userId);
    }
}
