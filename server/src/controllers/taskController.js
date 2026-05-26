import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      workspace,
      priority,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      workspace,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};