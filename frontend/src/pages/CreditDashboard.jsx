import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api, useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  ShoppingBag, 
  Trophy, 
  ShieldCheck, 
  History, 
  LogOut, 
  ArrowRightLeft, 
  Zap,
  Globe,
  TrendingUp,
  Landmark,
  ChevronLeft
} from "lucide-react";
import '../pages/DashboardPage.css';

const CreditDashboard = () => {
  const { user, logout, swapCodaToCtc, applyForLoan } = useAuthStore();
  const [profile, setProfile] = useState({ creditScore: 300, loanEligibility: 0, totalRecycled: 0 });
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleLogout = () => logout();

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await api.get("/credit/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Credit fetch error");
      }
    };
    fetchCredit();
  }, []);

  const handleSwap = async () => {
    if (user.codaBalance < 10) return toast.error("Min 10 CODA needed to swap");
    setIsSwapping(true);
    try {
      const res = await swapCodaToCtc(10);
      toast.success(res.message, { icon: '🔄' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleLoanExecution = async () => {
    setIsExecuting(true);
    try {
      const res = await applyForLoan();
      toast.success(res.message, { icon: '🏦', duration: 5000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Criteria not met");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="t2t-main-layout">
      {/* --- SIDEBAR (Persistent) --- */}
      <aside className="t2t-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">T2T</div>
          <span>TECHNOLOGIES</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/marketplace" className="nav-item"><ShoppingBag size={20} /> Marketplace</Link>
          <Link to="/lottery" className="nav-item"><Trophy size={20} /> Mega Lottery</Link>
          <Link to="/safety-verification" className="nav-item"><ShieldCheck size={20} /> Food Safety</Link>
          <Link to="/credit-identity" className="nav-item active"><History size={20} /> Credit ID</Link>
          <Link to="/withdraw" className="nav-item cashout"><Wallet size={20} /> Sell Tokens</Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn-premium">
            <LogOut size={18} /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="t2t-content-area">
        <header className="content-header">
          <div>
            <h1>Financial Identity</h1>
            <p>Your sustainability reputation on the <span className="text-emerald-500">Creditcoin Ledger</span></p>
          </div>
          <div className="header-status" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
            <ShieldCheck size={14} />
            <span style={{ letterSpacing: '1px' }}>IDENTITY VERIFIED</span>
          </div>
        </header>

        <div className="dashboard-grid">
          
          {/* SECTION 1: NETWORK REPUTATION (CREDIT SCORE) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid-card vault-card">
            <div className="card-header-flex">
              <h3>Eco-Sustainability Score</h3>
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            
            <div className="balance-display" style={{ textAlign: 'center', display: 'block' }}>
                <span style={{ 
                    fontSize: '6rem', 
                    fontWeight: '900', 
                    background: 'linear-gradient(to bottom, #fff, #444)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}>
                    {profile.creditScore}
                </span>
                <p style={{ color: '#22c55e', fontWeight: 'bold', letterSpacing: '4px', fontSize: '12px', marginTop: '-10px' }}>
                    RANK: {profile.creditScore > 600 ? 'GOLD' : 'STANDARD'}
                </p>
            </div>

            <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(profile.creditScore / 850) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ height: '100%', background: 'linear-gradient(to right, #dc2626, #facc15, #22c55e)' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#444', marginTop: '10px', fontWeight: 'bold' }}>
                <span>POOR</span>
                <span>EXCELLENT (850)</span>
            </div>
          </motion.div>

          {/* SECTION 2: CURRENCY SWAP */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="grid-card">
            <div className="card-header-flex">
              <h3>Asset Exchange</h3>
              <ArrowRightLeft size={18} className="text-emerald-500" />
            </div>
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user?.codaBalance || 0} <small style={{fontSize: '10px', color: '#dc2626'}}>CODA</small></div>
                <div style={{ color: '#333', margin: '10px 0' }}>⇅</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{user?.ctcBalance || 0} <small style={{fontSize: '10px'}}>CTC</small></div>
            </div>
            <button 
                onClick={handleSwap} 
                disabled={isSwapping || (user?.codaBalance < 10)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: user?.codaBalance >= 10 ? '#22c55e' : '#111', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
                {isSwapping ? "SWAPPING..." : "SWAP 10 CODA → 1 CTC"}
            </button>
          </motion.div>

          {/* SECTION 3: LIQUIDITY ACCESS (LOAN) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid-card">
            <div className="card-header-flex">
              <h3>Liquidity Access</h3>
              <Landmark size={18} className="text-yellow-500" />
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#facc15', margin: '15px 0' }}>
                ${profile.loanEligibility}.00
            </div>
            <button 
              onClick={handleLoanExecution}
              disabled={profile.creditScore < 600 || isExecuting}
              className="convert-btn-ultra"
              style={{ 
                background: profile.creditScore >= 600 ? 'var(--coke-red)' : '#111', 
                color: profile.creditScore >= 600 ? '#fff' : '#444' 
              }}
            >
              {isExecuting ? "EXECUTING..." : (profile.creditScore >= 600 ? "DISBURSE LOAN IN CTC" : "LOCKED < 600")}
            </button>
          </motion.div>

          {/* SECTION 4: LEDGER HISTORY */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid-card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header-flex">
              <h3>Global Ledger Transactions</h3>
              <Globe size={18} className="text-blue-400" />
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #111', textAlign: 'left', color: '#444', fontSize: '10px' }}>
                        <th style={{ paddingBottom: '10px' }}>EVENT</th>
                        <th style={{ paddingBottom: '10px' }}>ASSET</th>
                        <th style={{ paddingBottom: '10px' }}>STATUS</th>
                        <th style={{ paddingBottom: '10px' }}>NETWORK</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '12px', color: '#ccc' }}>
                    {user?.activeLoan && (
                        <tr style={{ borderBottom: '1px solid #0a0a0a' }}>
                            <td style={{ padding: '15px 0' }}>Micro-Loan Disbursement</td>
                            <td style={{ color: '#facc15' }}>+{profile.loanEligibility} CTC</td>
                            <td style={{ color: '#22c55e' }}>CONFIRMED</td>
                            <td>SEPOLIA L1</td>
                        </tr>
                    )}
                    <tr style={{ borderBottom: '1px solid #0a0a0a' }}>
                        <td style={{ padding: '15px 0' }}>Identity Reputation Sync</td>
                        <td>Score: {profile.creditScore}</td>
                        <td style={{ color: '#22c55e' }}>SYNCED</td>
                        <td>CREDITCOIN</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '15px 0' }}>Genesis Identity Created</td>
                        <td>Account Init</td>
                        <td style={{ color: '#22c55e' }}>VERIFIED</td>
                        <td>T2T PROTOCOL</td>
                    </tr>
                </tbody>
            </table>
          </motion.div>

        </div>

        <footer className="dashboard-footer-minimal" style={{ marginTop: '60px' }}>
           GLUWA / CREDITCOIN / T2T ALLIANCE | IMMUTABLE FINANCIAL IDENTITY
        </footer>
      </main>
    </div>
  );
};

export default CreditDashboard;