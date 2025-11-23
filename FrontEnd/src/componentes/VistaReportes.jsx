import React, { useState } from "react";
import "./AdminPanel.css";
import ReporteMovimientos from "./ReporteMovimientos";

const VistaReportes = ({ onVolver }) => {
    const [opcion, setOpcion] = useState(null);

    const renderContenido = () => {
        switch (opcion) {
            case 'inventario':
                return (
                    <div className="contenido-placeholder">
                        <h3>Reporte de Inventario General</h3>
                        <p>Aquí se mostrará el reporte general del inventario.</p>
                    </div>
                );
            case 'movimientos':
                return <ReporteMovimientos />;
            default:
                return (
                    <div className="contenido-placeholder">
                        <div className="placeholder-emoji">📊</div>
                        <h3>Reportes</h3>
                        <p>Seleccione una opción del menú de la izquierda para ver el reporte correspondiente.</p>
                    </div>
                );
        }
    };

    return (
        <div className="gestion-layout">
            <div className="gestion-sidebar">
                <h2 className="gestion-titulo">Reportes</h2>
                <nav className="gestion-menu">
                    <button
                        className={`gestion-menu-item ${opcion === 'inventario' ? 'activo' : ''}`}
                        onClick={() => setOpcion('inventario')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        Reporte de Inventario General
                    </button>
                    <button
                        className={`gestion-menu-item ${opcion === 'movimientos' ? 'activo' : ''}`}
                        onClick={() => setOpcion('movimientos')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.37 5.37A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        Reporte de Movimientos de Inventario
                    </button>
                    <button className="gestion-menu-item menu-volver" onClick={onVolver}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
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

export default VistaReportes;
