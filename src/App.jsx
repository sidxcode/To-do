import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MainView from './components/MainView.jsx'
import DetailPopover from './components/DetailPopover.jsx'
import MobileApp from './components/MobileApp.jsx'
import { uid, todayISO, isTaskToday, SEED_LISTS, makeSeedTasks } from './lib/utils.js'

const INITIAL_STATE = {
  theme: 'light',
  selected: { type: 'today' },
  detailId: null,
  showCompleted: false,
  mobileScreen: 'home',
  lists: SEED_LISTS,
  tasks: makeSeedTasks(),
}

export default function App() {
  const [state, setState] = useState(INITIAL_STATE)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches)

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  // Responsive breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Derived counts ───────────────────────────────────────────────────
  const counts = useMemo(() => {
    const today = todayISO(0)
    const inc = state.tasks.filter(t => !t.done)
    return {
      today: inc.filter(t => t.dueDate && t.dueDate <= today).length,
      scheduled: inc.filter(t => t.dueDate).length,
      all: inc.length,
      flagged: inc.filter(t => t.flagged).length,
      lists: Object.fromEntries(state.lists.map(l => [l.id, inc.filter(t => t.listId === l.id).length])),
    }
  }, [state.tasks, state.lists])

  // ── Filtered tasks for current view ─────────────────────────────────
  const filtered = useMemo(() => {
    const { selected, tasks, showCompleted } = state
    const show = (t) => !t.done || showCompleted
    const today = todayISO(0)
    switch (selected.type) {
      case 'today':     return tasks.filter(t => show(t) && t.dueDate && t.dueDate <= today)
      case 'scheduled': return tasks.filter(t => show(t) && t.dueDate)
      case 'all':       return tasks.filter(show)
      case 'flagged':   return tasks.filter(t => show(t) && t.flagged)
      case 'completed': return tasks.filter(t => t.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0))
      case 'list':      return tasks.filter(t => show(t) && t.listId === selected.id)
      default:          return tasks
    }
  }, [state])

  // ── Header info based on selection ──────────────────────────────────
  const headerInfo = useMemo(() => {
    const { selected } = state
    const now = new Date()
    switch (selected.type) {
      case 'today':     return { title: 'Today', sub: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), tint: 'var(--c-blue)', smart: true }
      case 'scheduled': return { title: 'Scheduled', sub: null, tint: 'var(--c-red)', smart: true }
      case 'all':       return { title: 'All', sub: null, tint: 'var(--c-gray)', smart: true }
      case 'flagged':   return { title: 'Flagged', sub: null, tint: 'var(--c-orange)', smart: true }
      case 'completed': return { title: 'Completed', sub: null, tint: 'var(--c-gray)', smart: true }
      case 'list': {
        const l = state.lists.find(x => x.id === selected.id)
        return { title: l?.name || '', sub: null, tint: l?.color || 'var(--c-blue)', smart: false }
      }
      default: return { title: '', sub: null, tint: 'var(--c-blue)', smart: false }
    }
  }, [state.selected, state.lists])

  // Apply tint CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--tint', headerInfo.tint)
  }, [headerInfo.tint])

  // ── Mutations ────────────────────────────────────────────────────────
  function addTask(title) {
    const { selected } = state
    let dueDate = null
    let listId = state.lists[0]?.id || null
    let flagged = false
    if (selected.type === 'today' || selected.type === 'scheduled') dueDate = todayISO(0)
    if (selected.type === 'flagged') flagged = true
    if (selected.type === 'list') listId = selected.id

    setState(s => ({
      ...s,
      tasks: [...s.tasks, {
        id: uid(), title, notes: '', done: false,
        dueDate, dueTime: null, priority: 0, flagged,
        listId, recurring: null, subtasks: [], createdAt: Date.now(),
      }],
    }))
  }

  function toggleTask(id) {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t =>
        t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : null } : t
      ),
    }))
  }

  function updateTask(id, patch) {
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch } : t) }))
  }

  function deleteTask(id) {
    setState(s => ({
      ...s,
      tasks: s.tasks.filter(t => t.id !== id),
      detailId: s.detailId === id ? null : s.detailId,
    }))
  }

  const listForTask = (t) => state.lists.find(l => l.id === t.listId)

  const detailTask = state.detailId ? state.tasks.find(t => t.id === state.detailId) : null

  const sharedProps = {
    state, setState, counts, filtered,
    tint: headerInfo.tint,
    headerTitle: headerInfo.title,
    headerSub: headerInfo.sub,
    smartView: headerInfo.smart,
    addTask, toggleTask, updateTask, deleteTask, listForTask,
  }

  if (isMobile) {
    return <MobileApp {...sharedProps} />
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--ink)',
    }}>
      <Sidebar {...sharedProps} />
      <MainView {...sharedProps} />
      <DetailPopover
        task={detailTask}
        list={detailTask ? state.lists.find(l => l.id === detailTask.listId) : null}
        lists={state.lists}
        tint={headerInfo.tint}
        onClose={() => setState(s => ({ ...s, detailId: null }))}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  )
}
