import { Server } from "socket.io";

// Tracks who's online per project room: { projectId: [{ socketId, user }] }
const projectRooms = {};

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // User joins a project room
    socket.on("join-project", ({ projectId, user }) => {
      socket.join(projectId);

      if (!projectRooms[projectId]) {
        projectRooms[projectId] = [];
      }

      // Avoid duplicates if the same user reconnects
      const alreadyIn = projectRooms[projectId].some((u) => u.socketId === socket.id);
      if (!alreadyIn) {
        projectRooms[projectId].push({ socketId: socket.id, name: user?.name || "Someone" });
      }

      // Broadcast updated online list to everyone in the room
      io.to(projectId).emit(
        "online-users",
        projectRooms[projectId].map((u) => ({ name: u.name }))
      );
    });

    // Task was created or moved — notify everyone else in the room
    socket.on("task-updated", ({ projectId, message }) => {
      // Emit back to all clients in the room (including sender) so they refetch
      io.to(projectId).emit("receive-task-update");

      // Also push to activity feed
      io.to(projectId).emit("activity", { message });
    });

    // A chat message was sent — broadcast to others in the room
    socket.on("send-message", ({ projectId, message }) => {
      // Broadcast to everyone else in the room (sender already added optimistically)
      socket.to(projectId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      // Remove user from any rooms they were in
      for (const projectId in projectRooms) {
        const before = projectRooms[projectId].length;
        projectRooms[projectId] = projectRooms[projectId].filter(
          (u) => u.socketId !== socket.id
        );

        if (projectRooms[projectId].length !== before) {
          // Someone left — update the online list for that room
          io.to(projectId).emit(
            "online-users",
            projectRooms[projectId].map((u) => ({ name: u.name }))
          );
        }

        // Clean up empty rooms
        if (projectRooms[projectId].length === 0) {
          delete projectRooms[projectId];
        }
      }
    });
  });
};

export default initSockets;