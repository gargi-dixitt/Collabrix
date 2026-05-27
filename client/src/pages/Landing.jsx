import { Link } from "react-router-dom";

/* ───────────────────────────── data ───────────────────────────── */

const AI_FEATURES = [
  {
    icon: "🤖",
    title: "AI Sprint Planner",
    description:
      "Describe your project in plain English — Collabrix generates a complete sprint with tasks, priorities, and assignments in seconds.",
    tag: "AI-Powered",
  },
  {
    icon: "🔍",
    title: "AI Code Review",
    description:
      "Paste any code snippet and get instant AI-powered audits, vulnerability flags, and actionable improvement suggestions.",
    tag: "AI-Powered",
  },
  {
    icon: "🏷️",
    title: "Smart Resource Tagging",
    description:
      "Share links, docs, and articles in the Resource Hub — AI auto-tags and recommends the most relevant resources to your team.",
    tag: "AI-Powered",
  },
];

const COLLAB_FEATURES = [
  {
    icon: "⚡",
    title: "Real-Time Kanban",
    description:
      "Drag-and-drop task boards with live multiplayer presence. See who's viewing, editing, and moving tasks — no refresh needed.",
  },
  {
    icon: "💬",
    title: "Built-In Team Chat",
    description:
      "Real-time messaging inside every project via Socket.IO. Threads, mentions, and context — without leaving your workflow.",
  },
  {
    icon: "🔔",
    title: "Real-Time Notifications",
    description:
      "Instant alerts for task assignments, @mentions, and workspace events. Stay in the loop without checking every channel.",
  },
];

const ENGINEERING_FEATURES = [
  {
    icon: "📊",
    title: "Engineer's Space",
    description:
      "Team activity pulse, sprint velocity analytics, and collaboration insights — see how your team ships at a glance.",
  },
  {
    icon: "📚",
    title: "Wiki & Snippets",
    description:
      "Build a living knowledge base for your team. Save reusable code snippets, architectural decisions, and runbooks.",
  },
  {
    icon: "🔐",
    title: "Workspace RBAC",
    description:
      "Fine-grained roles — Owner, Admin, Member, Viewer — with shareable invite links. Control who can see, edit, or manage.",
  },
];

const STATS = [
  { value: "9+", label: "Core Modules" },
  { value: "< 2s", label: "AI Sprint Generation" },
  { value: "100%", label: "Real-Time Sync" },
  { value: "4", label: "RBAC Roles" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create a Workspace",
    description:
      "Set up a workspace for your team, club, or hackathon squad. Invite members with a single link.",
  },
  {
    step: "02",
    title: "Describe Your Project",
    description:
      "Tell the AI Sprint Planner what you're building. It generates tasks, columns, and priorities instantly.",
  },
  {
    step: "03",
    title: "Collaborate & Ship",
    description:
      "Assign tasks, chat in real-time, review code, share resources, and track progress — all in one place.",
  },
];

/* ─────────────────────── reusable card ────────────────────────── */

const FeatureCard = ({ icon, title, description, tag }) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-7 hover:border-zinc-600 transition group flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">{icon}</span>
      {tag && (
        <span className="text-[10px] font-semibold uppercase tracking-widest bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
          {tag}
        </span>
      )}
    </div>
    <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition">
      {title}
    </h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
  </div>
);

/* ──────────────────────── section header ─────────────────────── */

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="text-center mb-14">
    {eyebrow && (
      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 block">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    {subtitle && (
      <p className="text-zinc-500 text-base max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

/* ═════════════════════════ component ═════════════════════════ */

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ─── Nav ─── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-900 max-w-7xl mx-auto">
        <span className="text-2xl font-bold tracking-tight">Collabrix</span>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-zinc-400 hover:text-white transition text-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-black px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="max-w-7xl mx-auto px-8 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-400 mb-10">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          AI-powered project management for dev teams
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
          Plan with AI.
          <br />
          Build in
          <span className="text-zinc-500"> real-time.</span>
          <br />
          Ship
          <span className="text-zinc-500"> together.</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Collabrix unifies sprint planning, kanban boards, team chat, code
          review, and a shared knowledge base — powered by AI so your team spends
          less time organizing and more time building.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-base hover:opacity-90 transition"
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="border border-zinc-800 text-zinc-300 px-8 py-4 rounded-2xl font-semibold text-base hover:border-zinc-600 hover:text-white transition"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-zinc-900 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold mb-1">
                {s.value}
              </div>
              <div className="text-zinc-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AI-Powered Features ─── */}
      <section className="max-w-7xl mx-auto px-8 py-28">
        <SectionHeader
          eyebrow="Artificial Intelligence"
          title="Let AI handle the busywork"
          subtitle="From sprint generation to code audits to smart tagging — Collabrix puts AI to work so your team can focus on what matters."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {AI_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─── Collaboration Features ─── */}
      <section className="max-w-7xl mx-auto px-8 pb-28">
        <SectionHeader
          eyebrow="Real-Time Collaboration"
          title="Work together, not apart"
          subtitle="Every interaction — tasks, chat, notifications — happens live. No refresh. No waiting."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {COLLAB_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─── Engineering Tools ─── */}
      <section className="max-w-7xl mx-auto px-8 pb-28">
        <SectionHeader
          eyebrow="Engineering Toolkit"
          title="Built for how engineers actually work"
          subtitle="Sprint analytics, a shared wiki, reusable snippets, and workspace-level access control — everything beyond the task board."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {ENGINEERING_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-y border-zinc-900 bg-zinc-950 py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Getting Started"
            title="Up and running in 3 steps"
            subtitle="No lengthy onboarding. No sales calls. Just sign up and start shipping."
          />
          <div className="grid md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="text-5xl font-extrabold text-zinc-800 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 text-center px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Ready to ship faster?
        </h2>
        <p className="text-zinc-500 mb-10 text-lg max-w-xl mx-auto">
          Free to use. No credit card needed. Set up your first workspace in
          under a minute.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-black px-10 py-4 rounded-2xl font-bold text-base hover:opacity-90 transition"
        >
          Create your workspace →
        </Link>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-900 py-14 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold block mb-3">Collabrix</span>
            <p className="text-zinc-500 leading-relaxed">
              The AI-powered project workspace for developer teams that ship
              fast and stay organized.
            </p>
          </div>

          {/* Product */}
          <div>
            <span className="font-semibold text-zinc-300 block mb-3">
              Product
            </span>
            <ul className="space-y-2 text-zinc-500">
              <li>Kanban Boards</li>
              <li>AI Sprint Planner</li>
              <li>Team Chat</li>
              <li>Code Review</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <span className="font-semibold text-zinc-300 block mb-3">
              Resources
            </span>
            <ul className="space-y-2 text-zinc-500">
              <li>Resource Hub</li>
              <li>Wiki &amp; Snippets</li>
              <li>Engineer's Space</li>
              <li>Notifications</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <span className="font-semibold text-zinc-300 block mb-3">
              Account
            </span>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-xs gap-4">
          <span>© {new Date().getFullYear()} Collabrix. Built for teams that ship.</span>
          <span className="text-zinc-700">
            Crafted with care for developers, by developers.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;