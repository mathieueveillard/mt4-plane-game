import { Router } from './router/router';
import { createContext, useEffect, useState } from "react";
import { SocketDriver } from "./services/sockets/drivers/socket.driver";
import { Socket } from "socket.io-client";

type PartStatus = "none" | "join" | "starting"

export interface IPosition { x: number, y: number }

export interface IAppContext {
  socket: Socket|null,
  setSocket: (socket: Socket) => void,
  partyStatus: PartStatus
  errorJoining: string
  players: string[]
  partyPlayers: string[]
  enemyPosition: IPosition
}

export const AppContext = createContext<IAppContext>({
  socket: null,
  setSocket: (socket: Socket) => {},
  errorJoining: "",
  partyStatus: "none",
  players: [],
  partyPlayers: [],
  enemyPosition: { x: 0, y: 0 }
})

function App() {
  const [socket, setSocket] = useState<Socket|null>(null);
  const [partyStatus, setPartyStatus] = useState<PartStatus>("none");
  const [errorJoining, setErrorJoining] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [partyPlayers, setPartyPlayers] = useState<string[]>([]);
  const [enemyPosition, setEnemyPosition] = useState<IPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const socketDriver = new SocketDriver()

    // Initialize socket in AppContext
    socketDriver.socket.on("connect",  () => {
      localStorage.setItem('socket', socketDriver.socket.id)
      console.info(`CONNECT TO SOCKET SERVER WITH ID ${socketDriver.socket.id}`)
      console.info(`SOCKET ID ${socketDriver.socket.id} saved in local storage`)

      setSocket(socketDriver.socket)
    })

    // Retrieve the list of players
    socketDriver.socket.on("get_players", (players: any) => {
      setPlayers(players)
    })

    // When join a room, set the status to join
    // It will be used to render components
    socketDriver.socket.on("join_successfully", (room: string) => {
      setPartyStatus("join")
    })

    // When an error happen by joining a room
    // send a message for rendering
    socketDriver.socket.on("join_error", (message: string) => {
      setErrorJoining(message)
      console.error(message)
    })

    // When a party is stating, change the status
    // It will be handle in component to redirect user
    socketDriver.socket.on("start", (players) => {
      setPartyStatus("starting")
      setPartyPlayers(players)
    })

    // When a party is stating, change the status
    // It will be handle in component to redirect user
    socketDriver.socket.on("get_enemy_position", (position: IPosition) => {
      console.log({ position })
      setEnemyPosition(position)
    })
  }, []);

  return (
    <AppContext.Provider value={{ socket, setSocket, errorJoining, partyStatus, players, enemyPosition, partyPlayers }}>
      <Router/>
    </AppContext.Provider>
  );
}

export default App;
