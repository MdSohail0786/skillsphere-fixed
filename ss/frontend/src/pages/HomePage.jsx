import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Star,
  Users,
  Briefcase,
  Shield,
  MapPin,
  Zap,
} from "lucide-react";
import { freelancerAPI, gigAPI } from "../api/index";
import { formatCurrency, getInitials, CATEGORIES } from "../utils/helpers";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    Promise.all([
      freelancerAPI.getAll({ limit: 4, sort: "-averageRating" }),
      gigAPI.getAll({ limit: 6 }),
    ])
      .then(([f, g]) => {
        setFreelancers(f.data.data || []);
        setGigs(g.data.data || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🚀 AI-Powered Hyperlocal Freelancing
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight">
              Find the <span className="gradient-text">Perfect Talent</span>
              <br />
              Near You
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
              Connect with verified local freelancers using AI-powered matching.
              Post jobs, hire talent, and grow your business.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/freelancers?q=${q}`);
              }}
              className="flex gap-3 max-w-xl mx-auto mb-6"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search skills, services..."
                  className="input pl-12 h-12 text-base"
                />
              </div>
              <button
                type="submit"
                className="btn-primary h-12 px-6 flex items-center gap-2"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-slate-400">Popular:</span>
              {["React", "Node.js", "UI/UX Design", "Python", "WordPress"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => navigate(`/gigs?q=${s}`)}
                    className="text-sm text-violet-600 hover:underline"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-slate-200 dark:border-slate-700">
          {[
            ["50K+", "Freelancers"],
            ["100K+", "Jobs Done"],
            ["4.9★", "Avg Rating"],
            ["₹0", "To Join"],
          ].map(([v, l]) => (
            <div
              key={l}
              className="py-6 text-center border-r border-slate-200 dark:border-slate-700 last:border-0"
            >
              <div className="text-2xl font-bold gradient-text">{v}</div>
              <div className="text-sm text-slate-400 mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/gigs?category=${cat}`)}
                className="card p-4 text-center hover:border-violet-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/40 flex items-center justify-center mx-auto mb-2 group-hover:bg-violet-100 dark:group-hover:bg-violet-800/50">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                </div>
                <p className="text-sm font-medium line-clamp-2">{cat}</p>
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/gigs"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-3">
              Why <span className="gradient-text">SkillSphere</span>?
            </h2>
            <p className="text-center text-slate-500 mb-10">
              Everything you need to succeed in the gig economy
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: MapPin,
                  title: "Hyperlocal Matching",
                  desc: "Find freelancers in your city, state, or by pincode for better collaboration.",
                  color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40",
                },
                {
                  icon: Zap,
                  title: "AI Recommendations",
                  desc: "Scored 0–100 by skills, budget, rating, and location. No manual hunting.",
                  color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40",
                },
                {
                  icon: Shield,
                  title: "Secure Payments",
                  desc: "Funds in escrow via Razorpay. Released only after milestone approval.",
                  color: "text-green-600 bg-green-100 dark:bg-green-900/40",
                },
                {
                  icon: Star,
                  title: "Verified Reviews",
                  desc: "All reviews come from verified completed projects only.",
                  color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40",
                },
                {
                  icon: Users,
                  title: "Real-time Chat",
                  desc: "Built-in chat, file sharing, typing indicators and online presence.",
                  color: "text-pink-600 bg-pink-100 dark:bg-pink-900/40",
                },
                {
                  icon: Briefcase,
                  title: "Career Tools",
                  desc: "Portfolio builder, skill badges, level tiers, and earnings analytics.",
                  color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40",
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card p-5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Freelancers */}
        {freelancers.length > 0 && (
          <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                Top <span className="gradient-text">Freelancers</span>
              </h2>
              <Link
                to="/freelancers"
                className="btn-outline text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {freelancers.map((p) => (
                <div
                  key={p._id}
                  className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => navigate(`/freelancers/${p.user?._id}`)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
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
                    <div>
                      <p className="font-semibold text-sm">{p.user?.name}</p>
                      <p className="text-xs text-slate-400">{p.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {p.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({p.totalReviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">
                      {p.hourlyRate
                        ? `${formatCurrency(p.hourlyRate)}/hr`
                        : "Negotiable"}
                    </span>
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
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-4 text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-violet-100 mb-8 max-w-md mx-auto">
            Join thousands of freelancers and clients already using SkillSphere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup?role=freelancer"
              className="bg-white text-violet-600 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              Become a Freelancer
            </Link>
            <Link
              to="/signup?role=client"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Hire Talent
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
