import React, { useState } from "react";
import "./VendedorPanel.css";
import TablaInventario from "./TablaInventario";

const VendedorPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio");

    if (vistaActual === "inventario") {
        return (
            <div className="gestion-layout">
                <div className="gestion-sidebar">
                    <h2 className="gestion-titulo">Inventario</h2>
                    <nav className="gestion-menu">
                        <button
                            className="gestion-menu-item activo"
                            onClick={() => setVistaActual("inventario")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            Ver Inventario
                        </button>

                        <button
                            className="gestion-menu-item menu-volver"
                            onClick={() => setVistaActual("inicio")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Volver al Panel Principal
                        </button>
                    </nav>
                </div>
                <div className="gestion-contenido">
                    <TablaInventario />
                </div>
            </div>
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
                        <h3>Visualizar Inventario</h3>
                        <p>Ver el stock actual de todos los productos.</p>
                        <button className="vendedor-boton" onClick={() => setVistaActual("inventario")}>
                            Ir al inventario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendedorPanel;