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
    
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable int id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado exitosamente"));
    }


    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable int id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();
        return ResponseEntity.ok(Map.of(
            "id", usuario.getId(),
            "dni", usuario.getDni(),
            "usuario", usuario.getUsuario(),
            "nombre", usuario.getNombre(),
            "apellido", usuario.getApellido(),
            "rol", usuario.getRol()
        ));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable int id, @RequestBody RegistroRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        // Validar campos obligatorios
        if (request.getDni() == null || request.getDni().trim().isEmpty() ||
                request.getUsuario() == null || request.getUsuario().trim().isEmpty() ||
                request.getNombre() == null || request.getNombre().trim().isEmpty() ||
                request.getApellido() == null || request.getApellido().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "DNI, usuario, nombre y apellido son obligatorios"));
        }

        // Validar DNI peruano (8 dígitos numéricos)
        if (!request.getDni().matches("\\d{8}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "El DNI debe tener exactamente 8 dígitos numéricos."));
        }

        // Validar que el rol sea válido
        List<String> rolesPermitidos = List.of("Administrador", "Almacenero", "Vendedor");
        if (request.getRol() == null || !rolesPermitidos.contains(request.getRol())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El rol especificado no es válido"));
        }

        // Validar unicidad de DNI (excepto si es el mismo usuario)
        Optional<Usuario> usuarioConMismoDni = usuarioRepository.findByDni(request.getDni());
        if (usuarioConMismoDni.isPresent() && usuarioConMismoDni.get().getId() != id) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "El DNI ya está registrado"));
        }

        // Validar unicidad de usuario (excepto si es el mismo usuario)
        Optional<Usuario> usuarioConMismoUsuario = usuarioRepository.findByUsuario(request.getUsuario());
        if (usuarioConMismoUsuario.isPresent() && usuarioConMismoUsuario.get().getId() != id) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        // Actualizar campos
        usuario.setDni(request.getDni());
        usuario.setUsuario(request.getUsuario());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setRol(request.getRol());

        // Actualizar contraseña solo si se proporcionó una nueva
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
            }
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            usuario.setPassword(hashedPassword);
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of(
            "mensaje", "Usuario actualizado con éxito",
            "id", usuarioActualizado.getId(),
            "dni", usuarioActualizado.getDni(),
            "usuario", usuarioActualizado.getUsuario(),
            "nombre", usuarioActualizado.getNombre(),
            "apellido", usuarioActualizado.getApellido(),
            "rol", usuarioActualizado.getRol()
        ));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request) {

        // Validar campos obligatorios
        if (request.getDni() == null || request.getDni().trim().isEmpty() ||
                request.getUsuario() == null || request.getUsuario().trim().isEmpty() ||
                request.getNombre() == null || request.getNombre().trim().isEmpty() ||
                request.getApellido() == null || request.getApellido().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty() ||
                request.getRol() == null || request.getRol().trim().isEmpty()) {

            return ResponseEntity.badRequest().body(Map.of("error", "Todos los campos son obligatorios (DNI, usuario, nombre, apellido, contraseña y rol)."));
        }

        // Validar DNI peruano (8 dígitos numéricos)
        if (!request.getDni().matches("\\d{8}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "El DNI debe tener exactamente 8 dígitos numéricos."));
        }

        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 6 caracteres."));
        }

        List<String> rolesPermitidos = List.of("Administrador", "Almacenero", "Vendedor");
        if (!rolesPermitidos.contains(request.getRol())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El rol especificado no es válido."));
        }

        // Validar unicidad de usuario y DNI
        if (usuarioRepository.findByUsuario(request.getUsuario()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "El nombre de usuario ya está en uso."));
        }

        if (usuarioRepository.findByDni(request.getDni()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "El DNI ya está registrado."));
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        Usuario nuevoUsuario = new Usuario(
            request.getDni(),
            request.getUsuario(),
            request.getNombre(),
            request.getApellido(),
            hashedPassword,
            request.getRol()
        );

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", "Usuario registrado con éxito",
                "id", usuarioGuardado.getId(),
                "dni", usuarioGuardado.getDni(),
                "usuario", usuarioGuardado.getUsuario(),
                "nombre", usuarioGuardado.getNombre(),
                "apellido", usuarioGuardado.getApellido(),
                "rol", usuarioGuardado.getRol()
        ));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsuario(request.getUsername());

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
            "usuario", usuario.getUsuario(),
            "nombre", usuario.getNombre()
        ));
    }
}
