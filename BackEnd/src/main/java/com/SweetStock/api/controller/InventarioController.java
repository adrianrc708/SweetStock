package com.SweetStock.api.controller;

import com.SweetStock.api.model.Inventario;
import com.SweetStock.api.repository.InventarioRepository;
import com.SweetStock.api.dto.ReporteInventarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/api/inventario/reporte")
    public ResponseEntity<List<ReporteInventarioDTO>> getReporteGeneral(
            @RequestParam(required = false) Integer productoId,
            @RequestParam(required = false) String marca) {

        List<Inventario> inventarioFiltrado;

        if (productoId != null || (marca != null && !marca.isEmpty())) {
            inventarioFiltrado = inventarioRepository.findReporteFilters(productoId, marca);
        } else {
            inventarioFiltrado = inventarioRepository.findAll();
        }

        List<ReporteInventarioDTO> reporte = inventarioFiltrado.stream()
                .map(item -> new ReporteInventarioDTO(
                        item.getProducto().getProducto_id(),
                        item.getProducto().getNombre(),
                        item.getProducto().getMarca(),
                        item.getProducto().getDescripcion(),
                        item.getProducto().getCantidadCaja() != null ? item.getProducto().getCantidadCaja() : 0,
                        item.getCantidadCaja() != null ? item.getCantidadCaja() : 0,
                        item.getCantidadUnidad() != null ? item.getCantidadUnidad() : 0,
                        item.getProducto().getPrecioUnitario() != null ? item.getProducto().getPrecioUnitario() : 0.0
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(reporte);
    }
}