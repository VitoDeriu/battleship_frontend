import React from 'react';
import {Link, useNavigate} from "react-router-dom";

import {useAuth} from "../../hooks/useAuth";



const Home: React.FC = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        logout();
        navigate('/');
    }

    return (
        <div className="home">
            <h1>Bienvenue à la Bataille Navale !</h1>

            { user !== null ? (
                <div>
                    <p>Bonjour {user}</p>
                    <Link to="/game/lobby">
                        <button style={{ margin: '10px', fontSize: '16px' }}>
                            Jouer !
                        </button>
                    </Link>
                        <button onClick={handleLogout} style={{ margin: '10px', fontSize: '16px' }}>
                            Se déconnecter
                        </button>
                </div>
                ) : (
                    <div>
                        <p>Vous devez vous connecter ou vous inscrire pour jouer : </p>
                        <Link to="/auth/login">
                            <button style={{ margin: '10px', fontSize: '16px' }}>
                                Se connecter
                            </button>
                        </Link>
                        <Link to="/auth/register">
                            <button style={{ margin: '10px', fontSize: '16px' }}>
                                S'inscrire
                            </button>
                        </Link>
                    </div>
            )}
        </div>
    )
}

export default Home;