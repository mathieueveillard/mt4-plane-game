import {useEffect, useRef, useState} from "react";
import MainGame from "../../../services/games/main.game";


const MapGame = (props: any) => {
  const canvasRef = useRef(null)
  let mainGame: MainGame

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement

    mainGame = new MainGame(canvas)
    mainGame.startGame()

    updateMainGame()

    // setInterval(updateMainGame, 500);

  }, [])

  const updateMainGame = () => {
    mainGame.update()

    requestAnimationFrame(() => {updateMainGame()});
  }


  return (<canvas ref={canvasRef} {...props}/>)
}

export default MapGame

