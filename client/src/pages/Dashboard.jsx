import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../lib/axios";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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
    try {
      await api.post("/workspaces", { name: workspaceName.trim() });
      setWorkspaceName("");
      fetchWorkspaces();
    } catch (err) {
      console.error("Failed to create workspace:", err.message);
      setError("Failed to create workspace. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createWorkspace();
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-2">Welcome to Collabrix</h1>
        <p className="text-zinc-400 mb-10">Your developer collaboration workspace</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-4xl bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
          <input
            type="text"
            placeholder="Enter workspace name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-5 py-4 outline-none focus:border-zinc-700 transition text-sm text-white"
          />
          <button
            onClick={createWorkspace}
            disabled={creating || !workspaceName.trim()}
            className="bg-white text-black px-8 py-4 sm:py-0 rounded-xl font-bold hover:bg-zinc-200 transition disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {creating ? "Creating..." : "Create Workspace"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6">{error}</p>
        )}

        {loading ? (
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
            <span>Loading workspaces...</span>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 text-center">
            <span className="text-3xl mb-3 block">🏢</span>
            <p className="text-zinc-500 text-sm">No workspaces yet. Create one above to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                onClick={() => navigate(`/workspace/${workspace._id}`)}
                className="group relative bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 cursor-pointer transition flex flex-col justify-between h-40"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold group-hover:text-white transition tracking-tight text-zinc-300">
                      {workspace.name}
                    </h2>
                    <span className="text-zinc-700 group-hover:text-zinc-400 transition text-sm">
                      →
                    </span>
                  </div>
                  <p className="text-zinc-500 mt-2 text-xs font-mono">
                    ID: {workspace._id.slice(-6)}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                  <span className="flex items-center gap-1.5 bg-zinc-900/60 text-zinc-400 text-xs px-2.5 py-1 rounded-full border border-zinc-850 group-hover:bg-zinc-800 transition">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    {workspace.members?.length || 1} member{workspace.members?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;