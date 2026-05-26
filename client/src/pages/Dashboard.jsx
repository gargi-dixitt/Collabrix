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

        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter workspace name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-zinc-600 transition"
          />
          <button
            onClick={createWorkspace}
            disabled={creating}
            className="bg-white text-black px-8 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading workspaces...</p>
        ) : workspaces.length === 0 ? (
          <p className="text-zinc-500">No workspaces yet. Create one above.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                onClick={() => navigate(`/workspace/${workspace._id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-zinc-600 transition"
              >
                <h2 className="text-2xl font-semibold">{workspace.name}</h2>
                <p className="text-zinc-500 mt-2 text-sm">
                  {workspace.members?.length || 1} member{workspace.members?.length !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;