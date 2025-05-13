import React, {useEffect, useState} from 'react';
import {useAuth} from "../../hooks/useAuth";
import wsGameService from "../../services/game/wsGameService";
import Board from "../../components/board/Board";
import {Boat} from "../../models/game/Boat";
import {ServerShot} from "../../models/game/ServerShot";
import {LobbyReady} from "../../models/game/LobbyReady";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableBoat from "../../components/board/boats/DraggableBoat";
import "./Game.scss";

const Game:React.FC = () => {

  //info websocket
  const gameWsUrl: string = "http://localhost:4002";

  //gestion du lobby

  const [gameId, setGameId] = useState<string>()
  const [lobbyState, setLobbyState] = useState<string>()

  //gestion mon id
  const {user} = useAuth();
  const [myPlayerId, setMyPlayerId] = useState<string>()
  const myPlayerIdRef = React.useRef<string>(myPlayerId);
  const myUsernameRef = React.useRef<string>(user);

  //gestion id adversaire
  const [opponentId, setOpponentId] = useState<string>()
  const [opponentUsername, setOpponentUsername] = useState<string>()

  //gestion des grilles
  const createEmptyGrid = (): any[][] => {
    return Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) =>
            ({x, y, state: 'empty'}))
    );
  };
  const [boatsPlaced, setBoatsPlaced] = useState<number>(0);
  const [myGrid, setMyGrid] = useState(createEmptyGrid());
  const [enemyGrid, setEnemyGrid] = useState(createEmptyGrid());

  //gestion des bateaux

  const initialBoats: Boat[] = [
    { id: "1", name: "Porte-avion", size: 5, orientation: "horizontal", position: null },
    { id: "2", name: "Cuirassé",    size: 4, orientation: "horizontal", position: null },
    { id: "3", name: "Destroyer 1", size: 3, orientation: "horizontal", position: null },
    { id: "4", name: "Destroyer 2", size: 3, orientation: "horizontal", position: null },
    { id: "5", name: "Torpilleur",  size: 2, orientation: "horizontal", position: null },
  ];
  const [boats, setBoats] = useState<Boat[]>(initialBoats);

  //gestion des tirs
  const [serverShots, setServerShots] = useState<ServerShot[]>([]);

//RECEPTION
  //Route "my-playerId" — récup de l'id du joueur
  const handleMyId = (data: {client: string, username: string, gameId: string, state: string}) => {
    console.log(`Game - my-id : \n client : ${data.client} \n username: ${data.username} \n gameid : ${data.gameId}`)
    setMyPlayerId(data.client)
    myPlayerIdRef.current = data.client;
    setGameId(data.gameId)
    setLobbyState(data.state)
  }

  //Route "player-joined" — information qu'un joueur a rejoint le salon
  const handlePlayerJoined = (data: { room: string, players: string }) => {
    console.log(`Game - player-joined : \n player : ${data.players} \n gameid : ${data.room}`)
  }

  //Route "lobby-ready" — récup de l'id de l'opposant
  const handleOpponentId = (data: LobbyReady) => {
    console.log(`Game - lobby-ready :\nplayer 1 : ${data.players[0]}\nplayer 2 : ${data.players[1]}\nplayerStart : ${data.startPlayer}`)

    if (data.players[0] === myPlayerIdRef.current){
      setOpponentId(data.players[1])
    } else {
      setOpponentId(data.players[0])
    }

    if (data.usernames[0] === myUsernameRef.current) {
      setOpponentUsername(data.usernames[1])
    } else {
      setOpponentUsername(data.usernames[0])
    }
    setLobbyState("ready")

  }

  //Route "placement-start" — change l'état de la partie pour rentrer dans l'interface de placement
  const handlePlacementStart = ()=>{
    setLobbyState("placement")
  }

  const handleCellDrop = (x: number, y: number, draggedItem?: { id: string, size: number, name: string, orientation: "horizontal" | "vertical" }) => {
    if (!draggedItem) return;

    const { id, size, orientation } = draggedItem;

    console.log(`cellule dropped at: ${x}, ${y}\nwith item : ${draggedItem.name}\norientation : ${draggedItem.orientation}`);

    // Vérifie les limites du placement (exemple horizontal)
    const isPlacementValid = () => {
      if (draggedItem.orientation === "horizontal") return x + draggedItem.size <= myGrid[0].length;
      if (draggedItem.orientation === "vertical") return y + draggedItem.size <= myGrid.length;
      return false;
    };

    if (isPlacementValid()) {
      // Met à jour la grille pour placer ce bateau
      setMyGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell }))); // Copie profonde de la grille

        for (let i = 0; i < size; i++) {
          if (draggedItem.orientation === "horizontal") {
            newGrid[y][x + i].state = "ship";
          }
          if (draggedItem.orientation === "vertical") {
            newGrid[y + i][x].state = "ship";
          }
        }
        return newGrid;
      });

      // Marque le bateau comme placé
      setBoats((prevBoats) =>
        prevBoats.map((boat) => (
          boat.id === id ? { ...boat, position: { x, y }, orientation } : boat))
      );

      // Incrémenter le nombre de bateaux placés
      setBoatsPlaced((prevCount) => prevCount + 1); // Incrémente le nombre de bateaux placés
    } else {
      console.log("Placement invalide");
    }
  }

  //Route "move" — gestion des tirs qui arrivent du serveur
  const handleShotReceive = (data: ServerShot) => {
    console.log("Game - tir recu du serveur :", data.move.detail);
    setServerShots(prevShot => [...prevShot, data]);

    // Màj de la grille après l'impact de tir - rendu en rouge
    if (data.player !== myPlayerIdRef.current) {
      setMyGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[data.move.y][data.move.x].state = 'hit';
        return newGrid;
      });
    }
  }

  //fonction de clic sur la grille ennemie (TIR)
  const handleCellClick = (x: number, y: number) => {
    console.log(`Tir sur ${x}, ${y}`);
    const detail = `${user} a tirer en ${x}, ${y}`
    const data = {detail, x, y };
    sendShot('move', data);

    //Màj de la grille ennemie après le tir
    setEnemyGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[y][x].state = 'hit';
      return newGrid;
    });

    // Ici tu pourras gérer les tirs ou placer un bateau
  }

  //pour faire tourner les bateaux quand on les places
  const handleBoatRotate = (boatId: string) => {
    setBoats((prevBoats) =>
      prevBoats.map((boat) =>
        boat.id === boatId
          ? { ...boat, orientation: boat.orientation === "horizontal" ? "vertical" : "horizontal" }
          : boat
      )
    );
  };



//EMISSION
  //Route "ready" — envoie l'état ready du joueur
  const sendReady = (message: string, data: string) => {
    wsGameService.sendMessage(message, data);
  }

  //todo: envoyer les bateaux placé comme il faut
  //Route "ship-placement" -- envoie les bateaux placés
  const validatePlacement = () => {
    const shipsCoordinates = myGrid
      .flat()
      .filter(cell => cell.state === 'ship')
      .map(cell => ({ x: cell.x, y: cell.y }));

    wsGameService.sendMessage("ship-placement", { player: myPlayerId, ships: shipsCoordinates });
    console.log("Placements envoyés :", shipsCoordinates);
  };


  //Route "move" — envoie des tirs
  const sendShot = (message: string, data: { detail: string, x: number, y: number }) => {
    wsGameService.sendMessage(message, data);  // Utilise le service pour envoyer une action
  }

  //todo: récupérer la route de game ready pour lancer la partie

  //todo: faire toute la mécanique de tour et de vérif coté serveur

  //todo: bloquer les tir en fonction du tour

  // //todo: Si une erreur s'est produite, affiche un message d'erreur
  //    regarder la route 'error' pour l'affichage des messages d'erreur du back
  // if (connectionError) {
  //   return (
  //     <div>
  //       <h1>Erreur de connexion</h1>
  //       <p>{connectionError}</p>
  //     </div>
  //   );
  // }"

  //todo: changement d'affichage suivant l'état de la partie
  // donc pour le faire il faut un état de partie renvoyé au front ou alors récup ready
  // si ready = waiting afficher la page de placement de bateau (avec les tirs pour placer les bateaux sur mygrid) avec un bouton valider
  // quand les deux joueurs envoient le placement valide on passe ready en ready
  // si ready = ready afficher l'interface de jeu avec les deux grilles et activer les tirs sur la grille ennemie
  // après faire la logique de jeu
  // ajouter un bouton pour finir la partie des deux cotés pour passer l'état de la partie en terminé et voir pour stocker la game

  //todo: faire les placements de bateaux

  // const handleCellClickToPlaceShip = (x: number, y: number) => {
  //   setMyGrid(prevGrid => {
  //     const newGrid = [...prevGrid];
  //     if (newGrid[y][x].state === 'empty' && boatsPlaced < 5) {
  //       newGrid[y][x].state = 'ship';
  //       setBoatsPlaced(prevCount => prevCount + 1);
  //     }
  //     return newGrid;
  //   });
  // };




  useEffect(()=>{
    let isMounted = true; // Flag pour protéger contre un second effet de rendu inutile. (par rapport au serveur de développement réact)
    //connexion au websocket via socket.io
    if (isMounted) {
    wsGameService.connect(gameWsUrl, user);
    }

    wsGameService.onMessage('my-id', handleMyId);
    wsGameService.onMessage("player-joined", handlePlayerJoined);
    wsGameService.onMessage("lobby-ready", handleOpponentId);
    wsGameService.onMessage("placement-start", handlePlacementStart);
    wsGameService.onMessage("move", handleShotReceive);

    //Se désabonner et fermer la connexion au démontage
    return()=>{
      console.log("Game - démontage")
      isMounted = false; //on désactive le flag
      wsGameService.close();// Fermer la connexion socketIo proprement
    }
  }, [])

  const renderContent = () => {
    switch (lobbyState) {
      case "waiting":
        return <p>En attente de joueur...</p>;

      case "ready":
        return <button onClick={()=>sendReady('ready', `${user} est prêt !`)}>Commencer la partie</button>;

      case "placement":
        return (
          <div>
            <h2>Placez vos bateaux (max 5)</h2>
            <div className="boats-container">
              {boats.map((boat) => (
                <DraggableBoat
                  key={boat.id}
                  boat={boat}
                  onRotate={() => handleBoatRotate(boat.id)}
                />
              ))}
            </div>
            <Board grid={myGrid} onCellClick={handleCellDrop} disabled={false}/>
            {boatsPlaced === 5 && (
              <button onClick={validatePlacement}>Valider les positions</button>
            )}
          </div>
        );

      default:
        return <p>État inconnu...</p>;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Bonjour {user} !</h1>
        <p>Voici l'id de la game : {gameId}</p>
        <p>mon id websocket : {myPlayerId}</p>
        <p>Etat du lobby : {lobbyState}</p>
      {renderContent()}
      <p>Message du serv :</p>
      {serverShots.length > 0 ? (
        <ul>
          {serverShots.map((shot, i) => (
            <li key={i}>{shot.move.detail} - ({shot.move.x}, {shot.move.y})</li>
          ))}
        </ul>
      ) : (
        <p>Aucun message reçu pour l'instant.</p>
      )}
    </div>
    </DndProvider>
  )
}

export default Game;