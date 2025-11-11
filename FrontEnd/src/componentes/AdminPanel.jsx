import React, { useState } from "react";
import "./AdminPanel.css";
import RegistroUsuario from "./RegistroUsuario";
import ListaUsuarios from "./ListaUsuarios";
import EditarUsuario from "./EditarUsuario";
import EliminarUsuario from "./EliminarUsuario";

const VistaGestionUsuarios = ({ onIrARegistro, onIrAEditar, onIrAEliminar, onVolver }) => {
    return (
        <div className="admin-container">
            <h2 className="admin-titulo">Gestión de Usuarios</h2>
            <div className="user-actions">
                <button className="admin-boton" onClick={onIrARegistro}>Registrar</button>
                <button className="admin-boton" onClick={onIrAEditar}>Editar</button>
                <button className="admin-boton" onClick={onIrAEliminar}>Eliminar</button>
            </div>
            <button className="admin-boton secondary-button" onClick={onVolver}>← Volver al Panel Principal</button>
        </div>
    );
};

const AdminPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio");
    const [usuarioIdEditar, setUsuarioIdEditar] = useState(null);

    if (vistaActual === "registrar") {
        return (
            <RegistroUsuario 
                onRegistroExitoso={() => setVistaActual("usuarios")}
                onVolver={() => setVistaActual("usuarios")}
            />
        );
    }
    
    if (vistaActual === "editarUsuario" && usuarioIdEditar) {
        return (
            <EditarUsuario
                usuarioId={usuarioIdEditar}
                usuarioActual={usuario}
                onEditarExitoso={() => setVistaActual("listaUsuarios")}
                onVolver={() => setVistaActual("listaUsuarios")}
            />
        );
    }

    if (vistaActual === "listaUsuarios") {
        return (
            <ListaUsuarios
                usuarioActual={usuario}
                onEditar={(id) => {
                    setUsuarioIdEditar(id);
                    setVistaActual("editarUsuario");
                }}
                onVolver={() => setVistaActual("usuarios")}
            />
        );
    }

    if (vistaActual === "usuarios") {
        return (
            <VistaGestionUsuarios
                onIrARegistro={() => setVistaActual("registrar")}
                onIrAEditar={() => setVistaActual("listaUsuarios")}
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
            <div className="admin-header">
                <h1 className="admin-titulo">Panel de Administrador</h1>
                <p className="admin-subtitulo">Bienvenido de vuelta, {usuario.nombre}!</p>
            </div>

            <div className="accesos-rapidos">
                <h2 className="seccion-titulo">Accesos Rápidos</h2>
                <div className="admin-card-container">
                    <div className="admin-card">
                        <div className="card-icon usuarios-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3>Gestión de Usuarios</h3>
                        <p>Crear, editar o eliminar usuarios del sistema.</p>
                        <button className="admin-boton" onClick={() => setVistaActual("usuarios")}>Ir a usuarios</button>
                    </div>

                    <div className="admin-card">
                        <div className="card-icon productos-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L8 7h8l-4-5z"/>
                                <path d="M8 7l-3 5h14l-3-5"/>
                                <ellipse cx="12" cy="17" rx="6" ry="5"/>
                                <path d="M6 12c0 1.5 2.5 3 6 3s6-1.5 6-3"/>
                            </svg>
                        </div>
                        <h3>Gestión de Productos</h3>
                        <p>Control total sobre los productos del inventario.</p>
                        <button className="admin-boton">Ir a productos</button>
                    </div>

                    <div className="admin-card">
                        <div className="card-icon reportes-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <h3>Reportes</h3>
                        <p>Ver estadísticas generales del negocio.</p>
                        <button className="admin-boton">Ver reportes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;