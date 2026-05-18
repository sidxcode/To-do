import { useState, useEffect, useRef, useMemo } from 'react'
import Icon from './Icons.jsx'
import { TaskWithSubs } from './TaskRow.jsx'
import { formatTaskDate } from '../lib/utils.js'

const FAB_PINK = '#FF2D55'

export default function MainView({
  state, setState, filtered, tint,
  headerTitle, headerSub, smartView,
  addTask, toggleTask, updateTask, deleteTask, listForTask,
}) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const newInputRef = useRef(null)

  useEffect(() => { if (adding) newInputRef.current?.focus() }, [adding])

  function submitNew() {
    if (newTitle.trim()) addTask(newTitle.trim())
    setNewTitle('')
    setAdding(false)
  }

  function cancel() {
    setNewTitle('')
    setAdding(false)
  }

  const groups = useMemo(() => {
    const sel = state.selected.type
    if (sel === 'scheduled') {
      const byDate = {}
      for (const t of filtered) {
        if (!t.dueDate) continue
        const k = formatTaskDate(t.dueDate, null)
        ;(byDate[k] = byDate[k] || []).push(t)
      }
      return Object.entries(byDate)
    }
    if (sel === 'today' || sel === 'flagged' || sel === 'all') {
      const byList = {}
      for (const t of filtered) {
        const k = t.listId || 'unsorted'
        ;(byList[k] = byList[k] || []).push(t)
      }
      return Object.entries(byList).map(([k, arr]) => {
        const list = state.lists.find(l => l.id === k)
        return [list?.name || 'Unsorted', arr, list]
      })
    }
    return null
  }, [filtered, state.selected, state.lists])

  const addRow = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', minHeight: 44,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 999, border: '1.6px solid var(--ink-4)', flex: '0 0 18px' }} />
      <input
        ref={newInputRef}
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submitNew(); if (e.key === 'Escape') cancel() }}
        onBlur={() => { if (newTitle.trim()) submitNew(); else cancel() }}
        placeholder="New Reminder"
        style={{ fontSize: 14, color: 'var(--ink)' }}
      />
    </div>
  )

  const renderTaskGroup = (items, groupTint, groupList, showAddRow) => (
    <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
      {items.map((t, i) => (
        <TaskWithSubs
          key={t.id}
          task={t}
          list={groupList || listForTask(t)}
          lists={state.lists}
          tint={groupTint}
          smartView={!groupList}
          onToggle={toggleTask}
          onSelect={id => setState(s => ({ ...s, detailId: id }))}
          onUpdate={updateTask}
          selected={state.detailId === t.id}
          isFirst={i === 0}
        />
      ))}
      {showAddRow && (
        <div style={{ borderTop: items.length ? '0.5px solid var(--separator-2)' : 'none' }}>
          {addRow}
        </div>
      )}
    </div>
  )

  return (
    <main style={{
      background: 'var(--bg-grouped)',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <header style={{ padding: '18px 28px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-rounded)',
            fontSize: 32, fontWeight: 700, color: tint,
            letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 2,
          }}>{headerTitle}</div>
          {headerSub && (
            <div style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-rounded)', fontWeight: 500 }}>
              {headerSub}
            </div>
          )}
        </div>
        <button
          className="r-toolbar-btn"
          onClick={() => setState(s => ({ ...s, showCompleted: !s.showCompleted }))}
          style={{ padding: '4px 8px', borderRadius: 6, fontSize: 13, color: 'var(--tint)', fontWeight: 500 }}
        >
          {state.showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 18px 90px' }}>
        {groups ? (
          <>
            {groups.map(([groupName, items, list], gi) => (
              <div key={gi} style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: list ? list.color : 'var(--ink-2)',
                  padding: '6px 10px 6px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {list && <span style={{ width: 8, height: 8, borderRadius: 999, background: list.color }} />}
                  {groupName}
                </div>
                {renderTaskGroup(items, list ? list.color : tint, list, false)}
              </div>
            ))}
            {adding && (
              <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
                {addRow}
              </div>
            )}
          </>
        ) : filtered.length === 0 && !adding ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>No Reminders</div>
            <div style={{ fontSize: 13 }}>Tap + to add one.</div>
          </div>
        ) : (
          renderTaskGroup(filtered, tint, null, adding)
        )}
        {filtered.length === 0 && adding && !groups && (
          <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
            {addRow}
          </div>
        )}
      </div>

      {/* FAB */}
      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 15 }}>
        <button
          className="r-fab"
          onMouseDown={e => { if (adding) e.preventDefault() }}
          onClick={() => adding ? cancel() : setAdding(true)}
          style={{
            background: adding ? FAB_PINK : 'var(--tint)',
            boxShadow: '0 4px 16px rgba(0,0,0,.18)',
            transition: 'background .2s ease, transform .15s ease, box-shadow .15s ease',
          }}
        >
          <div style={{
            position: 'absolute',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: adding ? 0 : 1,
            transform: adding ? 'rotate(45deg) scale(0.7)' : 'rotate(0deg) scale(1)',
            transition: 'opacity .18s ease, transform .18s ease',
          }}>
            <Icon name="plus" size={24} color="white" stroke={2.5} />
          </div>
          <div style={{
            position: 'absolute',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: adding ? 1 : 0,
            transform: adding ? 'rotate(0deg) scale(1)' : 'rotate(-45deg) scale(0.7)',
            transition: 'opacity .18s ease, transform .18s ease',
          }}>
            <Icon name="x" size={22} color="white" stroke={2.5} />
          </div>
        </button>
      </div>
    </main>
  )
}
