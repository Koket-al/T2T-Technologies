import { create } from "zustand";
import axios from "axios";
import { openSTXTransfer } from "@stacks/connect";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Remove any accidental quotes from the token string
    const cleanToken = token.replace(/['"]+/g, "");
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  message: null,
  isCheckingAuth: false,

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),

  // ---------------- 1. AUTHENTICATION ACTIONS ----------------

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/signup", { email, password, name });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Signup failed", isLoading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
      throw err;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/verify-email", { code });
      const updatedUser = { ...res.data.user, isVerified: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false, message: "Email verified!" });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Verification failed", isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, isCheckingAuth: false, user: null });
      return;
    }
    try {
      const res = await api.get("/auth/check-auth");
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ isAuthenticated: false, isCheckingAuth: false, user: null });
    }
  },

  logout: async () => {
    try { await api.post("/auth/logout"); } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/forgot-password", { email });
      set({ message: res.data.message, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Reset Error", isLoading: false });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      set({ message: res.data.message, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Update Error", isLoading: false });
      throw err;
    }
  },

  // ---------------- 2. x402 STACKS PAYMENT LOGIC ----------------

  payX402: async (paymentRequest) => {
    return new Promise((resolve, reject) => {
      if (!paymentRequest || !paymentRequest.amount) {
        return reject(new Error("Malformed Payment Request from Backend"));
      }
      try {
        // Manual Network object to fix the "not a constructor" bug in React 19
        const manualNetwork = {
          version: 1,
          chainId: 2147483648,
          coreApiUrl: "https://api.testnet4.hiro.so",
          isMainnet: () => false,
          getCoreApiUrl: () => "https://api.testnet4.hiro.so",
        };

        openSTXTransfer({
          network: manualNetwork,
          recipient: paymentRequest.recipient,
          amount: paymentRequest.amount.toString(),
          memo: paymentRequest.memo || "T2T Service Fee",
          appDetails: {
            name: "T2T Technologies",
            icon: window.location.origin + "/vite.svg",
          },
          onFinish: (data) => resolve(data.txId),
          onCancel: () => reject(new Error("Handshake Cancelled")),
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  // ---------------- 3. T2T ECONOMY & REWARDS ----------------

  // Redeems code, provides safety report
  claimCode: async (hash) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/rewards/scan", { hash });
      set((state) => ({
        user: { ...state.user, points: state.user.points + res.data.pointsAdded },
        isLoading: false
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Unlocks safety data after x402 payment
  unlockSafety: async (txId, hash) => {
    await api.post("/rewards/unlock-safety", { txId, hash });
    set((state) => {
      const updatedUser = { ...state.user, paidSafetyHashes: [...state.user.paidSafetyHashes, hash] };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  // Unlocks Admin Dashboard after 1 STX payment
  unlockAdmin: async (txId) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/admin/unlock-panel", { txId });
      set((state) => {
        const updatedUser = { ...state.user, hasMarketplaceAccess: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Link Leather wallet address to profile
  updateUserWallet: async (walletAddress) => {
    set({ isLoading: true });
    try {
      await api.put("/rewards/update-wallet", { walletAddress });
      set((state) => {
        const updatedUser = { ...state.user, walletAddress };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Convert Reputation Points into Internal Birr
  convertPointsToBirr: async () => {
    set({ isLoading: true });
    try {
      const res = await api.post("/rewards/convert");
      set((state) => {
        const updatedUser = { ...state.user, points: res.data.newPoints, birrBalance: res.data.newBirrBalance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Swap Birr for Global Creditcoin (CTC)
  swapBirrToCtc: async (amount) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/credit/swap", { birrAmount: amount });
      set((state) => {
        const updatedUser = { ...state.user, birrBalance: res.data.newBirrBalance, ctcBalance: res.data.newCtcBalance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Execute Loan Disbursement
  applyForLoan: async () => {
    set({ isLoading: true });
    try {
      const res = await api.post("/credit/apply-loan");
      set((state) => {
        const updatedUser = { ...state.user, ctcBalance: res.data.newBalance, activeLoan: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Sell Tokens/Birr for Cash (Telebirr/Bank)
  withdrawTokens: async (amount, method, details, tokenType) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/rewards/withdraw", { amount, method, details, tokenType });
      set((state) => {
        const updatedUser = { ...state.user, birrBalance: res.data.newBirrBalance, ctcBalance: res.data.newCtcBalance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser, isLoading: false };
      });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  }
}));
