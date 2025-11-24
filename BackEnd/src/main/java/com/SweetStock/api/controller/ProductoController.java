package com.SweetStock.api.controller;

import com.SweetStock.api.model.Producto;
import com.SweetStock.api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        Optional<Producto> producto = productoRepository.findById(id);
        if (producto.isEmpty()) {
            return ResponseEntity.badRequest().body("Producto no encontrado");
        }
        return ResponseEntity.ok(producto.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Producto cambios) {
        Optional<Producto> optional = productoRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Producto no encontrado");
        }

        Producto p = optional.get();
        p.setNombre(cambios.getNombre());
        p.setMarca(cambios.getMarca());
        p.setDescripcion(cambios.getDescripcion());
        p.setCantidadCaja(cambios.getCantidadCaja());
        p.setPeso(cambios.getPeso());
        p.setPrecioUnitario(cambios.getPrecioUnitario());

        productoRepository.save(p);

        return ResponseEntity.ok(p);
    }
}