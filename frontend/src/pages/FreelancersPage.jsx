import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { freelancerAPI } from "../api/index";
import { formatCurrency, getInitials } from "../utils/helpers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function FreelancersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    skills: "",
    minRate: "",
    maxRate: "",
    rating: "",
    availability: "",
    city: "",
    page: 1,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== 0),
      );
      const { data } = await freelancerAPI.getAll({ ...clean, limit: 12 });
      setFreelancers(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    setLoading(false);
  };

  const upd = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">
              Find <span className="text-yellow-300">Freelancers</span>
            </h1>
            <p className="text-violet-100 mb-6">
              Discover talented professionals near you
            </p>
            <div className="flex gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={filters.q}
                  onChange={(e) => upd("q", e.target.value)}
                  placeholder="Search by skill or name..."
                  className="input pl-9"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {showFilters && (
            <div className="card p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Min Rate (₹/hr)
                </label>
                <input
                  type="number"
                  value={filters.minRate}
                  onChange={(e) => upd("minRate", e.target.value)}
                  className="input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Max Rate (₹/hr)
                </label>
                <input
                  type="number"
                  value={filters.maxRate}
                  onChange={(e) => upd("maxRate", e.target.value)}
                  className="input"
                  placeholder="Any"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Min Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => upd("rating", e.target.value)}
                  className="input"
                >
                  <option value="">Any</option>
                  {[3, 3.5, 4, 4.5].map((r) => (
                    <option key={r} value={r}>
                      {r}+ Stars
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  City
                </label>
                <input
                  value={filters.city}
                  onChange={(e) => upd("city", e.target.value)}
                  className="input"
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {loading
                ? "Loading..."
                : `${pagination.total || 0} freelancers found`}
            </p>
            <select
              value={filters.sort || "-averageRating"}
              onChange={(e) => upd("sort", e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="-averageRating">Top Rated</option>
              <option value="hourlyRate">Price: Low to High</option>
              <option value="-hourlyRate">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card p-5 h-52 animate-pulse bg-slate-100 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No freelancers found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {freelancers.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/freelancers/${p.user?._id}`)}
                  className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center">
                        {p.user?.avatar ? (
                          <img
                            src={p.user.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(p.user?.name)
                        )}
                      </div>
                      {p.user?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate dark:text-white">
                        {p.user?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {p.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {p.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({p.totalReviews})
                    </span>
                  </div>
                  {p.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.skills.slice(0, 3).map((s) => (
                        <span
                          key={s.name}
                          className="text-xs badge-purple px-2 py-0.5"
                        >
                          {s.name}
                        </span>
                      ))}
                      {p.skills.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{p.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t dark:border-slate-600">
                    <div>
                      <p className="text-xs text-slate-400">from</p>
                      <p className="font-bold text-sm">
                        {p.hourlyRate
                          ? `${formatCurrency(p.hourlyRate)}/hr`
                          : "Negotiable"}
                      </p>
                    </div>
                    {p.user?.location?.city && (
                      <span className="text-xs text-slate-400 flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {p.user.location.city}
                      </span>
                    )}
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
