import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Users,
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";
import { jobAPI } from "../api/index";
import { formatCurrency, timeAgo, truncate } from "../utils/helpers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function JobsPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: sp.get("q") || "",
    budgetType: "",
    minBudget: "",
    maxBudget: "",
    duration: "",
    experience: "",
    page: 1,
  });

  useEffect(() => {
    load();
  }, [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== ""),
      );
      const { data } = await jobAPI.getAll({ ...clean, limit: 10 });
      setJobs(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    setLoading(false);
  };

  const upd = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">
              Find <span className="text-yellow-300">Jobs</span>
            </h1>
            <p className="text-violet-100 mb-5">
              Discover opportunities that match your skills
            </p>
            <div className="flex gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={filters.q}
                  onChange={(e) => upd("q", e.target.value)}
                  placeholder="Search jobs, skills..."
                  className="input pl-9"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {showFilters && (
            <div className="card p-4 mb-5 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Budget Type
                </label>
                <select
                  value={filters.budgetType}
                  onChange={(e) => upd("budgetType", e.target.value)}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) => upd("minBudget", e.target.value)}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => upd("experience", e.target.value)}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : `${pagination.total || 0} jobs found`}
            </p>
            <select
              value={filters.sort || "-createdAt"}
              onChange={(e) => upd("sort", e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            >
              <option value="-createdAt">Newest First</option>
              <option value="-views">Most Viewed</option>
              <option value="-proposalCount">Most Proposals</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="card p-5 h-36 animate-pulse bg-slate-100 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <p className="font-medium">No jobs found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((j) => (
                <div
                  key={j._id}
                  onClick={() => navigate(`/jobs/${j._id}`)}
                  className="card p-5 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <div>
                      <h3 className="font-semibold text-base hover:text-violet-600 dark:hover:text-violet-400">
                        {j.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Posted by {j.client?.name} · {timeAgo(j.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`badge-${j.status === "open" ? "green" : "yellow"} shrink-0`}
                    >
                      {j.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">
                    {truncate(j.description, 150)}
                  </p>
                  {j.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {j.skills.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(j.budget?.min)} –{" "}
                      {formatCurrency(j.budget?.max)} · {j.budget?.type}
                    </span>
                    {j.location?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {j.location.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {j.proposalCount} proposals
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${j._id}`);
                      }}
                      className="btn-primary text-sm ml-auto px-4 py-1.5"
                    >
                      Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => upd("page", p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${filters.page === p ? "bg-violet-600 text-white" : "border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300"}`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
