package com.SweetStock.api.controller;

import com.SweetStock.api.dto.LoginRequest;
import com.SweetStock.api.model.Usuario;
import com.SweetStock.api.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {
        return usuarioRepository.findAll();
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
        if (!usuario.getPassword().equals(request.getPassword())) {
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
