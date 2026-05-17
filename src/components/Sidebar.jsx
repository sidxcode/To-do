import { useState } from 'react'

export default function Sidebar({
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
  taskCounts,
}) {
  const [newListName, setNewListName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onAddList(newListName)
    setNewListName('')
  }

  return (
    <aside className="sidebar">
      <h2>Lists</h2>

      <div>
        {lists.map((list) => (
          <button
            key={list.id}
            className={`list-button ${list.id === activeListId ? 'active' : ''}`}
            onClick={() => onSelectList(list.id)}
          >
            <span>{list.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {taskCounts[list.id] ? (
                <span className="count">{taskCounts[list.id]}</span>
              ) : null}
              <span
                role="button"
                className="delete"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Delete list "${list.name}" and all its tasks?`)) {
                    onDeleteList(list.id)
                  }
                }}
                title="Delete list"
              >
                ×
              </span>
            </span>
          </button>
        ))}
      </div>

      <form className="add-list" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New list…"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button type="submit" disabled={!newListName.trim()}>
          +
        </button>
      </form>
    </aside>
  )
}
