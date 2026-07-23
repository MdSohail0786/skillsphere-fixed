import { useState } from "react";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full z-50 shadow-xl">
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          <div className="md:hidden flex items-center px-4 py-3 border-b bg-white dark:bg-slate-900 dark:border-slate-700">
            <button onClick={() => setOpen(true)} className="p-1">
              <Menu className="h-5 w-5 dark:text-slate-300" />
            </button>
          </div>
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
