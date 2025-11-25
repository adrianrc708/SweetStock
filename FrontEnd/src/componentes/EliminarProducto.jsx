import React, { useEffect, useState } from "react";
import "./EliminarProducto.css"
const EliminarProducto = ({ productoId, onVolver }) => {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/productos/${productoId}`);
                const data = await res.json();
                setProducto(data);
            } catch (error) {
                console.error("Error:", error);
            }
            setLoading(false);
        };

        fetchProducto();
    }, [productoId]);

    const handleEliminar = async () => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/productos/${productoId}`, {
                method: "DELETE",
            });

            const texto = await res.text();
            setMensaje(texto);

            if (res.ok) {
                alert("Producto eliminado correctamente");
                onVolver(); // Regresa a la tabla
            } else {
                alert("Error: " + texto);
            }
        } catch (error) {
            alert("Error al eliminar");
            console.error(error);
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="eliminar-container">
            <h2>Eliminar Producto</h2>
            
            <p><strong>Nombre:</strong> {producto.nombre}</p>
            <p><strong>Marca:</strong> {producto.marca}</p>
            <p><strong>Descripción:</strong> {producto.descripcion}</p>

            <p className="advertencia">
                ⚠ Esta acción eliminará el producto y su inventario si el stock es 0.
            </p>

            <div className="acciones">
                <button className="btn-cancelar" onClick={onVolver}>
                    Cancelar
                </button>
                <button className="btn-eliminar" onClick={handleEliminar}>
                    Eliminar definitivamente
                </button>
            </div>

            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default EliminarProducto;
