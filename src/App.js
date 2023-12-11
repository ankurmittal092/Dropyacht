import logo from "./logo.svg";
import "./App.css";
import { MatchGame } from "./match-game";
function App() {
  return (
    <div className="App">
      <MatchGame rows={4} columns={4} matchSize={2} />
    </div>
  );
}

export default App;
