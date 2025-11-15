import React, { useState } from "react";
import "./RegistroUsuario.css";
import Modal from "./Modal";

const ROLES = ["Administrador", "Almacenero", "Vendedor"];

// eslint-disable-next-line react/prop-types
const RegistroUsuario = ({ onRegistroExitoso, onVolver }) => {
    const [dni, setDni] = useState("");
    const [usuario, setUsuario] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState(ROLES[0]);
    const [error, setError] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    const handleDniChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo números
        if (value.length <= 8) {
            setDni(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!dni || !usuario || !nombre || !apellido || !password || !rol) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (dni.length !== 8) {
            setError("El DNI debe tener exactamente 8 dígitos.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        
        const data = { dni, usuario, nombre, apellido, password, rol };

        fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        .then(async (res) => {
            const text = await res.text();
            
            if (!res.ok) {
                // Se asume que el texto es el mensaje de error si no es exitoso
                throw new Error(text || "Error al registrar el usuario."); 
            }
            
            const usuario = JSON.parse(text);
            setModalConfig({
                isOpen: true,
                title: "¡Éxito!",
                message: `Usuario ${usuario.nombre} registrado exitosamente.`,
                type: "success",
                onClose: () => {
                    setModalConfig({ isOpen: false, title: "", message: "", type: "info" });
                    onRegistroExitoso();
                }
            });
        })
        .catch((err) => {
            console.error(err);
            setError(err.message || "Error de conexión o servidor.");
        });
    };

    return (
        <div className="registro-container">
            <h2 className="registro-titulo">Registrar Nuevo Usuario</h2>
            <p className="registro-subtitulo">Complete los datos para crear una nueva cuenta de usuario.</p>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit} className="registro-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="usuario">Usuario:</label>
                        <input id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required className="form-input" placeholder="ej., j.perez" />
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
                        <small className="form-hint">Debe tener exactamente 8 dígitos.</small>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="form-input" placeholder="ej., Juan" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="form-input" placeholder="ej., Pérez" />
                    </div>
                </div>

                <div className="form-group form-group-full">
                    <label htmlFor="password">Contraseña:</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" placeholder="Mínimo 6 caracteres" />
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
                    <button type="submit" className="admin-boton" style={{ gridColumn: '1 / -1' }}>Registrar</button>
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

export default RegistroUsuario;