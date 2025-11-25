import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import './Modal.css';
import './ActualizarStock.css';
import Modal from './Modal';

const ActualizarStock = ({ usuario }) => {
    const [inventario, setInventario] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [vistaFormulario, setVistaFormulario] = useState(false); // Cambio: controla si se muestra tabla o formulario
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Filtros de búsqueda
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // Estados del formulario
    const [tipoMovimiento, setTipoMovimiento] = useState('ingreso'); // 'ingreso' o 'salida'
    const [cantidadCajas, setCantidadCajas] = useState(''); // Nuevo estado para cantidad de cajas
    const [cantidadUnidades, setCantidadUnidades] = useState(''); // Nuevo estado para cantidad de unidades
    const [observaciones, setObservaciones] = useState('');
    const [errorValidacion, setErrorValidacion] = useState('');
    const [procesando, setProcesando] = useState(false);

    // Modal state
    const [modal, setModal] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null, onCancel: null, showCancel: false });
    const [showConfirm, setShowConfirm] = useState(false);

    // Helper para id de usuario autenticado
    const userId = usuario?.id ?? usuario?.usuarioId ?? null;

    // Cargar inventario al montar el componente
    useEffect(() => {
        fetchInventario();
    }, []);

    const fetchInventario = () => {
        setCargando(true);
        setError(null);

        const params = new URLSearchParams();
        if (filtroNombre) params.append('nombre', filtroNombre);
        if (filtroMarca) params.append('marca', filtroMarca);

        fetch(`http://localhost:8080/api/inventario?${params.toString()}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('No se pudo cargar el inventario');
                }
                return res.json();
            })
            .then(data => {
                setInventario(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar inventario:", err);
                setError(err.message);
                setCargando(false);
            });
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        fetchInventario();
    };

    const abrirFormulario = (item) => {
        setProductoSeleccionado(item);
        setVistaFormulario(true);
        // Resetear formulario
        setTipoMovimiento('ingreso');
        setCantidadCajas('');
        setCantidadUnidades('');
        setObservaciones('');
        setErrorValidacion('');
    };

    const volverATabla = () => {
        setVistaFormulario(false);
        setProductoSeleccionado(null);
        setErrorValidacion('');
    };

    const closeModal = () => {
        const currentType = modal.type;
        setModal({ open: false, type: 'info', title: '', message: '', onConfirm: null, onCancel: null, showCancel: false });
        // Si era un modal de éxito, volver a la tabla
        if (currentType === 'success') {
            volverATabla();
        }
    };

    const validarFormulario = () => {
        const cajasNum = parseInt(cantidadCajas) || 0;
        const unidadesNum = parseInt(cantidadUnidades) || 0;
        if (cajasNum === 0 && unidadesNum === 0) {
            setModal({ open: true, type: 'warning', title: 'Cantidad requerida', message: 'Debe ingresar al menos una cantidad (cajas o unidades).' });
            return false;
        }
        if (tipoMovimiento === 'salida') {
            const cajasInsuficientes = cajasNum > productoSeleccionado.cantidadCaja;
            const unidadesInsuficientes = unidadesNum > productoSeleccionado.cantidadUnidad;

            if (cajasInsuficientes && unidadesInsuficientes) {
                setModal({
                    open: true,
                    type: 'error',
                    title: 'Stock insuficiente',
                    message: `Stock de cajas insuficiente. Solo hay ${productoSeleccionado.cantidadCaja}.\nStock de unidades insuficiente. Solo hay ${productoSeleccionado.cantidadUnidad}.`
                });
                return false;
            }
            if (cajasInsuficientes) {
                setModal({ open: true, type: 'error', title: 'Stock insuficiente', message: `Stock de cajas insuficiente. Solo hay ${productoSeleccionado.cantidadCaja}.` });
                return false;
            }
            if (unidadesInsuficientes) {
                setModal({ open: true, type: 'error', title: 'Stock insuficiente', message: `Stock de unidades insuficiente. Solo hay ${productoSeleccionado.cantidadUnidad}.` });
                return false;
            }
        }
        return true;
    };

    const handlePreConfirm = (e) => {
        e.preventDefault();
        if (!userId) {
            setModal({ open: true, type: 'error', title: 'Usuario no disponible', message: 'Inicie sesión para registrar movimientos.' });
            return;
        }
        if (!validarFormulario()) return;
        // Construir resumen con stock
        const cajasNum = parseInt(cantidadCajas) || 0;
        const unidadesNum = parseInt(cantidadUnidades) || 0;
        const cajasAct = productoSeleccionado.cantidadCaja;
        const unidAct = productoSeleccionado.cantidadUnidad;
        let cajasNueva = cajasAct;
        let unidNueva = unidAct;
        if (tipoMovimiento === 'ingreso') {
            cajasNueva += cajasNum;
            unidNueva += unidadesNum;
        } else {
            cajasNueva -= cajasNum;
            unidNueva -= unidadesNum;
        }
        const signo = tipoMovimiento === 'ingreso' ? '+' : '-';
        const line1 = cajasNum > 0 ? `${signo} ${cajasNum} cajas` : '';
        const line2 = unidadesNum > 0 ? `${signo} ${unidadesNum} unidades` : '';
        const resumen = [line1, line2].filter(Boolean).join('\n');
        setModal({
            open: true,
            type: 'info',
            title: 'Confirmar movimiento',
            message: `${tipoMovimiento.toUpperCase()}\n${resumen}\n\nNuevo stock: ${cajasNueva} cajas | ${unidNueva} unidades`,
            onConfirm: () => handleActualizarStock(),
            showCancel: true
        });
    };

    const handleActualizarStock = async () => {
        setProcesando(true);

        const cajasNum = parseInt(cantidadCajas) || 0;
        const unidadesNum = parseInt(cantidadUnidades) || 0;

        try {
            const body = {
                productoId: productoSeleccionado.producto?.producto_id,
                usuarioId: userId,
                estado: tipoMovimiento === 'ingreso' ? 'ingreso' : 'salida',
                cantidadCaja: cajasNum > 0 ? cajasNum : 0,
                cantidadUnidad: unidadesNum > 0 ? unidadesNum : 0,
                observaciones
            };

            const response = await fetch('http://localhost:8080/api/registros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const txt = await response.text();
                throw new Error(txt || 'Error al registrar el movimiento');
            }

            await fetchInventario();
            const registroCreado = await response.json();
            const cambios = [];
            if (cajasNum > 0) cambios.push(`${tipoMovimiento === 'ingreso' ? '+' : '-'} ${cajasNum} cajas`);
            if (unidadesNum > 0) cambios.push(`${tipoMovimiento === 'ingreso' ? '+' : '-'} ${unidadesNum} unidades`);
            setModal({
                open: true,
                type: 'success',
                title: 'Movimiento registrado',
                message: `${cambios.join(' | ')}\nNuevo stock: ${registroCreado.stockCajaDespues} cajas | ${registroCreado.stockUnidadDespues} unidades`
            });
        } catch (err) {
            console.error(err);
            setModal({ open: true, type: 'error', title: 'No se pudo registrar', message: err.message });
        } finally {
            setProcesando(false);
        }
    };

    // Si está en vista de formulario, mostrar el formulario
    if (vistaFormulario && productoSeleccionado) {
        return (
            <div className="tabla-container">
                <Modal isOpen={modal.open} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} onConfirm={modal.onConfirm} onCancel={modal.onCancel} showCancel={modal.showCancel} />

                {/* Warning si no hay usuario */}
                {!userId && (
                    <div style={{background:'#fff5f5',border:'1px solid #ff6b9d',padding:'12px 16px',borderRadius:'8px',color:'#d8435a',marginBottom:'16px',fontSize:'14px'}}>
                        ⚠️ Usuario no disponible. No se puede registrar el movimiento hasta que inicie sesión.
                    </div>
                )}

                {/* Header sin botón Volver */}
                <h2 className="admin-titulo" style={{ margin: '0 0 24px', fontSize: '24px' }}>Actualizar Stock</h2>

                <div className="formulario-actualizar-stock">
                    {/* Información del producto apilada */}
                    <div className="info-producto-destacada">
                        <div className="info-block producto">
                            <span className="info-label-grande">PRODUCTO</span>
                            <span className="info-value-grande product-value">
                                {productoSeleccionado.producto?.nombre} - {productoSeleccionado.producto?.marca}
                            </span>
                        </div>
                        <div className="info-block stock">
                            <span className="info-label-grande">STOCK ACTUAL</span>
                            <span className="info-value-grande stock-value">
                                {productoSeleccionado.cantidadCaja} cajas | {productoSeleccionado.cantidadUnidad} unidades
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handlePreConfirm} className="form-actualizar">
                        {/* Tipo de Movimiento */}
                        <div className="form-group">
                            <label className="form-label-titulo">Tipo de movimiento</label>
                            <div className="radio-group-horizontal">
                                <label className={`radio-option-grande ${tipoMovimiento === 'salida' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="mov"
                                        value="salida"
                                        checked={tipoMovimiento === 'salida'}
                                        onChange={(e) => setTipoMovimiento(e.target.value)}
                                    />
                                    <span className="radio-content">
                                        <span className="radio-icon icon-salida">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8435a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <polyline points="19 12 12 19 5 12" />
                                            </svg>
                                        </span>
                                        <span>Salida (descontar stock)</span>
                                    </span>
                                </label>
                                <label className={`radio-option-grande ${tipoMovimiento === 'ingreso' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="mov"
                                        value="ingreso"
                                        checked={tipoMovimiento === 'ingreso'}
                                        onChange={(e) => setTipoMovimiento(e.target.value)}
                                    />
                                    <span className="radio-content">
                                        <span className="radio-icon icon-ingreso">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b8f3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="19" x2="12" y2="5" />
                                                <polyline points="5 12 12 5 19 12" />
                                            </svg>
                                        </span>
                                        <span>Ingreso (agregar stock)</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Cantidad dinámica */}
                        <div className="form-group">
                            <label className="form-label-titulo">Cantidades a {tipoMovimiento === 'ingreso' ? 'ingresar' : 'descontar'} (opcional cada campo)</label>
                            <div className="dual-cantidad-wrapper">
                                <div className="cantidad-box">
                                    <label>Cajas</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-input-grande"
                                        value={cantidadCajas}
                                        onChange={(e) => setCantidadCajas(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="cantidad-box">
                                    <label>Unidades</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-input-grande"
                                        value={cantidadUnidades}
                                        onChange={(e) => setCantidadUnidades(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview nuevo stock */}
                        <div className="stock-preview">
                            {(() => {
                                const cajasAct = productoSeleccionado.cantidadCaja;
                                const unidAct = productoSeleccionado.cantidadUnidad;
                                const cC = parseInt(cantidadCajas) || 0;
                                const cU = parseInt(cantidadUnidades) || 0;
                                let cajasNueva = cajasAct;
                                let unidNueva = unidAct;
                                if (tipoMovimiento === 'ingreso') {
                                    cajasNueva += cC;
                                    unidNueva += cU;
                                } else {
                                    cajasNueva -= cC;
                                    unidNueva -= cU;
                                }
                                return (
                                    <>
                                        <div>Stock actual: <span>{cajasAct} cajas | {unidAct} unidades</span></div>
                                        <div>Nuevo estimado: <span style={{ color: (cajasNueva < 0 || unidNueva < 0) ? '#d8435a' : '#1b1b1b' }}>{Math.max(cajasNueva, 0)} cajas | {Math.max(unidNueva, 0)} unidades</span></div>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="form-group">
                            <label className="form-label-titulo">Observaciones (opcional)</label>
                            <textarea
                                rows="3"
                                className="form-input-grande"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="Ej. Ajuste por rotura, devolución, salida por venta..."
                            />
                        </div>

                        {/* Mensaje de error */}
                        {errorValidacion && (
                            <div className="alert-error">
                                <span>⚠️</span>
                                <span>{errorValidacion}</span>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="admin-boton-pequeño secundario"
                                onClick={volverATabla}
                                disabled={procesando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="admin-boton-pequeño editar"
                                disabled={procesando || !userId}
                            >
                                {procesando ? 'Procesando...' : 'Continuar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Vista de tabla (por defecto)
    return (
        <div className="tabla-container">
            <h2 className="admin-titulo">Actualizar Stock</h2>

            <form className="tabla-header" onSubmit={handleBuscar} style={{ justifyContent: 'flex-start', gap: '15px' }}>
                <div className="filtro-busqueda">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                    <input
                        type="text"
                        className="input-busqueda"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>
                <div className="filtro-busqueda">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                    <input
                        type="text"
                        className="input-busqueda"
                        placeholder="Buscar por marca..."
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                    />
                </div>
                <button type="submit" className="admin-boton-pequeño editar" style={{ padding: '10px 16px' }}>
                    Buscar
                </button>
            </form>

            {cargando && <p>Cargando inventario...</p>}
            {error && <p className="error-message">{error}</p>}

            {!cargando && !error && (
                <>
                    <div className="tabla-scroll-container">
                        <table className="tabla-usuarios" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 900 }}>
                            <thead>
                            <tr style={{ height: '32px' }}>
                                <th>ID PRODUCTO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>DESCRIPCIÓN</th>
                                <th style={{ textAlign: 'right' }}>UNID. POR CAJA</th>
                                <th style={{ textAlign: 'right' }}>CAJAS (STOCK)</th>
                                <th style={{ textAlign: 'right' }}>UNIDADES (STOCK)</th>
                                <th style={{ textAlign: 'right' }}>TOTAL UNIDADES</th>
                                <th>ACCIONES</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inventario.length > 0 ? (
                                inventario.map((item, idx) => {
                                    const cantCajasStock = item.cantidadCaja || 0;
                                    const cantUnidadesStock = item.cantidadUnidad || 0;
                                    const unidPorCaja = item.producto?.cantidadCaja || 0;
                                    const totalUnidades = (cantCajasStock * unidPorCaja) + cantUnidadesStock;
                                    const rowStyle = {
                                        height: '32px',
                                        background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                                    };
                                    return (
                                        <tr key={item.inventario_id} style={rowStyle}>
                                            <td>{item.producto.producto_id}</td>
                                            <td>{item.producto.nombre}</td>
                                            <td>{item.producto.marca}</td>
                                            <td>{item.producto.descripcion}</td>
                                            <td style={{ textAlign: 'right' }}>{unidPorCaja}</td>
                                            <td style={{ textAlign: 'right' }}>{cantCajasStock}</td>
                                            <td style={{ textAlign: 'right' }}>{cantUnidadesStock}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{totalUnidades}</td>
                                            <td>
                                                <button
                                                    className="admin-boton-pequeño editar"
                                                    onClick={() => abrirFormulario(item)}
                                                    title="Actualizar stock"
                                                >
                                                    Actualizar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', fontStyle: 'italic', height: '32px' }}>
                                        No se encontraron productos en el inventario que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActualizarStock;
