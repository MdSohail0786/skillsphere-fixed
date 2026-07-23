import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authAPI } from '../../api/index';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && <><Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto mb-4" /><p>Verifying your email...</p></>}
        {status === 'success' && (
          <><CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Email Verified! 🎉</h2>
          <p className="text-slate-500 mb-5">Your account is now active.</p>
          <Link to="/login" className="btn-primary">Login Now</Link></>
        )}
        {status === 'error' && (
          <><XCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
          <p className="text-slate-500 mb-5">Invalid or expired token.</p>
          <Link to="/login" className="btn-outline">Back to Login</Link></>
        )}
      </div>
    </div>
  );
}
