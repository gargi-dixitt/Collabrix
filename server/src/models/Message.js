import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;