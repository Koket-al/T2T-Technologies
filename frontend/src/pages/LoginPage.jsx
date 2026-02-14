import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, ShieldCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import "../pages/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-gate-wrapper">
      {/* Background Decorative Elements */}
      <div className="cyber-ring"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-glass-card"
      >
        <div className="login-header">
          <div className="brand-section">
            <h1 className="brand-logo-text">T2T</h1>
            <p className="brand-subtext">TECHNOLOGIES</p>
          </div>
          <h2 className="gate-title">IDENTITY AUTHENTICATION</h2>
          <div className="system-status">
            <Globe size={12} className="pulse-icon" /> 
            <span>SECURE NODE 01: ONLINE</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form-cyber">
          <div className="input-group">
            <Input
              icon={Mail}
              type="email"
              placeholder="Operator Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Input
              icon={Lock}
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot-password-box">
            <Link to="/forgot-password">
              REQUEST KEY RESET
            </Link>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="cyber-error-box"
            >
              <ShieldCheck size={16} /> {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="gate-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="spinner" /> : "INITIATE SESSION"}
          </motion.button>
        </form>

        <div className="login-gate-footer">
          <p>
            UNAUTHORIZED ACCESS PROHIBITED?{" "}
            <Link to="/signup" className="signup-highlight">
                CREATE IDENTITY
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="bottom-compliance">
        T2T PROTOCOL v4.0.2 | ENCRYPTION: ACTIVE
      </div>
    </div>
  );
};

export default LoginPage;