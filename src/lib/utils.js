export const uid = () => Math.random().toString(36).slice(2, 9)

export const todayISO = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export const formatTaskDate = (iso, time) => {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((d - now) / 86400e3)
  let dateStr
  if (diff === 0) dateStr = 'Today'
  else if (diff === 1) dateStr = 'Tomorrow'
  else if (diff === -1) dateStr = 'Yesterday'
  else if (diff > 1 && diff < 7)
    dateStr = d.toLocaleDateString('en-US', { weekday: 'long' })
  else
    dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (time) {
    const [hh, mm] = time.split(':').map(Number)
    const h12 = ((hh + 11) % 12) + 1
    const ampm = hh < 12 ? 'AM' : 'PM'
    return `${dateStr}, ${h12}:${String(mm).padStart(2, '0')} ${ampm}`
  }
  return dateStr
}

export const isOverdue = (iso, time, done) => {
  if (!iso || done) return false
  const today = todayISO(0)
  if (iso < today) return true
  if (iso === today && time) {
    const [hh, mm] = time.split(':').map(Number)
    const now = new Date()
    return now.getHours() > hh || (now.getHours() === hh && now.getMinutes() > mm)
  }
  return false
}

export const isTaskToday = (t) => {
  if (t.done) return false
  if (!t.dueDate) return false
  return t.dueDate <= todayISO(0)
}

export const SMART_VIEWS = [
  { id: 'today',     label: 'Today',     color: 'var(--c-blue)',   icon: 'today' },
  { id: 'scheduled', label: 'Scheduled', color: 'var(--c-red)',    icon: 'scheduled' },
  { id: 'all',       label: 'All',       color: 'var(--c-gray)',   icon: 'all' },
  { id: 'flagged',   label: 'Flagged',   color: 'var(--c-orange)', icon: 'flagged' },
]

export const SEED_LISTS = [
  { id: 'reminders', name: 'Reminders',     color: 'var(--c-blue)',   icon: 'list' },
  { id: 'groceries', name: 'Groceries',     color: 'var(--c-orange)', icon: 'list' },
  { id: 'work',      name: 'Work',          color: 'var(--c-purple)', icon: 'list' },
  { id: 'home',      name: 'Home',          color: 'var(--c-green)',  icon: 'list' },
]

export const makeSeedTasks = () => [
  { id: uid(), title: 'Call dentist about Tuesday appointment', notes: '', done: false, dueDate: todayISO(0), dueTime: '11:00', priority: 0, flagged: false, listId: 'reminders', recurring: null, subtasks: [], createdAt: Date.now() - 8e6 },
  { id: uid(), title: 'Reply to Mira about the Figma comments', notes: 'She left notes in the onboarding section.', done: false, dueDate: todayISO(0), dueTime: null, priority: 2, flagged: true, listId: 'reminders', recurring: null, subtasks: [], createdAt: Date.now() - 6e6 },
  { id: uid(), title: 'Pick up dry cleaning', notes: '', done: false, dueDate: todayISO(1), dueTime: null, priority: 0, flagged: false, listId: 'reminders', recurring: null, subtasks: [], createdAt: Date.now() - 7e6 },
  { id: uid(), title: 'Oat milk', notes: '', done: false, dueDate: null, dueTime: null, priority: 0, flagged: false, listId: 'groceries', recurring: null, subtasks: [], createdAt: Date.now() - 1e7 },
  { id: uid(), title: 'Sourdough', notes: '', done: false, dueDate: null, dueTime: null, priority: 0, flagged: false, listId: 'groceries', recurring: null, subtasks: [], createdAt: Date.now() - 9e6 },
  { id: uid(), title: 'Olive oil', notes: '', done: false, dueDate: null, dueTime: null, priority: 0, flagged: false, listId: 'groceries', recurring: null, subtasks: [], createdAt: Date.now() - 7e6 },
  {
    id: uid(), title: 'Review Q3 design proposal', notes: 'Focus on the onboarding section.', done: false,
    dueDate: todayISO(0), dueTime: '15:00', priority: 2, flagged: false, listId: 'work', recurring: null,
    subtasks: [
      { id: uid(), title: "Re-read Mira's comments", done: true },
      { id: uid(), title: 'Sketch alternative for step 2', done: false },
      { id: uid(), title: 'Send revised draft', done: false },
    ], createdAt: Date.now() - 5e6,
  },
  { id: uid(), title: 'Prep slides for Thursday review', notes: '', done: false, dueDate: todayISO(2), dueTime: '09:00', priority: 3, flagged: true, listId: 'work', recurring: null, subtasks: [], createdAt: Date.now() - 4e6 },
  { id: uid(), title: 'Send invoice to Northbeam', notes: '', done: false, dueDate: todayISO(3), dueTime: null, priority: 2, flagged: false, listId: 'work', recurring: 'monthly', subtasks: [], createdAt: Date.now() - 3e6 },
  { id: uid(), title: 'Water the fiddle leaf', notes: '', done: false, dueDate: todayISO(0), dueTime: null, priority: 0, flagged: false, listId: 'home', recurring: 'weekly', subtasks: [], createdAt: Date.now() - 1.5e6 },
  { id: uid(), title: 'Replace kitchen lightbulb', notes: '', done: false, dueDate: todayISO(4), dueTime: null, priority: 0, flagged: false, listId: 'home', recurring: null, subtasks: [], createdAt: Date.now() - 1e6 },
  { id: uid(), title: 'Schedule HVAC service', notes: '', done: false, dueDate: null, dueTime: null, priority: 0, flagged: false, listId: 'home', recurring: null, subtasks: [], createdAt: Date.now() - 9e5 },
]
