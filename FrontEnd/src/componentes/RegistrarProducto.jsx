import React, { useState } from "react";
import "./RegistrarProducto.css";
import Modal from "./Modal";

const RegistrarProducto = ({ onVolver }) => {
    const [producto, setProducto] = useState({
        nombre: "",
        marca: "",
        descripcion: "",
        cantidadCaja: "",
        peso: "",
        precioUnitario: ""
    });

    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(producto),
            });
            const text = await res.text();
            if (!res.ok) {
                setModalConfig({
                    isOpen: true,
                    title: "Error",
                    message: text || "Error al registrar el producto",
                    type: "error",
                    onClose: () => setModalConfig({ isOpen: false, title: "", message: "", type: "info" })
                });
                return;
            }
            setModalConfig({
                isOpen: true,
                title: "¡Éxito!",
                message: "Producto registrado correctamente.",
                type: "success",
                onClose: () => {
                    setModalConfig({ isOpen: false, title: "", message: "", type: "info" });
                    onVolver();
                }
            });
        } catch (error) {
            setModalConfig({
                isOpen: true,
                title: "Error",
                message: "Error al registrar el producto",
                type: "error",
                onClose: () => setModalConfig({ isOpen: false, title: "", message: "", type: "info" })
            });
        }
    };

    return (
        <div className="registrar-producto-container">
            <h2>Registrar Producto</h2>

            <form className="registrar-form" onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input 
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        placeholder="Ej. Galletas Oreo"
                        required
                    />
                </div>

                <div>
                    <label>Marca</label>
                    <input 
                        type="text"
                        name="marca"
                        value={producto.marca}
                        onChange={handleChange}
                        placeholder="Ej. Nabisco"
                        required
                    />
                </div>

                <div className="form-full">
                    <label>Descripción</label>
                    <input 
                        type="text"
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleChange}
                        placeholder="Ej. Sabor chocolate"
                    />
                </div>

                <div>
                    <label>Cantidad por caja</label>
                    <input 
                        type="number"
                        name="cantidadCaja"
                        value={producto.cantidadCaja}
                        onChange={handleChange}
                        placeholder="Ej. 12"
                        required
                    />
                </div>

                <div>
                    <label>Peso (gramos)</label>
                    <input 
                        type="number"
                        step="0.01"
                        name="peso"
                        value={producto.peso}
                        onChange={handleChange}
                        placeholder="Ej. 0.25"
                    />
                </div>

                <div className="form-full">
                    <label>Precio Unitario</label>
                    <input 
                        type="number"
                        step="0.01"
                        name="precioUnitario"
                        value={producto.precioUnitario}
                        onChange={handleChange}
                        placeholder="Ej. 1.50"
                        required
                    />
                </div>

                <button className="btn-registrar" type="submit">
                    Registrar
                </button>
            </form>

            <button className="btn-volver" onClick={onVolver}>
                Volver
            </button>

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

export default RegistrarProducto;
