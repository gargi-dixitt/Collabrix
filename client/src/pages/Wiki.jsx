import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/ui/Skeleton";
import Avatar from "../components/ui/Avatar";

export default function Wiki() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();

  const [wikiPages, setWikiPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("architecture");
  const [selectedPage, setSelectedPage] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("member");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchWorkspaceAndWiki = async () => {
    try {
      setLoading(true);
      // Fetch user role
      const wsRes = await api.get(`/workspaces/${workspaceId}`);
      const member = wsRes.data?.members?.find(
        (m) => m.user === currentUser.id || m.user?._id === currentUser.id
      );
      if (member) setRole(member.role);

      // Fetch wiki-style articles from resources endpoint
      const res = await api.get(`/resources/workspace/${workspaceId}?limit=100`);
      const wikiDocs = (res.data.resources || res.data || []).filter(
        (r) => r.type === "article" || r.type === "docs"
      );
      
      // Inject standard seeded pages if empty
      const defaultPages = [
        {
          _id: "seeded-wiki-1",
          title: "Multiplayer Synchronization Engine Core Architecture",
          description: "Technical specification of the WebSocket presence and drag engine.",
          codeSnippet: `# Multiplayer State Sync Spec
This document describes how state is shared across multi-node autoscaling server pods.

## Realtime Handshake Pipeline
1. Handshake token checks parameters inside custom headers.
2. Disconnect requests missing JWT payloads in less than 2000ms.
3. Hook up socket adapter with secure Redis pub/sub.

## Presence Synchronization
- Drag position notifications are debounced client-side.
- Sockets broadcast cursor locations in a high-fidelity room structure.`,
          category: "architecture",
          createdBy: { name: "Aryan" },
          createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        },
        {
          _id: "seeded-wiki-2",
          title: "Production Deployment Checklist",
          description: "Autoscaling node proxies, reverse configurations, and connection thresholds.",
          codeSnippet: `# Production Deployment Rules
Guidelines for autoscaling sockets correctly.

1. Ensure sticky sessions are enabled on load balancer handshakes.
2. Nginx upgrade connection protocols must map upgrade headers.
3. Elasticache Redis replication groups handle multiplayer synchronization seamlessly.`,
          category: "deployment",
          createdBy: { name: "Bhoomi" },
          createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        }
      ];

      const combined = [...wikiDocs, ...defaultPages];
      setWikiPages(combined);
      if (combined.length > 0) {
        setSelectedPage(combined[0]);
      }
    } catch (err) {
      console.error("Failed to load wiki:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndWiki();
  }, [workspaceId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (role === "viewer") {
      setError("viewer_restriction: Viewer role cannot edit or write wiki pages.");
      return;
    }
    if (!title.trim() || !content.trim()) return;

    setCreating(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        description: `Wiki document on ${category}.`,
        type: "article",
        codeSnippet: content.trim(), // Reuse codeSnippet as markdown body
        category: category,
        workspace: workspaceId,
      };

      const res = await api.post("/resources", payload);
      const newPage = res.data.resource || res.data;
      setWikiPages((prev) => [newPage, ...prev]);
      setSelectedPage(newPage);
      
      // Log pulse event
      await api.get(`/pulse/workspace/${workspaceId}`); // Sync timeline

      // Reset form
      setTitle("");
      setContent("");
      setCategory("architecture");
    } catch (err) {
      console.error("Failed to create wiki page:", err.message);
      setError("Failed to save wiki article. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const isViewer = role === "viewer";

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Wiki Tree */}
        <div className="w-80 border-r border-zinc-900 flex flex-col h-screen bg-zinc-950/20">
          <div className="p-6 border-b border-zinc-900">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase font-mono">
              [engineering_wiki]
            </h1>
            <p className="text-zinc-550 text-[10px] mt-1 font-mono">
              Runbooks, technical specs & operational blueprints.
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
            ) : (
              wikiPages.map((page) => (
                <div
                  key={page._id}
                  onClick={() => setSelectedPage(page)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    selectedPage?._id === page._id
                      ? "bg-zinc-900 border-zinc-800 shadow-md shadow-black/40 ring-1 ring-white/5"
                      : "bg-zinc-950/20 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-mono bg-zinc-900/60 border border-zinc-850 px-1.5 py-0.5 rounded text-zinc-500 uppercase">
                      {page.category || "architecture"}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-zinc-200 truncate">{page.title}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1 truncate">{page.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Wiki Viewer / Editor */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {selectedPage ? (
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin flex flex-col gap-6">
              <div className="border-b border-zinc-900 pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded text-emerald-400 uppercase tracking-wider">
                    {selectedPage.category || "architecture"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Updated by {selectedPage.createdBy?.name || "Teammate"} · {new Date(selectedPage.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{selectedPage.title}</h2>
              </div>

              {/* Wiki Document Content */}
              <div className="prose prose-invert max-w-none text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative">
                <span className="absolute right-4 top-4 text-[9px] font-mono text-zinc-650 uppercase tracking-widest select-none">
                  markdown
                </span>
                <div className="whitespace-pre-wrap font-mono">
                  {selectedPage.codeSnippet || selectedPage.description}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 text-zinc-550">
              <span className="text-3xl select-none font-mono">📖</span>
              <p className="text-xs font-mono">Select a wiki document page or publish a technical blueprint below.</p>
            </div>
          )}

          {/* Bottom create wiki section */}
          <div className="border-t border-zinc-900 p-6 bg-zinc-950/30">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 font-mono">
              {isViewer ? (
                <span className="text-amber-500">🔒 [viewer_mode: edit_restricted]</span>
              ) : (
                <span>📝 Publish Technical blueprint</span>
              )}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Document Title (e.g. Socket Event Scaling)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isViewer}
                  required
                  className="md:col-span-2 bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-700 disabled:opacity-50"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isViewer}
                  className="bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-2.5 outline-none focus:border-zinc-700 transition text-xs text-zinc-400 font-mono disabled:opacity-50"
                >
                  <option value="architecture">architecture</option>
                  <option value="auth">security & auth</option>
                  <option value="deployment">deployment</option>
                  <option value="realtime">realtime sync</option>
                  <option value="database">database specs</option>
                </select>
              </div>

              <textarea
                placeholder="Write blueprint body (Supports Markdown)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isViewer}
                className="bg-zinc-900/40 border border-zinc-850 rounded-xl px-4 py-3 outline-none focus:border-zinc-700 transition text-xs text-white placeholder-zinc-750 font-mono h-28 resize-none scrollbar-thin disabled:opacity-50"
              />

              {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

              <button
                type="submit"
                disabled={creating || isViewer || !title.trim() || !content.trim()}
                className="bg-white text-black py-2.5 rounded-xl font-bold hover:bg-zinc-100 transition disabled:opacity-40 text-xs"
              >
                {creating ? "Publishing page..." : "Publish Wiki Page"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
