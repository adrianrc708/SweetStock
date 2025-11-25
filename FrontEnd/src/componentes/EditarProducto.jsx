import React, { useState, useEffect } from "react";
import "./EditarProducto.css";
import Modal from "./Modal";

const EditarProducto = ({ productoId, onVolver }) => {
    const [producto, setProducto] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    useEffect(() => {
        fetch(`http://localhost:8080/api/productos/${productoId}`)
            .then(res => res.json())
            .then(data => setProducto(data))
            .catch(() => setModalConfig({
                isOpen: true,
                title: "Error",
                message: "Error cargando el producto",
                type: "error"
            }));
    }, [productoId]);

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productoParaEnviar = {
            producto_id: productoId,
            nombre: producto.nombre,
            marca: producto.marca,
            descripcion: producto.descripcion,
            cantidadCaja: Number(producto.cantidadCaja),
            peso: Number(producto.peso),
            precioUnitario: Number(producto.precioUnitario)
        };
        try {
            const res = await fetch(`http://localhost:8080/api/productos/${productoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoParaEnviar)
            });
            if (!res.ok) throw new Error("Error actualizando producto");
            setModalConfig({
                isOpen: true,
                title: "¡Éxito!",
                message: "Producto actualizado correctamente.",
                type: "success",
                onClose: () => {
                    setModalConfig({ isOpen: false, title: "", message: "", type: "info" });
                    onVolver();
                }
            });
        } catch {
            setModalConfig({
                isOpen: true,
                title: "Error",
                message: "Error al actualizar el producto.",
                type: "error"
            });
        }
    };

    if (!producto) return <p className="eliminar-cargando">Cargando...</p>;

    return (
        <div className="editar-producto-container">
            <h2 className="editar-titulo">Editar Producto</h2>
            <form className="editar-form" onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
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
                    />
                </div>
                <div>
                    <label>Cantidad por caja</label>
                    <input
                        type="number"
                        name="cantidadCaja"
                        value={producto.cantidadCaja}
                        onChange={handleChange}
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
                        required
                    />
                </div>
                <div className="editar-botones">
                    <button className="btn-guardar" type="submit">Guardar Cambios</button>
                    <button className="btn-cancelar" type="button" onClick={onVolver}>Cancelar</button>
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

export default EditarProducto;