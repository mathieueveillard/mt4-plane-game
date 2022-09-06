import { Router } from './router/router';
import { createContext, useEffect, useState } from "react";
import { SocketDriver } from "./services/sockets/drivers/socket.driver";
import { Socket } from "socket.io-client";

export interface IAppContext { socket: Socket|null, setSocket: (socket: Socket) => void }

export const AppContext = createContext<IAppContext>({ socket: null, setSocket: (socket: Socket) => {} })

function App() {
  const [socket, setSocket] = useState<Socket|null>(null);


  useEffect(() => {
    const socketDriver = new SocketDriver()
    setSocket(socketDriver.socket)
    console.log(socketDriver.socket)
  }, []);


  return (
    <AppContext.Provider value={{ socket: socket, setSocket: setSocket }}>
      <Router/>
    </AppContext.Provider>
  );
}

export default App;
