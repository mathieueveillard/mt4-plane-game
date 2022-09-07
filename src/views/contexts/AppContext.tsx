import { Socket } from "socket.io-client";
import { createContext, ReactElement, useEffect, useState } from "react";
import { SocketDriver } from "../../services/sockets/drivers/socket.driver";
import { IAppContext, PartStatus } from "../../interfaces/app.context.interface";
import { EnemyPosition } from "../../interfaces/position.game.interface";

export const AppContext = createContext<IAppContext>({
  socket: null,
  errorJoining: "",
  partyStatus: "none",
  players: [],
  partyPlayers: [],
  enemyPosition: { position: { x: 0, y: 0 }, rotation: 0 }
})

const AppContextContainer = ({ children }: { children: ReactElement }) => {
  const [socket, setSocket] = useState<Socket|null>(null);
  const [partyStatus, setPartyStatus] = useState<PartStatus>("none");
  const [errorJoining, setErrorJoining] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [partyPlayers, setPartyPlayers] = useState<string[]>([]);
  const [enemyPosition, setEnemyPosition] = useState<EnemyPosition>({ position: { x: 0, y: 0 }, rotation: 0 });

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
    socketDriver.socket.on("join_successfully", () => {
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
    socketDriver.socket.on("get_enemy_position", (position: EnemyPosition) => {
      setEnemyPosition(position)
    })

    socketDriver.socket.on("get_shot", () => {
      console.log("SHOT !")
      // onShotEvent()
    })

    socketDriver.socket.on("get_destroy", () => {
      console.log("DESTROY !")
      setPartyStatus("lost")
    })

    socketDriver.socket.on("enemy_destroy", () => {
      console.log("DESTROY !")
      setPartyStatus("win")
    })
  }, []);

  return (
    <AppContext.Provider value={{ socket, errorJoining, partyStatus, players, enemyPosition, partyPlayers }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextContainer
