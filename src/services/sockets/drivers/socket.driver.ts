import { io, Socket } from "socket.io-client";

export class SocketDriver {
  private readonly _socket: Socket;

  constructor() {
    this._socket = io("localhost:5050")
  }

  get socket(): Socket {
    return this._socket;
  }
}
