import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from "../views/pages/Home.page";
import GamePage from "../views/pages/Game.page";
import { AppContext } from "../App";

export const Router = () => {
  return (
    <AppContext.Consumer>
      {({ socket }) => {
        console.log({socket})

        return <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage socket={socket}/>}></Route>
            <Route path="/game" element={<GamePage socket={socket}/>}></Route>
          </Routes>
        </BrowserRouter>
      }}
    </AppContext.Consumer>
  )
}
