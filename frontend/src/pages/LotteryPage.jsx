import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore, api } from "../store/authStore"; 
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Trophy, ShieldCheck, 
  Wallet, LogOut, Globe, Sparkles, Ticket, Lock, X
} from "lucide-react";
import "../pages/DashboardPage.css";

const LotteryPage = () => {
  const { user, logout, payX402 } = useAuthStore();
  const [prizes, setPrizes] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: State for the Lucky Number Popup
  const [newTicketNumber, setNewTicketNumber] = useState(null);

  const handleLogout = () => logout();

  const fetchPrizes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lottery/items");
      setPrizes(res.data.items);
      setHasAccess(res.data.hasAccess);
      setUserTickets(res.data.userTickets || []);
    } catch (err) {
      if (err.response?.status === 402) setHasAccess(false);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPrizes(); }, []);

  const handleUnlock = async () => {
    try {
      const res402 = await api.get("/lottery/items").catch(e => e.response);
      const txId = await payX402(res402.data.paymentRequest);
      toast.loading("Broadcasting to Bitcoin Layer...");
      await api.post("/lottery/unlock", { txId });
      toast.dismiss();
      toast.success("Room Unlocked!");
      setHasAccess(true);
      fetchPrizes();
    } catch (e) { toast.dismiss(); toast.error("Payment failed"); }
  };

  const handlePlay = async (prizeId) => {
    setIsSpinning(true);
    try {
      const res = await api.post("/lottery/play", { prizeId });
      if (user) user.birrBalance = res.data.newBalance;
      
      // ✅ SUCCESS: Show the Golden Ticket
      setNewTicketNumber(res.data.luckyNumber);
      fetchPrizes(); // Refresh the list of tickets
    } catch (err) {
      toast.error(err.response?.data?.message || "Lottery error");
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">T2T</div><span>TECHNOLOGIES</span></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/marketplace" className="nav-item"><ShoppingBag size={20} /> Marketplace</Link>
          <Link to="/lottery" className="nav-item active"><Trophy size={20} /> Mega Lottery</Link>
          <Link to="/safety-verification" className="nav-item"><ShieldCheck size={20} /> Food Safety</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={handleLogout} className="logout-btn-premium"><LogOut size={18} /> LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area" style={{ background: 'radial-gradient(circle at 50% 0%, #2b1d00 0%, #000 100%)' }}>
        <header className="content-header">
          <div>
            <h1 style={{ color: 'var(--gold-glow)' }}>Mega Lottery</h1>
            <p>Spend <span style={{ color: 'var(--gold-glow)' }}>Birr</span> for a unique Lucky Number</p>
          </div>
          <div className="header-status" style={{ borderColor: 'var(--gold-glow)', color: 'var(--gold-glow)' }}>
            <Sparkles size={14} className="pulse-icon" />
            <span style={{ letterSpacing: '1px' }}>WALLET: {user?.birrBalance || 0} ETB</span>
          </div>
        </header>

        {!hasAccess ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Lock size={60} style={{ color: '#dc2626', marginBottom: '20px' }} className="pulse-icon" />
            <h2 style={{fontWeight: '900'}}>ROOM RESTRICTED</h2>
            <button onClick={handleUnlock} className="convert-btn-ultra" style={{ maxWidth: '350px', margin: '0 auto', background: '#facc15', color: '#000' }}>UNLOCK WITH BITCOIN</button>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
                {prizes.map((prize) => (
                <motion.div key={prize.id} whileHover={{ scale: 1.02 }} className="grid-card" style={{ border: '1px solid rgba(250, 204, 21, 0.2)', background: 'rgba(0,0,0,0.8)' }}>
                    <img src={prize.image} alt={prize.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' }} />
                    <h3 className="text-white mt-4">{prize.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-glow)', margin: '15px 0' }}>
                        <Ticket size={16} />
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>ENTRY: {prize.ticketPrice} BIRR</span>
                    </div>
                    <button onClick={() => handlePlay(prize.id)} disabled={isSpinning || (user?.birrBalance < prize.ticketPrice)} className="claim-button" style={{ background: 'linear-gradient(to right, #facc15, #eab308)', color: '#000' }}>
                    {isSpinning ? "GENERATING..." : "BUY TICKET"}
                    </button>
                </motion.div>
                ))}
            </div>

            {/* ✅ YOUR TICKETS SECTION */}
            <h2 style={{marginTop: '50px', fontSize: '1.5rem', fontWeight: '900'}}>YOUR ACTIVE TICKETS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {userTickets.map(t => (
                    <div key={t._id} style={{ background: '#0a0a0a', border: '1px solid #222', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                        <p style={{fontSize: '10px', color: '#555', margin: 0}}>{t.prizeName.toUpperCase()}</p>
                        <p style={{fontSize: '1.5rem', fontWeight: '900', color: '#facc15', margin: '5px 0'}}>#{t.ticketNumber}</p>
                        <p style={{fontSize: '10px', color: '#22c55e'}}>STATUS: {t.status}</p>
                    </div>
                ))}
            </div>
          </>
        )}

        {/* ✅ GOLDEN TICKET POPUP */}
        <AnimatePresence>
            {newTicketNumber && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="grid-card" style={{ background: 'linear-gradient(135deg, #facc15, #eab308)', color: '#000', maxWidth: '350px', width: '100%', textAlign: 'center' }}>
                        <Trophy size={50} style={{ margin: '0 auto 10px' }} />
                        <h2 style={{fontWeight: '900', margin: 0}}>GOLDEN TICKET</h2>
                        <div style={{ background: '#000', color: '#facc15', padding: '30px', borderRadius: '20px', margin: '20px 0', border: '3px dashed #facc15' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '5px' }}>#{newTicketNumber}</span>
                        </div>
                        <p style={{fontSize: '12px', fontWeight: 'bold'}}>This number has been recorded on the T2T Ledger. Good luck!</p>
                        <button onClick={() => setNewTicketNumber(null)} style={{ width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '15px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' }}>DONE</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LotteryPage;