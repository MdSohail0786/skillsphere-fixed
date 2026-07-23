import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Star, Clock } from "lucide-react";
import { gigAPI } from "../api/index";
import { formatCurrency, getInitials, CATEGORIES } from "../utils/helpers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function GigsPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: sp.get("q") || "",
    category: sp.get("category") || "",
    minPrice: "",
    maxPrice: "",
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
      const { data } = await gigAPI.getAll({ ...clean, limit: 12 });
      setGigs(data.data || []);
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
              Browse <span className="text-yellow-300">Gigs</span>
            </h1>
            <p className="text-violet-100 mb-5">
              Find the perfect service for your needs
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={filters.q}
                onChange={(e) => upd("q", e.target.value)}
                placeholder="Search gigs..."
                className="input pl-9 bg-white w-full"
              />
            </div>
          </div>
        </div>

        <div className="border-b bg-white dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => upd("category", "")}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!filters.category ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500 dark:hover:bg-slate-800 dark:text-slate-300"}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => upd("category", filters.category === c ? "" : c)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filters.category === c ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500 dark:hover:bg-slate-800 dark:text-slate-300"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : `${pagination.total || 0} gigs found`}
            </p>
            <select
              value={filters.sort || "-createdAt"}
              onChange={(e) => upd("sort", e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            >
              <option value="-createdAt">Newest</option>
              <option value="-averageRating">Best Rated</option>
              <option value="-orders">Most Popular</option>
              <option value="packages.basic.price">Price: Low to High</option>
            </select>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="card h-72 animate-pulse bg-slate-100 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <p className="font-medium">No gigs found</p>
              <p className="text-sm">Try different filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {gigs.map((g) => (
                <div
                  key={g._id}
                  onClick={() => navigate(`/gigs/${g._id}`)}
                  className="card hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="h-40 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center relative overflow-hidden">
                    {g.media?.images?.[0] ? (
                      <img
                        src={g.media.images[0]}
                        alt={g.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-5xl">🎨</span>
                    )}
                    <span className="absolute top-2 left-2 bg-white/90 dark:bg-slate-800/90 text-xs font-medium px-2 py-0.5 rounded-full dark:text-slate-200">
                      {g.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                        {getInitials(g.freelancer?.name)}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {g.freelancer?.name}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2 mb-3 group-hover:text-violet-600 transition-colors">
                      {g.title}
                    </p>
                    {g.averageRating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">
                          {g.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({g.totalReviews})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t dark:border-slate-600">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {g.packages?.basic?.deliveryTime}d
                      </span>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">from</p>
                        <p className="font-bold text-sm">
                          {formatCurrency(g.packages?.basic?.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
