import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from "../views/pages/Home.page";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
