import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="login-container"
    >
      <div className="login-content">
        <h2 className="login-title">Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          {error && <p className="error-message">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="login-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="spinner" /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="login-footer">
        <p className="footer-text">
          Don't have an account?{" "}
          <Link to="/signup" className="footer-link">
              Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;