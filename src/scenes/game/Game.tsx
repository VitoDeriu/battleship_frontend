import React, {useEffect, useState} from 'react';
import {useAuth} from "../../hooks/useAuth";
import wsGameService from "../../services/game/wsGameService";
import Board from "../../components/board/Board";

const Game:React.FC = () => {
  const [serverMessages, setServerMessages] = useState<string[]>([]);
  const gameWsUrl: string = "http://localhost:4002";
  const { user } = useAuth();

  useEffect(()=>{

    let isMounted = true; // Flag pour protéger contre un second effet inutile.

    //connexion au websocket via socket.io
    if (isMounted) {
    wsGameService.connect(gameWsUrl);
    }

    //Gestion des messages qui arrivent du serveur
    const handleServerMessage = (message: string) => {
      console.log("Game - message recu :", message);
      setServerMessages(prevMessages => [...prevMessages, message]);
    }

    //S'abonner aux messages du websocket
    wsGameService.onMessage("move", handleServerMessage);

    //Se désabonner et fermer la connexion au démontage
    return()=>{
      console.log("Game - démontage")
      isMounted = false; //on désactive le flag
      wsGameService.close();// Fermer la connexion socketIo proprement
    }
  }, [])

  // Fonction pour envoyer des actions au serveur
  const sendShot = (message: string, data: string) => {
    wsGameService.sendMessage(message, data);  // Utilise le service pour envoyer une action
  }

  // //todo: Si une erreur s'est produite, affiche un message d'erreur
  // if (connectionError) {
  //   return (
  //     <div>
  //       <h1>Erreur de connexion</h1>
  //       <p>{connectionError}</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1>Ici le jeu !</h1>
      {/*<Board></Board>*/}
      <button onClick={() => sendShot('move', `${user} a tirer en A1`)}>Tirer en A1</button>
      <button onClick={() => sendShot('move', `${user} a tirer en A2`)}>Tirer en A2</button>
      <h2>Message du serv :</h2>
      {serverMessages.length > 0 ? (
        <ul>
          {serverMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun message reçu pour l'instant.</p>
      )}
    </div>
  )
}

export default Game;