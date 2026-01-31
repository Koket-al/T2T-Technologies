import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import "../pages/EmailVerificationPage.css";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail, clearError } = useAuthStore();

  const handleChange = (index, value) => {
    if (error) clearError();
    if (!/^\d*$/.test(value)) return; // only digits

    const newCode = [...code];

    if (value.length > 1) { // paste
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
    } else {
      newCode[index] = value;
    }

    setCode(newCode);

    const nextIndex = newCode.findIndex((d) => d === "");
    if (nextIndex !== -1) inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    const success = await verifyEmail(verificationCode);
    if (success) {
      toast.success("Email verified successfully!");
      navigate("/");
    } else {
      toast.error("Invalid or expired verification code");
    }
  };

  return (
    <div className="verification-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="verification-card"
      >
        <h2 className="verification-title">Verify Your Email</h2>
        <p className="verification-subtitle">
          Enter the 6-digit code sent to your email.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => clearError()}
                disabled={isLoading}
                className={`code-input ${error ? "input-error" : ""}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="verify-button"
            disabled={isLoading || code.some((d) => !d)}
            type="submit"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>

          <p className="resend-text">
            Didn’t receive a code?{" "}
            <button
              type="button"
              className="resend-link"
              onClick={() => toast.success("New code sent to your email")}
            >
              Resend Code
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
