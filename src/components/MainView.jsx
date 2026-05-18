import { useState, useEffect, useRef, useMemo } from 'react'
import Icon from './Icons.jsx'
import { TaskWithSubs } from './TaskRow.jsx'
import { DropdownMenu } from './Modals.jsx'
import { EmptyState } from './Modals.jsx'
import { formatTaskDate } from '../lib/utils.js'

const FAB_PINK = '#FF2D55'

export default function MainView({
  state, setState, filtered, tint,
  headerTitle, headerSub, smartView,
  addTask, toggleTask, updateTask, deleteTask, listForTask, deleteList,
  editMode, setEditMode, selectedIds, setSelectedIds, toggleSelectId,
  bulkComplete, bulkDelete, bulkFlag, bulkMoveTo,
  setModal, modal,
  searchOpen, searchQuery,
}) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [showBulkMove, setShowBulkMove] = useState(false)
  const newInputRef = useRef(null)
  const moreButtonRef = useRef(null)
  const moveButtonRef = useRef(null)

  useEffect(() => { if (adding) newInputRef.current?.focus() }, [adding])

  // ⌘N listener
  useEffect(() => {
    function onNewTask() { setAdding(true) }
    document.addEventListener('r-new-task', onNewTask)
    return () => document.removeEventListener('r-new-task', onNewTask)
  }, [])

  // Exit edit mode when view changes
  useEffect(() => {
    setEditMode(false)
    setSelectedIds(new Set())
  }, [state.selected])

  function submitNew() {
    if (newTitle.trim()) addTask(newTitle.trim())
    setNewTitle('')
    setAdding(false)
  }

  function cancel() {
    setNewTitle('')
    setAdding(false)
  }

  function selectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(t => t.id)))
    }
  }

  const isListView = state.selected.type === 'list'
  const currentList = isListView ? state.lists.find(l => l.id === state.selected.id) : null

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
          onDelete={deleteTask}
          selected={state.detailId === t.id}
          isFirst={i === 0}
          editMode={editMode}
          checked={selectedIds.has(t.id)}
          onToggleSelect={toggleSelectId}
        />
      ))}
      {showAddRow && (
        <div style={{ borderTop: items.length ? '0.5px solid var(--separator-2)' : 'none' }}>
          {addRow}
        </div>
      )}
    </div>
  )

  const mainMenuItems = [
    {
      label: state.showCompleted ? 'Hide Completed' : 'Show Completed',
      icon: 'check-circle',
      action: () => setState(s => ({ ...s, showCompleted: !s.showCompleted })),
      kbd: '⌘⇧C',
    },
    {
      label: editMode ? 'Done Editing' : 'Edit Reminders',
      icon: 'pencil',
      action: () => { setEditMode(v => !v); setSelectedIds(new Set()) },
      kbd: '⌘E',
    },
    ...(isListView && currentList ? [
      { separator: true },
      {
        label: 'Delete List',
        icon: 'trash',
        danger: true,
        action: () => deleteList(state.selected.id),
      },
    ] : []),
  ]

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
        <div style={{ flex: 1, minWidth: 0 }}>
          {editMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontFamily: 'var(--font-rounded)',
                fontSize: 28, fontWeight: 700, color: tint,
                letterSpacing: '-0.02em', lineHeight: 1.05,
              }}>
                {selectedIds.size === 0 ? 'Select Items' : `${selectedIds.size} Selected`}
              </div>
              <button
                onClick={selectAll}
                style={{ fontSize: 13, color: 'var(--tint)', fontWeight: 500, padding: '2px 6px' }}
              >
                {selectedIds.size === filtered.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: 'var(--font-rounded)',
                fontSize: 32, fontWeight: 700, color: tint,
                letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 2,
              }}>
                {searchOpen && searchQuery ? `"${searchQuery}"` : headerTitle}
              </div>
              {headerSub && !searchOpen && (
                <div style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-rounded)', fontWeight: 500 }}>
                  {headerSub}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          {editMode ? (
            <button
              onClick={() => { setEditMode(false); setSelectedIds(new Set()) }}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                color: 'white', background: 'var(--tint)',
              }}
            >Done</button>
          ) : (
            <>
              <button
                className="r-icon-btn"
                onClick={() => setAdding(true)}
                style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: 'var(--tint)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="plus" size={18} color="white" stroke={2.5} />
              </button>
              <button
                ref={moreButtonRef}
                className="r-icon-btn"
                onClick={() => setMenuAnchor(moreButtonRef.current.getBoundingClientRect())}
                style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--tint)',
                }}
              >
                <Icon name="ellipsis" size={16} color="var(--tint)" />
              </button>
            </>
          )}
        </div>
      </header>

      {menuAnchor && (
        <DropdownMenu
          anchorRect={menuAnchor}
          onClose={() => setMenuAnchor(null)}
          items={mainMenuItems}
        />
      )}

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
          <EmptyState
            tint={tint}
            title="No Reminders"
            sub={searchOpen && searchQuery ? `No results for "${searchQuery}"` : 'Tap + to add one.'}
            ctaLabel={searchOpen ? null : 'Add Reminder'}
            onCta={searchOpen ? null : () => setAdding(true)}
          />
        ) : (
          renderTaskGroup(filtered, tint, null, adding)
        )}
        {filtered.length === 0 && adding && !groups && (
          <div style={{ background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
            {addRow}
          </div>
        )}
      </div>

      {/* Bulk actions toolbar */}
      {editMode && selectedIds.size > 0 && (
        <div className="r-bulk-toolbar">
          <button
            className="r-toolbar-btn"
            onClick={bulkFlag}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'var(--c-orange)' }}
          >
            <Icon name="flag-small" size={18} color="var(--c-orange)" />
            Flag
          </button>

          <div style={{ position: 'relative' }}>
            <button
              ref={moveButtonRef}
              className="r-toolbar-btn"
              onClick={() => setShowBulkMove(v => !v)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'var(--tint)' }}
            >
              <Icon name="folder" size={18} color="var(--tint)" />
              Move
            </button>
            {showBulkMove && (
              <DropdownMenu
                anchorRect={moveButtonRef.current?.getBoundingClientRect()}
                onClose={() => setShowBulkMove(false)}
                items={state.lists.map(l => ({
                  label: l.name,
                  icon: 'list',
                  action: () => bulkMoveTo(l.id),
                }))}
              />
            )}
          </div>

          <button
            className="r-toolbar-btn"
            onClick={bulkComplete}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'var(--c-green)' }}
          >
            <Icon name="check-circle" size={18} color="var(--c-green)" filled />
            Complete
          </button>

          <button
            className="r-toolbar-btn"
            onClick={() => setModal({ type: 'confirm-bulk-delete' })}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'var(--c-red)' }}
          >
            <Icon name="trash" size={18} color="var(--c-red)" />
            Delete
          </button>
        </div>
      )}

      {/* FAB */}
      {!editMode && (
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
      )}
    </main>
  )
}
