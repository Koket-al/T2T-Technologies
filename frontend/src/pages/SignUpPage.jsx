import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, ShieldCheck, Globe } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import "../pages/SignUpPage.css";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-gate-wrapper">
      {/* Background Decorative Element */}
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
          <h2 className="gate-title">IDENTITY PROVISIONING</h2>
          <div className="system-status">
            <Globe size={12} className="pulse-icon" /> 
            <span>ESTABLISHING NEW NODE</span>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="login-form-cyber">
          <div className="input-group">
            <Input
              icon={User}
              type="text"
              placeholder="Full Operator Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Input
              icon={Mail}
              type="email"
              placeholder="Designated Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Input
              icon={Lock}
              type="password"
              placeholder="Security Key (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

          <div className="strength-meter-container">
            <PasswordStrengthMeter password={password} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="gate-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="spinner" /> : "GENERATE IDENTITY"}
          </motion.button>
        </form>

        <div className="login-gate-footer">
          <p>
            ALREADY REGISTERED?{" "}
            <Link to="/login" className="signup-highlight">
              AUTHENTICATE SESSION
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="bottom-compliance">
        T2T PROTOCOL v4.0.2 | COMPLIANCE: VERIFIED
      </div>
    </div>
  );
};

export default SignUpPage;