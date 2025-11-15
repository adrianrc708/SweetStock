import React, { useState, useEffect } from "react";
import "./RegistroUsuario.css";
import Modal from "./Modal";

const ROLES = ["Administrador", "Almacenero", "Vendedor"];

const EditarUsuario = ({ usuarioId, onEditarExitoso, onVolver, usuarioActual }) => {
    const [dni, setDni] = useState("");
    const [usuario, setUsuario] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState(ROLES[0]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
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
                    setDni(data.dni || "");
                    setUsuario(data.usuario || "");
                    setNombre(data.nombre || "");
                    setApellido(data.apellido || "");
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

    const handleDniChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        if (value.length <= 8) {
            setDni(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validar que los campos obligatorios no estén vacíos
        if (!dni || dni.trim() === "" || !usuario || usuario.trim() === "" ||
            !nombre || nombre.trim() === "" || !apellido || apellido.trim() === "") {
            setError("DNI, usuario, nombre y apellido son obligatorios");
            return;
        }

        // Validar DNI de 8 dígitos
        if (dni.length !== 8) {
            setError("El DNI debe tener exactamente 8 dígitos");
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
            dni,
            usuario,
            nombre,
            apellido,
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
            <p className="registro-subtitulo">Actualiza la información del usuario.</p>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="registro-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="usuario">Usuario:</label>
                        <input
                            id="usuario"
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                            className="form-input"
                            placeholder="ej., j.perez"
                        />
                        <small className="form-hint">Debe ser único - se usa para el login</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dni">DNI:</label>
                        <input
                            id="dni"
                            type="text"
                            value={dni}
                            onChange={handleDniChange}
                            required
                            className="form-input"
                            placeholder="8 dígitos"
                            maxLength={8}
                            pattern="\d{8}"
                            title="Ingrese 8 dígitos numéricos"
                        />
                        <small className="form-hint">Debe ser único - 8 dígitos exactos</small>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="form-input"
                            placeholder="ej., Juan"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input
                            id="apellido"
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                            className="form-input"
                            placeholder="ej., Pérez"
                        />
                    </div>
                </div>

                <div className="form-group form-group-full">
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

                <div className="form-group form-group-full">
                    <label>Rol:</label>
                    <div className="radio-group">
                        {ROLES.map(r => (
                            <label key={r} className="radio-label">
                                <input
                                    type="radio"
                                    name="rol"
                                    value={r}
                                    checked={rol === r}
                                    onChange={(e) => setRol(e.target.value)}
                                    required
                                />
                                <span>{r}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="admin-boton" style={{ gridColumn: '1 / -1' }}>Guardar Cambios</button>
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

