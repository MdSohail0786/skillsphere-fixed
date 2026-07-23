import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Briefcase,
  Star,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { freelancerAPI, gigAPI, proposalAPI, aiAPI } from "../../api/index";
import { useAuthStore } from "../../store/authStore";
import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import { formatCurrency, timeAgo } from "../../utils/helpers";

export default function FreelancerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      freelancerAPI.getStats(),
      gigAPI.getMyGigs(),
      proposalAPI.getMyProposals(),
      aiAPI.getRecommendedJobs().catch(() => ({ data: { data: [] } })),
    ])
      .then(([s, g, p, rj]) => {
        setStats(s.data.data);
        setGigs(g.data.data?.slice(0, 3) || []);
        setProposals(p.data.data?.slice(0, 5) || []);
        setJobs(rj.data.data?.slice(0, 3) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    pending: "badge-yellow",
    accepted: "badge-green",
    rejected: "badge-red",
    withdrawn: "badge-blue",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-slate-500">
              Here's your freelance overview
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/freelancer/gigs/new")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Gig
          </button>
        </div>

        {/* Stats */}
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
                title="Total Earnings"
                value={formatCurrency(stats?.totalEarnings || 0)}
                icon={DollarSign}
                color="green"
              />
              <StatsCard
                title="Active Projects"
                value={stats?.activeProjects || 0}
                icon={Briefcase}
                color="violet"
              />
              <StatsCard
                title="Pending Proposals"
                value={stats?.pendingProposals || 0}
                icon={FileText}
                color="blue"
              />
              <StatsCard
                title="Avg Rating"
                value={`${stats?.averageRating?.toFixed(1) || "—"} ★`}
                icon={Star}
                color="orange"
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* My Gigs */}
          <div className="card">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold">My Gigs</h2>
              <button
                onClick={() => navigate("/dashboard/freelancer/gigs")}
                className="text-xs text-violet-600 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="p-3">
              {gigs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-3">No gigs yet</p>
                  <button
                    onClick={() => navigate("/dashboard/freelancer/gigs/new")}
                    className="btn-primary text-sm"
                  >
                    Create First Gig
                  </button>
                </div>
              ) : (
                gigs.map((g) => (
                  <div
                    key={g._id}
                    onClick={() => navigate(`/gigs/${g._id}`)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{g.title}</p>
                      <p className="text-xs text-slate-400">
                        {g.orders} orders
                      </p>
                    </div>
                    <span
                      className={
                        g.status === "active" ? "badge-green" : "badge-yellow"
                      }
                    >
                      {g.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Proposals */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
              <h2 className="font-semibold">Recent Proposals</h2>
              <button
                onClick={() => navigate("/dashboard/freelancer/proposals")}
                className="text-xs text-violet-600 flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="p-3">
              {proposals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 mb-3">
                    No proposals yet
                  </p>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="btn-outline text-sm"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                proposals.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/jobs/${p.job?._id}`)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {p.job?.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(p.bidAmount)} · {timeAgo(p.createdAt)}
                      </p>
                    </div>
                    <span className={statusColor[p.status] || "badge-blue"}>
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        {jobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-600" /> AI
                Recommended Jobs
              </h2>
              <button
                onClick={() => navigate("/jobs")}
                className="text-xs text-violet-600"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {jobs.map((item) => {
                const j = item.job || item;
                return (
                  <div
                    key={j._id}
                    onClick={() => navigate(`/jobs/${j._id}`)}
                    className="card p-4 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{j.title}</p>
                      {item.matchScore && (
                        <span className="badge-green">
                          {item.matchScore}% match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(j.budget?.min)} –{" "}
                      {formatCurrency(j.budget?.max)} · {j.budget?.type}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
