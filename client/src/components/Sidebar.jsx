import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-800 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Collabrix
        </h1>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className={`transition px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              isActive("/dashboard")
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <span>📊</span> Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full bg-zinc-900/50 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 transition px-4 py-3 rounded-xl text-left text-sm text-zinc-400 hover:text-red-400 font-semibold flex items-center gap-2.5"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;