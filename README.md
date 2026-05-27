<div align="center">

# Collabrix

**AI-powered real-time collaboration platform for modern engineering teams.**

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)](https://github.com)
[![Stack](https://img.shields.io/badge/stack-MERN-blue)](https://github.com)
[![AI](https://img.shields.io/badge/AI-Gemini--powered-orange)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

*One platform. Every tool your engineering team needs.*

</div>

---

## What is Collabrix?

Most dev teams juggle 5–6 disconnected tools: Slack for chat, Linear for tasks, Notion for docs, GitHub for code, and ChatGPT for help. The context switching kills velocity.

Collabrix brings it all together — AI-powered sprint planning, real-time kanban boards, team chat, shared knowledge bases, and engineering analytics — into a single collaborative workspace built specifically for fast-moving developer teams.

---

## Features

### 🤖 AI Sprint Planner
Describe your project in natural language. Collabrix's AI generates a fully structured sprint — complete with tasks, priorities, assignees, due dates, and column assignments. Sprints are created in seconds, not hours.

### ⚡ Real-Time Kanban Boards
Drag-and-drop task management with multiplayer presence. See who's viewing which task, watch cards move in real-time, and track sprint progress with live counters. Powered by Socket.IO.

### 💬 Built-In Team Chat
Channel-based messaging inside every project. Typing indicators, online presence, message timestamps — no need to context-switch to a separate chat tool.

### 📊 Engineer's Space
A live pulse of your workspace's engineering activity. Grouped event timelines, sprint momentum analytics, weekly collaboration summaries, and AI-generated workspace insights.

### 📚 Resource Hub
Shared knowledge library with AI-powered metadata tagging. Links, articles, and documents automatically categorized by topic. Smart recommendations surface relevant resources as you work.

### 📖 Wiki
Team knowledge base for documentation, architecture decisions, onboarding guides, and runbooks. Rich editing with publish/draft workflows.

### 💻 Snippets
Reusable code snippet library with syntax highlighting. Save, tag, search, and share code patterns across your team.

### 🔍 AI Code Review
Paste code and get AI-powered audits. Receive quality scores, security analysis, performance suggestions, and architectural recommendations — powered by Gemini.

### 🔐 Workspace RBAC
Role-based access control: **Owner → Admin → Member → Viewer**. Invite links with automatic role assignment. Granular permissions for sprints, resources, and project management.

### 🔔 Real-Time Notifications
Instant alerts for task assignments, mentions, workspace invites, sprint completions, and AI-generated insights. Never miss an update.

### 💳 Billing & Plans
Tiered pricing with usage tracking. Free, Pro, and Team plans with clear feature breakdowns and upgrade paths.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Vite + React)                 │
│                                                              │
│  Landing ─ Login ─ Register ─ Dashboard                      │
│  └─ Workspace                                                │
│     ├─ Projects → Kanban Board → Task Modal                  │
│     │   ├─ AI Sprint Planner                                 │
│     │   ├─ Chat Panel                                        │
│     │   └─ Activity Panel                                    │
│     ├─ Engineer's Space (Pulse)                              │
│     ├─ Resource Hub                                          │
│     ├─ Wiki                                                  │
│     ├─ Snippets                                              │
│     ├─ Code Review                                           │
│     └─ Billing                                               │
│                                                              │
│  Socket.IO Client ←──── real-time sync ────→ Socket.IO       │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST API + WebSocket
┌───────────────────────────┴──────────────────────────────────┐
│                     SERVER (Express + Node.js)               │
│                                                              │
│  Routes:  auth · workspaces · projects · tasks · messages    │
│           ai · pulse · resources · collections · notifications│
│                                                              │
│  Controllers:                                                │
│     authController      workspaceController                  │
│     projectController   taskController                       │
│     messageController   aiController                         │
│     sprintController    pulseController                      │
│     resourceController  collectionController                 │
│     notificationController                                   │
│                                                              │
│  Middleware: auth · workspaceAccess (RBAC) · errorHandler     │
│  Sockets:   presence · kanban sync · chat · pulse events     │
│  AI:        Gemini API (sprint gen, code review, tagging)    │
│                                                              │
│  Database: MongoDB + Mongoose                                │
│     User · Workspace · Project · Task · Message              │
│     PulseEvent · Resource · Collection · Notification        │
│     Comment · AiFeedback                                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

**Frontend**
- [React 18](https://react.dev/) via [Vite 5](https://vitejs.dev/) — fast HMR, ESM-native
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling
- [React Router 6](https://reactrouter.com/) — client-side routing with `createBrowserRouter`
- [Socket.IO Client](https://socket.io/) — real-time collaboration
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) — drag-and-drop kanban
- [Axios](https://axios-http.com/) — API client

**Backend**
- [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/)
- [Socket.IO 4](https://socket.io/) — real-time engine
- [Zod](https://zod.dev/) — request validation
- JWT + bcrypt — authentication & password hashing
- [Morgan](https://github.com/expressjs/morgan) — request logging

**AI**
- [Google Gemini API](https://ai.google.dev/) — sprint generation, code review, resource tagging

**Deployment**
- Frontend → [Vercel](https://vercel.com/)
- Backend → [Render](https://render.com/) / [Railway](https://railway.app/)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Project Structure

```
COLLABRIX/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/              # AI Sprint Planner modal
│   │   │   ├── board/           # Kanban board, task cards, task modal
│   │   │   ├── chat/            # Chat panel, messages, input
│   │   │   ├── notifications/   # Notification bell & dropdown
│   │   │   ├── workspace/       # Member panel, invite flows
│   │   │   └── ui/              # Avatar, Skeleton, shared UI
│   │   │
│   │   ├── context/             # AuthContext provider
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Axios instance, utils
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Marketing landing page
│   │   │   ├── Login.jsx        # Auth — login
│   │   │   ├── Register.jsx     # Auth — register
│   │   │   ├── Dashboard.jsx    # Workspace selector
│   │   │   ├── Workspace.jsx    # Workspace home — projects, pulse, members
│   │   │   ├── Project.jsx      # Kanban board + chat + sprint planner
│   │   │   ├── Pulse.jsx        # Engineer's Space — activity timeline
│   │   │   ├── ResourceHub.jsx  # Shared resource library
│   │   │   ├── Wiki.jsx         # Team knowledge base
│   │   │   ├── Snippets.jsx     # Code snippet library
│   │   │   ├── CodeReview.jsx   # AI code auditor
│   │   │   ├── Billing.jsx      # Plans & usage
│   │   │   ├── JoinWorkspace.jsx # Invite link handler
│   │   │   └── NotFound.jsx     # 404 page
│   │   │
│   │   ├── routes.jsx           # Route definitions (createBrowserRouter)
│   │   ├── socket.js            # Socket.IO client instance
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global styles + Tailwind directives
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   │   ├── aiController.js        # AI task generation, code review
│   │   │   ├── sprintController.js    # Full AI sprint orchestration
│   │   │   ├── authController.js      # Register, login, JWT
│   │   │   ├── workspaceController.js # CRUD, invites, RBAC
│   │   │   ├── projectController.js   # Project CRUD
│   │   │   ├── taskController.js      # Task CRUD, status updates
│   │   │   ├── messageController.js   # Chat messages
│   │   │   ├── pulseController.js     # Activity events + AI summaries
│   │   │   ├── resourceController.js  # Resource CRUD + AI tagging
│   │   │   ├── collectionController.js # Resource collections
│   │   │   └── notificationController.js # Notification CRUD
│   │   │
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── User.js          # Auth, profile, workspace refs
│   │   │   ├── Workspace.js     # Members, roles, invite tokens
│   │   │   ├── Project.js       # Name, description, workspace ref
│   │   │   ├── Task.js          # Status, assignee, priority, due date
│   │   │   ├── Message.js       # Sender, project, content
│   │   │   ├── PulseEvent.js    # Type-enum activity log
│   │   │   ├── Resource.js      # URL, AI metadata, tags, upvotes
│   │   │   ├── Collection.js    # Resource groupings
│   │   │   ├── Notification.js  # Type, read status, references
│   │   │   ├── Comment.js       # Task discussion threads
│   │   │   └── AiFeedback.js    # Sprint feedback tracking
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── workspaceAccess.js   # RBAC role checking
│   │   │   └── errorHandler.js      # Global error handler
│   │   │
│   │   ├── routes/              # Express route definitions
│   │   ├── sockets/             # Socket.IO event handlers
│   │   ├── services/            # Business logic services
│   │   ├── validators/          # Zod schemas
│   │   ├── utils/               # Helpers
│   │   │
│   │   ├── app.js               # Express app setup
│   │   ├── index.js             # Server entry (HTTP + Socket.IO)
│   │   └── seed.js              # Demo data seeder
│   │
│   └── package.json
│
├── package.json                 # Root scripts
├── .gitignore
└── README.md
```

---

## Database Models

| Model | Key Fields | Purpose |
|---|---|---|
| **User** | name, email, password, skills, avatar | Authentication & profiles |
| **Workspace** | name, members[], inviteToken, roles | Team environments |
| **Project** | name, description, workspace ref | Engineering boards |
| **Task** | title, status, assignee, priority, due date, column | Sprint tasks |
| **Message** | sender, project, content, timestamps | Project chat |
| **PulseEvent** | type (enum), content, workspace, metadata | Activity timeline |
| **Resource** | url, title, aiMetadata, tags, upvotes | Shared knowledge |
| **Collection** | name, resources[], workspace | Resource groupings |
| **Notification** | type, user, read, references | Alert system |
| **Comment** | task, user, content | Task discussions |
| **AiFeedback** | sprint, rating, feedback | AI quality tracking |

---

## Real-Time Architecture

Socket.IO powers live collaboration across:

| Feature | Events |
|---|---|
| **Kanban sync** | `task:moved`, `task:created`, `task:updated` |
| **Team chat** | `message:new`, `typing`, `stop-typing` |
| **Presence** | `join-workspace`, `leave-workspace`, `workspace-online-users` |
| **Drag presence** | `drag:start`, `drag:end` — see who's dragging which card |
| **View presence** | `task:viewing`, `task:editing` — see who's looking at what |
| **Pulse events** | `pulse:new` — live activity feed updates |
| **Notifications** | `notification:new` — instant alert delivery |
| **Member events** | `workspace:member-joined` — live member updates |

---

## AI Systems

Collabrix integrates Google Gemini across multiple workflows:

### Sprint Generation
- Input: project description in natural language
- Output: structured sprint with 8-15 tasks, priorities, time estimates, assignees
- Includes column distribution (todo/in-progress/review) and dependency ordering

### Code Review
- Input: code snippet in any language
- Output: quality score, security analysis, performance suggestions, refactoring recommendations
- Real-time feedback with category-based ratings

### Resource Intelligence
- Automatic metadata extraction from shared URLs
- AI-powered topic tagging and categorization
- Smart resource recommendations based on workspace activity

### Workspace Analytics
- Weekly collaboration summaries
- Sprint velocity insights
- Contributor activity patterns
- Busiest areas and collaboration spikes

---

## Security

- Password hashing with bcrypt (10 salt rounds)
- JWT validation on all protected routes
- Role-based access control (Owner → Admin → Member → Viewer)
- Middleware-enforced workspace permissions
- Environment variable management (`.env`)
- CORS configuration with credential support
- Request body size limiting (1MB)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- Google Gemini API key ([get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/collabrix.git
cd collabrix

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Setup

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running Locally

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

### Demo Mode

Seed the database with realistic team activity data:

```bash
cd server
npm run seed:demo
```

This populates your workspace with:
- Sample team members and projects
- Sprint tasks across all status columns
- Resource library entries with AI metadata
- Pulse timeline events (sprint completions, task moves, milestones)
- Realistic collaboration history

> **Note:** Requires a valid `MONGO_URI` in your `.env` file.

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| MVP | Auth, workspaces, chat, tasks | ✅ Complete |
| v1.0 | AI Sprint Planner, kanban, real-time sync | ✅ Complete |
| v1.1 | Engineer's Space, Resource Hub, RBAC | ✅ Complete |
| v1.2 | Wiki, Snippets, AI Code Review | ✅ Complete |
| v1.3 | Billing, notifications, activity intelligence | ✅ Complete |
| v2.0 | GitHub integration, video calls, mobile app | 🔜 Planned |

---

## Target Users

- **Engineering teams** — startups, hackathon squads, project groups
- **Student developers** — college projects, coding clubs, bootcamp teams
- **Technical creators** — indie builders, freelancers, open-source contributors

---

## Why JavaScript?

Collabrix is intentionally built in JavaScript for faster iteration, easier onboarding, and a hackathon-friendly workflow. The architecture is designed for eventual TypeScript migration as the codebase matures.

---

<div align="center">

**Built for teams that ship.** 🚀

</div>
