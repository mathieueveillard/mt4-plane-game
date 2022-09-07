import { Socket } from "socket.io-client";
import { IPosition } from "./position.game.interface";

export type PartStatus = "none" | "join" | "starting"

export interface IAppContext {
  socket: Socket|null,
  partyStatus: PartStatus
  errorJoining: string
  players: string[]
  partyPlayers: string[]
  enemyPosition: IPosition
}
