import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  // Reconnect automatically with backoff
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

// Dev-only logging — won't spam in prod
if (import.meta.env.DEV) {
  socket.on("connect", () => console.log("[socket] connected:", socket.id));
  socket.on("disconnect", (reason) => console.log("[socket] disconnected:", reason));
  socket.on("reconnect", (n) => console.log("[socket] reconnected after", n, "attempts"));
  socket.on("reconnect_error", (err) => console.warn("[socket] reconnect error:", err.message));
}

export default socket;