import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api, useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, Wallet, Landmark, Info, ChevronLeft, ArrowRightLeft, Globe } from "lucide-react";

const CreditDashboard = () => {
  const { user, swapCodaToCtc, applyForLoan } = useAuthStore();
  const [profile, setProfile] = useState({ creditScore: 300, loanEligibility: 0, totalRecycled: 0 });
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

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
      // Swaps 10 CODA for 1 CTC
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

  // --- PREMIUM CSS STYLES ---
  const styles = {
    page: {
      background: 'radial-gradient(circle at 50% 0%, #2b0000 0%, #000000 100%)',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden'
    },
    container: { maxWidth: '1000px', width: '100%' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    card: {
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '30px',
      padding: '30px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    scoreValue: {
      fontSize: 'clamp(60px, 10vw, 100px)',
      fontWeight: '900',
      lineHeight: '1',
      display: 'block',
      margin: '20px 0',
      textAlign: 'center'
    },
    progressBar: { height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' },
    button: {
      width: '100%',
      padding: '15px',
      borderRadius: '15px',
      border: 'none',
      fontWeight: '900',
      fontSize: '12px',
      cursor: 'pointer',
      transition: '0.3s',
      textTransform: 'uppercase',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Navigation & Status */}
        <div style={styles.nav}>
          <Link to="/" style={{ color: '#ef4444', fontWeight: 'bold', textDecoration: 'none', fontSize: '12px' }}>
            ← RETURN TO HUB
          </Link>
          <div style={{ color: '#60a5fa', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Globe size={12} /> SEPOLIA MAINNET: CONNECTED
          </div>
        </div>

        {/* Page Hero */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', margin: '0', letterSpacing: '-2px' }}>
            CREDIT <span style={{ color: '#dc2626' }}>ID</span>
          </h1>
          <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(34,197,94,0.2)', display: 'inline-block', padding: '6px 18px', borderRadius: '25px', marginTop: '10px' }}>
            <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> VERIFIED BY CREDITCOIN PROTOCOL
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          
          {/* Section 1: Reputation Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...styles.card, gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>NETWORK REPUTATION</span>
              <TrendingUp style={{ color: '#22c55e' }} />
            </div>
            
            <div>
                <span style={styles.scoreValue}>{profile.creditScore}</span>
                <p style={{ color: '#22c55e', fontWeight: 'bold', letterSpacing: '4px', textAlign: 'center', fontSize: '12px' }}>
                  RANK: {profile.creditScore > 600 ? 'GOLD' : 'STANDARD'}
                </p>
            </div>

            <div style={styles.progressBar}>
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(profile.creditScore / 850) * 100}%` }}
                    transition={{ duration: 1.5 }}
                    style={{ height: '100%', background: 'linear-gradient(to right, #dc2626, #eab308, #22c55e)' }} 
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444', marginTop: '10px', fontWeight: 'bold' }}>
                <span>POOR</span>
                <span>EXCELLENT (850)</span>
            </div>
          </motion.div>

          {/* Section 2: Currency Swap */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ArrowRightLeft size={24} style={{ color: '#22c55e' }} />
                <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold' }}>CURRENCY SWAP</span>
            </div>
            
            <div style={{ margin: '15px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{user?.codaBalance || 0} <span style={{fontSize: '10px', color: '#dc2626'}}>CODA</span></div>
                <div style={{ color: '#444', fontSize: '18px', margin: '8px 0' }}>⇅</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#22c55e' }}>{user?.ctcBalance || 0} <span style={{fontSize: '10px'}}>CTC</span></div>
            </div>

            <button 
              onClick={handleSwap}
              disabled={isSwapping || (user?.codaBalance < 10)}
              style={{
                ...styles.button,
                background: user?.codaBalance >= 10 ? '#22c55e' : '#111',
                color: user?.codaBalance >= 10 ? '#000' : '#444'
              }}
            >
              {isSwapping ? "Swapping..." : "SWAP 10 CODA → 1 CTC"}
            </button>
          </motion.div>

          {/* Section 3: Loan Execution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...styles.card, gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Landmark size={24} style={{ color: '#eab308' }} />
                <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold' }}>LIQUIDITY ACCESS</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '64px', fontWeight: '900', color: '#eab308' }}>${profile.loanEligibility}.00</div>
                <button 
                  onClick={handleLoanExecution}
                  disabled={profile.creditScore < 600 || isExecuting}
                  style={{
                    ...styles.button,
                    width: 'auto',
                    padding: '18px 40px',
                    background: profile.creditScore >= 600 ? '#dc2626' : '#111',
                    color: profile.creditScore >= 600 ? '#fff' : '#444',
                    boxShadow: profile.creditScore >= 600 ? '0 0 20px rgba(220,38,38,0.4)' : 'none'
                  }}
                >
                  {isExecuting ? "Executing Transaction..." : "DISBURSE LOAN IN CTC"}
                </button>
            </div>
            <p style={{ color: '#555', fontSize: '10px', marginTop: '15px' }}>* Repayments are automatically handled through future recycling efforts.</p>
          </motion.div>

          {/* Section 4: Asset Tracking */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Wallet size={24} style={{ color: '#dc2626' }} />
                <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold' }}>LIVE ASSET STORAGE</span>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#777' }}>CODA Balance</span>
                    <span style={{ fontWeight: 'bold' }}>{user?.codaBalance || 0}</span>
                </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#777' }}>CTC Balance</span>
                    <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{user?.ctcBalance || 0}</span>
                </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <div style={{ ...styles.card, gridColumn: '1 / -1', background: 'transparent', border: '1px dashed #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Info size={30} style={{ color: '#60a5fa' }} />
                <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: '0' }}>
                    Your sustainability score is an immutable record. By converting local <b>CODA</b> tokens to <b>Creditcoin (CTC)</b>, 
                    you are transforming recycling effort into global financial collateral.
                </p>
            </div>
          </div>

        </div>
        {/* LOAN LEDGER HISTORY */}
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ ...styles.card, marginTop: '30px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <ShieldCheck size={24} style={{ color: '#22c55e' }} />
        <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold' }}>CREDITCOIN TRANSACTION LEDGER</span>
    </div>
    
    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', fontSize: '12px' }}>
        <thead>
            <tr style={{ borderBottom: '1px solid #222', textAlign: 'left' }}>
                <th style={{ padding: '10px 0' }}>EVENT</th>
                <th style={{ padding: '10px 0' }}>ASSET</th>
                <th style={{ padding: '10px 0' }}>STATUS</th>
                <th style={{ padding: '10px 0' }}>NETWORK</th>
            </tr>
        </thead>
        <tbody>
            {user?.activeLoan && (
                <tr style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '15px 0' }}>Micro-Loan Disbursement</td>
                    <td style={{ color: '#facc15' }}>+{profile.loanEligibility} CTC</td>
                    <td style={{ color: '#22c55e' }}>CONFIRMED</td>
                    <td style={{ color: '#60a5fa' }}>SEPOLIA L1</td>
                </tr>
            )}
            <tr style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '15px 0' }}>Identity Sync</td>
                <td>Score: {profile.creditScore}</td>
                <td style={{ color: '#22c55e' }}>SYNCED</td>
                <td style={{ color: '#60a5fa' }}>CREDITCOIN</td>
            </tr>
        </tbody>
    </table>
</motion.div>

        {/* Footer */}
        <footer style={{ marginTop: '80px', textAlign: 'center', opacity: '0.2', fontSize: '10px', letterSpacing: '4px', paddingBottom: '40px' }}>
            GLUWA / CREDITCOIN / COCA-COLA ALLIANCE 2026
        </footer>
      </div>
    </div>
  );
};

export default CreditDashboard;