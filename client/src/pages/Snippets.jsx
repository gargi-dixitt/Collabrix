import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/ui/Skeleton";
import Avatar from "../components/ui/Avatar";

export default function Snippets() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const [role, setRole] = useState("member");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchWorkspaceAndSnippets = async () => {
    try {
      setLoading(true);
      // Fetch user role
      const wsRes = await api.get(`/workspaces/${workspaceId}`);
      const member = wsRes.data?.members?.find(
        (m) => m.user === currentUser.id || m.user?._id === currentUser.id
      );
      if (member) setRole(member.role);

      // Fetch code snippets from resource endpoint
      const res = await api.get(`/resources/workspace/${workspaceId}?limit=100`);
      const filtered = (res.data.resources || res.data || []).filter(
        (r) => r.type === "code-snippet"
      );
      setSnippets(filtered);
      if (filtered.length > 0) {
        setSelectedSnippet(filtered[0]);
      }
    } catch (err) {
      console.error("Failed to load snippets:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndSnippets();
  }, [workspaceId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (role === "viewer") {
      setError("viewer_restriction: Viewer role cannot create snippets.");
      return;
    }
    if (!title.trim() || !code.trim()) return;

    setCreating(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type: "code-snippet",
        codeSnippet: code.trim(),
        category: "backend",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        workspace: workspaceId,
      };

      const res = await api.post("/resources", payload);
      const newSnippet = res.data.resource || res.data;
      setSnippets((prev) => [newSnippet, ...prev]);
      setSelectedSnippet(newSnippet);
      
      // Log pulse event
      await api.get(`/pulse/workspace/${workspaceId}`); // Sync timeline
      
      // Reset form
      setTitle("");
      setDescription("");
      setCode("");
      setTags("");
    } catch (err) {
      console.error("Failed to create snippet:", err.message);
      setError("Failed to save code snippet. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (snippet) => {
    navigator.clipboard.writeText(snippet.codeSnippet);
    setCopiedId(snippet._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isViewer = role === "viewer";

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left list of snippets */}
        <div className="w-80 border-r border-zinc-900 flex flex-col h-screen bg-zinc-950/20">
          <div className="p-6 border-b border-zinc-900">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase font-mono">
              [snippets]
            </h1>
            <p className="text-zinc-550 text-[10px] mt-1 font-mono">
              Reusable code ledger & operational libraries.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 animate-pulse">
                  <Skeleton className="h-4 w-2/3 mb-2 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              ))
            ) : snippets.length === 0 ? (
              <p className="text-[10px] text-zinc-650 italic font-mono text-center mt-10">No code snippets logged.</p>
            ) : (
              snippets.map((snip) => (
                <div
                  key={snip._id}
                  onClick={() => setSelectedSnippet(snip)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    selectedSnippet?._id === snip._id
                      ? "bg-zinc-900 border-zinc-800 shadow-md shadow-black/40 ring-1 ring-white/5"
                      : "bg-zinc-950/20 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <h3 className="text-xs font-bold text-zinc-200 truncate">{snip.title}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 truncate">{snip.description || "No description provided."}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-zinc-600">
                    <span>by {snip.createdBy?.name || "Teammate"}</span>
                    <span>{new Date(snip.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Editor Screen */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {selectedSnippet ? (
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin flex flex-col gap-6">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{selectedSnippet.title}</h2>
                  <p className="text-zinc-500 text-xs mt-1.5 font-mono">{selectedSnippet.description}</p>
                  {selectedSnippet.tags?.length > 0 && (
                    <div className="mt-3 flex gap-1.5 flex-wrap">
                      {selectedSnippet.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleCopy(selectedSnippet)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold px-4 py-2 rounded-xl transition flex items-center gap-2"
                  >
                    <span>📋</span>
                    {copiedId === selectedSnippet._id ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>

              {/* Code Previewer */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden font-mono text-xs text-zinc-350 p-6 leading-relaxed relative group">
                <span className="absolute right-4 top-4 text-[9px] font-mono text-zinc-600 uppercase select-none tracking-widest bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded">
                  javascript
                </span>
                <pre className="overflow-x-auto scrollbar-thin max-h-96">{selectedSnippet.codeSnippet}</pre>
              </div>

              <div className="flex items-center gap-3 bg-zinc-950/20 border border-zinc-900/60 p-4 rounded-2xl">
                <Avatar alt={selectedSnippet.createdBy?.name || "?"} size="sm" />
                <div>
                  <p className="text-xs font-bold text-zinc-300">Logged by {selectedSnippet.createdBy?.name || "Teammate"}</p>
                  <p className="text-[10px] text-zinc-600 font-mono mt-0.5">Author ID: {selectedSnippet.createdBy?._id || "Seeded record"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 text-zinc-550">
              <span className="text-3xl select-none font-mono">💻</span>
              <p className="text-xs font-mono">Select a code snippet to view or save a new one.</p>
            </div>
          )}

          {/* Bottom create form */}
          <div className="border-t border-zinc-900 p-6 bg-zinc-950/30">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
              {isViewer ? (
                <span className="text-amber-500">🔒 [viewer_mode: save_restricted]</span>
              ) : (
                <span>📝 Log New Snippet</span>
              )}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Snippet Title (e.g. Socket Handshake Auth)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isViewer}
                  required
                  className="bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-700 font-sans disabled:opacity-50"
                />
                <input
                  type="text"
                  placeholder="Comma-separated tags (e.g. auth, sockets, rbac)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isViewer}
                  className="bg-zinc-900/40 border border-zinc-855 rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-700 font-mono disabled:opacity-50"
                />
              </div>

              <input
                type="text"
                placeholder="Short description of what the snippet accomplishes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isViewer}
                className="bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-700 font-sans disabled:opacity-50"
              />

              <textarea
                placeholder="Paste code snippet here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isViewer}
                className="bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-3 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-750 font-mono h-32 resize-none scrollbar-thin disabled:opacity-50"
              />

              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

              <button
                type="submit"
                disabled={creating || isViewer || !title.trim() || !code.trim()}
                className="bg-white text-black py-2.5 rounded-xl font-bold hover:bg-zinc-100 transition disabled:opacity-40 text-xs"
              >
                {creating ? "Saving to repository..." : "Log Code Snippet"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
