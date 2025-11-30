import HabitCard from './HabitCard'

function Dashboard({ userStats, habits, onAttack, onDamage }) {
  const hpPercent = (userStats.hp / userStats.maxHp) * 100
  const xpPercent = (userStats.xp / userStats.maxXp) * 100

  return (
    <div className="dashboard">
      <div className="stats-bar card">
        <div className="level-badge">
          <span className="label">LEVEL</span>
          <span className="value">{userStats.level}</span>
        </div>
        
        <div className="bars-container">
          <div className="stat-row">
            <div className="stat-label">HP {userStats.hp}/{userStats.maxHp}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill hp-fill" 
                style={{ width: `${hpPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">XP {userStats.xp}/{userStats.maxXp}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill xp-fill" 
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        {habits.length === 0 ? (
          <div className="empty-state">
            <h3>No Monsters Found</h3>
            <p>The realm is safe... for now. Summon a monster below to start fighting!</p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onAttack={onAttack} 
              onDamage={onDamage} 
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
