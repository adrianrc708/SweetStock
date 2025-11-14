import {useState} from "react";
import "./Login.css";
import Modal from "./componentes/Modal";

function Login({onLoginSuccess }){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

    const handleSubmit = (e) => {
        e.preventDefault();

    const data = {username, password};
    console.log("Enviando login: ", data);

    fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(async (res) => {
        const mensaje = await res.text();
        if (!res.ok) {
            setModalConfig({
                isOpen: true,
                title: "Error de Inicio de Sesión",
                message: mensaje,
                type: "error"
            });
            throw new Error(mensaje);
        }
        return JSON.parse(mensaje);
    })
    .then((usuario) => {
        setModalConfig({
            isOpen: true,
            title: "¡Bienvenido!",
            message: `Inicio de sesión exitoso. Bienvenido ${usuario.nombre || usuario.usuario}`,
            type: "success",
            onClose: () => {
                setModalConfig({ isOpen: false, title: "", message: "", type: "info" });
                onLoginSuccess(usuario);
            }
        });
    })
    .catch((err) => console.error(err));
    };

    return(
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar Sesión</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ingresa tu usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>

                    <button className="login-button" type="submit">Ingresar</button>
                </form>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={modalConfig.onClose || (() => setModalConfig({ isOpen: false, title: "", message: "", type: "info" }))}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    )
}

export default Login;