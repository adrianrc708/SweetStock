import React, { useState } from "react";
import "./AlmaceneroPanel.css";
import VistaGestionProductos from "./VistaGestionProductos";
import VistaReportes from "./VistaReportes";

const AlmaceneroPanel = ({ usuario }) => {
    const [vistaActual, setVistaActual] = useState("inicio");

    if (vistaActual === "productos") {
        return (
            <VistaGestionProductos
                usuario={usuario}
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }
    if (vistaActual === "reportes") {
        return (
            <VistaReportes
                onVolver={() => setVistaActual("inicio")}
            />
        );
    }

    return (
        <div className="almacenero-container">
            <div className="almacenero-header">
                <h1 className="almacenero-titulo">Panel de Almacenero</h1>
                <p className="almacenero-subtitulo">Bienvenido de vuelta, {usuario.nombre}!</p>
            </div>

            <div className="accesos-rapidos">
                <div className="almacenero-card-container">
                    <div className="almacenero-card">
                        <div className="card-icon stock-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <h3>Gestión de Productos</h3>
                        <p>Control total sobre los productos del inventario.</p>
                        <button className="almacenero-boton" onClick={() => setVistaActual("productos")}>Ir a productos</button> {/* <-- CAMBIADO */}
                    </div>

                    <div className="almacenero-card">
                        <div className="card-icon reportes-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <h3>Reportes</h3>
                        <p>Ver estadísticas generales del negocio.</p>
                        <button className="almacenero-boton" onClick={() => setVistaActual("reportes")}>Ver reportes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlmaceneroPanel;