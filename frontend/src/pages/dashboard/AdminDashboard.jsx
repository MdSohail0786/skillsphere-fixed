import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  Briefcase,
  Flag,
  TrendingUp,
  Shield,
  CheckCircle,
} from "lucide-react";
import { adminAPI } from "../../api/index";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { formatCurrency, formatDate, timeAgo } from "../../utils/helpers";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([adminAPI.getDashboard(), adminAPI.getUsers({ limit: 8 })])
      .then(([d, u]) => {
        setData(d.data.data);
        setUsers(u.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const s = data?.stats || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard 🛡️</h1>
          <p className="text-sm text-slate-500">
            Platform-wide overview and management
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="card p-5 h-24 animate-pulse bg-slate-100"
              />
            ))
          ) : (
            <>
              <StatsCard
                title="Total Users"
                value={(s.totalUsers || 0).toLocaleString()}
                icon={Users}
                color="violet"
              />
              <StatsCard
                title="Freelancers"
                value={(s.totalFreelancers || 0).toLocaleString()}
                icon={Shield}
                color="blue"
              />
              <StatsCard
                title="Active Projects"
                value={(s.activeProjects || 0).toLocaleString()}
                icon={Briefcase}
                color="green"
              />
              <StatsCard
                title="Platform Revenue"
                value={formatCurrency(s.totalRevenue || 0)}
                icon={DollarSign}
                color="orange"
              />
              <StatsCard
                title="Clients"
                value={(s.totalClients || 0).toLocaleString()}
                icon={Users}
                color="pink"
              />
              <StatsCard
                title="Open Jobs"
                value={(s.openJobs || 0).toLocaleString()}
                icon={Briefcase}
                color="violet"
              />
              <StatsCard
                title="Monthly Revenue"
                value={formatCurrency(s.monthlyRevenue || 0)}
                icon={TrendingUp}
                color="green"
              />
              <StatsCard
                title="Pending Reports"
                value={s.pendingReports || 0}
                icon={Flag}
                color="orange"
              />
            </>
          )}
        </div>

        {/* User Management Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h2 className="font-semibold">Recent Users</h2>
            <button
              onClick={() => navigate("/admin/users")}
              className="text-xs text-violet-600"
            >
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    User
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          u.role === "freelancer"
                            ? "badge-purple"
                            : u.role === "admin"
                              ? "badge-red"
                              : "badge-blue"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {u.location?.city || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {timeAgo(u.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={u.isBanned ? "badge-red" : "badge-green"}
                      >
                        {u.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            u.isBanned
                              ? adminAPI.unbanUser(u._id)
                              : adminAPI.banUser(u._id, {
                                  reason: "Admin action",
                                })
                          }
                          className={`text-xs px-2 py-1 rounded-md font-medium ${u.isBanned ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => adminAPI.verifyFreelancer(u._id)}
                          className="text-xs px-2 py-1 rounded-md font-medium bg-blue-100 text-blue-700"
                        >
                          Verify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
