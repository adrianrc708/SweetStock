import React, { useState, useEffect } from "react";
import "./RegistroUsuario.css";
import Modal from "./Modal";

const ROLES = ["Administrador", "Almacenero", "Vendedor"];

const EditarUsuario = ({ usuarioId, onEditarExitoso, onVolver, usuarioActual }) => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState(ROLES[0]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
    const [nombreOriginal, setNombreOriginal] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    useEffect(() => {
        let isMounted = true;

        // Cargar datos del usuario
        fetch(`http://localhost:8080/usuarios/${usuarioId}`)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.error || "Usuario no encontrado");
                    });
                }
                return res.json();
            })
            .then(data => {
                if (isMounted) {
                    setNombre(data.nombre);
                    setNombreOriginal(data.nombre);
                    setRol(data.rol);
                    setCargando(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error("Error al cargar usuario:", err);
                    setError(err.message || "Error al cargar los datos del usuario");
                    setCargando(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [usuarioId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validar que el nombre no esté vacío
        if (!nombre || nombre.trim() === "") {
            setError("El nombre de usuario es obligatorio");
            return;
        }

        // Validar contraseña si se proporcionó
        if (password && password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres (o déjala vacía para no cambiarla)");
            return;
        }

        // Validar que un admin no se quite su propio rol
        if (usuarioActual && usuarioActual.id === usuarioId &&
            usuarioActual.rol === "Administrador" && rol !== "Administrador") {
            setError("No puedes cambiar tu propio rol de Administrador");
            return;
        }

        const data = {
            nombre,
            rol,
            password: password || undefined // Solo enviar si hay valor
        };

        fetch(`http://localhost:8080/usuarios/${usuarioId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        .then(async (res) => {
            const response = await res.json();

            if (!res.ok) {
                throw new Error(response.error || "Error al actualizar el usuario");
            }

            setModalConfig({
                isOpen: true,
                title: "¡Éxito!",
                message: `Usuario ${response.nombre} actualizado exitosamente.`,
                type: "success",
                onClose: () => {
                    setModalConfig({ isOpen: false, title: "", message: "", type: "info" });
                    onEditarExitoso();
                }
            });
        })
        .catch((err) => {
            console.error(err);
            setError(err.message || "Error de conexión o servidor");
        });
    };

    if (cargando) {
        return (
            <div className="registro-container">
                <h2 className="registro-titulo">Editar Usuario</h2>
                <p>Cargando datos del usuario...</p>
                <button type="button" onClick={onVolver} className="admin-boton secondary-button">Volver</button>
            </div>
        );
    }

    return (
        <div className="registro-container">
            <h2 className="registro-titulo">Editar Usuario</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="registro-form">
                <div className="form-group">
                    <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                    <input
                        id="nombreUsuario"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="form-input"
                    />
                    <small className="form-hint">Se puede cambiar, pero debe ser único</small>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Nueva Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        placeholder="Dejar vacío para no cambiar"
                    />
                    <small className="form-hint">Mínimo 6 caracteres (opcional)</small>
                </div>

                <div className="form-group">
                    <label htmlFor="rolUsuario">Rol:</label>
                    <select
                        id="rolUsuario"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="form-select"
                    >
                        {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="admin-boton">Guardar Cambios</button>
                    <button type="button" onClick={onVolver} className="admin-boton secondary-button">Cancelar</button>
                </div>
            </form>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={modalConfig.onClose || (() => setModalConfig({ isOpen: false, title: "", message: "", type: "info" }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    );
};

export default EditarUsuario;

