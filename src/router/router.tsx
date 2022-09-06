import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from "../views/pages/Home.page";
import GamePage from "../views/pages/Game.page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/game" element={<GamePage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
