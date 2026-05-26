import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { project, text } = req.body;

    if (!project || !text) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const message = await Message.create({
      project,
      sender: req.user._id,
      text,
    });

    const populatedMessage = await Message.findById(
      message._id
    ).populate("sender", "name email");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({
      project: projectId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};