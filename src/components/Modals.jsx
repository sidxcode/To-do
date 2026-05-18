import { useState, useEffect, useRef } from 'react'
import Icon from './Icons.jsx'

// ── Color + icon palettes ────────────────────────────────────────────────────

const PALETTE = [
  { name: 'Red',    val: 'var(--c-red)' },
  { name: 'Orange', val: 'var(--c-orange)' },
  { name: 'Yellow', val: 'var(--c-yellow)' },
  { name: 'Green',  val: 'var(--c-green)' },
  { name: 'Mint',   val: 'var(--c-mint)' },
  { name: 'Cyan',   val: 'var(--c-cyan)' },
  { name: 'Blue',   val: 'var(--c-blue)' },
  { name: 'Indigo', val: 'var(--c-indigo)' },
  { name: 'Purple', val: 'var(--c-purple)' },
  { name: 'Pink',   val: 'var(--c-pink)' },
  { name: 'Brown',  val: 'var(--c-brown)' },
  { name: 'Gray',   val: 'var(--c-gray)' },
]

const LIST_ICONS = ['list', 'folder', 'star', 'flag', 'bell', 'person', 'flagged', 'scheduled']

// ── NewListModal ─────────────────────────────────────────────────────────────

export function NewListModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || 'var(--c-blue)')
  const [icon, setIcon] = useState(initial?.icon || 'list')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSave() {
    const n = name.trim()
    if (!n) return
    onSave({ name: n, color, icon })
    onClose()
  }

  return (
    <div className="r-modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="r-modal-card" style={{ width: 320, padding: '20px 20px 16px' }}>
        {/* Preview circle + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 999,
            background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flex: '0 0 48px',
          }}>
            <Icon name={icon} size={22} color="white" filled />
          </div>
          <input
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose() }}
            placeholder="List Name"
            style={{
              fontSize: 17, fontWeight: 600, color: 'var(--ink)',
              background: 'var(--surface-2)', borderRadius: 8,
              padding: '8px 12px', flex: 1,
            }}
          />
        </div>

        {/* Color picker */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Color</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
          {PALETTE.map(c => (
            <div
              key={c.val}
              className={`r-color-sw ${color === c.val ? 'selected' : ''}`}
              style={{ background: c.val, color: c.val }}
              onClick={() => setColor(c.val)}
              title={c.name}
            />
          ))}
        </div>

        {/* Icon picker */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Icon</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, marginBottom: 20 }}>
          {LIST_ICONS.map(ic => (
            <button
              key={ic}
              onClick={() => setIcon(ic)}
              style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: icon === ic ? color : 'var(--surface-2)',
                transition: 'background .15s',
              }}
            >
              <Icon name={ic} size={15} color={icon === ic ? 'white' : 'var(--ink-2)'} filled={icon === ic} />
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, color: 'var(--ink-2)', background: 'var(--surface-2)' }}
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: 'white', background: name.trim() ? color : 'var(--surface-3)',
              transition: 'background .15s',
            }}
          >{initial ? 'Save' : 'Add'}</button>
        </div>
      </div>
    </div>
  )
}

// ── ConfirmModal ─────────────────────────────────────────────────────────────

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="r-modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="r-modal-card" style={{ width: 280, padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
        {message && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginBottom: 20, lineHeight: 1.5 }}>{message}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, color: 'var(--ink-2)', background: 'var(--surface-2)' }}
          >Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'white', background: 'var(--c-red)' }}
          >{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ── DropdownMenu ─────────────────────────────────────────────────────────────

export function DropdownMenu({ items, anchorRect, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    function onMouseDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const menuWidth = 180
  let left = anchorRect.right - menuWidth
  let top = anchorRect.bottom + 4
  if (left < 8) left = 8
  if (top + 200 > window.innerHeight) top = anchorRect.top - 8

  return (
    <div
      ref={menuRef}
      className="r-menu"
      style={{ left, top, minWidth: menuWidth }}
    >
      {items.map((item, i) => {
        if (item.separator) return <div key={i} className="r-menu-separator" />
        return (
          <button
            key={i}
            className={`r-menu-item ${item.danger ? 'danger' : ''}`}
            onClick={() => { item.action(); onClose() }}
          >
            {item.icon && <Icon name={item.icon} size={15} color={item.danger ? 'var(--c-red)' : 'var(--ink-2)'} />}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.kbd && <span className="r-kbd">{item.kbd}</span>}
          </button>
        )
      })}
    </div>
  )
}

// ── KeyboardHelpModal ────────────────────────────────────────────────────────

const SHORTCUTS = [
  { kbd: '⌘ N', desc: 'New reminder' },
  { kbd: '⌘ F', desc: 'Search' },
  { kbd: '⌘ D', desc: 'Toggle dark mode' },
  { kbd: '⌘ ⇧ C', desc: 'Show / hide completed' },
  { kbd: '⌘ E', desc: 'Edit mode (bulk select)' },
  { kbd: 'Esc', desc: 'Close / cancel' },
  { kbd: '?', desc: 'Show this help' },
]

export function KeyboardHelpModal({ onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="r-modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="r-modal-card" style={{ width: 320, padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Keyboard Shortcuts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SHORTCUTS.map(s => (
            <div key={s.kbd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5 }}>
              <span style={{ color: 'var(--ink-2)' }}>{s.desc}</span>
              <span className="r-kbd">{s.kbd}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ marginTop: 18, padding: '8px 16px', borderRadius: 8, fontSize: 14, color: 'var(--ink-2)', background: 'var(--surface-2)', width: '100%' }}
        >Close</button>
      </div>
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ tint, title, sub, ctaLabel, onCta }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', gap: 12 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 999,
        background: tint,
        opacity: 0.15,
        position: 'absolute',
      }} />
      <div style={{
        width: 72, height: 72, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <Icon name="check-circle" size={40} color={tint} filled />
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink-2)', textAlign: 'center', marginTop: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>{sub}</div>}
      {onCta && (
        <button
          onClick={onCta}
          style={{
            marginTop: 4, padding: '8px 20px',
            borderRadius: 999, fontSize: 14, fontWeight: 600,
            color: 'white', background: tint,
          }}
        >{ctaLabel}</button>
      )}
    </div>
  )
}
