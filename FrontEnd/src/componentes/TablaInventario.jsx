import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const TablaInventario = ({ onEditar, onEliminar }) => {
    const [inventario, setInventario] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // ← CORREGIDO: "usuario" en vez de "user"
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const rol = usuario?.rol || ""; // Admin, almacenero, vendedor

    console.log("ROL DEL USUARIO:", rol);

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
                        <table className="tabla-usuarios">
                            <thead>
                            <tr>
                                <th>ID PRODUCTO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>DESCRIPCIÓN</th>
                                <th>UNID. POR CAJA</th>
                                <th>CAJAS (STOCK)</th>
                                <th>UNIDADES (STOCK)</th>
                                <th>TOTAL UNIDADES</th>

                                {/* Solo admin y almacenero ven ACCIONES */}
                                {rol !== "vendedor" && <th>ACCIONES</th>}
                            </tr>
                            </thead>

                            <tbody>
                            {inventario.length > 0 ? (
                                inventario.map((item) => {
                                    const cantCajasStock = item.cantidadCaja || 0;
                                    const cantUnidadesStock = item.cantidadUnidad || 0;
                                    const unidPorCaja = item.producto?.cantidadCaja || 0;

                                    const totalUnidades = (cantCajasStock * unidPorCaja) + cantUnidadesStock;

                                    return (
                                        <tr key={item.inventario_id}>
                                            <td>{item.producto.producto_id}</td>
                                            <td>{item.producto.nombre}</td>
                                            <td>{item.producto.marca}</td>
                                            <td>{item.producto.descripcion}</td>
                                            <td>{unidPorCaja}</td>
                                            <td>{cantCajasStock}</td>
                                            <td>{cantUnidadesStock}</td>
                                            <td style={{ fontWeight: 'bold' }}>{totalUnidades}</td>

                                            {/* Solo admin y almacenero ven botón de editar */}
                                            {rol !== "vendedor" && (
                                                <td>
                                                    <button
                                                        className="admin-boton-pequeño editar"
                                                        onClick={() => onEditar(item.producto.producto_id)}
                                                    >
                                                        Editar
                                                    </button>
                                                    {/* Botón ELIMINAR */}
                                                    <button
                                                        className="admin-boton-pequeño eliminar"
                                                        onClick={() => onEliminar(item.producto.producto_id)}
                                                    >
                                                        🗑 Eliminar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                                        No se encontraron productos en el inventario que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default TablaInventario;
