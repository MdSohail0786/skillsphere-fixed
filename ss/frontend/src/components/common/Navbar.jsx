import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useThemeStore } from "../../store/themeStore";
import { getInitials } from "../../utils/helpers";

export default function Navbar() {
  const { isDark, toggle } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setProfileOpen(false);
  };

  const getDashPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "freelancer") return "/dashboard/freelancer";
    return "/dashboard/client";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
            SS
          </div>
          <span className="font-bold text-lg hidden sm:block gradient-text">
            SkillSphere
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            ["Find Freelancers", "/freelancers"],
            ["Browse Gigs", "/gigs"],
            ["Find Jobs", "/jobs"],
          ].map(([l, h]) => (
            <Link
              key={h}
              to={h}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* ✅ Dark Mode Toggle - sirf yeh ek button */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/chat"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b dark:border-slate-700">
                        <p className="font-semibold text-sm dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <div className="p-1">
                        {[
                          [LayoutDashboard, "Dashboard", getDashPath()],
                          [User, "Profile", "/profile"],
                        ].map(([Icon, label, path]) => (
                          <button
                            key={path}
                            onClick={() => {
                              navigate(path);
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-left"
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </button>
                        ))}
                        <div className="border-t dark:border-slate-700 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login" className="btn-outline text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 dark:text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {[
            ["Find Freelancers", "/freelancers"],
            ["Browse Gigs", "/gigs"],
            ["Find Jobs", "/jobs"],
          ].map(([l, h]) => (
            <Link
              key={h}
              to={h}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"
            >
              {l}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center btn-outline text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center btn-primary text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
