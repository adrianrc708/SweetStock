package com.SweetStock.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Registro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registro_id")
    private Long registroId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_id", referencedColumnName = "Producto_id")
    private Producto producto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuarioRegistro;

    @Column(nullable = false, length = 15)
    private String estado; // ingreso | salida

    @Column(name = "cantidad_caja")
    private Integer cantidadCaja; // movimiento cajas

    @Column(name = "cantidad_unidad")
    private Integer cantidadUnidad; // movimiento unidades

    @Column(name = "stock_caja_antes")
    private Integer stockCajaAntes;

    @Column(name = "stock_unidad_antes")
    private Integer stockUnidadAntes;

    @Column(name = "stock_caja_despues")
    private Integer stockCajaDespues;

    @Column(name = "stock_unidad_despues")
    private Integer stockUnidadDespues;

    @Column(name = "fecha_registro")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaRegistro;

    @Column(name = "hora_registro", columnDefinition = "TIME(0)")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaRegistro;

    @Column(length = 300)
    private String observaciones;

    public Registro() {}

    public Registro(Producto producto, Usuario usuarioRegistro, String estado,
                    Integer cantidadCaja, Integer cantidadUnidad,
                    Integer stockCajaAntes, Integer stockUnidadAntes,
                    Integer stockCajaDespues, Integer stockUnidadDespues,
                    String observaciones) {
        this.producto = producto;
        this.usuarioRegistro = usuarioRegistro;
        this.estado = estado;
        this.cantidadCaja = cantidadCaja;
        this.cantidadUnidad = cantidadUnidad;
        this.stockCajaAntes = stockCajaAntes;
        this.stockUnidadAntes = stockUnidadAntes;
        this.stockCajaDespues = stockCajaDespues;
        this.stockUnidadDespues = stockUnidadDespues;
        this.observaciones = observaciones;
        // fecha y hora se setean externamente para mayor control
    }

    // Getters y Setters
    public Long getRegistroId() { return registroId; }
    public void setRegistroId(Long registroId) { this.registroId = registroId; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public Usuario getUsuarioRegistro() { return usuarioRegistro; }
    public void setUsuarioRegistro(Usuario usuarioRegistro) { this.usuarioRegistro = usuarioRegistro; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getCantidadCaja() { return cantidadCaja; }
    public void setCantidadCaja(Integer cantidadCaja) { this.cantidadCaja = cantidadCaja; }
    public Integer getCantidadUnidad() { return cantidadUnidad; }
    public void setCantidadUnidad(Integer cantidadUnidad) { this.cantidadUnidad = cantidadUnidad; }
    public Integer getStockCajaAntes() { return stockCajaAntes; }
    public void setStockCajaAntes(Integer stockCajaAntes) { this.stockCajaAntes = stockCajaAntes; }
    public Integer getStockUnidadAntes() { return stockUnidadAntes; }
    public void setStockUnidadAntes(Integer stockUnidadAntes) { this.stockUnidadAntes = stockUnidadAntes; }
    public Integer getStockCajaDespues() { return stockCajaDespues; }
    public void setStockCajaDespues(Integer stockCajaDespues) { this.stockCajaDespues = stockCajaDespues; }
    public Integer getStockUnidadDespues() { return stockUnidadDespues; }
    public void setStockUnidadDespues(Integer stockUnidadDespues) { this.stockUnidadDespues = stockUnidadDespues; }
    public LocalDate getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDate fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public LocalTime getHoraRegistro() { return horaRegistro; }
    public void setHoraRegistro(LocalTime horaRegistro) { this.horaRegistro = horaRegistro; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
