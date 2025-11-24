import React, { useState } from "react";
import "./AlmaceneroPanel.css";
import TablaInventario from "./TablaInventario";
import ActualizarStock from "./ActualizarStock";
import EditarProducto from './EditarProducto';
import RegistrarProducto from './RegistrarProducto';

const VistaGestionProductos = ({ onVolver, usuario }) => {
    const [productoId, setProductoId] = useState(null);
    const [vista, setVista] = useState('menu');

    const renderContenido = () => {
        switch (vista) {
            case 'ver':
                return (
                    <TablaInventario 
                        onEditar={(id) => {
                            setProductoId(id);  // Se modificó el case 'ver', antes:  return <TablaInventario />;
                            setVista('editar');
                        }} 
                    />
                );
            case 'editar':
                return (
                    <EditarProducto 
                        productoId={productoId}
                        onVolver={() => setVista('ver')}
                    />
                );
            case 'actualizar':
                return <ActualizarStock usuario={usuario} />;

            case 'registrar':
                return (
                    <RegistrarProducto
                        onVolver={() => setVista('menu')}
                    />
                );

            case 'historial':
                return <div className="contenido-placeholder"><h3>Historial de Movimientos</h3><p>Vista no implementada.</p></div>;
            default: // 'menu'
                return (
                    <div className="contenido-placeholder">
                        <div className="placeholder-emoji">📦</div>
                        <h3>Gestión de Productos</h3>
                        <p>Seleccione una opción del menú de la izquierda para comenzar.</p>
                        <p className="placeholder-subtitle">Aquí se mostrará el contenido correspondiente.</p>
                    </div>
                );
        }
    };

    return (
        <div className="gestion-layout">
            <div className="gestion-sidebar">
                <h2 className="gestion-titulo">Gestión de Productos</h2>
                <nav className="gestion-menu">
                    <button
                        className={`gestion-menu-item menu-ver-inventario ${vista === 'ver' ? 'activo' : ''}`}
                        onClick={() => setVista('ver')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        Ver inventario
                    </button>

                    <button
                        className={`gestion-menu-item menu-registrar ${vista === 'registrar' ? 'activo' : ''}`}
                        onClick={() => setVista('registrar')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                        </svg>
                        Registrar Producto
                    </button>

                    <button
                        className={`gestion-menu-item menu-actualizar ${vista === 'actualizar' ? 'activo' : ''}`}
                        onClick={() => setVista('actualizar')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 9.5 12 12 16.5 9.5"></polyline>
                            <line x1="12" y1="12" x2="12" y2="16.5"></line>
                            <line x1="12" y1="7.5" x2="12" y2="12"></line>
                        </svg>
                        Actualizar stock
                    </button>

                    {/*
                    <button
                        className={`gestion-menu-item menu-historial ${vista === 'historial' ? 'activo' : ''}`}
                        onClick={() => setVista('historial')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Historial de movimientos
                    </button>
                    */}

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

export default VistaGestionProductos;