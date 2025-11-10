package com.SweetStock.api.controller;

import com.SweetStock.api.dto.LoginRequest;
import com.SweetStock.api.dto.RegistroRequest;
import com.SweetStock.api.model.Usuario;
import com.SweetStock.api.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request) {

        if (request.getNombre() == null || request.getNombre().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty() ||
                request.getRol() == null || request.getRol().trim().isEmpty()) {

            return ResponseEntity.badRequest().body(Map.of("error", "Nombre, contraseña y rol son obligatorios."));
        }
        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres."));
        }

        List<String> rolesPermitidos = List.of("Administrador", "Almacenero", "Vendedor");
        if (!rolesPermitidos.contains(request.getRol())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El rol especificado no es válido."));
        }

        if (usuarioRepository.findByNombre(request.getNombre()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "El nombre de usuario ya está en uso."));
        }
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        Usuario nuevoUsuario = new Usuario(request.getNombre(), hashedPassword, request.getRol());

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", "Usuario registrado con éxito",
                "id", usuarioGuardado.getId(),
                "nombre", usuarioGuardado.getNombre(),
                "rol", usuarioGuardado.getRol()
        ));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombre(request.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verificar si está bloqueado actualmente
        if (usuario.isCuentaBloqueada()) {
            LocalDateTime finBloqueo = usuario.getBloqueoHasta();
            String horaFormateada = finBloqueo.toLocalTime()
                                    .format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss"));
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                   .body("Cuenta bloqueada temporalmente. Intenta nuevamente a las " + horaFormateada);
        }

        // Verificar contraseña
        // TEMPORAL: comparación directa (luego lo cambiamos por BCrypt)
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);

            if (usuario.getIntentosFallidos() >= 3) { // máximo 3 intentos
                usuario.setBloqueoHasta(LocalDateTime.now().plusMinutes(10));
                usuario.setIntentosFallidos(0); // Reinicia los intentos al bloquear
                usuario.setCuentaBloqueada(true);
            }

            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        // Si el login fue exitoso
        usuario.setIntentosFallidos(0); // reinicia el contador
        usuario.setBloqueoHasta(null); // elimina cualquier bloqueo previo
        usuarioRepository.save(usuario);
        
        // Si todo OK
        return ResponseEntity.ok(Map.of(
            "mensaje", "Login exitoso",
            "rol", usuario.getRol(),
            "id", usuario.getId(),
            "nombre", usuario.getNombre()
        ));
    }
}
