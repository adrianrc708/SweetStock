import { useEffect, useState } from 'react'
import './App.css'
import Login from "./Login";
import Admin from "./componentes/AdminPanel";
import Almacenero from "./componentes/AlmaceneroPanel";
import Vendedor from "./componentes/VendedorPanel";

function App() {
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUsuarioLogeado(userData); // Guarda ID, nombre, rol
  };

  return (
    <div>
      {usuarioLogeado && (
        <div className="app-header">
          <div className="header-content">
            <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L8 7h8l-4-5z"/>
              <path d="M8 7l-3 5h14l-3-5"/>
              <ellipse cx="12" cy="17" rx="6" ry="5"/>
              <path d="M6 12c0 1.5 2.5 3 6 3s6-1.5 6-3"/>
            </svg>
            <h1>SweetStock</h1>
          </div>
        </div>
      )}

      {!usuarioLogeado ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>

          {usuarioLogeado.rol === "Administrador" && <Admin usuario={usuarioLogeado}/>}
          {usuarioLogeado.rol === "Almacenero" && <Almacenero usuario={usuarioLogeado}/>}
          {usuarioLogeado.rol === "Vendedor" && <Vendedor usuario={usuarioLogeado}/>}
        </div>
      )}
    </div>
  );
}

export default App
