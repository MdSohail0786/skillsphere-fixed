import { create } from 'zustand';
import { chatAPI } from '../api/index';

export const useChatStore = create((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoadingMessages: false,
  typingUsers: {},

  fetchConversations: async () => {
    try { const { data } = await chatAPI.getConversations(); set({ conversations: data.data }); } catch {}
  },

  setActiveConversation: (conv) => set({ activeConversation: conv, messages: [] }),

  fetchMessages: async (id) => {
    set({ isLoadingMessages: true });
    try { const { data } = await chatAPI.getMessages(id); set({ messages: data.data }); }
    finally { set({ isLoadingMessages: false }); }
  },

  addMessage: (msg) => set((s) => ({
    messages: [...s.messages, msg],
    conversations: s.conversations.map(c => c._id === msg.conversation ? { ...c, lastMessage: msg } : c),
  })),

  setTyping: (userId, isTyping) => set((s) => ({
    typingUsers: isTyping ? { ...s.typingUsers, [userId]: true } : Object.fromEntries(Object.entries(s.typingUsers).filter(([k]) => k !== userId)),
  })),
}));
