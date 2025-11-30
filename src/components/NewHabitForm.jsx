import { useState } from 'react'

function NewHabitForm({ onAdd }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('slime')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    
    onAdd(name, type)
    setName('')
    setType('slime')
  }

  return (
    <div className="card new-habit-form">
      <h2>Summon New Monster</h2>
      <form onSubmit={handleSubmit} className="flex-center">
        <input 
          type="text" 
          placeholder="Bad Habit Name (e.g. Smoking)" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="slime">Slime (Easy)</option>
          <option value="goblin">Goblin (Medium)</option>
          <option value="skeleton">Skeleton (Medium)</option>
          <option value="ghost">Ghost (Hard)</option>
          <option value="dragon">Dragon (Boss)</option>
        </select>

        <button type="submit">Summon</button>
      </form>
    </div>
  )
}

export default NewHabitForm
