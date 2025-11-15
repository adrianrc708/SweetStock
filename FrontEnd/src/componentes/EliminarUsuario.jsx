import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import Modal from "./Modal";

const EliminarUsuario = ({ onVolver }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info", showCancel: false });
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [rolFiltro, setRolFiltro] = useState("Todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 10;

    // Cargar usuarios al iniciar
    useEffect(() => {
        fetch("http://localhost:8080/usuarios")
        .then((res) => {
            if (!res.ok) throw new Error("Error al obtener usuarios");
            return res.json();
        })
        .then((data) => setUsuarios(data))
        .catch((err) => setError(err.message));
    }, []);

    // Mostrar modal de confirmación
    const handleEliminar = (id, nombre) => {
        setUsuarioAEliminar({ id, nombre });
        setModalConfig({
            isOpen: true,
            title: "Confirmar Eliminación",
            message: `¿Estás seguro que deseas eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`,
            type: "warning",
            showCancel: true,
            onConfirm: () => confirmarEliminacion(id, nombre)
        });
    };

    // Eliminar usuario
    const confirmarEliminacion = async (id, nombre) => {
        try {
            const res = await fetch(`http://localhost:8080/usuarios/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("No se pudo eliminar el usuario");

            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            setError("");

            // Mostrar modal de éxito
            setModalConfig({
                isOpen: true,
                title: "¡Eliminado!",
                message: `Usuario "${nombre}" eliminado con éxito.`,
                type: "success",
                showCancel: false
            });
        } catch (err) {
            setError(err.message);
            setMensaje("");

            // Mostrar modal de error
            setModalConfig({
                isOpen: true,
                title: "Error",
                message: err.message || "No se pudo eliminar el usuario.",
                type: "error",
                showCancel: false
            });
        }
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

    return (
        <div className="tabla-container">
            <div className="tabla-header">
                <h2 className="admin-titulo">Selecciona un Usuario para Eliminar</h2>
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
            {mensaje && <p className="success-message">{mensaje}</p>}

            {usuariosFiltrados.length > 0 && (
                <>
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
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
                        {usuariosPaginados.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.dni || 'N/A'}</td>
                                <td>{u.usuario || 'N/A'}</td>
                                <td>{u.nombre}</td>
                                <td>{u.apellido || 'N/A'}</td>
                                <td>{u.rol}</td>
                                <td>
                                    <button
                                        className="admin-boton-pequeño eliminar"
                                        onClick={() => handleEliminar(u.id, u.nombre)}
                                        title="Eliminar usuario"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
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

            <div style={{ marginTop: '20px' }}>
                <button className="admin-boton secondary-button" onClick={onVolver}>← Volver</button>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, title: "", message: "", type: "info", showCancel: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                showCancel={modalConfig.showCancel}
                onConfirm={modalConfig.onConfirm}
            />
        </div>
    );
};

export default EliminarUsuario;
