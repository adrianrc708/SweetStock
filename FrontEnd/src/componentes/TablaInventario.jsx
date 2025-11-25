import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const TablaInventario = ({ onEditar, onEliminar }) => {
    const [inventario, setInventario] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // Se obtiene el usuario y se normaliza el rol para evitar problemas de formato
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    let rol = usuario?.rol || "";
    rol = rol.trim().toLowerCase();

    const fetchInventario = () => {
        setCargando(true);
        setError(null);

        const params = new URLSearchParams();
        if (filtroNombre) params.append('nombre', filtroNombre);
        if (filtroMarca) params.append('marca', filtroMarca);

        fetch(`http://localhost:8080/api/inventario?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar el inventario');
                return res.json();
            })
            .then(data => {
                setInventario(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error fetching inventario:", err);
                setError(err.message);
                setCargando(false);
            });
    };

    useEffect(() => {
        fetchInventario();
    }, []);

    const handleBuscar = (e) => {
        e.preventDefault();
        fetchInventario();
    };

    // Paginación
    const filasPorPagina = 10;
    const [paginaActual, setPaginaActual] = useState(1);
    const totalPaginas = Math.ceil(inventario.length / filasPorPagina);
    const inventarioPaginado = inventario.slice((paginaActual - 1) * filasPorPagina, paginaActual * filasPorPagina);

    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [filtroNombre, filtroMarca, inventario.length]);

    return (
        <div className="tabla-container">
            <h2 className="admin-titulo">Inventario de Productos</h2>

            <form className="tabla-header" onSubmit={handleBuscar} style={{ justifyContent: 'flex-start', gap: '15px' }}>
                <div className="filtro-busqueda">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        className="input-busqueda"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                <div className="filtro-busqueda">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        className="input-busqueda"
                        placeholder="Buscar por marca..."
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                    />
                </div>

                <button type="submit" className="admin-boton-pequeño editar" style={{ padding: '10px 16px' }}>
                    Buscar
                </button>
            </form>

            {cargando && <p>Cargando inventario...</p>}
            {error && <p className="error-message">{error}</p>}

            {!cargando && !error && (
                <>
                    <div className="tabla-scroll-container">
                        <table className="tabla-usuarios" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
                            <thead>
                            <tr style={{ height: '32px' }}>
                                <th>ID PRODUCTO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>DESCRIPCIÓN</th>
                                <th style={{ textAlign: 'right' }}>UNID. POR CAJA</th>
                                <th style={{ textAlign: 'right' }}>CAJAS (STOCK)</th>
                                <th style={{ textAlign: 'right' }}>UNIDADES (STOCK)</th>
                                <th style={{ textAlign: 'right' }}>TOTAL UNIDADES</th>
                                {/* La columna de acciones solo se muestra si el usuario no es vendedor */}
                                {rol !== "vendedor" && <th style={{ textAlign: 'center' }}>ACCIONES</th>}
                            </tr>
                            </thead>

                            <tbody>
                            {inventario.length > 0 ? (
                                inventarioPaginado.map((item, idx) => {
                                    const cantCajasStock = item.cantidadCaja || 0;
                                    const cantUnidadesStock = item.cantidadUnidad || 0;
                                    const unidPorCaja = item.producto?.cantidadCaja || 0;
                                    const totalUnidades = (cantCajasStock * unidPorCaja) + cantUnidadesStock;
                                    const rowStyle = {
                                        height: '32px',
                                        background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                                    };
                                    return (
                                        <tr key={item.inventario_id} style={rowStyle}>
                                            <td style={{ textAlign: 'right' }}>{item.producto.producto_id}</td>
                                            <td>{item.producto.nombre}</td>
                                            <td>{item.producto.marca}</td>
                                            <td>{item.producto.descripcion}</td>
                                            <td style={{ textAlign: 'right' }}>{unidPorCaja}</td>
                                            <td style={{ textAlign: 'right' }}>{cantCajasStock}</td>
                                            <td style={{ textAlign: 'right' }}>{cantUnidadesStock}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{totalUnidades}</td>
                                            {rol !== "vendedor" && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                                        <button
                                                            className="admin-boton-pequeño editar"
                                                            onClick={() => onEditar(item.producto.producto_id)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="admin-boton-pequeño eliminar"
                                                            onClick={() => onEliminar(item.producto.producto_id)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={rol !== "vendedor" ? 9 : 8} style={{ textAlign: 'center', fontStyle: 'italic', height: '32px' }}>
                                        No se encontraron productos en el inventario que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {inventario.length > filasPorPagina && (
                        <div className="paginacion">
                            <button
                                className="paginacion-boton"
                                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaActual === 1}
                            >
                                ← Anterior
                            </button>
                            <div className="paginacion-info">
                                Página {paginaActual} de {totalPaginas} ({inventario.length} productos)
                            </div>
                            <button
                                className="paginacion-boton"
                                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TablaInventario;
