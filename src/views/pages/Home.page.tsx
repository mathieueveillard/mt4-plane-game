import { AppContext } from "../../App";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const {socket} = useContext(AppContext);

  if (socket === null) {
    return <h1>Vous n'avez pas pu vous connecter au serveur</h1>
  }

  return (
    <>
      <h1>Bonjour, voici votre identifiant: {socket.id}</h1>
      <Link to="/game">Aller il faut jouer maintenant</Link>
    </>
  )
}

export default HomePage
