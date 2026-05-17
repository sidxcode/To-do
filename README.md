# To-do app (v0.1)

A simple cross-device to-do list. **Phase 1** is just the local UI — no backend, no login. Tasks live in browser memory and reset on page reload. We add Supabase (Postgres + Google sign-in + cross-device sync) in Phase 2.

---

## Run it locally

Prerequisites: **Node.js 18 or newer**. Check what you have:

```bash
node --version
```

If you don't have Node, install the LTS build from https://nodejs.org.

Then, from inside this `todo-app/` folder:

```bash
npm install        # one time — installs React, Vite, etc.
npm run dev        # starts the dev server
```

Vite will print a local URL (usually http://localhost:5173) and open it in your browser. Edits to any file under `src/` hot-reload instantly.

To stop the server: `Ctrl+C` in the terminal.

---

## What works right now

- Sidebar with multiple lists (Inbox, Today, Work seeded by default)
- Add a new list (input at the bottom of the sidebar)
- Delete a list (hover over a list — × appears on the right)
- Add a task to the current list, with an optional due date
- Check tasks off / uncheck them
- Edit a task's title inline (just click and type)
- Delete a task (hover — × appears on the right)
- Due-date display with friendly labels (Today / Tomorrow / Mon, etc.) and an "overdue" indicator in red
- Counts of open tasks per list shown in the sidebar

## What's intentionally NOT here yet

- **No persistence.** Refresh the page and your tasks are gone. This comes with Supabase.
- **No login / no cross-device sync.** Comes with Supabase.
- **No reminders.** Comes later via Google Calendar integration.
- **Styling is placeholder.** Will be replaced from the Figma file.

---

## File layout

```
todo-app/
├── package.json          # deps + npm scripts
├── vite.config.js        # dev-server config
├── index.html            # HTML entry — Vite injects the bundle here
├── .gitignore
└── src/
    ├── main.jsx          # React entry — mounts <App /> into #root
    ├── App.jsx           # Top-level state (lists, tasks, active list)
    ├── App.css           # Layout + component styles (placeholder)
    ├── index.css         # Global resets and base typography
    └── components/
        ├── Sidebar.jsx       # Lists + add-list input
        ├── AddTaskInput.jsx  # Title + due-date input row
        ├── TaskList.jsx      # Wraps the list of TaskItem rows
        └── TaskItem.jsx      # Single task row (checkbox / title / due / delete)
```

All state currently lives in `App.jsx`. When we add Supabase, this is where we swap `useState` calls for hooks that read from / write to the database.

---

## Next steps (planned)

1. ✅ Phase 1 — Local UI with in-memory state (this commit)
2. ⏳ Apply Figma-based styling
3. ⏳ Set up Supabase project + tables (`lists`, `tasks`)
4. ⏳ Add Google sign-in
5. ⏳ Replace in-memory state with Supabase reads/writes (cross-device sync)
6. ⏳ Reminders via Google Calendar integration
7. ⏳ PWA polish (install to home screen on Android, app icon)
8. ⏳ Offline support
