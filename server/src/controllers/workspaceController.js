import Workspace from "../models/workspace.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      owner: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(workspace);
  } catch (err) {
    next(err);
  }
};

export const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ members: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(workspaces);
  } catch (err) {
    next(err);
  }
};