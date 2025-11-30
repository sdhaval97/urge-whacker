import { useState, useEffect, useRef } from 'react'
import './App.css'
import ChainSimulation from './components/ChainSimulation'

function App() {
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('physics-chain-streak') || '0')
  })
  
  const chainRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('physics-chain-streak', streak.toString())
  }, [streak])

  const handleComplete = () => {
    setStreak(s => s + 1)
    if (chainRef.current) {
      chainRef.current.addLink()
    }
  }

  const handleReset = () => {
    if (confirm("Break the chain?")) {
      setStreak(0)
      window.location.reload() // Easiest way to clear physics world for now
    }
  }

  return (
    <div className="app-container">
      <ChainSimulation ref={chainRef} linkCount={streak} />
      
      <div className="ui-overlay">
        <header>
          <h1>Chain Reaction</h1>
          <div className="streak-counter">
            <span className="count">{streak}</span>
            <span className="label">LINKS</span>
          </div>
        </header>

        <div className="controls">
          <button className="btn-complete" onClick={handleComplete}>
            + Add Link
          </button>
          
          {streak > 0 && (
            <button className="btn-reset" onClick={handleReset}>
              Break Chain
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
