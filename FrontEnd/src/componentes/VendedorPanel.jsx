import React, { useState } from "react";
import "./VendedorPanel.css";

const VistaActualizacionStock = ({ onVolver, usuario }) => {
    return (
        <div className="gestion-layout">
            <div className="gestion-sidebar">
                <h2 className="gestion-titulo">Gestionar Stock</h2>
                <nav className="gestion-menu">
                    <button className="gestion-menu-item menu-ver-inventario">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        Ver inventario
                    </button>
                    <button className="gestion-menu-item menu-actualizar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 9.5 12 12 16.5 9.5"></polyline>
                            <line x1="12" y1="12" x2="12" y2="16.5"></line>
                            <line x1="12" y1="7.5" x2="12" y2="12"></line>
                        </svg>
                        Actualizar stock
                    </button>
                    <button className="gestion-menu-item menu-historial">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Historial de movimientos
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
                <div className="contenido-placeholder">
                    <div className="placeholder-emoji">📦</div>
                    <h3>Gestionar Stock</h3>
                    <p>Seleccione una opción del menú de la izquierda para comenzar.</p>
                    <p className="placeholder-subtitle">Aquí se mostrará el contenido correspondiente.</p>
                </div>
            </div>
        </div>
    );
};

const VendedorPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio");

    if (vistaActual === "stock") {
        return (
            <VistaActualizacionStock
                usuario={usuario}
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }

    return (
        <div className="vendedor-container">
            <div className="vendedor-header">
                <h1 className="vendedor-titulo">Panel de Vendedor</h1>
                <p className="vendedor-subtitulo">Bienvenido de vuelta, {usuario.nombre}!</p>
            </div>

            <div className="accesos-rapidos">
                <div className="vendedor-card-container">
                    <div className="vendedor-card">
                        <div className="card-icon stock-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <h3>Gestionar Stock</h3>
                        <p>Gestiona el inventario, actualiza cantidades y revisa movimientos.</p>
                        <button className="vendedor-boton" onClick={() => setVistaActual("stock")}>Ir a gestionar stock</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendedorPanel;