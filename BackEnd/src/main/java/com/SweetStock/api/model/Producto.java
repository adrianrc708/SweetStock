package com.SweetStock.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Producto_id")
    private Integer producto_id;

    @Column(name = "nombre", length = 20)
    private String nombre;

    @Column(name = "marca", length = 20)
    private String marca;

    @Column(name = "descripcion", length = 40)
    private String descripcion;

    @Column(name = "cantidad_caja")
    private Integer cantidadCaja;

    @Column(name = "peso")
    private Double peso;

    @Column(name = "precio_unitario")
    private Double precioUnitario;

    @OneToOne(mappedBy = "producto")
    @JsonIgnore
    private Inventario inventario;


    // Constructores
    public Producto() {}

    // Getters y Setters
    public Integer getProducto_id() { return producto_id; }
    public void setProducto_id(Integer producto_id) { this.producto_id = producto_id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }
    public Inventario getInventario() { return inventario; }
    public void setInventario(Inventario inventario) { this.inventario = inventario; }

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public Integer getCantidadCaja() {
        return cantidadCaja;
    }

    public void setCantidadCaja(Integer cantidadCaja) {
        this.cantidadCaja = cantidadCaja;
    }


}