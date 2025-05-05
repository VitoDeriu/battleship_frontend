import React, {useEffect, useState} from 'react';
import {useAuth} from "../../hooks/useAuth";
import wsGameService from "../../services/game/wsGameService";
import Board from "../../components/board/Board";

const createEmptyGrid = (): any[][] => {
  return Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 10 }, (_, x) =>
      ({x, y, state: 'empty'}))
  );
};

const Game:React.FC = () => {

  type ServerShot = {player: string, move: {detail: string, x: number, y: number}};


  const [serverShots, setServerShots] = useState<ServerShot[]>([]);
  const [myGrid, setMyGrid] = useState(createEmptyGrid());
  const [enemyGrid, setEnemyGrid] = useState(createEmptyGrid());
  const gameWsUrl: string = "http://localhost:4002";
  const { user } = useAuth();
  const [userId, setUserId] = useState<string>()
  const [gameId, setGameId] = useState<string>()

  useEffect(()=>{

    let isMounted = true; // Flag pour protéger contre un second effet inutile.

    //connexion au websocket via socket.io
    if (isMounted) {
    wsGameService.connect(gameWsUrl);
    }

    //Gestion des messages qui arrivent du serveur
    const handleShotRecieve = (data: {player: string, move: {detail: string, x: number, y: number}}) => {
      console.log("Game - tir recu du serveur :", data.move.detail);
      setServerShots(prevShot => [...prevShot, data]);
    }

    //S'abonner aux messages du websocket sur l'evenement "move"
    wsGameService.onMessage("move", handleShotRecieve);

    //récup de l'id de la game sur la route "game-id"


    const handleGameId = (data: { room: string, players: string }) => {
      console.log(`Game - player-joined : ${data.players} - game id reçu : ${data.room}`)
      setGameId(data.room)
    }
    wsGameService.onMessage("player-joined", handleGameId);

    //todo: récuperer la route du back qui va renvoyer au joueur son id et une autre qui va renvoyer l'id de l'autre joueur qui soit se connecte soit s'est déjà connecté.
    //récup de l'id du joueur sur la route "player-id"
    const handlePlayerId = (data: { room: string, players: string }) => {
      console.log("Game - player-id reçu :", data.players)
      console.log(`Game - Mon Id = ${data.players}`)
      setUserId(data.players)
    }
    wsGameService.onMessage("player-joined",handlePlayerId);

    //Se désabonner et fermer la connexion au démontage
    return()=>{
      console.log("Game - démontage")
      isMounted = false; //on désactive le flag
      wsGameService.close();// Fermer la connexion socketIo proprement
    }
  }, [])

  const handleCellClick = (x: number, y: number) => {
    console.log(`Tir sur ${x}, ${y}`);
    const detail = `${user} a tirer en ${x}, ${y}`
    const data = {detail, x, y };
    sendShot('move', data);
    setEnemyGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[y][x].state = 'hit';
      return newGrid;
    });
    // Ici tu pourras gérer les tirs ou placer un bateau
  }

  // Fonction pour envoyer des actions au serveur
  const sendShot = (message: string, data: { detail: string, x: number, y: number }) => {
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
      <h1>Voici l'id de la game : {gameId}</h1>
      <h1>Ici ma grille ! mon id : {userId}</h1>
      <Board grid={myGrid}></Board>
      <h1>Ici la grille ennemie !</h1>
      <Board grid={enemyGrid} onCellClick={handleCellClick}></Board>
      <h2>Message du serv :</h2>
      {serverShots.length > 0 ? (
        <ul>
          {serverShots.map((shot, index) => (
            <li key={index}>{shot.move.detail} - ({shot.move.x}, {shot.move.y})</li>
          ))}
        </ul>
      ) : (
        <p>Aucun message reçu pour l'instant.</p>
      )}
    </div>
  )
}

export default Game;