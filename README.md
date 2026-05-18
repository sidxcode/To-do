# 📝 Reminders

> A personal to-do and note-taking app built as part of my journey into **vibe coding** — using AI tools to build real, useful software for myself.

Live demo: **https://to-do-phi-smoky.vercel.app/#**

---

## What is this?

This is my attempt at building a cross-device reminder and task manager — heavily inspired by Apple Reminders — using AI-assisted coding (Claude, Cursor, etc.) as the primary development approach. I'm just a product designer and not a professional developer; this is a personal learning project.

The goal: build something I actually use every day, while learning how modern web stacks fit together.

---

## Features

- **Smart views** — Today, Scheduled, All, Flagged with live counts
- **Multiple lists** — each with a custom color and icon
- **Rich task rows** — priority levels (`!` `!!` `!!!`), flag, due date, overdue highlighting, subtasks, and notes
- **Detail panel** — tap ⓘ on any task to edit date, time, list, flag, priority, repeat, and subtasks
- **Edit mode** — bulk select tasks to Flag / Move / Complete / Delete
- **Search** — instant filtering across all tasks
- **Keyboard shortcuts** — `⌘N` new · `⌘F` search · `⌘D` dark mode · `⌘⇧C` show completed · `⌘E` edit mode · `?` help
- **Mobile layout** — responsive below 700 px; opens to Today view with a bottom-sheet detail panel
- **Dark mode** toggle
- **Cross-device sync** via Supabase Realtime — same data on phone and laptop instantly
- **Google sign-in** — one tap on Android and desktop

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend / DB | Supabase (Postgres + Row-Level Security) |
| Auth | Google OAuth via Supabase |
| Hosting | Vercel (auto-deploy from GitHub) |
| Styling | Inline styles + CSS variables (iOS system tokens) |

---

## Run locally

You'll need Node 18+ and a Supabase project.

```bash
# Clone the repo
git clone https://github.com/your-username/reminders.git
cd reminders

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Start dev server
npm run dev
# → http://localhost:5173
```

### Environment variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## About this project / vibe coding

I built this primarily by describing what I wanted to claude and iterating from there — a workflow sometimes called *vibe coding*. Almost everything here, from the component structure to the Supabase schema, was written or shaped with AI help.

Things I learned along the way:

- How Supabase Row-Level Security works (and why it matters)
- How to wire up Google OAuth without pulling my hair out
- How Supabase Realtime keeps data in sync across tabs and devices
- How to think in React — state, props, lifting up, side effects
- How Vercel auto-deploy from GitHub actually works in practice

It's imperfect. There are probably better ways to do most things in here. But it works, I use it daily now, and i keep adding and removing feautres and bugs alike every other day, and ofcourse building it taught me more than any tutorial did.

---

## Roadmap / ideas

- [ ] Widgets (iOS home screen style)
- [ ] Natural language input ("call mom tomorrow at 3pm")
- [ ] Attachments / image notes
- [ ] Shared lists (collaborative)
- [ ] Notification reminders (push / email)

---

## Contributing

This is a personal project, so I'm not actively seeking contributions — but if you find a bug or have a suggestion, feel free to open an issue, or just send me a hi on my socials. I'd love to hear from others learning the same way.

---
