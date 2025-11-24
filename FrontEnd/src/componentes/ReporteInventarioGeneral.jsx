import React, { useState, useEffect, useCallback } from 'react';
import './AdminPanel.css';
import './ActualizarStock.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = "http://localhost:8080/api/inventario/reporte";

const ReporteInventarioGeneral = () => {
    const [reporte, setReporte] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [productoIdFiltro, setProductoIdFiltro] = useState('');
    const [marcaFiltro, setMarcaFiltro] = useState('');
    const [filtrosActivos, setFiltrosActivos] = useState({});

    const fetchReporte = useCallback((id, marca) => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (id) params.append('productoId', id);
        if (marca) params.append('marca', marca);

        setFiltrosActivos({
            productoId: id,
            marca: marca
        });

        fetch(`${API_URL}?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar el reporte de inventario");
                return res.json();
            })
            .then(data => {
                setReporte(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchReporte(productoIdFiltro, marcaFiltro);
    }, [fetchReporte]);


    const handleBuscar = (e) => {
        e.preventDefault();
        fetchReporte(productoIdFiltro, marcaFiltro);
    };

    const handleLimpiar = () => {
        setProductoIdFiltro('');
        setMarcaFiltro('');
        fetchReporte('', '');
    };


    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
        }).format(valor);
    };

    const totalInventario = reporte.reduce((sum, item) => sum + item.valorTotal, 0);

    const exportPDF = () => {
        const input = document.getElementById('reporte-inventario-pdf');
        if (!input) return;

        const pdfButton = document.getElementById('export-pdf-button-inv');
        if (pdfButton) pdfButton.style.display = 'none';

        const scrollContainer = input.querySelector('.tabla-scroll-container');
        let originalMaxHeight = '';
        let originalOverflow = '';

        if (scrollContainer) {
            originalMaxHeight = scrollContainer.style.maxHeight;
            originalOverflow = scrollContainer.style.overflowY;
            scrollContainer.style.maxHeight = 'none';
            scrollContainer.style.overflowY = 'visible';
        }

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' = horizontal (landscape)

            const pdfWidth = 287; // Ancho máximo del documento (A4)
            const pdfHeight = 200; // Altura máxima imprimible (A4, ~210mm)

            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0; // Posición de corte vertical en la imagen

            pdf.setFontSize(14);
            pdf.text("Reporte de Inventario General - SweetStock", 10, 10);

            pdf.addImage(imgData, 'JPEG', 5, 15, pdfWidth - 10, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= -pdfHeight) {
                position = heightLeft - imgHeight + 10; // Ajuste de la posición Y para el siguiente corte
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 5, position, pdfWidth - 10, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`Reporte_Inventario_General_${new Date().toISOString().slice(0, 10)}.pdf`);
        }).finally(() => {
            // 3. Restaurar estilos y visibilidad
            if (pdfButton) pdfButton.style.display = 'block';
            if (scrollContainer) {
                scrollContainer.style.maxHeight = originalMaxHeight;
                scrollContainer.style.overflowY = originalOverflow || 'auto'; // Restaurar
            }
        });
    };


    return (
        <div className="tabla-container">
            <h2 className="admin-titulo">Reporte de Inventario General</h2>

            <form className="tabla-header" onSubmit={handleBuscar} style={{ justifyContent: 'flex-start', gap: '15px' }}>
                <div className="filtro-busqueda" style={{minWidth: 160}}>
                    <input
                        type="number"
                        className="input-busqueda"
                        placeholder="Filtrar por ID Producto..."
                        value={productoIdFiltro}
                        onChange={(e) => setProductoIdFiltro(e.target.value)}
                        style={{minWidth: 140, width: 140, maxWidth: 180}}
                    />
                </div>
                <div className="filtro-busqueda" style={{minWidth: 160}}>
                    <input
                        type="text"
                        className="input-busqueda"
                        placeholder="Filtrar por Marca..."
                        value={marcaFiltro}
                        onChange={(e) => setMarcaFiltro(e.target.value)}
                        style={{minWidth: 140, width: 140, maxWidth: 180}}
                    />
                </div>
                <button type="submit" className="admin-boton-pequeño editar" style={{ padding: '10px 16px', minWidth: 120 }}>
                    Buscar
                </button>
                <button type="button" className="admin-boton-pequeño" onClick={handleLimpiar} style={{ padding: '10px 16px', minWidth: 120, background: '#e0e0e0', color: '#333' }}>
                    Limpiar
                </button>
            </form>
            <div className="tabla-header" style={{ justifyContent: 'flex-end', marginBottom: '20px', padding: '0', border: 'none' }}>
                <button
                    type="button"
                    className="admin-boton-pequeño editar"
                    onClick={exportPDF}
                    disabled={loading || reporte.length === 0}
                    style={{ background: '#dc3545', padding: '10px 16px', minWidth: 120 }}
                    id="export-pdf-button-inv"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="10" y2="9"></line></svg>
                    Exportar PDF
                </button>
            </div>

            <div style={{margin: '10px 0 18px 0', fontSize: '14px', color: '#444'}}>
                <strong>Filtros aplicados:</strong>
                <span style={{marginLeft: 10}}>
                {productoIdFiltro ? `ID: ${productoIdFiltro}` : 'Todos los IDs'}
                    {" | "}
                    {marcaFiltro ? `Marca: ${marcaFiltro}` : 'Todas las marcas'}
                </span>
            </div>

            <div id="reporte-inventario-pdf">
                <p style={{marginBottom: '20px', textAlign: 'center', fontSize: '16px', fontWeight: 500, color: '#ff4d8a'}}>
                    Valoración Total del Inventario: <span style={{fontSize: '20px', fontWeight: 700}}>{formatoMoneda(totalInventario)}</span>
                </p>

                {loading && <p>Cargando reporte...</p>}
                {error && <p className="error-message">Error: {error}</p>}

                {!loading && !error && (
                    <div className="tabla-scroll-container">
                        <table className="tabla-usuarios">
                            <thead>
                            <tr>
                                <th>ID</th><th>Nombre</th><th>Marca</th><th>Unid. Caja</th><th>Stock Cajas</th><th>Stock Unid. Sueltas</th><th>Stock Total Unidades</th><th>Precio Unitario</th><th style={{textAlign: 'right'}}>Valor Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reporte.length === 0 ? (
                                <tr><td colSpan="9" className="mensaje-vacio">No hay datos que coincidan con los filtros.</td></tr>
                            ) : (
                                reporte.map((item) => (
                                    <tr key={item.productoId}>
                                        <td>{item.productoId}</td>
                                        <td>{item.nombre}</td>
                                        <td>{item.marca}</td>
                                        <td>{item.unidadesPorCaja}</td>
                                        <td>{item.stockCajas}</td>
                                        <td>{item.stockUnidadesSueltas}</td>
                                        <td><span style={{fontWeight: 'bold'}}>{item.stockTotalUnidades}</span></td>
                                        <td>{formatoMoneda(item.precioUnitario)}</td>
                                        <td style={{textAlign: 'right', fontWeight: 'bold'}}>{formatoMoneda(item.valorTotal)}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReporteInventarioGeneral;