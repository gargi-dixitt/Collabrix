import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../lib/axios";
import Sidebar from "../components/Sidebar";

const Workspace = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err.message);
      setError("Could not load projects. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!projectName.trim()) return;

    setCreating(true);
    try {
      await api.post("/projects", {
        name: projectName.trim(),
        description: description.trim(),
        workspaceId: id,
      });

      setProjectName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error("Failed to create project:", err.message);
      setError("Failed to create project. Try again.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-bold mb-2">Workspace</h1>
        <p className="text-zinc-400 mb-10">Manage your projects</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-5">Create Project</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600 transition"
            />

            <textarea
              placeholder="Project description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none h-28 resize-none focus:border-zinc-600 transition"
            />

            <button
              onClick={createProject}
              disabled={creating}
              className="bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-zinc-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-zinc-500">No projects yet. Create one above.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-zinc-600 transition"
              >
                <h2 className="text-2xl font-semibold">{project.name}</h2>
                {project.description && (
                  <p className="text-zinc-400 mt-3 text-sm">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;