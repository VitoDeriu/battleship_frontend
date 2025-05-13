import { io, Socket } from "socket.io-client";

class WsGameService {
  private socket: Socket | null = null; //la connexion websocket
  private listeners: ((message: string) => void)[] = []; // Liste des abonnés pour recevoir les messages j'ai pas compris cétait quoi ??

  //init de la connexion
  connect(url: string, username?: string | null): void {

    console.log("WsGameService - Tentative de connexion à :", url)

    //annule la co si déjà co
    if (this.socket) {
      console.log('WsGameService - déjà connecté ou en cours de connexion.');
      return;
    }

    //initialise la connexion avec l'url
    this.socket = io(url, {
      transports: ['websocket'],// Force l'utilisation du WebSocket
      auth: {username},
    });

    // Sur connexion reussie
    this.socket.on("connect", () => {
      console.log('WsGameService - Connecté au WebSocket!')
      // @ts-ignore
      this.socket.emit('join-room', { roomId: 'room1'});
    });

    this.socket.on('player-joined', (data) => {
      console.log(`WsGameService - roomId : ${data.room} - Joueur rejoint la room`, data.players);
    })

    this.socket.on('game-ready', (data) => {
      console.log(`WsGameService - PARTIE PRÊTE ! Joueur qui commence : ${data.startPlayer}`);
    });

    this.socket.on('player-left', (data) => {
      console.log(`[${data.roomId}] Un joueur a quitté la room`);
    });

    this.socket.on('room-error', (data) => {
      console.error(`${data.message} (Room: ${data.roomId})`);
    });

    // Gestion des messages
    this.socket.on("message", (data: any) => {
      console.log("WsGameService - Message reçu :", data);
      // Appel de tous les abonnés avec le message reçu
      this.listeners.forEach((listener) => listener(data));
    });

    // Gestion des erreurs
    this.socket.on("connect_error", (error) => {
      console.error("WsGameService - Erreur de connexion Socket.IO :", error);
    });

    // Gestion de la déconnexion
    this.socket.on("disconnect", (reason) => {
      console.log(`WsGameService - Déconnecté (${reason}).`);
      this.socket = null; // Réinitialiser la connexion
      return;
    });
  }

  // Méthode pour envoyer un message au serveur
  sendMessage(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      console.log("WsGameService - Message envoyé :", { event, data });
    } else {
      console.error("WsGameService - Impossible d'envoyer un message : Socket.IO non connecté.");
    }
  }

  // Méthode pour s'abonner à une route et y réagir (le callback c'est la fonction qui se lance lorsqu'on a cet event)
  onMessage(event: string, callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error("WsGameService - Impossible de s'abonner : Socket.IO non connecté.");
    }
  }

  // Méthode pour fermer proprement la connexion
  close() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("WsGameService - Connexion Socket.IO fermée manuellement.");
    }
  }
}

//on fait un singleton pour avoir qu'une seule instance dans l'application
const wsGameService = new WsGameService();
export default wsGameService;
