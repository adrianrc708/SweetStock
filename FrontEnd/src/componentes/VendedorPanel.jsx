import React from "react";

const VendedorPanel = ({ usuario }) => {
    return (
        <div style={{ padding: "20px" }}>
        <h1>Panel de Vendedor</h1>
        <p>Bienvenido, {usuario.nombre}</p>
        <p>Aquí podrás gestionar el inventario.</p>
        </div>
    );
};

export default VendedorPanel;