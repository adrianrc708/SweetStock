package com.SweetStock.api.controller;

import com.SweetStock.api.model.Inventario;
import com.SweetStock.api.model.Producto;
import com.SweetStock.api.model.Registro;
import com.SweetStock.api.model.Usuario;
import com.SweetStock.api.repository.InventarioRepository;
import com.SweetStock.api.repository.ProductoRepository;
import com.SweetStock.api.repository.RegistroRepository;
import com.SweetStock.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registros")
public class RegistroController {

    @Autowired
    private RegistroRepository registroRepository;
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Registro>> listar(@RequestParam(required = false) String estado) {
        if (estado != null && !estado.isBlank()) {
            return ResponseEntity.ok(registroRepository.findByEstado(estado));
        }
        return ResponseEntity.ok(registroRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody RegistroMovimientoRequest request) {
        // Validaciones básicas
        if (request.getProductoId() == null || request.getUsuarioId() == null) {
            return ResponseEntity.badRequest().body("productoId y usuarioId son obligatorios");
        }
        if (request.getEstado() == null || !(request.getEstado().equalsIgnoreCase("ingreso") || request.getEstado().equalsIgnoreCase("despacho"))) {
            return ResponseEntity.badRequest().body("estado debe ser 'ingreso' o 'despacho'");
        }
        int cajasMov = request.getCantidadCaja() != null ? request.getCantidadCaja() : 0;
        int unidadesMov = request.getCantidadUnidad() != null ? request.getCantidadUnidad() : 0;
        if (cajasMov <= 0 && unidadesMov <= 0) {
            return ResponseEntity.badRequest().body("Debe especificar alguna cantidad (cajas o unidades) mayor a 0");
        }

        Optional<Producto> prodOpt = productoRepository.findById(request.getProductoId());
        if (prodOpt.isEmpty()) return ResponseEntity.badRequest().body("Producto no encontrado");
        Optional<Usuario> userOpt = usuarioRepository.findById(request.getUsuarioId());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Usuario no encontrado");

        Producto producto = prodOpt.get();
        Usuario usuario = userOpt.get();

        // Obtener inventario asociado
        Inventario inventario = producto.getInventario();
        if (inventario == null) {
            return ResponseEntity.badRequest().body("El producto no tiene inventario asociado");
        }

        int stockCajaAntes = inventario.getCantidadCaja() != null ? inventario.getCantidadCaja() : 0;
        int stockUnidadAntes = inventario.getCantidadUnidad() != null ? inventario.getCantidadUnidad() : 0;

        // Calcular después
        int stockCajaDespues = stockCajaAntes;
        int stockUnidadDespues = stockUnidadAntes;

        if (request.getEstado().equalsIgnoreCase("ingreso")) {
            stockCajaDespues += cajasMov;
            stockUnidadDespues += unidadesMov;
        } else { // despacho
            if (cajasMov > stockCajaAntes) return ResponseEntity.badRequest().body("Stock de cajas insuficiente");
            if (unidadesMov > stockUnidadAntes) return ResponseEntity.badRequest().body("Stock de unidades insuficiente");
            stockCajaDespues -= cajasMov;
            stockUnidadDespues -= unidadesMov;
        }

        inventario.setCantidadCaja(stockCajaDespues);
        inventario.setCantidadUnidad(stockUnidadDespues);
        inventarioRepository.save(inventario);

        Registro registro = new Registro(
                producto,
                usuario,
                request.getEstado().toLowerCase(),
                cajasMov,
                unidadesMov,
                stockCajaAntes,
                stockUnidadAntes,
                stockCajaDespues,
                stockUnidadDespues,
                request.getObservaciones()
        );
        registro.setFechaRegistro(LocalDate.now());
        registro.setHoraRegistro(LocalTime.now());
        Registro guardado = registroRepository.save(registro);
        return ResponseEntity.ok(guardado);
    }

    // DTO interno para request
    public static class RegistroMovimientoRequest {
        private Integer productoId;
        private Integer usuarioId;
        private String estado; // ingreso | despacho
        private Integer cantidadCaja;
        private Integer cantidadUnidad;
        private String observaciones;

        public Integer getProductoId() { return productoId; }
        public void setProductoId(Integer productoId) { this.productoId = productoId; }
        public Integer getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
        public Integer getCantidadCaja() { return cantidadCaja; }
        public void setCantidadCaja(Integer cantidadCaja) { this.cantidadCaja = cantidadCaja; }
        public Integer getCantidadUnidad() { return cantidadUnidad; }
        public void setCantidadUnidad(Integer cantidadUnidad) { this.cantidadUnidad = cantidadUnidad; }
        public String getObservaciones() { return observaciones; }
        public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    }
}
