export type LobbyReady = {
  message: string,
  room: string,
  players: string[],
  usernames: string[],
  startPlayer: string
}