import React from "react";
import {Link} from "react-router-dom";

const Lobby: React.FC = () => {
  console.log("Lobby monté");
    return (
        <div>
            <h1>Lobby</h1>
          <Link to="/game/game">
            <button onClick={()=> console.log('navigation vers game')}>Créer une partie</button>
          </Link>
          {/*todo: form pour rejoindre la partie /}
          {/*<form action="/game/game" method="post">*/}
          {/*  <label>Id de la partie :</label>*/}
          {/*  <input type="text" />*/}
          {/*  <button>Rejoindre une partie</button>*/}
          {/*</form>*/}
        </div>
    )

}

export default Lobby;