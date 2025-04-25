import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";

import Home from "./scenes/home/Home";
import Login from "./scenes/auth/login/Login";
import Register from "./scenes/auth/register/Register";
import Profile from "./scenes/profile/Profile";
// import {useAuth} from "./hooks/useAuth";
import Lobby from "./scenes/lobby/Lobby";
import Game from "./scenes/game/Game";

const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Route actuelle :", location.pathname); // Log chaque fois que la route change
  }, [location]);

  return null;
};

const App: React.FC = () => {
  console.log("App re-render"); // Ajoute ce log

  return (
      <Router>
          <RouteTracker/>
          <Routes>
              {/*Home Route*/}
              <Route path="/" element={<Home/>}/>

              {/*Auth Routes*/}
              <Route path="/auth/login" element={<Login/>}/>
              <Route path="/auth/register" element={<Register/>}/>

              {/*User Routes*/}
              <Route path="/profile" element={<Profile/>}/>
              {/*<Route path="/profile/:id" element={<Profile key={useAuth(user)}/>}/>*/}

              {/*Game Routes*/}
              {/*<Route path="/game" element={<div>Game</div>}/>*/}
              {/*<Route path="/game/:id" element={<div>Game</div>}/*/}
              <Route path="/game/lobby" element={<Lobby/>}/>
              <Route path="/game/game" element={<Game/>}/>

          </Routes>
      </Router>
  );
}

export default App;
