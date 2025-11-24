package com.SweetStock.api.dto;

public class ReporteInventarioDTO {
    private Integer productoId;
    private String nombre;
    private String marca;
    private String descripcion;
    private Integer unidadesPorCaja;
    private Integer stockCajas;
    private Integer stockUnidadesSueltas;
    private Integer stockTotalUnidades;
    private Double precioUnitario;
    private Double valorTotal;

    public ReporteInventarioDTO() {}

    public ReporteInventarioDTO(Integer productoId, String nombre, String marca, String descripcion, Integer unidadesPorCaja, Integer stockCajas, Integer stockUnidadesSueltas, Double precioUnitario) {
        this.productoId = productoId;
        this.nombre = nombre;
        this.marca = marca;
        this.descripcion = descripcion;
        this.unidadesPorCaja = unidadesPorCaja;
        this.stockCajas = stockCajas;
        this.stockUnidadesSueltas = stockUnidadesSueltas;
        this.precioUnitario = precioUnitario;
        this.stockTotalUnidades = (stockCajas * unidadesPorCaja) + stockUnidadesSueltas;
        this.valorTotal = this.stockTotalUnidades * precioUnitario;
    }

    // Getters
    public Integer getProductoId() { return productoId; }
    public String getNombre() { return nombre; }
    public String getMarca() { return marca; }
    public String getDescripcion() { return descripcion; }
    public Integer getUnidadesPorCaja() { return unidadesPorCaja; }
    public Integer getStockCajas() { return stockCajas; }
    public Integer getStockUnidadesSueltas() { return stockUnidadesSueltas; }
    public Integer getStockTotalUnidades() { return stockTotalUnidades; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public Double getValorTotal() { return valorTotal; }

    // Setters
    public void setProductoId(Integer productoId) { this.productoId = productoId; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setMarca(String marca) { this.marca = marca; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setUnidadesPorCaja(Integer unidadesPorCaja) { this.unidadesPorCaja = unidadesPorCaja; }
    public void setStockCajas(Integer stockCajas) { this.stockCajas = stockCajas; }
    public void setStockUnidadesSueltas(Integer stockUnidadesSueltas) { this.stockUnidadesSueltas = stockUnidadesSueltas; }
    public void setStockTotalUnidades(Integer stockTotalUnidades) { this.stockTotalUnidades = stockTotalUnidades; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}