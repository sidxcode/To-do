import { useState, useRef } from 'react'
import Icon from './Icons.jsx'
import { DropdownMenu } from './Modals.jsx'
import { SMART_VIEWS } from '../lib/utils.js'

const SmartTile = ({ tile, active, count, onClick }) => (
  <div
    className={`r-tile ${active ? 'active' : ''}`}
    onClick={onClick}
    style={{
      background: 'var(--surface)',
      borderRadius: 10,
      padding: '12px 14px 10px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      minHeight: 80,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 999,
        background: tile.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={tile.icon} size={tile.id === 'today' ? 14 : 16} filled color="white" />
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: 'var(--ink)',
        letterSpacing: '-0.02em', fontFamily: 'var(--font-rounded)',
      }}>{count}</div>
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginTop: 'auto' }}>{tile.label}</div>
  </div>
)

const ListRow = ({ list, count, active, onClick, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const btnRef = useRef(null)

  function openMenu(e) {
    e.stopPropagation()
    setMenuAnchor(btnRef.current.getBoundingClientRect())
  }

  return (
    <>
      <div
        className={`r-list-row ${active ? 'active' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: 14,
          color: 'var(--ink)',
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: 999,
          background: list.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: '0 0 24px',
        }}>
          <Icon name={list.icon || 'list'} size={13} color="white" stroke={2.2} />
        </div>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list.name}</span>
        {hovered ? (
          <button
            ref={btnRef}
            onClick={openMenu}
            className="r-icon-btn"
            style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, flex: '0 0 22px' }}
          >
            <Icon name="ellipsis" size={15} color="var(--ink-3)" />
          </button>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums', minWidth: 16, textAlign: 'right' }}>{count || 0}</span>
        )}
      </div>
      {menuAnchor && (
        <DropdownMenu
          anchorRect={menuAnchor}
          onClose={() => { setMenuAnchor(null); setHovered(false) }}
          items={[
            { label: 'Edit List', icon: 'pencil', action: onEdit },
            { separator: true },
            { label: 'Delete List', icon: 'trash', danger: true, action: onDelete },
          ]}
        />
      )}
    </>
  )
}

export default function Sidebar({ state, setState, counts, addList, deleteList, updateList, user, onSignOut, setModal, modal, searchOpen, setSearchOpen, searchQuery, setSearchQuery }) {
  const searchRef = useRef(null)

  const select = (sel) => setState(s => ({ ...s, selected: sel, detailId: null }))
  const isSel = (sel) => JSON.stringify(sel) === JSON.stringify(state.selected)

  function handleSearchClick() {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function handleSearchBlur() {
    if (!searchQuery.trim()) setSearchOpen(false)
  }

  return (
    <aside style={{
      background: 'var(--bg-grouped)',
      borderRight: '0.5px solid var(--separator)',
      padding: '16px 14px 12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      gap: 16,
      userSelect: 'none',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <button
          onClick={onSignOut}
          className="r-icon-btn"
          title="Sign out"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: 'var(--ink-3)',
            padding: '2px 4px', borderRadius: 5,
            overflow: 'hidden', maxWidth: 160,
          }}
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              style={{ width: 20, height: 20, borderRadius: 999, flex: '0 0 20px' }}
            />
          ) : (
            <span style={{ fontSize: 16 }}>👤</span>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || user?.email || 'Account'}
          </span>
        </button>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <button
            className="r-icon-btn"
            onClick={() => setModal({ type: 'keyboard-help' })}
            title="Keyboard shortcuts (?)"
            style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', borderRadius: 5 }}
          >
            <Icon name="help" size={13} />
          </button>
          <button
            className="r-icon-btn"
            onClick={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
            style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', borderRadius: 5 }}
          >
            <Icon name={state.theme === 'light' ? 'moon' : 'sun'} size={13} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          background: 'var(--surface-2)',
          borderRadius: 8,
          fontSize: 13,
          color: 'var(--ink-3)',
          cursor: searchOpen ? 'text' : 'pointer',
        }}
        onClick={!searchOpen ? handleSearchClick : undefined}
      >
        <Icon name="search" size={13} color="var(--ink-3)" />
        {searchOpen ? (
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onBlur={handleSearchBlur}
            onKeyDown={e => { if (e.key === 'Escape') { setSearchQuery(''); setSearchOpen(false) } }}
            placeholder="Search"
            style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}
          />
        ) : (
          <span style={{ flex: 1 }}>Search</span>
        )}
        {searchOpen && searchQuery && (
          <button onClick={() => { setSearchQuery(''); setSearchOpen(false) }} style={{ color: 'var(--ink-3)', padding: 2 }}>
            <Icon name="x" size={12} />
          </button>
        )}
      </div>

      {/* Smart tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {SMART_VIEWS.map(sv => (
          <SmartTile
            key={sv.id}
            tile={sv}
            count={counts[sv.id] || 0}
            active={isSel({ type: sv.id })}
            onClick={() => { select({ type: sv.id }); setSearchOpen(false); setSearchQuery('') }}
          />
        ))}
      </div>

      {/* My Lists */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', padding: '4px 10px 6px' }}>
          My Lists
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '4px' }}>
          {state.lists.map(l => (
            <ListRow
              key={l.id}
              list={l}
              count={counts.lists?.[l.id]}
              active={isSel({ type: 'list', id: l.id })}
              onClick={() => { select({ type: 'list', id: l.id }); setSearchOpen(false); setSearchQuery('') }}
              onEdit={() => setModal({ type: 'edit-list', data: l })}
              onDelete={() => deleteList(l.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{
        borderTop: '0.5px solid var(--separator)',
        padding: '10px 2px 0',
      }}>
        <button
          className="r-sidebar-add"
          onClick={() => setModal({ type: 'new-list' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 8px', borderRadius: 6,
            fontSize: 13, color: 'var(--ink-2)',
          }}
        >
          <Icon name="plus" size={13} color="var(--ink-3)" />
          <span>Add List</span>
        </button>
      </div>
    </aside>
  )
}
