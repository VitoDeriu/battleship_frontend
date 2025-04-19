import React, {useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {

    const [username, setUsername] = useState<string>('');
    const { login } = useAuth()
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(username);
        navigate('/');
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Connexion</h1>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nom d'utilisateur :</label>
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>

        </div>

    )
}

export default Login;