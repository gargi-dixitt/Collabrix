import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import initSockets from "./sockets/index.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  initSockets(server);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();