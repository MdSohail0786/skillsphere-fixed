import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../api/index';
import { getErrorMessage } from '../../utils/helpers';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try { await authAPI.forgotPassword(email); setDone(true); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6"><ArrowLeft className="h-4 w-4" />Back to login</Link>
        <div className="card p-6">
          <h1 className="text-xl font-bold mb-1">Forgot password?</h1>
          <p className="text-sm text-slate-500 mb-5">Enter your email and we'll send a reset link</p>
          {done ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-3">📬</p>
              <p className="font-medium">Check your email!</p>
              <p className="text-sm text-slate-400 mt-1">If that email exists, a reset link has been sent.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email address</label>
                <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
