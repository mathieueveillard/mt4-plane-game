import { useContext, useEffect, useRef, useState } from "react";
import MainGame from "../../../services/games/main.game";
import { AppContext } from "../../contexts/AppContext";


const MapGame = (props: any) => {
  const canvasRef = useRef(null)
  const [mainGame, setMainGame] = useState<MainGame|null>(null)

  const { socket, partyPlayers, enemyPosition, partyStatus } = useContext(AppContext);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const mainGameObject = new MainGame(canvas)

    // if (setOnShortEvent) {
    //   setOnShortEvent(onShot)
    // }

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


  switch (partyStatus) {
    case "starting":
      return (<canvas ref={canvasRef} {...props}/>)
    case "lost":
      return <h1>Looooooooser</h1>
    case "win":
      return <h1>Oh tu es le boss !</h1>
    default:
      return <>Une erreur est survenu</>
  }
}

export default MapGame

