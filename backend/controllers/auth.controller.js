import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { validateAuthInput, generateSecureCode, hashToken } from "../utils/security.js";
import jwt from "jsonwebtoken";

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!validateAuthInput(email, password, name)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateSecureCode();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    // ✅ Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    generateTokenAndSetCookie(res, user._id); 

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
      token, 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!validateAuthInput(email, password)) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
      token, 
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ---------------- VERIFY EMAIL (UPDATED & FIXED) ----------------
export const verifyEmail = async (req, res) => {
  // FIX: Changed from verificationCode to code to match Frontend Zustand call
  const { code } = req.body;

  try {
    console.log("--- Verification Request Received ---");
    console.log("Attempting to verify with code:", code);

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Result: Invalid or expired code");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verification code" });
    }

    console.log("✅ Result: User Found, Verifying:", user.email);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (typeof email !== "string")
    return res.status(400).json({ success: false, message: "Invalid input" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!validateAuthInput("test@test.com", password)) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const hashedToken = hashToken(token);

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};

// ---------------- CHECK AUTH ----------------
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("checkAuth error:", error);
    res.status(400).json({ success: false, message: "Server error" });
  }
};