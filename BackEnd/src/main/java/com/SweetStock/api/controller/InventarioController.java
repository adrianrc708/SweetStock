package com.SweetStock.api.controller;

import com.SweetStock.api.model.Inventario;
import com.SweetStock.api.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping("/api/inventario")
    public ResponseEntity<List<Inventario>> getInventario(
                                                           @RequestParam(required = false) String nombre,
                                                           @RequestParam(required = false) String marca) {

        List<Inventario> inventario = inventarioRepository.findWithFilters(nombre, marca);
        return ResponseEntity.ok(inventario);
    }
}