import React, { useEffect, useState } from "react";
import "./AdminPanel.css";

const EliminarUsuario = ({ onVolver }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

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

    // Eliminar usuario
    const handleEliminar = async (id, nombre) => {
        const confirmar = window.confirm(`¿Seguro que deseas eliminar a "${nombre}"?`);
        if (!confirmar) return;

        try {
        const res = await fetch(`http://localhost:8080/usuarios/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("No se pudo eliminar el usuario");

        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        setMensaje(`Usuario "${nombre}" eliminado con éxito`);
        setError("");
        } catch (err) {
        setError(err.message);
        setMensaje("");
        }
    };

    return (
        <div className="admin-container">
        <h2 className="admin-titulo">Eliminar Usuario</h2>

        {error && <p className="error-message">{error}</p>}
        {mensaje && <p className="success-message">{mensaje}</p>}

        <table className="admin-tabla">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {usuarios.length === 0 ? (
                <tr>
                <td colSpan="4">No hay usuarios registrados</td>
                </tr>
            ) : (
                usuarios.map((u) => (
                <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.rol}</td>
                    <td>
                    <button
                        className="admin-boton eliminar"
                        onClick={() => handleEliminar(u.id, u.nombre)}
                    >
                        Eliminar
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>

        <button className="admin-boton secondary-button" onClick={onVolver}>
            ← Volver
        </button>
        </div>
    );
};

export default EliminarUsuario;
