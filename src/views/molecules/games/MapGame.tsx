import { useContext, useEffect, useRef, useState } from "react";
import MainGame from "../../../services/games/main.game";
import { AppContext } from "../../../App";
import { Socket } from "socket.io-client";


const MapGame = (props: any) => {
  const canvasRef = useRef(null)
  let mainGame: MainGame

  const { socket } = useContext(AppContext);

  useEffect(() => {
    if (socket !== null) {
      const canvas = canvasRef.current as unknown as HTMLCanvasElement

      mainGame = new MainGame(canvas)
      mainGame.startGame()

      updateMainGame(socket)
    }

    // setInterval(updateMainGame, 500);

  }, [])

  const updateMainGame = (socket: Socket) => {
    mainGame.update(socket)

    requestAnimationFrame(() => {updateMainGame(socket)});
  }


  return (<canvas ref={canvasRef} {...props}/>)
}

export default MapGame

