import { useState, useEffect, useRef } from 'react'

export default function TaskItem({ task, onToggle, onDelete, onUpdateTask }) {
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDueDate, setDraftDueDate] = useState(task.dueDate ?? '')
  const titleRef = useRef(null)

  const dueLabel = formatDueDate(task.dueDate)
  const overdue = isOverdue(task.dueDate, task.done)

  useEffect(() => {
    if (editing) titleRef.current?.focus()
  }, [editing])

  function startEdit() {
    setDraftTitle(task.title)
    setDraftDueDate(task.dueDate ?? '')
    setEditing(true)
  }

  function saveEdit() {
    const trimmed = draftTitle.trim()
    if (trimmed) {
      onUpdateTask(task.id, { title: trimmed, dueDate: draftDueDate || null })
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); saveEdit() }
    if (e.key === 'Escape') cancelEdit()
  }

  function handleBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) saveEdit()
  }

  if (editing) {
    return (
      <li className="task-item editing">
        <div className="task-edit-form" onBlur={handleBlur} onKeyDown={handleKeyDown}>
          <input
            ref={titleRef}
            type="text"
            className="edit-title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
          <input
            type="date"
            className="edit-date"
            value={draftDueDate}
            onChange={(e) => setDraftDueDate(e.target.value)}
            title="Due date"
          />
          <button className="edit-save" onClick={saveEdit} title="Save">✓</button>
          <button className="edit-cancel" onClick={cancelEdit} title="Cancel">✕</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />

      <span className="title">{task.title}</span>

      {dueLabel && (
        <span className={`due ${overdue ? 'overdue' : ''}`}>{dueLabel}</span>
      )}

      <button
        className="edit-btn"
        onClick={startEdit}
        title="Edit task"
        aria-label="Edit task"
      >
        ✎
      </button>

      <button
        className="delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  )
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function formatDueDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const today = stripTime(new Date())
  const due = stripTime(d)
  const diffDays = Math.round((due - today) / 86_400_000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) {
    return due.toLocaleDateString(undefined, { weekday: 'short' })
  }
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function isOverdue(iso, done) {
  if (!iso || done) return false
  const due = stripTime(new Date(iso))
  const today = stripTime(new Date())
  return due < today
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
