package com.SweetStock.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventario_id")
    private Integer inventario_id;

    @Column(name = "cantidad_caja") // Corregido
    private Integer cantidadCaja;

    @Column(name = "cantidad_unidad") // Corregido
    private Integer cantidadUnidad;

    @Column(name = "id_muelle")
    private Integer idMuelle;

    @OneToOne
    @JoinColumn(name = "producto_id", referencedColumnName = "Producto_id")
    private Producto producto;

    // Constructores
    public Inventario() {}

    // Getters y Setters
    public Integer getInventario_id() { return inventario_id; }
    public void setInventario_id(Integer inventario_id) { this.inventario_id = inventario_id; }
    public Integer getCantidadCaja() { return cantidadCaja; }
    public void setCantidadCaja(Integer cantidadCaja) { this.cantidadCaja = cantidadCaja; }
    public Integer getCantidadUnidad() { return cantidadUnidad; }
    public void setCantidadUnidad(Integer cantidadUnidad) { this.cantidadUnidad = cantidadUnidad; }
    public Integer getIdMuelle() { return idMuelle; }
    public void setIdMuelle(Integer idMuelle) { this.idMuelle = idMuelle; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
}