import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MainView from './components/MainView.jsx'
import DetailPopover from './components/DetailPopover.jsx'
import MobileApp from './components/MobileApp.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import { supabase } from './lib/supabase.js'
import { uid, todayISO } from './lib/utils.js'

// ── DB ↔ app mapping ─────────────────────────────────────────────────────────

function dbToList(r) {
  return { id: r.id, name: r.name, color: r.color, icon: r.icon }
}

function listToDb(list, userId) {
  return { id: list.id, user_id: userId, name: list.name, color: list.color, icon: list.icon }
}

function dbToTask(r) {
  return {
    id: r.id, listId: r.list_id, title: r.title, notes: r.notes,
    done: r.done, doneAt: r.done_at,
    dueDate: r.due_date, dueTime: r.due_time,
    priority: r.priority, flagged: r.flagged, recurring: r.recurring,
    subtasks: r.subtasks || [], createdAt: r.created_at,
  }
}

function taskToDb(task, userId) {
  return {
    id: task.id, user_id: userId, list_id: task.listId,
    title: task.title, notes: task.notes,
    done: task.done, done_at: task.doneAt,
    due_date: task.dueDate, due_time: task.dueTime,
    priority: task.priority, flagged: task.flagged, recurring: task.recurring,
    subtasks: task.subtasks || [], created_at: task.createdAt,
  }
}

const TASK_COL = {
  listId: 'list_id', dueDate: 'due_date', dueTime: 'due_time',
  doneAt: 'done_at', createdAt: 'created_at',
}

function patchToDb(patch) {
  const out = {}
  for (const [k, v] of Object.entries(patch)) out[TASK_COL[k] || k] = v
  return out
}

// ── Initial UI state (no data — loaded from Supabase) ───────────────────────

const INITIAL_STATE = {
  theme: 'light',
  selected: { type: 'today' },
  detailId: null,
  showCompleted: false,
  mobileScreen: 'list',
  lists: [],
  tasks: [],
}

const LIST_COLORS = [
  'var(--c-blue)', 'var(--c-orange)', 'var(--c-green)',
  'var(--c-pink)', 'var(--c-purple)', 'var(--c-red)', 'var(--c-mint)',
]

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState(INITIAL_STATE)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches)

  // Apply theme
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

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load data when user logs in / out
  useEffect(() => {
    if (user) {
      loadData(user.id)
    } else {
      setState(s => ({ ...s, lists: [], tasks: [] }))
    }
  }, [user?.id])

  async function loadData(userId) {
    const [{ data: listsData }, { data: tasksData }] = await Promise.all([
      supabase.from('lists').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('tasks').select('*').eq('user_id', userId).order('created_at'),
    ])

    let lists = (listsData || []).map(dbToList)

    // First-time user: create a default list
    if (lists.length === 0) {
      const defaultList = { id: uid(), name: 'Reminders', color: 'var(--c-blue)', icon: 'list' }
      await supabase.from('lists').insert(listToDb(defaultList, userId))
      lists = [defaultList]
    }

    setState(s => ({
      ...s,
      lists,
      tasks: (tasksData || []).map(dbToTask),
    }))
  }

  // ── Derived counts ─────────────────────────────────────────────────────────
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

  // ── Filtered tasks ─────────────────────────────────────────────────────────
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

  // ── Header info ────────────────────────────────────────────────────────────
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

  useEffect(() => {
    document.documentElement.style.setProperty('--tint', headerInfo.tint)
  }, [headerInfo.tint])

  // ── Task mutations ─────────────────────────────────────────────────────────

  function addTask(title) {
    const { selected } = state
    let dueDate = null
    let listId = state.lists[0]?.id || null
    let flagged = false
    if (selected.type === 'today' || selected.type === 'scheduled') dueDate = todayISO(0)
    if (selected.type === 'flagged') flagged = true
    if (selected.type === 'list') listId = selected.id

    const task = {
      id: uid(), title, notes: '', done: false,
      dueDate, dueTime: null, priority: 0, flagged,
      listId, recurring: null, subtasks: [], createdAt: Date.now(),
    }
    setState(s => ({ ...s, tasks: [...s.tasks, task] }))
    supabase.from('tasks').insert(taskToDb(task, user.id))
      .then(({ error }) => { if (error) console.error('addTask:', error) })
  }

  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id)
    const patch = { done: !task.done, doneAt: !task.done ? Date.now() : null }
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch } : t),
    }))
    supabase.from('tasks').update(patchToDb(patch)).eq('id', id)
      .then(({ error }) => { if (error) console.error('toggleTask:', error) })
  }

  function updateTask(id, patch) {
    setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch } : t) }))
    supabase.from('tasks').update(patchToDb(patch)).eq('id', id)
      .then(({ error }) => { if (error) console.error('updateTask:', error) })
  }

  function deleteTask(id) {
    setState(s => ({
      ...s,
      tasks: s.tasks.filter(t => t.id !== id),
      detailId: s.detailId === id ? null : s.detailId,
    }))
    supabase.from('tasks').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('deleteTask:', error) })
  }

  // ── List mutations ─────────────────────────────────────────────────────────

  function addList(name) {
    const color = LIST_COLORS[Math.floor(Math.random() * LIST_COLORS.length)]
    const list = { id: uid(), name, color, icon: 'list' }
    setState(s => ({ ...s, lists: [...s.lists, list] }))
    supabase.from('lists').insert(listToDb(list, user.id))
      .then(({ error }) => { if (error) console.error('addList:', error) })
    return list.id
  }

  function deleteList(id) {
    setState(s => ({
      ...s,
      lists: s.lists.filter(l => l.id !== id),
      selected: s.selected.type === 'list' && s.selected.id === id ? { type: 'today' } : s.selected,
    }))
    supabase.from('lists').delete().eq('id', id)
      .then(({ error }) => { if (error) console.error('deleteList:', error) })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setState(INITIAL_STATE)
  }

  // ── Shared props ───────────────────────────────────────────────────────────

  const listForTask = (t) => state.lists.find(l => l.id === t.listId)
  const detailTask = state.detailId ? state.tasks.find(t => t.id === state.detailId) : null

  const sharedProps = {
    state, setState, counts, filtered,
    tint: headerInfo.tint,
    headerTitle: headerInfo.title,
    headerSub: headerInfo.sub,
    smartView: headerInfo.smart,
    addTask, toggleTask, updateTask, deleteTask, listForTask,
    addList, deleteList, user, onSignOut: signOut,
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>Loading…</div>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  if (isMobile) return <MobileApp {...sharedProps} />

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
