import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="border-t dark:border-slate-700 bg-white dark:bg-slate-900 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
            SS
          </div>
          <span className="font-bold gradient-text">SkillSphere</span>
        </div>
        <div className="flex gap-6 text-sm text-slate-500">
          <Link to="/freelancers" className="hover:text-slate-900">
            Find Freelancers
          </Link>
          <Link to="/jobs" className="hover:text-slate-900">
            Find Jobs
          </Link>
          <Link to="/gigs" className="hover:text-slate-900">
            Browse Gigs
          </Link>
        </div>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} SkillSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
