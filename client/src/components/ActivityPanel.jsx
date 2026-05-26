// Shows live activity feed and who's currently online in the project.
export default function ActivityPanel({ activities = [], onlineUsers = [] }) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Activity</h2>
      </div>

      {/* Online users */}
      <div className="px-5 py-3 border-b border-zinc-800">
        <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Online Now</p>
        {onlineUsers.length === 0 ? (
          <p className="text-zinc-700 text-xs">Just you</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((u, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                {u.name || u}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {activities.length === 0 ? (
          <p className="text-zinc-600 text-xs text-center mt-4">No activity yet</p>
        ) : (
          activities.map((activity, i) => (
            <div key={i} className="text-xs text-zinc-400 border-b border-zinc-900 pb-2">
              {typeof activity === "string" ? activity : activity.message || JSON.stringify(activity)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
