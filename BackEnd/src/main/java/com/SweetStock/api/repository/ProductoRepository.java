package com.SweetStock.api.repository;

import com.SweetStock.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Para usar Optional


public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    Optional<Producto> findByNombreAndMarca(String nombre, String marca);
}