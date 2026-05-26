import { io } from "socket.io-client";

// Connect with autoConnect: false so we only connect when we need it.
// The socket will connect when .connect() is called (on entering a project).
const socket = io("http://localhost:4000", {
  autoConnect: false,
});

export default socket;