import React from "react";
import {Link} from "react-router-dom";

const Lobby: React.FC = () => {
  console.log("Lobby monté");
    return (
        <div>
            <h1>Lobby</h1>
          <Link to="/game/game">
            <button onClick={()=> console.log('navigation vers game')}>Jouer</button>
          </Link>
        </div>
    )

}

export default Lobby;