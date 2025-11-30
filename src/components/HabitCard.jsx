function HabitCard({ habit, onAttack, onDamage }) {
  const hpPercent = (habit.hp / habit.maxHp) * 100
  
  // Simple mapping of types to emojis/icons
  const getIcon = (type) => {
    switch(type) {
      case 'slime': return '💧';
      case 'goblin': return '👺';
      case 'dragon': return '🐉';
      case 'ghost': return '👻';
      case 'skeleton': return '💀';
      default: return '👾';
    }
  }

  return (
    <div className="card habit-card">
      <div className="monster-icon">{getIcon(habit.monsterType)}</div>
      <h3>{habit.name}</h3>
      <div className="monster-type">Lvl {Math.floor(habit.streak / 5) + 1} {habit.monsterType}</div>
      
      <div className="monster-stats">
        <div className="stat-label">HP {habit.hp}/{habit.maxHp}</div>
        <div className="progress-bar">
          <div 
            className="progress-fill monster-hp-fill" 
            style={{ width: `${hpPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="actions">
        <button 
          className="btn-attack" 
          onClick={() => onAttack(habit.id)}
          title="I resisted this habit today!"
        >
          ⚔️ Attack
        </button>
        <button 
          className="btn-damage" 
          onClick={() => onDamage(habit.id)}
          title="I slipped up..."
        >
          💔 Slipped
        </button>
      </div>
    </div>
  )
}

export default HabitCard
