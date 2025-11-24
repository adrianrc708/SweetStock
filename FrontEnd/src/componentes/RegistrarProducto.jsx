import React, { useState } from "react";
import "./RegistrarProducto.css";

const RegistrarProducto = ({ onVolver }) => {
    const [producto, setProducto] = useState({
        nombre: "",
        marca: "",
        descripcion: "",
        cantidadCaja: "",
        peso: "",
        precioUnitario: ""
    });

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

            if (!res.ok) {
                const errorText = await res.text();
                alert("Error: " + errorText);
                return;
            }

            alert("Producto registrado correctamente");
            onVolver();

        } catch (error) {
            console.error("Error:", error);
            alert("Error al registrar el producto");
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

                <div>
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

                <div>
                    <label>Precio Unitario</label>
                    <input 
                        type="number"
                        step="0.01"
                        name="precioUnitario"
                        value={producto.precioUnitario}
                        onChange={handleChange}
                        placeholder="Ej. 1.50"
                    />
                </div>

                <button className="btn-registrar" type="submit">
                    Registrar
                </button>
            </form>

            <button className="btn-volver" onClick={onVolver}>
                Volver
            </button>
        </div>
    );
};

export default RegistrarProducto;


