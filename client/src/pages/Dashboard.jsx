import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../lib/axios";
import Sidebar from "../components/Sidebar";

const PULSE_MESSAGES = [
  "2 teammates online",
  "3 tasks moved today",
  "AI sprint generated",
  "Aryan pushed a commit",
  "Sprint 2 in progress",
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [pulseIdx, setPulseIdx] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/workspaces");
      setWorkspaces(res.data);
    } catch (err) {
      console.error("Failed to load workspaces:", err.message);
      setError("Could not load workspaces. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    if (!workspaceName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await api.post("/workspaces", { name: workspaceName.trim() });
      setWorkspaceName("");
      setWorkspaces((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create workspace:", err.message);
      setError("Failed to create workspace. Try again.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Cycle through pulse messages
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIdx((i) => (i + 1) % PULSE_MESSAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        {/* Personalized greeting */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👋</span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {greeting()}, <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">{user.name || "there"}</span>
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">Your collaborative workspace is ready. Let's build something.</p>

          {/* Live workspace pulse ticker */}
          <div className="mt-4 inline-flex items-center gap-2 bg-zinc-950/60 border border-zinc-900 rounded-full px-4 py-2 text-xs">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-zinc-400 font-mono transition-all duration-500 ease-in-out">
              {PULSE_MESSAGES[pulseIdx]}
            </span>
          </div>
        </div>

        {/* Create workspace */}
        <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 mb-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🏗️</span>
            <h2 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider">New Workspace</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Hackathon 2025, Startup MVP, Client Project..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createWorkspace()}
              className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-5 py-3.5 outline-none focus:border-zinc-700 transition text-sm text-white placeholder-zinc-600"
            />
            <button
              onClick={createWorkspace}
              disabled={creating || !workspaceName.trim()}
              className="bg-white text-black px-6 py-3.5 sm:py-0 rounded-xl font-bold hover:bg-zinc-100 transition disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {creating ? "Creating..." : "Create Workspace"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
        </div>

        {/* Workspaces */}
        {loading ? (
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            <span className="text-sm">Loading workspaces...</span>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="max-w-2xl bg-zinc-950 border border-zinc-900 rounded-3xl p-12 text-center">
            <span className="text-4xl block mb-4">🚀</span>
            <h3 className="text-lg font-bold text-zinc-300 mb-2">Start your first workspace</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
              A workspace is where your team collaborates. Create one above, then invite teammates, generate sprints with AI, and ship faster.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center max-w-xs mx-auto">
              {[["✨", "AI Sprints"], ["⚡", "Realtime"], ["💬", "Team Chat"]].map(([icon, label]) => (
                <div key={label} className="bg-zinc-900/60 border border-zinc-850 rounded-xl py-3 px-2">
                  <span className="block text-xl mb-1">{icon}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider">
                Your Workspaces ({workspaces.length})
              </h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {workspaces.map((workspace, idx) => (
                <WorkspaceCard
                  key={workspace._id}
                  workspace={workspace}
                  onClick={() => navigate(`/workspace/${workspace._id}`)}
                  colorIndex={idx}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ACCENT_COLORS = [
  "from-violet-900/30 to-indigo-900/20 border-violet-800/30",
  "from-emerald-900/20 to-teal-900/20 border-emerald-800/30",
  "from-amber-900/20 to-orange-900/20 border-amber-800/30",
  "from-blue-900/20 to-cyan-900/20 border-blue-800/30",
  "from-rose-900/20 to-pink-900/20 border-rose-800/30",
];

function WorkspaceCard({ workspace, onClick, colorIndex }) {
  const accent = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];
  const memberCount = workspace.members?.length || 1;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-gradient-to-br ${accent} border rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between min-h-[160px]`}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-base font-extrabold text-white tracking-tight leading-tight group-hover:text-white transition">
            {workspace.name}
          </h2>
          <span className="text-zinc-500 group-hover:text-zinc-300 transition text-sm flex-shrink-0 ml-2">→</span>
        </div>
        <p className="text-zinc-500 text-[10px] font-mono">
          ID: {workspace._id.slice(-6)}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-1.5">
          {/* Fake member dots for visual richness */}
          {Array.from({ length: Math.min(memberCount, 4) }).map((_, i) => (
            <span
              key={i}
              className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[8px] font-bold text-zinc-400"
            >
              {String.fromCharCode(65 + i)}
            </span>
          ))}
          {memberCount > 4 && (
            <span className="text-[9px] text-zinc-500 font-mono">+{memberCount - 4}</span>
          )}
        </div>
        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          {memberCount} member{memberCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default Dashboard;