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
      <h1>Sistema SweetStock</h1>

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
