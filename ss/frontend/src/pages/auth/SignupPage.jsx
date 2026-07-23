import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { authAPI } from "../../api/index";
import { getErrorMessage } from "../../utils/helpers";

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") || "client");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    setLoading(true);
    try {
      await authAPI.signup({ ...form, role });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 p-4 relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors"
          title="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">
            Check your email!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            We sent a verification link to{" "}
            <strong className="dark:text-slate-200">{form.email}</strong>. Click
            the link to activate your account.
          </p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 relative">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800 transition-colors"
        title="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold">
              SS
            </div>
            <span className="font-bold text-xl gradient-text">SkillSphere</span>
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Start your journey today
          </p>
        </div>

        <div className="card p-6">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {
                value: "freelancer",
                label: "I'm a Freelancer",
                desc: "Looking for work",
                Icon: Briefcase,
              },
              {
                value: "client",
                label: "I'm a Client",
                desc: "Hiring talent",
                Icon: Building2,
              },
            ].map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${role === value ? "border-violet-600 bg-violet-50 dark:bg-violet-900/30" : "border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-500 dark:text-slate-200"}`}
              >
                <Icon
                  className={`h-5 w-5 mb-1.5 ${role === value ? "text-violet-600" : "text-slate-400"}`}
                />
                <p className="text-sm font-semibold dark:text-slate-200">
                  {label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {desc}
                </p>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block dark:text-slate-200">
                Full Name
              </label>
              <input
                className="input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              By signing up you agree to our{" "}
              <Link to="/terms" className="text-violet-600">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-violet-600">
                Privacy Policy
              </Link>
            </p>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
