import Message from "../models/Message.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { project, text } = req.body;

    if (!project || !text?.trim()) {
      return res.status(400).json({ success: false, message: "Project and text are required" });
    }

    const message = await Message.create({
      project,
      sender: req.user._id,
      text: text.trim(),
    });

    const populated = await Message.findById(message._id).populate("sender", "name email");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};