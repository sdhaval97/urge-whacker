import { useState, useEffect, useRef } from 'react'
import Mole from './Mole'
import './GameCanvas.css'

const GAME_DURATION = 60
const GRID_SIZE = 9
const MIN_SPAWN_TIME = 400
const MAX_SPAWN_TIME = 1000
const MOLE_STAY_TIME = 800

function GameCanvas({ onGameOver }) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [moles, setMoles] = useState(Array(GRID_SIZE).fill({ visible: false, whacked: false }))
  const [gameActive, setGameActive] = useState(true)
  
  const timerRef = useRef(null)
  const moleTimerRef = useRef(null)

  // Game Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  // Mole Spawning Logic
  useEffect(() => {
    if (!gameActive) return

    const spawnMole = () => {
      const randomHole = Math.floor(Math.random() * GRID_SIZE)
      
      setMoles(prev => {
        const newMoles = [...prev]
        // Only spawn if not already visible
        if (!newMoles[randomHole].visible) {
          newMoles[randomHole] = { visible: true, whacked: false }
          
          // Schedule hide
          setTimeout(() => {
            setMoles(current => {
              const updated = [...current]
              if (updated[randomHole] && !updated[randomHole].whacked) {
                updated[randomHole] = { ...updated[randomHole], visible: false }
              }
              return updated
            })
          }, MOLE_STAY_TIME)
        }
        return newMoles
      })

      // Schedule next spawn
      const nextSpawn = Math.random() * (MAX_SPAWN_TIME - MIN_SPAWN_TIME) + MIN_SPAWN_TIME
      moleTimerRef.current = setTimeout(spawnMole, nextSpawn)
    }

    spawnMole()

    return () => clearTimeout(moleTimerRef.current)
  }, [gameActive])

  const endGame = () => {
    setGameActive(false)
    clearInterval(timerRef.current)
    clearTimeout(moleTimerRef.current)
    onGameOver(score)
  }

  const handleWhack = (index) => {
    if (!moles[index].visible || moles[index].whacked || !gameActive) return

    setScore(s => s + 10)
    setMoles(prev => {
      const newMoles = [...prev]
      newMoles[index] = { ...newMoles[index], whacked: true }
      return newMoles
    })

    // Hide quickly after whack
    setTimeout(() => {
      setMoles(prev => {
        const newMoles = [...prev]
        newMoles[index] = { visible: false, whacked: false }
        return newMoles
      })
    }, 200)
  }

  return (
    <div className="game-canvas">
      <div className="hud">
        <div className="score">Score: {score}</div>
        <div className={`timer ${timeLeft < 10 ? 'danger' : ''}`}>Time: {timeLeft}s</div>
      </div>

      <div className="mole-grid">
        {moles.map((mole, idx) => (
          <Mole 
            key={idx}
            isVisible={mole.visible}
            isWhacked={mole.whacked}
            onWhack={() => handleWhack(idx)}
          />
        ))}
      </div>
    </div>
  )
}

export default GameCanvas
