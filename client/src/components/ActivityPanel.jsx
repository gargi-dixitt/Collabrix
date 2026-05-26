// Activity feed + online presence panel for a project room

// Returns something like "just now", "2m ago", "1h ago"
function relativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);

  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Icon per activity type — keeps the feed scannable
const ACTIVITY_ICONS = {
  task_created: "＋",
  task_moved: "→",
  task_completed: "✓",
  ai_generated: "✨",
  task_updated: "↻",
  message_sent: "💬",
  default: "•",
};

export default function ActivityPanel({ activities = [], onlineUsers = [] }) {
  return (
    <div className="flex flex-col h-full bg-zinc-950/80 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 transition">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center gap-2 flex-shrink-0">
        <span className="text-sm">⚡</span>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400">Activity</h2>
      </div>

      {/* Online users */}
      <div className="px-5 py-3.5 border-b border-zinc-900 bg-zinc-950/40 flex-shrink-0">
        <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-extrabold mb-2.5">
          Online Now
        </p>
        {onlineUsers.length === 0 ? (
          <p className="text-zinc-700 text-xs italic">Just you</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((u, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-zinc-900 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-800"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {u.name || u}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <span className="text-xl mb-2">📋</span>
            <p className="text-zinc-600 text-xs">
              Activity will appear here as your team works.
            </p>
          </div>
        ) : (
          activities.map((activity, i) => {
            const icon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default;
            const msg =
              typeof activity === "string"
                ? activity
                : activity.message || JSON.stringify(activity);
            const ts = activity.timestamp ? relativeTime(activity.timestamp) : "";

            return (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs text-zinc-400 pb-2 border-b border-zinc-900/50 last:border-0"
              >
                <span className="text-zinc-600 mt-0.5 w-4 text-center flex-shrink-0 font-mono">
                  {icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="leading-relaxed break-words">{msg}</p>
                  {ts && (
                    <span className="text-zinc-600 text-[10px] mt-0.5 block">{ts}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
