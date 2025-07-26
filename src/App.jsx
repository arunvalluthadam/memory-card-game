import GameBoard from './components/GameBoard.jsx';

function App() {
  return (
    <div className="game-board-container">
      <header>
        <h1>Memory Card Game</h1>
      </header>
      <main>
        <GameBoard />
      </main>
    </div>
  );
}

export default App;