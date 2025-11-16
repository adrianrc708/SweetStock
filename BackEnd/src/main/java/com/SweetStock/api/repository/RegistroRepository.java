package com.SweetStock.api.repository;

import com.SweetStock.api.model.Registro;
import com.SweetStock.api.model.Producto;
import com.SweetStock.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByProducto(Producto producto);
    List<Registro> findByUsuarioRegistro(Usuario usuario);
    List<Registro> findByEstado(String estado);

    @Query("SELECT r FROM Registro r WHERE r.fechaRegistro BETWEEN :desde AND :hasta ORDER BY r.fechaRegistro DESC, r.horaRegistro DESC")
    List<Registro> findRangoFechas(LocalDate desde, LocalDate hasta);
}
