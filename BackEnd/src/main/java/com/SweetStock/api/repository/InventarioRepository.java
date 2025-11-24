package com.SweetStock.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.SweetStock.api.model.Inventario;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    @Query("SELECT i FROM Inventario i JOIN i.producto p WHERE " +
            "(:nombre IS NULL OR :nombre = '' OR p.nombre LIKE %:nombre%) AND " +
            "(:marca IS NULL OR :marca = '' OR p.marca LIKE %:marca%)")
    List<Inventario> findWithFilters(
            @Param("nombre") String nombre,
            @Param("marca") String marca);

    @Query("SELECT i FROM Inventario i JOIN i.producto p WHERE " +
            "(:productoId IS NULL OR p.producto_id = :productoId) AND " +
            "(:marca IS NULL OR :marca = '' OR p.marca LIKE %:marca%)")
    List<Inventario> findReporteFilters(
            @Param("productoId") Integer productoId,
            @Param("marca") String marca);
}