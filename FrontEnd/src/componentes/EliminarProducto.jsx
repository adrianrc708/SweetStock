import React, { useEffect, useState } from "react";
import "./EliminarProducto.css";
import Modal from "./Modal";

const EliminarProducto = ({ productoId, onVolver }) => {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info", showCancel: false });
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/productos/${productoId}`);
                const data = await res.json();
                setProducto(data);
            } catch (error) {
                setModalConfig({
                    isOpen: true,
                    title: "Error",
                    message: "No se pudo cargar el producto.",
                    type: "error"
                });
            }
            setLoading(false);
        };
        fetchProducto();
    }, [productoId]);

    const handleEliminar = async () => {
        setModalConfig({
            isOpen: true,
            title: "¿Eliminar producto?",
            message: `¿Seguro que deseas eliminar el producto "${producto?.nombre}"? Esta acción no se puede deshacer.`,
            type: "warning",
            showCancel: true,
            onConfirm: confirmarEliminar
        });
    };

    const confirmarEliminar = async () => {
        setModalConfig({ isOpen: false });
        try {
            const res = await fetch(`http://localhost:8080/api/productos/${productoId}`, {
                method: "DELETE",
            });
            const texto = await res.text();
            setMensaje(texto);
            if (res.ok) {
                setModalConfig({
                    isOpen: true,
                    title: "Producto eliminado",
                    message: "El producto fue eliminado correctamente.",
                    type: "success",
                    onClose: onVolver
                });
            } else {
                setModalConfig({
                    isOpen: true,
                    title: "Error",
                    message: texto || "No se pudo eliminar el producto.",
                    type: "error"
                });
            }
        } catch (error) {
            setModalConfig({
                isOpen: true,
                title: "Error",
                message: "Error al eliminar el producto.",
                type: "error"
            });
        }
    };

    if (loading) return <p className="eliminar-cargando">Cargando...</p>;

    return (
        <div className="eliminar-container eliminar-form-style">
            <h2 className="eliminar-titulo">Eliminar Producto</h2>
            <div className="eliminar-datos">
                <div><strong>Nombre:</strong> {producto.nombre}</div>
                <div><strong>Marca:</strong> {producto.marca}</div>
                <div><strong>Descripción:</strong> {producto.descripcion || <span style={{color:'#888'}}>Sin descripción</span>}</div>
            </div>
            <p className="advertencia">
                <span className="icono-alerta">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><circle cx="12" cy="17" r="1.2"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                </span>
                <span>
                    <span className="alerta-titulo">Atención</span><br/>
                    Esta acción eliminará el producto y su inventario si el stock es 0. Esta operación no se puede deshacer.
                </span>
            </p>
            <div className="acciones">
                <button className="btn-cancelar" onClick={onVolver}>
                    Cancelar
                </button>
                <button className="btn-eliminar" onClick={handleEliminar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    Eliminar definitivamente
                </button>
            </div>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={modalConfig.onClose || (() => setModalConfig({ isOpen: false, title: "", message: "", type: "info" }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                showCancel={modalConfig.showCancel}
                onConfirm={modalConfig.onConfirm}
            />
        </div>
    );
};

export default EliminarProducto;
