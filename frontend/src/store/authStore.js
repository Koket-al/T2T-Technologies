import { create } from "zustand";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
  isCheckingAuth: false,

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),

  // ---------------- AUTHENTICATION ----------------
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/auth/signup", { email, password, name });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
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
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
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
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Verification failed", isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/auth/check-auth");
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      set({ isAuthenticated: false, isCheckingAuth: false, user: null });
    }
  },

  logout: async () => {
    try { await api.post("/auth/logout"); } catch (e) {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  // ---------------- MARKETPLACE ----------------
  purchaseItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/marketplace/purchase", { itemId });
      set((state) => ({
        user: { ...state.user, codaBalance: res.data.newBalance },
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      const errorMessage = err.response?.data?.message || "Purchase failed";
      throw new Error(errorMessage);
    }
  },

  // ---------------- REWARDS & WALLET ----------------
  updateUserWallet: async (walletAddress) => {
    set({ isLoading: true });
    try {
      await api.put("/rewards/update-wallet", { walletAddress });
      set((state) => ({
        user: { ...state.user, walletAddress: walletAddress },
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: "Failed to link wallet" });
      throw err;
    }
  },

  convertPointsToCoda: async () => {
    set({ isLoading: true });
    try {
      const res = await api.post("/rewards/convert");
      set((state) => ({
        user: { 
          ...state.user, 
          points: res.data.newPoints, 
          codaBalance: res.data.newCodaBalance 
        },
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ---------------- CREDITCOIN (CTC) IDENTITY & LOANS ----------------
  
  // ✅ NEW: SWAP LOCAL CODA TO GLOBAL CREDITCOIN (CTC)
  swapCodaToCtc: async (amount) => {
    set({ isLoading: true });
    try {
      // Calls the /api/credit/swap route on backend
      const res = await api.post("/credit/swap", { codaAmount: amount });
      set((state) => ({
        user: { 
          ...state.user, 
          codaBalance: res.data.newCodaBalance, 
          ctcBalance: res.data.newCtcBalance 
        },
        isLoading: false
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // ✅ NEW: EXECUTE BLOCKCHAIN LOAN (DISBURSED IN CTC)
  applyForLoan: async () => {
    set({ isLoading: true });
    try {
      // Calls the /api/credit/apply-loan route on backend
      const res = await api.post("/credit/apply-loan");
      set((state) => ({
        user: { 
          ...state.user, 
          ctcBalance: res.data.newBalance, // Loan disbursed into CTC wallet
          activeLoan: true 
        },
        isLoading: false,
      }));
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  }
}));