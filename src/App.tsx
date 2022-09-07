import { Router } from './router/router';
import AppContextContainer from "./views/contexts/AppContext";

function App() {
  return (
    <AppContextContainer>
      <Router/>
    </AppContextContainer>
  );
}

export default App;
