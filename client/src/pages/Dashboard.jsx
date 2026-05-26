import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Welcome back, {user?.name}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Your Workspace
        </h2>

        <p className="text-slate-400">
          Real-time collaboration features will live here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;