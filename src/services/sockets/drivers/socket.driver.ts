import { io, Socket } from "socket.io-client";

export class SocketDriver {
  private readonly _socket: Socket;

  constructor() {
    this._socket = io("localhost:5050")

    this._socket.on("connect",  () => {
      localStorage.setItem('socket', this.socket.id)
      console.info(`CONNECT TO SOCKET SERVER WITH ID ${this._socket.id}`)
      console.info(`SOCKET ID ${this._socket.id} saved in local storage`)
    })

    this._socket.emit("send_id", "toto")
  }

  get socket(): Socket {
    return this._socket;
  }
}
