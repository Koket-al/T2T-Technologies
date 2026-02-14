import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore, api } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { LayoutDashboard, Wallet, ShoppingBag, Trophy, ShieldCheck, History, LogOut, ArrowRightLeft, Zap, Globe, User } from "lucide-react";
import '../pages/DashboardPage.css';

const DashboardPage = () => {
  const { user, logout, convertPointsToBirr } = useAuthStore();
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState("");

  const handleClaim = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/rewards/scan", { hash: manualCode.toUpperCase() });
      setStatus(`✅ SUCCESS: +${res.data.pointsAdded} PTS`);
      if (user) user.points += res.data.pointsAdded;
    } catch (err) { setStatus("❌ ERROR"); }
  };

  const handleConvert = async () => {
    try {
      const res = await convertPointsToBirr();
      toast.success(res.message);
    } catch (e) { toast.error("100 Points Required"); }
  };

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">T2T</div><span>TECHNOLOGIES</span></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/marketplace" className="nav-item"><ShoppingBag size={20} /> Marketplace</Link>
          <Link to="/lottery" className="nav-item"><Trophy size={20} /> Mega Lottery</Link>
          <Link to="/safety-verification" className="nav-item"><ShieldCheck size={20} /> Food Safety</Link>
          <Link to="/credit-identity" className="nav-item"><History size={20} /> Credit ID</Link>
          

        </nav>
        <div className="sidebar-footer"><button onClick={logout} className="logout-btn-premium"><LogOut size={18} /> LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
            <div><h1>Command Center</h1><p>ID: <span className="text-red-500">{user?.recyclerId}</span></p></div>
            <div className="header-status"><Globe size={14} className="pulse-icon" /><span>BITCOIN LAYER ACTIVE</span></div>
        </header>

        <div className="dashboard-grid">
          <div className="grid-card vault-card">
            <h3>Asset Vault</h3>
            <div className="balance-display">
                <div className="balance-item"><span className="label">Points</span><span className="value">{user?.points || 0}</span></div>
                <div className="balance-item gold-text"><span className="label">BIRR BALANCE</span><span className="value">{user?.birrBalance || 0} <small>ETB</small></span></div>
            </div>
            <button onClick={handleConvert} className="convert-btn-ultra">CONVERT POINTS → BIRR</button>
          </div>

          <div className="grid-card redeem-card">
            <h3>Redeem Bottle Code</h3>
            <form onSubmit={handleClaim} className="redeem-form">
              <input type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value.toUpperCase())} maxLength={8} placeholder="CODE" />
              <button type="submit">CLAIM REWARD</button>
            </form>
            {status && <div className="status-pill">{status}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};
export default DashboardPage;