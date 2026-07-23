import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../api/index';
import { getErrorMessage } from '../../utils/helpers';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await authAPI.resetPassword({ token: params.get('token'), password });
      navigate('/login?reset=success');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50 p-4">
      <div className="w-full max-w-md card p-6">
        <h1 className="text-xl font-bold mb-1">Set new password</h1>
        <p className="text-sm text-slate-500 mb-5">Choose a strong password for your account</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">New Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Resetting...</> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
