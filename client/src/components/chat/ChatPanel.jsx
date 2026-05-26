import { useEffect, useRef, useState } from "react";
import api from "../../lib/axios";
import socket from "../../socket";

// Real chat panel — loads message history, sends via REST, receives live via socket.
export default function ChatPanel({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${projectId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err.message);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    setSending(true);
    try {
      const res = await api.post("/messages", {
        project: projectId,
        text: text.trim(),
      });

      // Optimistically add to local state and emit to room
      setMessages((prev) => [...prev, res.data]);
      socket.emit("send-message", { projectId, message: res.data });
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on("receive-message", (message) => {
      // Don't duplicate messages we sent ourselves (already added optimistically)
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === message._id);
        return alreadyExists ? prev : [...prev, message];
      });
    });

    return () => {
      socket.off("receive-message");
    };
  }, [projectId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold">Team Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-zinc-600 text-sm text-center mt-4">No messages yet. Say hi 👋</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender?._id === user.id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <span className="text-zinc-500 text-xs mb-1">
                {msg.sender?.name || "Unknown"}
              </span>
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                  isMe
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-zinc-500 transition"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
