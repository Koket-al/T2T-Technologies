import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import "../pages/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="forgot-password-container"
    >
      
      <div className="forgot-password-content">
        <h2 className="forgot-password-title">Forgot Password</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="forgot-password-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="submit-button"
              type="submit"
            >
              {isLoading ? <Loader className="spinner" /> : "Send Reset Link"}
            </motion.button>
          </form>
          
        ) : 
        (
          
          <div className="success-message">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="success-icon"
            >
              <Mail className="mail-icon" />
            </motion.div>
            
            <p className="success-text">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <div className="forgot-password-footer">
        <Link to="/login" className="back-link">
          <ArrowLeft className="back-icon" /> Back to Login
        </Link>
      </div>
          </div>
        )}
      </div>

      
    </motion.div>
  );
};

export default ForgotPasswordPage;