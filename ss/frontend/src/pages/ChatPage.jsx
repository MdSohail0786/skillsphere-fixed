import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { chatAPI } from "../api/index";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { getSocket } from "../hooks/useSocket";
import { getInitials, timeAgo } from "../utils/helpers";
import Navbar from "../components/common/Navbar";

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversation,
    messages,
    isLoadingMessages,
    typingUsers,
    fetchConversations,
    setActiveConversation,
    fetchMessages,
    addMessage,
  } = useChatStore();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      getSocket()?.emit("conversation:join", activeConversation._id);
    }
  }, [activeConversation?._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const other = (conv) => conv?.participants?.find((p) => p._id !== user?._id);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !activeConversation) return;
    setSending(true);
    const socket = getSocket();
    if (socket) {
      socket.emit("message:send", {
        conversationId: activeConversation._id,
        content: text.trim(),
      });
    } else {
      try {
        const { data } = await chatAPI.sendMessage(activeConversation._id, {
          content: text.trim(),
        });
        addMessage(data.data);
      } catch {}
    }
    setText("");
    setSending(false);
  };

  const handleTyping = () => {
    const socket = getSocket();
    socket?.emit("typing:start", { conversationId: activeConversation?._id });
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(
      () =>
        socket?.emit("typing:stop", {
          conversationId: activeConversation?._id,
        }),
      2000,
    );
  };

  const typingList = Object.keys(typingUsers).filter((id) => id !== user?._id);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r dark:border-slate-700 flex flex-col bg-white dark:bg-slate-900">
          <div className="p-4 border-b dark:border-slate-700">
            <h2 className="font-bold text-lg dark:text-white">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => {
                const o = other(conv);
                const active = activeConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b dark:border-slate-700 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${active ? "bg-violet-50 dark:bg-violet-900/30 border-r-2 border-r-violet-600" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
                        {o?.avatar ? (
                          <img
                            src={o.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(o?.name)
                        )}
                      </div>
                      {o?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{o?.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {conv.lastMessage?.content || "Start chatting"}
                      </p>
                    </div>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-slate-400 shrink-0">
                        {timeAgo(conv.lastMessageAt)}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat window */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
            <div className="px-5 py-3 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex items-center gap-3">
              {(() => {
                const o = other(activeConversation);
                return (
                  <>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
                        {getInitials(other(activeConversation)?.name)}
                      </div>
                      {o?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{o?.name}</p>
                      <p className="text-xs text-slate-400">
                        {o?.isOnline
                          ? "🟢 Online"
                          : `Last seen ${timeAgo(o?.lastSeen)}`}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {isLoadingMessages ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-7 w-7 animate-spin text-violet-600" />
                </div>
              ) : (
                messages.map((msg) => {
                  const mine =
                    msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
                    >
                      {!mine && (
                        <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {getInitials(msg.sender?.name)}
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-violet-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-bl-sm"}`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${mine ? "text-violet-200" : "text-slate-400"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {mine && msg.isRead && " ✓✓"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {typingList.length > 0 && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {other(activeConversation) &&
                      getInitials(other(activeConversation)?.name)}
                  </div>
                  <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex items-center gap-3"
            >
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="btn-primary h-10 w-10 flex items-center justify-center p-0 rounded-full disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center text-slate-400">
              <p className="text-5xl mb-3">💬</p>
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm">
                Choose from your conversations to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
