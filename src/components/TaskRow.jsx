import { useState, useEffect, useRef } from 'react'
import Icon, { RepeatIcon } from './Icons.jsx'
import { formatTaskDate, isOverdue } from '../lib/utils.js'

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

export function TaskWithSubs({ task, list, tint, smartView, onToggle, onSelect, onUpdate, selected, isFirst }) {
  const subs = task.subtasks || []
  return (
    <>
      <TaskRow
        task={task}
        list={list}
        tint={tint}
        smartView={smartView}
        onToggle={onToggle}
        onSelect={onSelect}
        onUpdate={onUpdate}
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

export default function TaskRow({ task, list, tint, smartView, onToggle, onSelect, onUpdate, selected, isFirst }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const inputRef = useRef(null)
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const overdue = isOverdue(task.dueDate, task.dueTime, task.done)
  const dateStr = formatTaskDate(task.dueDate, task.dueTime)

  return (
    <div
      className="r-task"
      onClick={() => onSelect(task.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 14px',
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

        {task.notes ? (
          <div style={{
            fontSize: 12.5, color: 'var(--ink-3)',
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}>{task.notes}</div>
        ) : null}

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
      </div>

      <button
        className="r-task-info r-icon-btn"
        onClick={e => { e.stopPropagation(); onSelect(task.id) }}
        style={{
          width: 22, height: 22, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', flex: '0 0 22px', alignSelf: 'center',
        }}
      >
        <Icon name="i" size={18} color="var(--c-blue)" stroke={1.8} />
      </button>
    </div>
  )
}
