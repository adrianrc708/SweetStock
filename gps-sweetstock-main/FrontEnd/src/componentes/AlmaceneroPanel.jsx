import React from "react";

const AlmaceneroPanel = ({ usuario }) => {
    return (
        <div style={{ padding: "20px" }}>
        <h1>Panel de Almacenero</h1>
        <p>Bienvenido, {usuario.nombre}</p>
        <p>Aquí podrás gestionar el inventario y registrar movimientos de stock.</p>
        </div>
    );
};

export default AlmaceneroPanel;
