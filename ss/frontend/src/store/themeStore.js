import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  isDark: (() => {
    const saved = localStorage.getItem("ss_theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  })(),

  init: () => {
    const { isDark } = get();
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggle: () => {
    const next = !get().isDark;
    localStorage.setItem("ss_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    set({ isDark: next });
  },
}));
