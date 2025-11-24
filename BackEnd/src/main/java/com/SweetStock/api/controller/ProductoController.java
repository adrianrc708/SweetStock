package com.SweetStock.api.controller;

import com.SweetStock.api.model.Producto;
import com.SweetStock.api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.SweetStock.api.repository.InventarioRepository;
import com.SweetStock.api.model.Inventario;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private InventarioRepository inventarioRepository;


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
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Producto nuevo) {

        // Validación de campos obligatorios
        if (nuevo.getNombre() == null || nuevo.getNombre().isBlank() ||
            nuevo.getMarca() == null || nuevo.getMarca().isBlank()) {
            return ResponseEntity.badRequest().body("Nombre y marca son obligatorios");
        }

        // Validación de duplicados
        Optional<Producto> existente = productoRepository.findByNombreAndMarca(
                nuevo.getNombre(), nuevo.getMarca()
        );
        if (existente.isPresent()) {
            return ResponseEntity.badRequest().body("El producto ya existe");
        }

        // Crear producto
        Producto guardado = productoRepository.save(nuevo);

        // Asociar inventario inicial (cero stock)
        Inventario inventario = new Inventario();
        inventario.setProducto(guardado);
        inventario.setCantidadCaja(0);
        inventario.setCantidadUnidad(0);
        inventario.setIdMuelle(null); // o el que corresponda

        inventarioRepository.save(inventario);

        guardado.setInventario(inventario);

        return ResponseEntity.ok(guardado);
    }

}