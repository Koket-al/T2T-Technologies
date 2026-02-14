import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore, api } from "../store/authStore";
import { ShieldCheck, Search, LayoutDashboard, ShoppingBag, Trophy, Wallet, LogOut, Globe, Lock, History as HistoryIcon } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../pages/DashboardPage.css"; 

const SafetyPage = () => {
  const { logout, payX402, unlockSafety, user } = useAuthStore();
  const [code, setCode] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => logout();

  const handleCheck = async (e) => {
    if (e) e.preventDefault();
    if (!code) return;
    setLoading(true);
    setReport(null);

    const bottleHash = code.toUpperCase();

    try {
      // 1. Initial Attempt
      const res = await api.post("/rewards/safety-check", { hash: bottleHash });
      setReport(res.data.safetyReport);
      toast.success("Identity Verified: Data Unlocked");

    } catch (err) {
      if (err.response?.status === 402) {
        // 🚀 x402 MOMENT: Payment Required
        toast("Bitcoin micro-payment required", { icon: '₿' });
        
        try {
          const reqData = err.response.data.paymentRequest;
          const txId = await payX402(reqData); // Trigger Wallet
          
          toast.loading("Verifying on Bitcoin Layer...");
          await new Promise(r => setTimeout(r, 6000)); // Delay for indexer
          
          // 2. Sync backend that we paid
          await unlockSafety(txId, bottleHash);
          
          // 3. Retry to see the data
          const finalRes = await api.post("/rewards/safety-check", { hash: bottleHash });
          setReport(finalRes.data.safetyReport);
          toast.dismiss();
          toast.success("Access Granted!");

        } catch (payErr) {
            toast.dismiss();
            toast.error("Payment failed or cancelled");
        }
      } else {
        toast.error(err.response?.data?.message || "Invalid bottle code");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">T2T</div><span>TECHNOLOGIES</span></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/marketplace" className="nav-item"><ShoppingBag size={20} /> Marketplace</Link>
          <Link to="/lottery" className="nav-item"><Trophy size={20} /> Mega Lottery</Link>
          <Link to="/safety-verification" className="nav-item active"><ShieldCheck size={20} /> Food Safety</Link>
          <Link to="/credit-identity" className="nav-item"><HistoryIcon size={20} /> Credit ID</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={handleLogout} className="logout-btn-premium"><LogOut size={18} /> LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
          <div><h1>Product Passport</h1><p>Traceability powered by <span className="text-red-500">Bitcoin Layer 2</span></p></div>
          <div className="header-status" style={{borderColor: '#facc15', color: '#facc15'}}><Lock size={14} /> x402 ACTIVE</div>
        </header>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <form onSubmit={handleCheck} className="redeem-form">
              <input type="text" placeholder="BOTTLE HASH" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={8} />
              <button type="submit" disabled={loading}>{loading ? "SEARCHING..." : "VERIFY (0.001 STX)"}</button>
            </form>
          </motion.div>

          {report && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="grid-card" style={{ maxWidth: '800px', margin: '30px auto 0', border: '2px solid #22c55e', background: 'linear-gradient(145deg, rgba(6, 32, 6, 0.6), rgba(0, 0, 0, 0.9))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#22c55e', marginBottom: '30px' }}>
                <ShieldCheck size={40} className="pulse-icon" /> <h2 style={{ margin: 0, fontWeight: '900', letterSpacing: '2px' }}>PASSPORT VERIFIED</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                <div className="balance-item"><span className="label">BATCH NUMBER</span><span className="value" style={{fontSize: '1.4rem'}}>{report.batch}</span></div>
                <div className="balance-item"><span className="label">STATUS</span><span className="value" style={{fontSize: '1.4rem', color: '#22c55e'}}>AUTHENTIC</span></div>
                <div className="balance-item"><span className="label">MFG DATE</span><span className="value" style={{fontSize: '1.4rem'}}>{report.mfg}</span></div>
                <div className="balance-item"><span className="label">EXPIRY</span><span className="value" style={{fontSize: '1.4rem', color: '#facc15'}}>{report.exp}</span></div>
              </div>
              <div style={{ marginTop: '40px', background: 'rgba(0,0,0,0.5)', padding: '25px', borderRadius: '20px', border: '1px solid #111' }}>
                <p style={{ color: '#555', fontSize: '10px', fontWeight: 'bold' }}>CERTIFIED INGREDIENTS</p>
                <p style={{ fontSize: '13px', color: '#ccc', lineHeight: '1.8' }}>{report.ingredients}</p>
                <p style={{ marginTop: '10px', fontSize: '10px', color: '#444' }}>Origin: {report.origin}</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SafetyPage;