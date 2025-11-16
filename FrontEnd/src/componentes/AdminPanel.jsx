import React, { useState } from "react";
import "./AdminPanel.css";
import RegistroUsuario from "./RegistroUsuario";
import ListaUsuarios from "./ListaUsuarios";
import EditarUsuario from "./EditarUsuario";
import EliminarUsuario from "./EliminarUsuario";
import VistaGestionProductos from "./VistaGestionProductos";

const VistaGestionUsuarios = ({ onVolver, usuario }) => {
    const [opcionActual, setOpcionActual] = useState(null);
    const [usuarioIdEditar, setUsuarioIdEditar] = useState(null);

    const renderContenido = () => {
        switch (opcionActual) {
            case 'registrar':
                return (
                    <RegistroUsuario
                        onRegistroExitoso={() => setOpcionActual('editar')}
                        onVolver={() => setOpcionActual(null)}
                    />
                );
            case 'editar':
                if (usuarioIdEditar) {
                    return (
                        <EditarUsuario
                            usuarioId={usuarioIdEditar}
                            usuarioActual={usuario}
                            onEditarExitoso={() => {
                                setUsuarioIdEditar(null);
                                setOpcionActual('editar');
                            }}
                            onVolver={() => {
                                setUsuarioIdEditar(null);
                                setOpcionActual('editar');
                            }}
                        />
                    );
                }
                return (
                    <ListaUsuarios
                        usuarioActual={usuario}
                        onEditar={(id) => setUsuarioIdEditar(id)}
                        onVolver={() => setOpcionActual(null)}
                    />
                );
            case 'eliminar':
                return <EliminarUsuario onVolver={() => setOpcionActual(null)} />;
            default:
                return (
                    <div className="contenido-placeholder">
                        <div className="placeholder-emoji">👤</div>
                        <h3>Gestión de Usuarios</h3>
                        <p>Seleccione una opción del menú de la izquierda para comenzar.</p>
                        <p className="placeholder-subtitle">Aquí se mostrará el contenido correspondiente.</p>
                    </div>
                );
        }
    };

    return (
        <div className="gestion-layout">
            <div className="gestion-sidebar">
                <h2 className="gestion-titulo">Gestión de Usuarios</h2>
                <nav className="gestion-menu">
                    <button
                        className={`gestion-menu-item menu-registrar ${opcionActual === 'registrar' ? 'activo' : ''}`}
                        onClick={() => setOpcionActual('registrar')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" y1="8" x2="19" y2="14"></line>
                            <line x1="22" y1="11" x2="16" y2="11"></line>
                        </svg>
                        Registrar
                    </button>
                    <button
                        className={`gestion-menu-item menu-editar ${opcionActual === 'editar' ? 'activo' : ''}`}
                        onClick={() => {
                            setUsuarioIdEditar(null);
                            setOpcionActual('editar');
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                    </button>
                    <button
                        className={`gestion-menu-item menu-eliminar ${opcionActual === 'eliminar' ? 'activo' : ''}`}
                        onClick={() => setOpcionActual('eliminar')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Eliminar
                    </button>
                    <button className="gestion-menu-item menu-volver" onClick={onVolver}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Volver al Panel Principal
                    </button>
                </nav>
            </div>
            <div className="gestion-contenido">
                {renderContenido()}
            </div>
        </div>
    );
};

const AdminPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio");

    if (vistaActual === "usuarios") {
        return (
            <VistaGestionUsuarios
                usuario={usuario}
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }

    if (vistaActual === "productos") {
        return (
            <VistaGestionProductos
                usuario={usuario}
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-titulo">Panel de Administrador</h1>
                <p className="admin-subtitulo">Bienvenido de vuelta, {usuario.nombre}!</p>
            </div>

            <div className="accesos-rapidos">
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
                        <button className="admin-boton" onClick={() => setVistaActual("productos")}>Ir a productos</button>
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