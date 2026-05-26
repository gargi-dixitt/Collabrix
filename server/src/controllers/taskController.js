import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, workspace, priority } = req.body;

    if (!title?.trim() || !project) {
      return res.status(400).json({ success: false, message: "Title and project are required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      project,
      workspace,
      priority: priority || "medium",
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};