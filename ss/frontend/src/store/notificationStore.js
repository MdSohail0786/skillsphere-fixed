import { create } from 'zustand';
import { notificationAPI } from '../api/index';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  fetch: async () => {
    try {
      const { data } = await notificationAPI.getAll({ limit: 20 });
      set({ notifications: data.data, unreadCount: data.pagination?.unreadCount || 0 });
    } catch {}
  },

  add: (n) => set((s) => ({ notifications: [n, ...s.notifications], unreadCount: s.unreadCount + 1 })),

  markRead: async (id) => {
    await notificationAPI.markRead(id);
    set((s) => ({ notifications: s.notifications.map(n => n._id === id ? { ...n, isRead: true } : n), unreadCount: Math.max(0, s.unreadCount - 1) }));
  },

  markAllRead: async () => {
    await notificationAPI.markAllRead();
    set((s) => ({ notifications: s.notifications.map(n => ({ ...n, isRead: true })), unreadCount: 0 }));
  },
}));
