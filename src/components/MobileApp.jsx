import { useState, useEffect, useRef, useMemo } from 'react'
import Icon from './Icons.jsx'
import { SMART_VIEWS, formatTaskDate, isOverdue } from '../lib/utils.js'
import { Toggle, DateChips, TimeChips, PriorityChips, Picker, SubtasksEditor } from './DetailPopover.jsx'

// ── Home tile ────────────────────────────────────────────────────────────────
const HomeTile = ({ tile, count, onClick }) => (
  <div onClick={onClick} className="r-tile" style={{
    background: 'var(--surface)', borderRadius: 12,
    padding: '14px 14px 12px', minHeight: 96,
    display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 30, height: 30, borderRadius: 999, background: tile.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={tile.icon} size={tile.id === 'today' ? 15 : 17} filled color="white" />
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', fontFamily: 'var(--font-rounded)' }}>{count}</div>
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' }}>{tile.label}</div>
  </div>
)

// ── Home screen ──────────────────────────────────────────────────────────────
const HomeScreen = ({ state, setState, counts }) => {
  const open = (sel) => setState(s => ({ ...s, selected: sel, detailId: null, mobileScreen: 'list' }))
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '12px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ fontSize: 17, color: 'var(--tint)' }}>Edit</button>
        <button
          onClick={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
          style={{ fontSize: 17, color: 'var(--tint)' }}
        >
          <Icon name={state.theme === 'light' ? 'moon' : 'sun'} size={18} color="var(--tint)" />
        </button>
      </div>

      <div style={{
        margin: '8px 18px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10,
        color: 'var(--ink-3)', fontSize: 16,
      }}>
        <Icon name="search" size={15} color="var(--ink-3)" />
        <span style={{ flex: 1 }}>Search</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px 12px' }}>
        {SMART_VIEWS.map(sv => (
          <HomeTile key={sv.id} tile={sv} count={counts[sv.id] || 0} onClick={() => open({ type: sv.id })} />
        ))}
      </div>

      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', padding: '14px 18px 8px', fontFamily: 'var(--font-rounded)', color: 'var(--ink)' }}>
        My Lists
      </div>
      <div style={{ margin: '0 18px', background: 'var(--surface)', borderRadius: 12, overflow: 'hidden' }}>
        {state.lists.map((l, i) => (
          <div key={l.id} className="r-tile" onClick={() => open({ type: 'list', id: l.id })} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', minHeight: 44,
            borderTop: i === 0 ? 'none' : '0.5px solid var(--separator-2)',
          }}>
            <div style={{ width: 30, height: 30, borderRadius: 999, background: l.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="list" size={14} color="white" stroke={2.3} />
            </div>
            <span style={{ flex: 1, fontSize: 16, color: 'var(--ink)' }}>{l.name}</span>
            <span style={{ fontSize: 15, color: 'var(--ink-3)' }}>{counts.lists?.[l.id] || 0}</span>
            <Icon name="chevron" size={13} color="var(--ink-4)" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mobile task row ──────────────────────────────────────────────────────────
const MobileTaskRow = ({ task, list, tint, smartView, onToggle, onSelect }) => {
  const overdue = isOverdue(task.dueDate, task.dueTime, task.done)
  const dateStr = formatTaskDate(task.dueDate, task.dueTime)
  return (
    <div onClick={() => onSelect(task.id)} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '11px 16px', borderTop: '0.5px solid var(--separator-2)', minHeight: 48,
    }}>
      <button
        onClick={e => { e.stopPropagation(); onToggle(task.id) }}
        style={{
          width: 22, height: 22, borderRadius: 999,
          border: `1.6px solid ${task.done ? tint : 'var(--ink-4)'}`,
          background: task.done ? tint : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: '0 0 22px', marginTop: 1,
        }}
      >
        {task.done && <Icon name="check" size={12} color="white" stroke={3} />}
      </button>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {task.priority > 0 && <span style={{ color: tint, fontWeight: 600, fontSize: 16, marginRight: 4 }}>{'!'.repeat(task.priority)}</span>}
          <span style={{ fontSize: 16, color: task.done ? 'var(--ink-3)' : 'var(--ink)', textDecoration: task.done ? 'line-through' : 'none', flex: 1 }}>{task.title}</span>
          {task.flagged && <Icon name="flag-small" size={14} color="var(--c-orange)" />}
        </div>
        {task.notes ? <div style={{ fontSize: 13.5, color: 'var(--ink-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.notes}</div> : null}
        {dateStr ? <div style={{ fontSize: 13.5, color: overdue ? 'var(--c-red)' : 'var(--ink-3)' }}>{dateStr}</div> : null}
        {smartView && list ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--ink-3)', marginTop: 1 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: list.color }} />
            <span>{list.name}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ── List view (slides in) ────────────────────────────────────────────────────
const ListView = ({ open, state, setState, filtered, tint, headerTitle, headerSub, smartView, toggleTask, addTask, listForTask }) => {
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { if (adding) inputRef.current?.focus() }, [adding])

  const back = () => setState(s => ({ ...s, mobileScreen: 'home', detailId: null }))
  const submitNew = () => {
    if (newTitle.trim()) addTask(newTitle.trim())
    setNewTitle(''); setAdding(false)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--bg-grouped)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform .26s cubic-bezier(.2,.7,.3,1)',
      zIndex: 20,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px' }}>
        <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', color: 'var(--tint)', fontSize: 17 }}>
          <Icon name="chevron" size={16} color="var(--tint)" style={{ transform: 'rotate(180deg)' }} stroke={2.4} />
          Lists
        </button>
        <button style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tint)', padding: '6px 8px' }}>⋯</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 100px' }}>
        <div style={{ padding: '4px 4px 16px' }}>
          <div style={{ fontFamily: 'var(--font-rounded)', fontSize: 34, fontWeight: 700, color: tint, letterSpacing: '-0.02em' }}>{headerTitle}</div>
          {headerSub && <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 2 }}>{headerSub}</div>}
        </div>

        {filtered.length === 0 && !adding ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>No Reminders</div>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 12, overflow: 'hidden' }}>
            {filtered.map((t, i) => (
              <MobileTaskRow
                key={t.id}
                task={t}
                list={listForTask(t)}
                tint={tint}
                smartView={smartView}
                onToggle={toggleTask}
                onSelect={id => setState(s => ({ ...s, detailId: id }))}
              />
            ))}
            {adding && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderTop: filtered.length ? '0.5px solid var(--separator-2)' : 'none', minHeight: 48 }}>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: '1.6px solid var(--ink-4)', flex: '0 0 22px' }} />
                <input
                  ref={inputRef}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitNew(); if (e.key === 'Escape') setAdding(false) }}
                  onBlur={() => { if (newTitle.trim()) submitNew(); else setAdding(false) }}
                  placeholder="New Reminder"
                  style={{ fontSize: 16, color: 'var(--ink)' }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setAdding(true)}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          width: 56, height: 56, borderRadius: 999,
          background: tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,.18)',
        }}
      >
        <Icon name="plus" size={24} color="white" stroke={2.5} />
      </button>
    </div>
  )
}

// ── Detail bottom sheet ──────────────────────────────────────────────────────
const DetailSheet = ({ task, list, lists, tint, onClose, onUpdate, onDelete }) => {
  const [editTitle, setEditTitle] = useState(task?.title || '')
  const [editNotes, setEditNotes] = useState(task?.notes || '')
  useEffect(() => { if (task) { setEditTitle(task.title); setEditNotes(task.notes || '') } }, [task?.id])

  const open = !!task
  const commit = (patch) => task && onUpdate(task.id, patch)

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: open ? 'rgba(0,0,0,.4)' : 'rgba(0,0,0,0)',
          transition: 'background .2s',
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 45,
        }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-grouped)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .25s cubic-bezier(.2,.7,.3,1)',
        zIndex: 50,
        borderTopLeftRadius: 14, borderTopRightRadius: 14,
        maxHeight: '92%',
        overflow: 'auto',
        padding: '12px 18px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 -10px 40px rgba(0,0,0,.18)',
      }}>
        {task && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={onClose} style={{ fontSize: 16, color: 'var(--tint)' }}>Done</button>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-2)' }}>Details</div>
              <button onClick={() => { onDelete(task.id); onClose() }} style={{ fontSize: 16, color: 'var(--c-red)' }}>Delete</button>
            </div>

            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => commit({ title: editTitle })}
              placeholder="Title"
              style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}
            />
            <textarea
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              onBlur={() => commit({ notes: editNotes })}
              placeholder="Notes"
              rows={3}
              style={{ fontSize: 15, color: 'var(--ink-2)', resize: 'none', lineHeight: 1.45 }}
            />

            <div style={{ background: 'var(--surface)', borderRadius: 12 }}>
              <MobileDetailRow icon="scheduled" iconBg="var(--c-red)" label="Date">
                <DateChips value={task.dueDate} onChange={v => commit({ dueDate: v })} />
              </MobileDetailRow>
              <MobileDetailRow icon="today" iconBg="var(--c-blue)" label="Time" sep>
                <TimeChips value={task.dueTime} onChange={v => commit({ dueTime: v })} disabled={!task.dueDate} />
              </MobileDetailRow>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: 12 }}>
              <MobileDetailRow icon="flagged" iconBg="var(--c-orange)" label="Flag">
                <Toggle value={task.flagged} onChange={v => commit({ flagged: v })} />
              </MobileDetailRow>
              <MobileDetailRow icon="!" iconBg="var(--c-red)" label="Priority" sep>
                <PriorityChips value={task.priority} onChange={v => commit({ priority: v })} />
              </MobileDetailRow>
              <MobileDetailRow icon="repeat" iconBg="var(--c-purple)" label="Repeat" sep>
                <Picker
                  opts={[{ label: 'Never', val: null }, { label: 'Daily', val: 'daily' }, { label: 'Weekly', val: 'weekly' }, { label: 'Monthly', val: 'monthly' }]}
                  value={task.recurring}
                  onChange={v => commit({ recurring: v })}
                />
              </MobileDetailRow>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: 12 }}>
              <MobileDetailRow icon="list" iconBg={list?.color || 'var(--c-gray)'} label="List">
                <Picker
                  opts={lists.map(l => ({ label: l.name, val: l.id, color: l.color }))}
                  value={task.listId}
                  onChange={v => commit({ listId: v })}
                />
              </MobileDetailRow>
            </div>

            <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '4px 0' }}>
              <SubtasksEditor task={task} tint={tint} onUpdate={commit} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

const MobileDetailRow = ({ icon, iconBg, label, children, sep }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 14px',
    borderTop: sep ? '0.5px solid var(--separator-2)' : 'none',
    minHeight: 44,
  }}>
    <div style={{
      width: 26, height: 26, borderRadius: 6, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: 14, flex: '0 0 26px',
    }}>
      {icon === '!' ? '!' : icon === 'repeat' ? '↻' : <Icon name={icon} size={15} filled color="white" />}
    </div>
    <span style={{ fontSize: 15, color: 'var(--ink)', flex: 1 }}>{label}</span>
    {children}
  </div>
)

// ── MobileApp root ───────────────────────────────────────────────────────────
export default function MobileApp({ state, setState, counts, filtered, tint, headerTitle, headerSub, smartView, addTask, toggleTask, updateTask, deleteTask, listForTask }) {
  const mobileScreen = state.mobileScreen || 'home'
  const detailTask = state.detailId ? state.tasks.find(t => t.id === state.detailId) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--ink)', overflow: 'hidden', position: 'relative' }}>
      <HomeScreen state={state} setState={setState} counts={counts} />
      <ListView
        open={mobileScreen === 'list'}
        state={state}
        setState={setState}
        filtered={filtered}
        tint={tint}
        headerTitle={headerTitle}
        headerSub={headerSub}
        smartView={smartView}
        toggleTask={toggleTask}
        addTask={addTask}
        listForTask={listForTask}
      />
      <DetailSheet
        task={detailTask}
        list={detailTask ? state.lists.find(l => l.id === detailTask.listId) : null}
        lists={state.lists}
        tint={tint}
        onClose={() => setState(s => ({ ...s, detailId: null }))}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  )
}
