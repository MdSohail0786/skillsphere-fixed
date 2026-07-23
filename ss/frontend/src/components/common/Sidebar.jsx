import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  User,
  Settings,
  Users,
  BarChart3,
  Flag,
  ShieldCheck,
  PlusCircle,
  Search,
  Bell,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getInitials } from "../../utils/helpers";

const freelancerLinks = [
  {
    to: "/dashboard/freelancer",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  { to: "/dashboard/freelancer/gigs", icon: Briefcase, label: "My Gigs" },
  {
    to: "/dashboard/freelancer/gigs/new",
    icon: PlusCircle,
    label: "Create Gig",
  },
  { to: "/dashboard/freelancer/proposals", icon: FileText, label: "Proposals" },
  { to: "/dashboard/freelancer/projects", icon: Briefcase, label: "Projects" },
  { to: "/jobs", icon: Search, label: "Find Jobs" },
  { to: "/chat", icon: MessageSquare, label: "Messages" },
  { to: "/dashboard/freelancer/earnings", icon: CreditCard, label: "Earnings" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Profile" },
];

const clientLinks = [
  {
    to: "/dashboard/client",
    icon: LayoutDashboard,
    label: "Dashboard",
    end: true,
  },
  { to: "/dashboard/client/jobs", icon: Briefcase, label: "My Jobs" },
  { to: "/dashboard/client/jobs/new", icon: PlusCircle, label: "Post a Job" },
  { to: "/dashboard/client/projects", icon: FileText, label: "Projects" },
  { to: "/dashboard/client/transactions", icon: CreditCard, label: "Payments" },
  { to: "/freelancers", icon: Search, label: "Find Freelancers" },
  { to: "/gigs", icon: Briefcase, label: "Browse Gigs" },
  { to: "/chat", icon: MessageSquare, label: "Messages" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/reports", icon: Flag, label: "Reports" },
  { to: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  { to: "/admin/verifications", icon: ShieldCheck, label: "Verifications" },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "freelancer"
        ? freelancerLinks
        : clientLinks;

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col h-full">
      <div className="p-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <span className="text-xs badge-purple capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors ${isActive ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"}`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
