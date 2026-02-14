import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Added Admin Dashboard
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MarketplacePage from "./pages/MarketplacePage";
import LotteryPage from "./pages/LotteryPage";
import CreditDashboard from "./pages/CreditDashboard";
import SafetyPage from "./pages/SafetyPage";

import HomePage from "./pages/HomePage"; 
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import NetworkHealth from "./pages/NetworkHealth";
import SecurityHub from "./pages/SecurityHub";
import Inventory from "./pages/Inventory";
import SmartBinAI from "./pages/SmartBinAI";

// --- PROTECTED ROUTE LOGIC (For Regular Users) ---
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

// --- ADMIN ROUTE LOGIC (Strict Access Control) ---
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in but NOT an admin, send them to the user dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- AUTH REDIRECT LOGIC ---
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
      <div className="app-background">
        {/* Consistent Cyber-Red Atmosphere */}
        <FloatingShape color="bg-red-600" size="w-64" top="-5%" left="10%" delay={0} />
        <FloatingShape color="bg-red-900" size="w-48" top="70%" left="80%" delay={5} />
        <FloatingShape color="bg-zinc-800" size="w-32" top="40%" left="-10%" delay={2} />

        <Routes>
          {/* 
            ✅ THE SMART ROOT ROUTE 
            1. Not Logged In -> Show Landing (HomePage)
            2. Logged In as Admin -> Show Admin Control Room
            3. Logged In as User -> Show User Hub
          */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <HomePage />
              ) : user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              )
            }
          />

          {/* --- ADMIN ONLY ROUTES --- */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* --- PROTECTED USER ROUTES --- */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lottery"
            element={
              <ProtectedRoute>
                <LotteryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/credit-identity"
            element={
              <ProtectedRoute>
                <CreditDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/safety-verification"
            element={
              <ProtectedRoute>
                <SafetyPage />
              </ProtectedRoute>
            }
          />

          

          {/* --- AUTHENTICATION FLOW --- */}
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
          <Route 
  path="/smart-bin" 
  element={<ProtectedRoute><SmartBinAI /></ProtectedRoute>} 
/>
     <Route path="/admin/health" element={<AdminRoute><NetworkHealth /></AdminRoute>} />
<Route path="/admin/security" element={<AdminRoute><SecurityHub /></AdminRoute>} />
<Route path="/admin/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />


          {/* --- GLOBAL FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;