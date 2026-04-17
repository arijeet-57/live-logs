# LIVE_LOG

> A minimalist, real-time blogging platform for developers. Write live, sync instantly, build your audience.

LIVE_LOG is a full-stack blogging platform built around a single powerful idea: **what if your audience could watch you write?** When a session goes live, every keystroke is streamed to readers in real-time via WebSockets — turning the act of writing into a shared, synchronous experience. Between sessions, posts are preserved as archived logs that readers can browse and comment on.

---

## ✨ Features

### Real-Time Live Writing
- Toggle any post into **Live Mode** to begin broadcasting your writing session instantly
- Readers connected to the live page receive content updates with a **500ms debounced WebSocket sync** — no page refresh required
- A **typing indicator** notifies readers when the author is actively writing
- Live sessions are discoverable from the home page with a prominent animated "Broadcasting" card

### Markdown Editor
- Side-by-side **split-pane editor** with a raw Markdown input and a rendered preview
- **Auto-save** to the database every 3 seconds with a visible save status indicator (saving / saved)
- Live word and line count in the status bar
- Monospace, keyboard-first interface with zero visual clutter

### Threaded Comments
- Readers can comment on any post (live or archived)
- Threaded replies enable proper discussions under any comment
- Comment notifications are broadcast via Socket.IO so live viewers see new comments without refreshing

### Authentication
- **Google OAuth** — sign in with Google
- **GitHub OAuth** — sign in with GitHub
- **Email Magic Link** — passwordless sign-in via a secure token sent by email (or printed to the terminal in dev mode for zero-config testing)
- **Admin Credentials** — a single-user admin account with full write access to create, edit, publish, and delete posts

### Neo-Brutalist Design
- Deliberately raw, high-contrast aesthetic with thick borders, hard shadows, and monospace typography
- Full **dark / light mode** toggle powered by `next-themes`
- JetBrains Mono as the system-wide typeface
- Animated live indicators (pulsing radio icon, green glows) to signal active sessions

---

## 🏗️ Architecture

LIVE_LOG runs on a **custom Node.js HTTP server** (`server.ts`) that co-locates a Next.js application and a Socket.IO server on the same port. This avoids the need for a separate WebSocket service.

```
┌────────────────────────────────────────────┐
│              Node.js HTTP Server            │
│  ┌─────────────────┐  ┌──────────────────┐ │
│  │   Next.js App   │  │   Socket.IO      │ │
│  │  (API + Pages)  │  │  (Real-time sync)│ │
│  └─────────────────┘  └──────────────────┘ │
│              PostgreSQL (via Prisma)        │
└────────────────────────────────────────────┘
```

### Socket.IO Events

| Event              | Direction         | Purpose                                    |
|--------------------|-------------------|--------------------------------------------|
| `join-room`        | Client → Server   | Subscribe to a post's live room            |
| `content-update`   | Client → Server   | Author broadcasts new content              |
| `content-sync`     | Server → Clients  | Delivers content update to all viewers     |
| `typing`           | Client → Server   | Author signals they are actively typing    |
| `typing-indicator` | Server → Clients  | Notifies viewers author is writing         |
| `new-comment`      | Client → Server   | A new comment was posted                   |
| `comment-notification` | Server → Clients | Pushes the new comment to live viewers |

### Database Schema (PostgreSQL + Prisma)

- **User** — standard NextAuth user model linked to posts and comments
- **Post** — contains `isLive` (active broadcast) and `lastLiveAt` (archive timestamp), plus `published` flag for visibility control
- **Comment** — self-referential threaded model (`parentId`) supporting nested replies
- **Account / Session / VerificationToken** — NextAuth adapter models

---

## 🛠️ Tech Stack

| Layer         | Technology                                                |
|---------------|-----------------------------------------------------------|
| Framework     | [Next.js 16](https://nextjs.org) (App Router)            |
| Runtime       | Node.js with custom `server.ts`                          |
| Real-time     | [Socket.IO 4](https://socket.io)                        |
| Database      | PostgreSQL via [Prisma 7](https://www.prisma.io)         |
| Auth          | [NextAuth.js 4](https://next-auth.js.org) (Google, GitHub, Email, Credentials) |
| Styling       | [Tailwind CSS 4](https://tailwindcss.com) + `@tailwindcss/typography` |
| UI Components | [Lucide React](https://lucide.dev), [Framer Motion](https://www.framer.com/motion/) |
| Markdown      | [react-markdown](https://github.com/remarkjs/react-markdown) |
| Language      | TypeScript                                               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database
- OAuth credentials (optional — Google and/or GitHub) for social sign-in

### 1. Clone & Install

```bash
git clone https://github.com/your-username/mindlog.git
cd mindlog
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth (optional)
GITHUB_ID=""
GITHUB_SECRET=""

# Email / SMTP (optional — magic links are printed to console in dev)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="LIVE_LOG <noreply@livelog.dev>"
```

### 3. Set Up the Database

```bash
npx prisma db push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Admin login** (no OAuth needed): Use username `admin` and password `admin123` at the sign-in page. This auto-creates the admin account on first login.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/          # Next.js Server Actions (post CRUD, comments)
│   ├── api/              # NextAuth API route handler
│   ├── auth/             # Sign-in page
│   ├── editor/[id]/      # Admin-only Markdown editor page
│   ├── live/[id]/        # Public live viewer page
│   ├── post/[slug]/      # Published post reader page
│   └── page.tsx          # Home — post list + system status dashboard
├── components/
│   ├── auth/             # Auth status / sign-in button
│   ├── blog/             # CommentSection, DeletePostButton
│   ├── editor/           # MarkdownEditor, LiveToggle
│   └── live/             # LiveViewer (real-time reader)
├── hooks/
│   └── useSocket.ts      # Custom hook — Socket.IO client connection
└── lib/
    ├── auth.ts           # NextAuth configuration
    ├── format.ts         # Date formatting utilities
    └── prisma.ts         # Prisma client singleton
server.ts                 # Custom HTTP + Socket.IO server entry point
prisma/
└── schema.prisma         # Database schema
```

---

## 🔐 Admin Access

The platform is designed as a **single-author writing tool** with public readership:

- **Admin** (email: `admin@livelog.dev`) can create, edit, publish, delete posts, and toggle live mode
- **Authenticated users** (OAuth or magic link) can leave comments on posts
- **Guests** can browse published posts and watch live sessions — no account required

---

## 📦 Available Scripts

| Command         | Description                                         |
|-----------------|-----------------------------------------------------|
| `npm run dev`   | Start the dev server with nodemon hot-reload        |
| `npm run build` | Build the Next.js production bundle                 |
| `npm start`     | Start the production server                         |
| `npm run lint`  | Run ESLint                                          |

---

## 📄 License

MIT
