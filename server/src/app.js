import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspaces.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/workspaces", workspaceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Collabrix API running",
  });
});

app.use("/api/auth", authRoutes);

export default app;