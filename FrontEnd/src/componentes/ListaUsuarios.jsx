import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const ListaUsuarios = ({ onEditar, onVolver, usuarioActual }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [rolFiltro, setRolFiltro] = useState("Todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 10;

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        setCargando(true);
        setError("");

        fetch("http://localhost:8080/usuarios")
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar usuarios");
                return res.json();
            })
            .then(data => {
                setUsuarios(data);
                setCargando(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar la lista de usuarios");
                setCargando(false);
            });
    };

    const handleEditar = (usuario) => {
        onEditar(usuario.id);
    };

    const normalizar = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const filtro = normalizar(busqueda.trim());

    const usuariosFiltrados = usuarios.filter(u => {
        const cumpleBusqueda = !filtro || normalizar(u?.nombre || "").includes(filtro) ||
                               normalizar(u?.apellido || "").includes(filtro) ||
                               normalizar(u?.usuario || "").includes(filtro);
        const cumpleRol = rolFiltro === "Todos" || u.rol === rolFiltro;
        return cumpleBusqueda && cumpleRol;
    });

    // Calcular paginación
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
    const indiceFin = indiceInicio + usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFin);


    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, rolFiltro]);

    if (cargando) {
        return (
            <div className="tabla-container">
                <div className="tabla-header">
                    <h2 className="admin-titulo">Lista de Usuarios</h2>
                </div>
                <p>Cargando usuarios...</p>
                <button className="admin-boton secondary-button" onClick={onVolver}>← Volver</button>
            </div>
        );
    }

    return (
        <div className="tabla-container">
            <div className="tabla-header">
                <h2 className="admin-titulo">Selecciona un Usuario para Editar</h2>
                <div className="tabla-filtros">
                    <div className="filtro-rol">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <select
                            className="select-rol"
                            value={rolFiltro}
                            onChange={(e) => setRolFiltro(e.target.value)}
                        >
                            <option value="Todos">Todos los roles</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Almacenero">Almacenero</option>
                            <option value="Vendedor">Vendedor</option>
                        </select>
                    </div>
                    <div className="filtro-busqueda">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            className="input-busqueda"
                            placeholder="Buscar usuario..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {usuariosFiltrados.length > 0 && (
                <>
                <table className="tabla-usuarios" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
                    <thead>
                        <tr style={{ height: '32px' }}>
                            <th>ID</th>
                            <th>DNI</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosPaginados.map((usuario, idx) => {
                            const rowStyle = {
                                height: '32px',
                                background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                            };
                            return (
                                <tr key={usuario.id} style={rowStyle}>
                                    <td style={{ textAlign: 'right' }}>{usuario.id}</td>
                                    <td>{usuario.dni || 'N/A'}</td>
                                    <td>{usuario.usuario || 'N/A'}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido || 'N/A'}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <button
                                            className="admin-boton-pequeño editar"
                                            onClick={() => handleEditar(usuario)}
                                            title="Editar usuario"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {totalPaginas > 1 && (
                    <div className="paginacion">
                        <button
                            className="paginacion-boton"
                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                        >
                            ← Anterior
                        </button>

                        <div className="paginacion-info">
                            Página {paginaActual} de {totalPaginas} ({usuariosFiltrados.length} usuarios)
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

            {usuariosFiltrados.length === 0 && !error && (
                <p className="mensaje-vacio">No hay usuarios que coincidan con la búsqueda</p>
            )}
        </div>
    );
};

export default ListaUsuarios;
