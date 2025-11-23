import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/registros";

const ReporteMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  // Estados para los filtros "en edición"
  const [filtrosEdicion, setFiltrosEdicion] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipo: "",
    usuario: ""
  });

  // Sincronizar los filtros "en edición" con los filtros activos al inicio
  useEffect(() => {
    setFiltrosEdicion({
      fechaInicio,
      fechaFin,
      tipo,
      usuario
    });
  }, []);

  // Cargar movimientos desde la API
  useEffect(() => {
    const fetchMovimientos = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = API_URL;
        const params = [];
        if (tipo) params.push(`estado=${tipo}`);
        if (params.length > 0) url += `?${params.join("&")}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener los movimientos");
        const data = await res.json();
        setMovimientos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovimientos();
  }, [tipo]);

  // Nuevo: función para manejar el submit de filtros
  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMostrarTabla(false);
    try {
      let url = API_URL;
      const params = [];
      if (filtrosEdicion.tipo) params.push(`estado=${filtrosEdicion.tipo}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al obtener los movimientos");
      const data = await res.json();
      setMovimientos(data);
      // Actualizar los filtros activos con los de edición
      setFechaInicio(filtrosEdicion.fechaInicio);
      setFechaFin(filtrosEdicion.fechaFin);
      setTipo(filtrosEdicion.tipo);
      setUsuario(filtrosEdicion.usuario);
      setMostrarTabla(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // En el filtrado, usar los filtros activos, no los de edición
  const movimientosFiltrados = movimientos
    .filter((mov) => {
      const fecha = mov.fechaRegistro || mov.fecha;
      const fechaValida =
        (!fechaInicio || fecha >= fechaInicio) &&
        (!fechaFin || fecha <= fechaFin);
      // Filtro por usuario
      const usuarioValido = !usuario || (mov.usuarioRegistro?.nombre?.toLowerCase().includes(usuario.toLowerCase()) || mov.usuario?.toLowerCase().includes(usuario.toLowerCase()));
      return fechaValida && usuarioValido;
    })
    .sort((a, b) => {
      // Ordenar por fecha y hora descendente
      const fechaA = a.fechaRegistro || a.fecha;
      const fechaB = b.fechaRegistro || b.fecha;
      if (fechaA > fechaB) return -1;
      if (fechaA < fechaB) return 1;
      // Si la fecha es igual, comparar hora
      const horaA = a.horaRegistro || "00:00:00";
      const horaB = b.horaRegistro || "00:00:00";
      if (horaA > horaB) return -1;
      if (horaA < horaB) return 1;
      return 0;
    });

  return (
    <div className="tabla-container">
      <h2 className="admin-titulo">Reporte de Movimientos de Inventario</h2>
      <form className="tabla-header" style={{ justifyContent: 'flex-start', gap: '15px', alignItems: 'flex-end' }} onSubmit={handleGenerarReporte}>
        <div style={{display: 'flex', flexDirection: 'column', minWidth: 220}}>
          <label style={{fontSize: '13px', color: '#666', marginBottom: 6, marginLeft: 2}}>Rango de Fechas</label>
          <div className="filtro-busqueda" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <input
              type="date"
              className="input-busqueda filtro-fecha"
              value={filtrosEdicion.fechaInicio}
              onChange={e => setFiltrosEdicion(f => ({...f, fechaInicio: e.target.value}))}
              style={{minWidth: 140, width: 140, maxWidth: 180}}
            />
            <span style={{margin: '0 6px', color: '#888', fontWeight: 'bold', fontSize: '18px'}}>-</span>
            <input
              type="date"
              className="input-busqueda filtro-fecha"
              value={filtrosEdicion.fechaFin}
              onChange={e => setFiltrosEdicion(f => ({...f, fechaFin: e.target.value}))}
              style={{minWidth: 140, width: 140, maxWidth: 180}}
            />
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', minWidth: 160}}>
          <label style={{fontSize: '13px', color: '#666', marginBottom: 6, marginLeft: 2}}>Tipo</label>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <select
              className="select-rol"
              value={filtrosEdicion.tipo}
              onChange={e => setFiltrosEdicion(f => ({...f, tipo: e.target.value}))}
              style={{minWidth: 140, width: 140, maxWidth: 180, height: 38, border: '1px solid #e0e0e0', borderRadius: 8, background: '#f8f9fa', fontSize: 14, color: '#333', paddingLeft: 10}}
            >
              <option value="">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="salida">Salida</option>
            </select>
          </div>
        </div>
        <div className="filtro-busqueda" style={{minWidth: 160}}>
          <input
            type="text"
            className="input-busqueda"
            placeholder="Filtrar por usuario..."
            value={filtrosEdicion.usuario}
            onChange={e => setFiltrosEdicion(f => ({...f, usuario: e.target.value}))}
            style={{minWidth: 140, width: 140, maxWidth: 180}}
          />
        </div>
        <button
          type="submit"
          className="admin-boton-pequeño editar"
          style={{
            padding: '12px 22px',
            minWidth: 140,
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ff4d8a 100%)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            border: 'none',
            borderRadius: 8,
            boxShadow: '0 4px 16px #ff6b9d44',
            letterSpacing: 0.7,
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
            marginRight: 4
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d8a 0%, #ff6b9d 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ff4d8a 100%)'}
        >
          <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{marginRight: 2}}><path fill="#fff" d="M5 20q-.825 0-1.413-.588T3 18V6q0-.825.588-1.413T5 4h5q.425 0 .713.288T11 5q0 .425-.288.713T10 6H5v12h14V6h-5q-.425 0-.713-.288T13 5q0-.425.288-.713T14 4h5q.825 0 1.413.588T21 6v12q0 .825-.588 1.413T19 20H5Zm7-3.425q-.2 0-.375-.062t-.325-.213l-2.6-2.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l.9.9V8q0-.425.288-.713T12 7q.425 0 .713.288T13 8v5.2l.9-.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-2.6 2.6q-.15.15-.325.213t-.375.062Z"></path></svg>
            Generar reporte
          </span>
        </button>
        <button type="button" className="admin-boton-pequeño" style={{ padding: '10px 16px', minWidth: 120, background: '#e0e0e0', color: '#333', marginLeft: 4 }}
          onClick={() => setFiltrosEdicion({fechaInicio: '', fechaFin: '', tipo: '', usuario: ''})}>
          Limpiar filtros
        </button>
      </form>
      {mostrarTabla && (
        <>
          {/* Resumen de filtros aplicados */}
          <div style={{margin: '10px 0 18px 0', fontSize: '14px', color: '#444'}}>
            <strong>Filtros aplicados:</strong>
            <span style={{marginLeft: 10}}>
              {fechaInicio && fechaFin ? `Fechas: ${fechaInicio} a ${fechaFin}` : fechaInicio ? `Desde: ${fechaInicio}` : fechaFin ? `Hasta: ${fechaFin}` : 'Todas las fechas'}
              {" | "}
              {tipo ? `Tipo: ${tipo === 'ingreso' ? 'Ingreso' : 'Salida'}` : 'Todos los tipos'}
              {" | "}
              {usuario ? `Usuario: ${usuario}` : 'Todos los usuarios'}
            </span>
          </div>
          {loading ? (
            <p>Cargando movimientos...</p>
          ) : error ? (
            <p style={{color: 'red'}}>Error: {error}</p>
          ) : (
            <div className="tabla-scroll-container">
              <table className="tabla-usuarios">
                <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th>
                    Cantidad<br/>
                    <span style={{fontWeight: 'normal', fontSize: '11px', color: '#888'}}>Cajas</span>
                  </th>
                  <th>
                    Cantidad<br/>
                    <span style={{fontWeight: 'normal', fontSize: '11px', color: '#888'}}>Unidades</span>
                  </th>
                  <th>Usuario</th>
                  <th>Observaciones</th>
                </tr>
                </thead>
                <tbody>
                {movimientosFiltrados.length === 0 ? (
                  <tr><td colSpan={8} className="mensaje-vacio">No hay movimientos en el rango seleccionado.</td></tr>
                ) : (
                  movimientosFiltrados.map(mov => (
                    <tr key={mov.registroId || mov.id}>
                      <td>{mov.fechaRegistro || mov.fecha}</td>
                      <td>{mov.horaRegistro || "-"}</td>
                      <td>{mov.estado ? (mov.estado.charAt(0).toUpperCase() + mov.estado.slice(1)) : mov.tipo}</td>
                      <td>{mov.producto?.nombre || mov.producto || '-'}</td>
                      <td>{mov.cantidadCaja ?? '-'}</td>
                      <td>{mov.cantidadUnidad ?? '-'}</td>
                      <td>{mov.usuarioRegistro?.nombre || mov.usuario || '-'}</td>
                      <td>{mov.observaciones ?? '-'}</td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReporteMovimientos;
