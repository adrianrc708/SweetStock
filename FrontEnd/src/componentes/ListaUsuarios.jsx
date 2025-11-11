import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const ListaUsuarios = ({ onEditar, onVolver, usuarioActual }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

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

    if (cargando) {
        return (
            <div className="tabla-container">
                <h2 className="admin-titulo">Lista de Usuarios</h2>
                <p>Cargando usuarios...</p>
                <button className="admin-boton secondary-button" onClick={onVolver}>← Volver</button>
            </div>
        );
    }

    return (
        <div className="tabla-container">
            <h2 className="admin-titulo">Selecciona un Usuario para Editar</h2>

            {error && <p className="error-message">{error}</p>}

            {usuarios.length > 0 && (
                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <button
                                        className="admin-boton-pequeño editar"
                                        onClick={() => handleEditar(usuario)}
                                        title="Editar usuario"
                                    >
                                        ✏️ Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {usuarios.length === 0 && !error && (
                <p className="mensaje-vacio">No hay usuarios registrados</p>
            )}

            <div style={{ marginTop: '20px' }}>
                <button className="admin-boton secondary-button" onClick={onVolver}>← Volver a Gestión de Usuarios</button>
            </div>
        </div>
    );
};

export default ListaUsuarios;

