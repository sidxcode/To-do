import { useState, useEffect, useRef } from 'react'
import Icon, { RepeatIcon } from './Icons.jsx'
import { formatTaskDate, isOverdue, todayISO, uid } from '../lib/utils.js'

const SubRow = ({ sub, tint, onToggle }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 14px 8px 50px',
    borderTop: '0.5px solid var(--separator-2)',
    minHeight: 38,
  }}>
    <button
      onClick={onToggle}
      style={{
        width: 16, height: 16, borderRadius: 999,
        border: `1.4px solid ${sub.done ? tint : 'var(--ink-4)'}`,
        background: sub.done ? tint : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: '0 0 16px',
      }}
    >
      {sub.done && <Icon name="check" size={9} color="white" stroke={3} />}
    </button>
    <span style={{
      fontSize: 13.5,
      color: sub.done ? 'var(--ink-3)' : 'var(--ink-2)',
      textDecoration: sub.done ? 'line-through' : 'none',
      flex: 1,
    }}>{sub.title}</span>
  </div>
)

export function TaskWithSubs({ task, list, lists, tint, smartView, onToggle, onSelect, onUpdate, onDelete, selected, isFirst }) {
  const subs = task.subtasks || []
  return (
    <>
      <TaskRow
        task={task}
        list={list}
        lists={lists}
        tint={tint}
        smartView={smartView}
        onToggle={onToggle}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
        selected={selected}
        isFirst={isFirst}
      />
      {subs.map(s => (
        <SubRow
          key={s.id}
          sub={s}
          tint={tint}
          onToggle={() => {
            const newSubs = subs.map(x => x.id === s.id ? { ...x, done: !x.done } : x)
            onUpdate(task.id, { subtasks: newSubs })
          }}
        />
      ))}
    </>
  )
}

export default function TaskRow({ task, list, lists, tint, smartView, onToggle, onSelect, onUpdate, onDelete, selected, isFirst }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [expanded, setExpanded] = useState(false)
  const [editNotes, setEditNotes] = useState(task.notes || '')
  const [showListPicker, setShowListPicker] = useState(false)
  const inputRef = useRef(null)
  const rowRef = useRef(null)
  const dateInputRef = useRef(null)
  const timeInputRef = useRef(null)
  const pendingNotesRef = useRef(task.notes || '')

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  useEffect(() => {
    if (expanded) {
      const fresh = task.notes || ''
      setEditNotes(fresh)
      pendingNotesRef.current = fresh
    } else {
      if (pendingNotesRef.current !== (task.notes || '')) {
        onUpdate(task.id, { notes: pendingNotesRef.current })
      }
    }
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    function onMouseDown(e) {
      if (rowRef.current && !rowRef.current.contains(e.target)) {
        setExpanded(false)
        setShowListPicker(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [expanded])

  const overdue = isOverdue(task.dueDate, task.dueTime, task.done)
  const dateStr = formatTaskDate(task.dueDate, task.dueTime)

  const pillStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 999,
    fontSize: 12, fontWeight: 500,
    background: 'var(--surface-2)',
    color: 'var(--ink-3)',
    border: '0.5px solid var(--separator)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }

  function triggerDatePicker() {
    try { dateInputRef.current?.showPicker() } catch { dateInputRef.current?.click() }
  }

  function triggerTimePicker() {
    try { timeInputRef.current?.showPicker() } catch { timeInputRef.current?.click() }
  }

  return (
    <div
      ref={rowRef}
      className="r-task"
      onClick={() => setExpanded(v => !v)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: expanded ? '10px 14px 12px' : '10px 14px',
        borderTop: isFirst ? 'none' : '0.5px solid var(--separator-2)',
        cursor: 'pointer',
        background: selected ? 'var(--surface-2)' : 'transparent',
        minHeight: 44,
        position: 'relative',
      }}
    >
      <button
        className="r-check"
        onClick={e => { e.stopPropagation(); onToggle(task.id) }}
        style={{
          width: 18, height: 18, borderRadius: 999,
          border: `1.6px solid ${task.done ? tint : 'var(--ink-4)'}`,
          background: task.done ? tint : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2, flex: '0 0 18px',
        }}
      >
        {task.done && <Icon name="check" size={10} color="white" stroke={3} />}
      </button>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          {task.priority > 0 && (
            <span style={{ color: tint, fontWeight: 600, fontSize: 14, marginRight: 4 }}>
              {'!'.repeat(task.priority)}
            </span>
          )}
          {editing ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => { setEditing(false); if (editTitle.trim() && editTitle !== task.title) onUpdate(task.id, { title: editTitle.trim() }) }}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }}
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 14, color: 'var(--ink)', flex: 1 }}
            />
          ) : (
            <span
              style={{
                fontSize: 14,
                color: task.done ? 'var(--ink-3)' : 'var(--ink)',
                textDecoration: task.done ? 'line-through' : 'none',
                textDecorationColor: 'var(--ink-3)',
                lineHeight: 1.35, flex: 1,
              }}
              onDoubleClick={e => { e.stopPropagation(); setEditTitle(task.title); setEditing(true) }}
            >
              {task.title}
            </span>
          )}
          {task.flagged && (
            <span style={{ color: 'var(--c-orange)', marginLeft: 8, flex: '0 0 14px' }}>
              <Icon name="flag-small" size={13} color="var(--c-orange)" />
            </span>
          )}
        </div>

        {expanded ? (
          <textarea
            value={editNotes}
            onChange={e => { setEditNotes(e.target.value); pendingNotesRef.current = e.target.value }}
            onBlur={() => {
              if (pendingNotesRef.current !== (task.notes || '')) {
                onUpdate(task.id, { notes: pendingNotesRef.current })
              }
            }}
            onKeyDown={e => {
              if (e.key === '/') {
                e.preventDefault()
                const text = editNotes.trim()
                const newSub = { id: uid(), title: text || 'New subtask', done: false }
                const updated = { subtasks: [...(task.subtasks || []), newSub] }
                if (text) updated.notes = ''
                onUpdate(task.id, updated)
                setEditNotes('')
                pendingNotesRef.current = ''
              }
            }}
            onClick={e => e.stopPropagation()}
            placeholder="Notes  ·  type / to add a subtask"
            rows={2}
            style={{
              fontSize: 13, color: 'var(--ink-2)', resize: 'none',
              lineHeight: 1.45, marginTop: 4,
              background: 'transparent', border: 'none', outline: 'none',
              width: '100%', fontFamily: 'inherit',
            }}
          />
        ) : (
          task.notes ? (
            <div style={{
              fontSize: 12.5, color: 'var(--ink-3)',
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}>{task.notes}</div>
          ) : null
        )}

        {(dateStr || task.recurring) ? (
          <div style={{
            fontSize: 12.5,
            color: overdue ? 'var(--c-red)' : 'var(--ink-3)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {dateStr}
            {task.recurring && (
              <>
                <span style={{ opacity: .4 }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <RepeatIcon size={11} />
                  {task.recurring}
                </span>
              </>
            )}
          </div>
        ) : null}

        {smartView && list ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: list.color, flex: '0 0 8px' }} />
            <span>{list.name}</span>
          </div>
        ) : null}

        {expanded && (
          <div
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}
          >
            {/* Hidden date input */}
            <input
              ref={dateInputRef}
              type="date"
              value={task.dueDate || ''}
              min={todayISO(0)}
              onChange={e => onUpdate(task.id, { dueDate: e.target.value || null })}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />

            {/* Date pill */}
            <button
              onClick={triggerDatePicker}
              style={{
                ...pillStyle,
                color: task.dueDate ? (overdue ? 'var(--c-red)' : 'var(--tint)') : 'var(--ink-3)',
              }}
            >
              <Icon name="scheduled" size={11} color={task.dueDate ? (overdue ? 'var(--c-red)' : 'var(--tint)') : 'var(--ink-3)'} />
              {task.dueDate ? formatTaskDate(task.dueDate, null) : 'Add Date'}
            </button>

            {/* Hidden time input */}
            <input
              ref={timeInputRef}
              type="time"
              value={task.dueTime || ''}
              onChange={e => onUpdate(task.id, { dueTime: e.target.value || null })}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />

            {/* Time pill */}
            <button
              onClick={() => { if (task.dueDate) triggerTimePicker() }}
              style={{
                ...pillStyle,
                opacity: task.dueDate ? 1 : 0.4,
                cursor: task.dueDate ? 'pointer' : 'default',
                color: task.dueTime ? 'var(--tint)' : 'var(--ink-3)',
              }}
            >
              <Icon name="today" size={11} color={task.dueTime ? 'var(--tint)' : 'var(--ink-3)'} />
              {task.dueTime || 'Add Time'}
            </button>

            {/* List picker pill */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowListPicker(v => !v)}
                style={{
                  ...pillStyle,
                  color: list ? list.color : 'var(--ink-3)',
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: 999, flex: '0 0 7px',
                  background: list ? list.color : 'var(--ink-4)',
                }} />
                {list ? list.name : 'List'}
              </button>
              {showListPicker && lists?.length > 0 && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, zIndex: 30,
                  background: 'var(--surface)',
                  borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,.15), 0 0 0 0.5px var(--separator)',
                  padding: '4px 0',
                  minWidth: 140,
                }}>
                  {lists.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { onUpdate(task.id, { listId: l.id }); setShowListPicker(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', width: '100%', fontSize: 13,
                        color: 'var(--ink)', textAlign: 'left',
                        background: task.listId === l.id ? 'var(--surface-2)' : 'transparent',
                        fontWeight: task.listId === l.id ? 600 : 400,
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: l.color, flex: '0 0 8px' }} />
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Flag toggle */}
            <button
              onClick={() => onUpdate(task.id, { flagged: !task.flagged })}
              style={{
                ...pillStyle,
                color: task.flagged ? 'var(--c-orange)' : 'var(--ink-3)',
                background: task.flagged ? 'rgba(255,149,0,.12)' : 'var(--surface-2)',
                border: task.flagged ? '0.5px solid rgba(255,149,0,.3)' : '0.5px solid var(--separator)',
              }}
            >
              <Icon name="flag-small" size={11} color={task.flagged ? 'var(--c-orange)' : 'var(--ink-3)'} />
              {task.flagged ? 'Flagged' : 'Flag'}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, alignSelf: 'center', flex: '0 0 auto' }}>
        <button
          className="r-icon-btn"
          onClick={e => { e.stopPropagation(); onDelete(task.id) }}
          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}
        >
          <Icon name="x" size={14} color="var(--c-red)" stroke={2.2} />
        </button>
        <button
          className="r-task-info r-icon-btn"
          onClick={e => { e.stopPropagation(); setExpanded(false); onSelect(task.id) }}
          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}
        >
          <Icon name="i" size={18} color="var(--c-blue)" stroke={1.8} />
        </button>
      </div>
    </div>
  )
}
