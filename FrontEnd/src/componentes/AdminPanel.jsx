import React, { useState } from "react";
import "./AdminPanel.css";
import RegistroUsuario from "./RegistroUsuario";
import EliminarUsuario from "./EliminarUsuario";

const VistaGestionUsuarios = ({ onIrARegistro, onIrAEliminar, onVolver }) => {
    return (
        <div className="admin-container">
            <h2 className="admin-titulo">Gestión de Usuarios</h2>
            <div className="user-actions">
                <button className="admin-boton" onClick={onIrARegistro}>Registrar</button>
                <button className="admin-boton" onClick={() => {}}>Editar</button>
                <button className="admin-boton" onClick={onIrAEliminar}>Eliminar</button>
            </div>
            <button className="admin-boton" onClick={onVolver}>← Volver al Panel Principal</button>
        </div>
    );
};


const AdminPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio"); 

    if (vistaActual === "registrar") {
        return (
            <RegistroUsuario 
                onRegistroExitoso={() => setVistaActual("usuarios")} 
                onVolver={() => setVistaActual("usuarios")}
            />
        );
    }
    
    if (vistaActual === "usuarios") {
        return (
            <VistaGestionUsuarios
                onIrARegistro={() => setVistaActual("registrar")}
                onIrAEliminar={() => setVistaActual("eliminar")}
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }

    if (vistaActual === "eliminar") {
        return <EliminarUsuario onVolver={() => setVistaActual("usuarios")} />;
    }

    return (
        <div className="admin-container">
            <h1 className="admin-titulo">Panel de Administrador</h1>
            <p className="admin-subtitulo">Bienvenido, {usuario.nombre}</p>

            <div className="admin-card-container">
                <div className="admin-card">
                    <h3>👥 Gestión de Usuarios</h3>
                    <p>Crear, editar o eliminar usuarios del sistema.</p>
                    <button className="admin-boton" onClick={() => setVistaActual("usuarios")}>Ir a usuarios</button>
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