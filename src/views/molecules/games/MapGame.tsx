import { useContext, useEffect, useRef, useState } from "react";
import MainGame from "../../../services/games/main.game";
import { AppContext, IPosition } from "../../../App";
import { Socket } from "socket.io-client";


const MapGame = (props: any) => {
  const canvasRef = useRef(null)
  const [mainGame, setMainGame] = useState<MainGame|null>(null)

  const { socket, partyPlayers, enemyPosition } = useContext(AppContext);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const mainGameObject = new MainGame(canvas)

    setMainGame(mainGameObject)
  }, [])

  useEffect(() => {
    if (mainGame) {
      mainGame.updateEnemyPosition(enemyPosition)
    }
  }, [enemyPosition]);


  useEffect(() => {
    if (socket !== null && mainGame) {
      mainGame.startGame(socket, partyPlayers)

      updateMainGame()
    }
  }, [mainGame])

  const updateMainGame = () => {
    if (mainGame) {
      mainGame.update()
    }

    // TODO: remove setTimeout for production ?
    setTimeout(() => {
      updateMainGame()
      // requestAnimationFrame(() => {updateMainGame(socket)});
    }, 10)
  }


  return (<canvas ref={canvasRef} {...props}/>)
}

export default MapGame

