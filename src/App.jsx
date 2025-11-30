import { useState, useEffect } from 'react'
import './App.css'
import GameCanvas from './components/GameCanvas'

function App() {
  const [gameState, setGameState] = useState('idle') // idle, playing, gameover
  const [lastScore, setLastScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('whack-high-score') || '0')
  })

  const startGame = () => {
    setGameState('playing')
  }

  const handleGameOver = (score) => {
    setLastScore(score)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('whack-high-score', score.toString())
    }
    setGameState('gameover')
  }

  return (
    <div className="app-container">
      <header>
        <h1>Urge Whacker 🔨</h1>
        <p>Distract your brain. Defeat the urge.</p>
      </header>

      <main>
        {gameState === 'idle' && (
          <div className="start-screen">
            <div className="high-score">High Score: {highScore}</div>
            <button className="btn-emergency" onClick={startGame}>
              🚨 I HAVE AN URGE! 🚨
            </button>
            <p className="hint">Play for 60 seconds to reset your focus.</p>
          </div>
        )}

        {gameState === 'playing' && (
          <GameCanvas onGameOver={handleGameOver} />
        )}

        {gameState === 'gameover' && (
          <div className="game-over-screen">
            <h2>Time's Up!</h2>
            <div className="final-score">Score: {lastScore}</div>
            {lastScore >= highScore && lastScore > 0 && (
              <div className="new-record">🏆 NEW RECORD! 🏆</div>
            )}
            
            <p className="check-in">How is the urge now?</p>
            
            <div className="actions">
              <button className="btn-primary" onClick={startGame}>
                Still there... Play Again
              </button>
              <button className="btn-secondary" onClick={() => setGameState('idle')}>
                I'm Good Now
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
