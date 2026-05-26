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
    <div className="flex flex-col h-full bg-zinc-950/80 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 transition">
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">💬</span>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400">Team Chat</h2>
        </div>
        <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">
          Socket Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <span className="text-2xl mb-2">💬</span>
            <p className="text-zinc-600 text-xs">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender?._id === user.id;
          return (
            <div
              key={msg._id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <span className="text-zinc-500 text-[10px] mb-1 font-mono px-1">
                {msg.sender?.name || "Unknown"}
              </span>
              <div
                className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] break-words leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-white text-black font-semibold rounded-tr-sm"
                    : "bg-zinc-900 text-zinc-200 border border-zinc-850 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-zinc-900 bg-zinc-950/20 flex gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:border-zinc-700 transition text-white"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
