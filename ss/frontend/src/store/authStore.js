import { create } from 'zustand';
import { authAPI } from '../api/index';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('ss_token') || null,
  isLoading: true,
  isAuthenticated: false,

  setAccessToken: (token) => {
    localStorage.setItem('ss_token', token);
    set({ accessToken: token });
  },

  login: async (credentials) => {
    const { data } = await authAPI.login(credentials);
    const { accessToken, user } = data.data;
    localStorage.setItem('ss_token', accessToken);
    set({ accessToken, user, isAuthenticated: true });
    return user;
  },

  logout: async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('ss_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const token = get().accessToken;
    if (!token) { set({ isLoading: false }); return; }
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('ss_token');
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
}));
