import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  DollarSign,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { projectAPI, jobAPI } from "../../api/index";
import { useAuthStore } from "../../store/authStore";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { formatCurrency, timeAgo } from "../../utils/helpers";

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectAPI.getStats(),
      jobAPI.getMyJobs(),
      projectAPI.getAll({ limit: 4 }),
    ])
      .then(([s, j, p]) => {
        setStats(s.data.data);
        setJobs(j.data.data?.slice(0, 4) || []);
        setProjects(p.data.data?.slice(0, 4) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              Manage your projects and find great talent
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/client/jobs/new")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Post a Job
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card p-5 h-24 animate-pulse bg-slate-100"
              />
            ))
          ) : (
            <>
              <StatsCard
                title="Active Projects"
                value={stats?.activeProjects || 0}
                icon={Briefcase}
                color="violet"
              />
              <StatsCard
                title="Completed"
                value={stats?.completedProjects || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="Total Spend"
                value={formatCurrency(stats?.totalSpend || 0)}
                icon={DollarSign}
                color="blue"
              />
              <StatsCard
                title="Jobs Posted"
                value={stats?.postedJobs || 0}
                icon={FileText}
                color="orange"
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold">My Jobs</h2>
              <button
                onClick={() => navigate("/dashboard/client/jobs")}
                className="text-xs text-violet-600 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="p-3">
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-3">
                    No jobs posted yet
                  </p>
                  <button
                    onClick={() => navigate("/dashboard/client/jobs/new")}
                    className="btn-primary text-sm"
                  >
                    Post First Job
                  </button>
                </div>
              ) : (
                jobs.map((j) => (
                  <div
                    key={j._id}
                    onClick={() => navigate(`/jobs/${j._id}`)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{j.title}</p>
                      <p className="text-xs text-slate-400">
                        {j.proposalCount} proposals · {timeAgo(j.createdAt)}
                      </p>
                    </div>
                    <span
                      className={
                        j.status === "open"
                          ? "badge-green"
                          : j.status === "in-progress"
                            ? "badge-blue"
                            : "badge-yellow"
                      }
                    >
                      {j.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold">Active Projects</h2>
              <button
                onClick={() => navigate("/dashboard/client/projects")}
                className="text-xs text-violet-600 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="p-3">
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">No active projects</p>
                </div>
              ) : (
                projects.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/projects/${p._id}`)}
                    className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <span className="text-sm font-semibold text-violet-600">
                        {formatCurrency(p.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-violet-600 rounded-full h-1.5"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {p.progress}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
