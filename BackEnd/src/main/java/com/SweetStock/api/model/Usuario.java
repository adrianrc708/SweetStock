
package com.SweetStock.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

//import org.springframework.security.crypto.bycrypt.ByCryptPasswordEncoder;
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String password;
    private String rol;
    @Column(columnDefinition = "integer default 0")
    private int intentosFallidos = 0;
    @Column(columnDefinition = "boolean default false")
    private boolean cuentaBloqueada = false;
    private LocalDateTime bloqueoHasta;
    
    public Usuario(){}
    
    public Usuario(String nombre, String password, String rol){
        this.nombre = nombre;
        this.password = password;
        this.rol = rol;
    }
    
    public int getId(){
        return id;
    }
    
    public void setId(int id){
        this.id = id;
    }
    
    public String getNombre(){
        return nombre;
    }
    
    public void setNombre(String nombre){
        this.nombre = nombre;
    }
    
    public String getPassword(){
        return password;
    }
    
    public void setPassword(String password){
        this.password = password;
    }
    
    public String getRol(){
        return rol;
    }
    
    public void setRol(String rol){
        this.rol = rol;
    }
    
    public int getIntentosFallidos(){
        return intentosFallidos;
    }
    
    public void setIntentosFallidos(int intentosFallidos){
        this.intentosFallidos = intentosFallidos;
    }
    
    public boolean isCuentaBloqueada(){
        return bloqueoHasta != null && LocalDateTime.now().isBefore(bloqueoHasta);
    }
    
    public void setCuentaBloqueada(boolean cuentaBloqueada){
        this.cuentaBloqueada = cuentaBloqueada;
    }
    
    public LocalDateTime getBloqueoHasta() {
        return bloqueoHasta;
    }

    public void setBloqueoHasta(LocalDateTime bloqueoHasta) {
        this.bloqueoHasta = bloqueoHasta;
    }
}
