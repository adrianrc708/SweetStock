import React, { useState } from "react";
import "./RegistroUsuario.css";
import Modal from "./Modal";

const ROLES = ["Administrador", "Almacenero", "Vendedor"];

// eslint-disable-next-line react/prop-types
const RegistroUsuario = ({ onRegistroExitoso, onVolver }) => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState(ROLES[0]);
    const [error, setError] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!nombre || !password || !rol || password.length < 6) {
            setError("Todos los campos son obligatorios y la contraseña debe tener al menos 6 caracteres.");
            return;
        }
        
        const data = { nombre, password, rol };

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
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit} className="registro-form">
                <div className="form-group">
                    <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                    <input id="nombreUsuario" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="form-input" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />
                </div>
                
                <div className="form-group">
                    <label htmlFor="rolUsuario">Rol:</label>
                    <select id="rolUsuario" value={rol} onChange={(e) => setRol(e.target.value)} className="form-select">
                        {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="admin-boton">Registrar</button>
                    <button type="button" onClick={onVolver} className="admin-boton secondary-button">Volver</button>
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