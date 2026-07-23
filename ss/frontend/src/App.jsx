import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useNotificationStore } from "./store/notificationStore";
import { useSocket } from "./hooks/useSocket";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/common/Toast";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const FreelancersPage = lazy(() => import("./pages/FreelancersPage"));
const GigsPage = lazy(() => import("./pages/GigsPage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const FreelancerDashboard = lazy(
  () => import("./pages/dashboard/FreelancerDashboard"),
);
const ClientDashboard = lazy(() => import("./pages/dashboard/ClientDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));

const Spinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// OAuth callback handler
function OAuthCallback() {
  const { fetchMe } = useAuthStore();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("ss_token", token);
      fetchMe().then(() => {
        window.location.href = "/";
      });
    } else {
      window.location.href = "/login?error=oauth_failed";
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500">Completing sign in...</p>
      </div>
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-8xl font-bold gradient-text mb-3">404</h1>
      <p className="text-xl text-slate-500 mb-6">Page not found</p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetch: fetchNotifications } = useNotificationStore();
  const { toasts, toast, dismiss } = useToast();

  useEffect(() => {
    useThemeStore.getState().init();
  }, []);
  useEffect(() => {
    fetchMe();
  }, []);
  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);
  useEffect(() => {
    window.__toast = toast;
  }, [toast]);

  useSocket();

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Protected: Freelancer */}
          <Route
            path="/dashboard/freelancer"
            element={
              <ProtectedRoute roles={["freelancer"]}>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/freelancer/*"
            element={
              <ProtectedRoute roles={["freelancer"]}>
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Client */}
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute roles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client/*"
            element={
              <ProtectedRoute roles={["client"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Any Auth */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </>
  );
}
