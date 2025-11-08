// src/components/AdminPanel.jsx
import React from "react";
import "./AdminPanel.css";

const AdminPanel = ({ usuario }) => {
    return (
        <div className="admin-container">
        <h1 className="admin-titulo">Panel de Administrador</h1>
        <p className="admin-subtitulo">Bienvenido, {usuario.nombre}</p>

        <div className="admin-card-container">
            <div className="admin-card">
            <h3>👥 Gestión de Usuarios</h3>
            <p>Crear, editar o eliminar usuarios del sistema.</p>
            <button className="admin-boton">Ir a usuarios</button>
            </div>

            <div className="admin-card">
            <h3>📦 Gestión de Productos</h3>
            <p>Control total sobre los productos del inventario.</p>
            <button className="admin-boton">Ir a productos</button>
            </div>

            <div className="admin-card">
            <h3>📊 Reportes</h3>
            <p>Ver estadísticas generales del negocio.</p>
            <button className="admin-boton">Ver reportes</button>
            </div>
        </div>
        </div>
    );
};

export default AdminPanel;

