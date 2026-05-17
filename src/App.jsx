import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TaskList from './components/TaskList.jsx'
import AddTaskInput from './components/AddTaskInput.jsx'
import './App.css'

// ------------------------------------------------------------------
// Seed data so the app isn't empty on first load.
// All of this gets replaced by Supabase in a later step.
// ------------------------------------------------------------------
const SEED_LISTS = [
  { id: 'inbox', name: 'Inbox' },
  { id: 'today', name: 'Today' },
  { id: 'work', name: 'Work' },
]

const SEED_TASKS = [
  {
    id: crypto.randomUUID(),
    listId: 'inbox',
    title: 'Try adding your first task below',
    done: false,
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    listId: 'today',
    title: 'Check off a task to see it complete',
    done: false,
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    listId: 'work',
    title: 'Add a new list using the + button in the sidebar',
    done: true,
    dueDate: null,
    createdAt: new Date().toISOString(),
  },
]

export default function App() {
  const [lists, setLists] = useState(SEED_LISTS)
  const [tasks, setTasks] = useState(SEED_TASKS)
  const [activeListId, setActiveListId] = useState('inbox')

  // ---- Derived state -------------------------------------------------
  const activeList = useMemo(
    () => lists.find((l) => l.id === activeListId) ?? lists[0],
    [lists, activeListId],
  )

  const tasksForActiveList = useMemo(
    () =>
      tasks
        .filter((t) => t.listId === activeListId)
        // Incomplete first, then by creation time
        .sort((a, b) => {
          if (a.done !== b.done) return a.done ? 1 : -1
          return a.createdAt.localeCompare(b.createdAt)
        }),
    [tasks, activeListId],
  )

  // ---- Mutations -----------------------------------------------------
  function addTask({ title, dueDate }) {
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        listId: activeListId,
        title: trimmed,
        done: false,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function updateTask(id, { title, dueDate }) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, dueDate } : t)),
    )
  }

  function addList(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = trimmed.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36)
    setLists((prev) => [...prev, { id, name: trimmed }])
    setActiveListId(id)
  }

  function deleteList(id) {
    if (lists.length <= 1) return // always keep at least one list
    setLists((prev) => prev.filter((l) => l.id !== id))
    setTasks((prev) => prev.filter((t) => t.listId !== id))
    if (activeListId === id) {
      setActiveListId(lists[0].id)
    }
  }

  // ---- Render --------------------------------------------------------
  return (
    <div className="app-shell">
      <Sidebar
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onAddList={addList}
        onDeleteList={deleteList}
        taskCounts={countOpenTasksByList(tasks)}
      />
      <main className="main-pane">
        <header className="main-header">
          <h1>{activeList?.name ?? 'Tasks'}</h1>
          <p className="main-subhead">
            {tasksForActiveList.filter((t) => !t.done).length} open
          </p>
        </header>

        <AddTaskInput onAdd={addTask} />

        <TaskList
          tasks={tasksForActiveList}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdateTask={updateTask}
        />
      </main>
    </div>
  )
}

function countOpenTasksByList(tasks) {
  const counts = {}
  for (const t of tasks) {
    if (!t.done) counts[t.listId] = (counts[t.listId] ?? 0) + 1
  }
  return counts
}
