import React, { useState, useEffect } from "react";
import "./EditarProducto.css";

const EditarProducto = ({ productoId, onVolver }) => {
    const [producto, setProducto] = useState(null);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
    console.log("ID recibido:", productoId);

    fetch(`http://localhost:8080/api/productos/${productoId}`)
        .then(res => res.json())
        .then(data => setProducto(data))
        .catch(() => setMensaje("Error cargando el producto"));
}, [productoId]);



    const handleSubmit = (e) => {  //handleSubmit modificado
    e.preventDefault();

    const productoParaEnviar = {
    producto_id: productoId,   // ← Agregado
    nombre: producto.nombre,
    marca: producto.marca,
    descripcion: producto.descripcion,
    cantidadCaja: Number(producto.cantidadCaja),
    peso: Number(producto.peso)
};


    fetch(`http://localhost:8080/api/productos/${productoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoParaEnviar)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error actualizando producto");
        return res.json();
    })
    .then(() => setMensaje("Producto actualizado correctamente"))
    .catch(() => setMensaje("Error al actualizar"));
};


    if (!producto) return <p>Cargando...</p>;

    return (
        <div>
            <h2>Editar Producto</h2>

            {mensaje && (
                <p style={{ color: mensaje.includes("Error") ? "red" : "green" }}>
                    {mensaje}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input
                    type="text"
                    value={producto.nombre}
                    onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                />

                <label>Marca:</label>
                <input
                    type="text"
                    value={producto.marca}
                    onChange={(e) => setProducto({ ...producto, marca: e.target.value })}
                />

                <label>Descripción:</label>
                <input
                    type="text"
                    value={producto.descripcion}
                    onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                />

                <label>Unidades por Caja:</label>
                <input
                    type="number"
                    value={producto.cantidadCaja}
                    onChange={(e) => setProducto({ ...producto, cantidadCaja: e.target.value })}
                />

                <label>Peso:</label>
                <input
                    type="number"
                    value={producto.peso}
                    onChange={(e) => setProducto({ ...producto, peso: e.target.value })}
                />

                <div className="botones">
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={onVolver}>Cancelar</button>
                </div>

            </form>
        </div>
    );
};

export default EditarProducto;
