import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import MarketplacePage from "./pages/MarketplacePage";
import LotteryPage from "./pages/LotteryPage";
import CreditDashboard from "./pages/CreditDashboard";

// Protect routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect authenticated users away from auth pages (login/signup)
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // ✅ FIXED: Destructured isAuthenticated here so it can be used in the routes below
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
      <div className="app-background">
        <FloatingShape
          color="bg-green-500"
          size="w-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <Routes>
          {/* Main Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Marketplace - Now Protected */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Lottery - Now Protected */}
          <Route
            path="/lottery"
            element={
              <ProtectedRoute>
                <LotteryPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Credit Identity - Now Protected and fixed error */}
          <Route
            path="/credit-identity"
            element={
              <ProtectedRoute>
                <CreditDashboard />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
