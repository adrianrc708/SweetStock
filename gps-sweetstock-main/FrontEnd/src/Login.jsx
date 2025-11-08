import {useState} from "react";

function Login({onLoginSuccess }){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
        alert(mensaje);
        throw new Error(mensaje);
        }
        return JSON.parse(mensaje);
    })
    .then((usuario) => {
        onLoginSuccess(usuario);
    })
    .catch((err) => console.error(err));
    };

    return(
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Ingresar</button>
            </form>
        </div>
    )
}

export default Login;