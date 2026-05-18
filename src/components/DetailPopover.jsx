import { useState, useEffect } from 'react'
import Icon, { RepeatIcon } from './Icons.jsx'
import { uid, todayISO } from '../lib/utils.js'

// ── Shared detail sub-components ─────────────────────────────────────────────

export const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      width: 36, height: 22, borderRadius: 999,
      background: value ? 'var(--c-green)' : 'var(--surface-3)',
      position: 'relative', transition: 'background .15s', flex: '0 0 36px',
    }}
  >
    <span style={{
      position: 'absolute',
      top: 2, left: value ? 16 : 2,
      width: 18, height: 18, borderRadius: 999,
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,.18)',
      transition: 'left .15s',
    }} />
  </button>
)

export const Chip = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '2px 8px', borderRadius: 999,
    fontSize: 12.5,
    background: active ? 'var(--tint)' : 'var(--surface-2)',
    color: active ? 'white' : 'var(--ink-2)',
    fontWeight: active ? 600 : 400,
  }}>{children}</button>
)

export const DateChips = ({ value, onChange }) => {
  const today = todayISO(0)
  const opts = [
    { label: 'Today', val: today },
    { label: 'Tomorrow', val: todayISO(1) },
    { label: 'Weekend', val: todayISO((6 - new Date().getDay() + 7) % 7 || 7) },
    { label: 'None', val: null },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {opts.map(o => (
          <Chip key={o.label} active={value === o.val} onClick={() => onChange(o.val)}>{o.label}</Chip>
        ))}
      </div>
      <input
        type="date"
        value={value || ''}
        min={today}
        onChange={e => onChange(e.target.value || null)}
        style={{
          fontSize: 12.5,
          color: 'var(--ink-3)',
          padding: '3px 8px',
          borderRadius: 6,
          border: '0.5px solid var(--separator)',
          background: 'var(--surface-2)',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}

export const TimeChips = ({ value, onChange, disabled }) => {
  const opts = [
    { label: '9:00', val: '09:00' },
    { label: '13:00', val: '13:00' },
    { label: '18:00', val: '18:00' },
    { label: 'None', val: null },
  ]
  return (
    <div style={{
      display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end',
      opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto',
    }}>
      {opts.map(o => (
        <Chip key={o.label} active={value === o.val} onClick={() => onChange(o.val)}>{o.label}</Chip>
      ))}
    </div>
  )
}

export const PriorityChips = ({ value, onChange }) => {
  const opts = [{ label: 'None', val: 0 }, { label: '!', val: 1 }, { label: '!!', val: 2 }, { label: '!!!', val: 3 }]
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {opts.map(o => (
        <Chip key={o.label} active={value === o.val} onClick={() => onChange(o.val)}>{o.label}</Chip>
      ))}
    </div>
  )
}

export const Picker = ({ opts, value, onChange }) => (
  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
    {opts.map(o => (
      <Chip key={String(o.val)} active={value === o.val} onClick={() => onChange(o.val)}>
        {o.color && <span style={{ width: 6, height: 6, borderRadius: 999, background: o.color, display: 'inline-block', marginRight: 5, verticalAlign: 1 }} />}
        {o.label}
      </Chip>
    ))}
  </div>
)

const DetailGroup = ({ children }) => (
  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '2px 0' }}>
    {children}
  </div>
)

const DetailRow = ({ icon, iconBg, label, children, sep }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '8px 12px',
    borderTop: sep ? '0.5px solid var(--separator-2)' : 'none',
    minHeight: 38,
  }}>
    <div style={{
      width: 24, height: 24, borderRadius: 6, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: 13, flex: '0 0 24px',
    }}>
      {icon === '!' ? '!' : icon === 'repeat' ? <RepeatIcon size={13} /> : <Icon name={icon} size={14} filled color="white" />}
    </div>
    <span style={{ fontSize: 14, color: 'var(--ink)', flex: 1 }}>{label}</span>
    {children}
  </div>
)

export const SubtasksEditor = ({ task, tint, onUpdate }) => {
  const [newSub, setNewSub] = useState('')
  const subs = task.subtasks || []

  function add() {
    if (!newSub.trim()) return
    onUpdate({ subtasks: [...subs, { id: uid(), title: newSub.trim(), done: false }] })
    setNewSub('')
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', padding: '6px 12px 4px' }}>Subtasks</div>
      {subs.map(s => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px' }}>
          <button
            onClick={() => onUpdate({ subtasks: subs.map(x => x.id === s.id ? { ...x, done: !x.done } : x) })}
            style={{
              width: 16, height: 16, borderRadius: 999,
              border: `1.4px solid ${s.done ? tint : 'var(--ink-4)'}`,
              background: s.done ? tint : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {s.done && <Icon name="check" size={9} color="white" stroke={3} />}
          </button>
          <input
            value={s.title}
            onChange={e => onUpdate({ subtasks: subs.map(x => x.id === s.id ? { ...x, title: e.target.value } : x) })}
            style={{ fontSize: 13.5, color: s.done ? 'var(--ink-3)' : 'var(--ink-2)', textDecoration: s.done ? 'line-through' : 'none' }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px' }}>
        <Icon name="plus" size={13} color="var(--ink-4)" />
        <input
          value={newSub}
          onChange={e => setNewSub(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add() }}
          placeholder="Add Subtask"
          style={{ fontSize: 13.5, color: 'var(--ink-2)' }}
        />
      </div>
    </div>
  )
}

// ── DetailPopover ────────────────────────────────────────────────────────────

export default function DetailPopover({ task, list, lists, tint, onClose, onUpdate, onDelete }) {
  const [editTitle, setEditTitle] = useState(task?.title || '')
  const [editNotes, setEditNotes] = useState(task?.notes || '')

  useEffect(() => {
    if (task) { setEditTitle(task.title); setEditNotes(task.notes || '') }
  }, [task?.id])

  if (!task) return null

  const commit = (patch) => onUpdate(task.id, patch)

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: '50%', right: 30, transform: 'translateY(-50%)',
          width: 340,
          maxHeight: 'min(640px, calc(100vh - 60px))',
          background: 'var(--bg-grouped)',
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,.16), 0 0 0 0.5px var(--separator)',
          padding: '16px 18px',
          overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ fontSize: 14, color: 'var(--tint)', fontWeight: 500, padding: '2px 4px' }}>Done</button>
          <button onClick={() => { onDelete(task.id); onClose() }} style={{ fontSize: 14, color: 'var(--c-red)', padding: '2px 4px' }}>Delete</button>
        </div>

        <input
          className="r-detail-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={() => commit({ title: editTitle })}
          placeholder="Title"
          style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}
        />
        <textarea
          className="r-detail-input"
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          onBlur={() => commit({ notes: editNotes })}
          placeholder="Notes"
          rows={3}
          style={{ fontSize: 14, color: 'var(--ink-2)', resize: 'none', lineHeight: 1.45 }}
        />

        <DetailGroup>
          <DetailRow icon="scheduled" iconBg="var(--c-red)" label="Date">
            <DateChips value={task.dueDate} onChange={v => commit({ dueDate: v })} />
          </DetailRow>
          <DetailRow icon="today" iconBg="var(--c-blue)" label="Time" sep>
            <TimeChips value={task.dueTime} onChange={v => commit({ dueTime: v })} disabled={!task.dueDate} />
          </DetailRow>
        </DetailGroup>

        <DetailGroup>
          <DetailRow icon="flagged" iconBg="var(--c-orange)" label="Flag">
            <Toggle value={task.flagged} onChange={v => commit({ flagged: v })} />
          </DetailRow>
          <DetailRow icon="!" iconBg="var(--c-red)" label="Priority" sep>
            <PriorityChips value={task.priority} onChange={v => commit({ priority: v })} />
          </DetailRow>
          <DetailRow icon="repeat" iconBg="var(--c-purple)" label="Repeat" sep>
            <Picker
              opts={[
                { label: 'Never', val: null },
                { label: 'Daily', val: 'daily' },
                { label: 'Weekly', val: 'weekly' },
                { label: 'Monthly', val: 'monthly' },
              ]}
              value={task.recurring}
              onChange={v => commit({ recurring: v })}
            />
          </DetailRow>
        </DetailGroup>

        <DetailGroup>
          <DetailRow icon="list" iconBg={list?.color || 'var(--c-gray)'} label="List">
            <Picker
              opts={lists.map(l => ({ label: l.name, val: l.id, color: l.color }))}
              value={task.listId}
              onChange={v => commit({ listId: v })}
            />
          </DetailRow>
        </DetailGroup>

        <DetailGroup>
          <SubtasksEditor task={task} tint={tint} onUpdate={commit} />
        </DetailGroup>
      </div>
    </div>
  )
}
