import { useState } from 'react'

export default function AddTaskInput({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title, dueDate })
    setTitle('')
    setDueDate('')
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a task and press Enter…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        title="Due date (optional)"
      />
      <button type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  )
}
