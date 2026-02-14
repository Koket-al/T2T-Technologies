import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore, api } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Trophy, ShieldCheck, Wallet, LogOut, Lock, ShoppingCart, History as HistoryIcon } from "lucide-react";
import "../pages/DashboardPage.css"; 

const MarketplacePage = () => {
  const { user, logout, payX402 } = useAuthStore();
  const [items, setItems] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => logout();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/marketplace/items");
      setItems(res.data.items);
      setHasAccess(res.data.hasAccess);
    } catch (err) {
      if (err.response?.status === 402) {
          setHasAccess(false);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUnlock = async () => {
    try {
      // 1. Get payment request data
      const res402 = await api.get("/marketplace/items").catch(e => e.response);
      
      // 2. Open Stacks Wallet
      const txId = await payX402(res402.data.paymentRequest);
      
      toast.loading("Verifying Bitcoin Payment...");

      // 3. Inform Backend of the Payment
      const unlockRes = await api.post("/marketplace/unlock", { txId });

      if (unlockRes.data.success) {
          toast.dismiss();
          toast.success("Identity Verified. Access Granted!");
          setHasAccess(true);
          fetchItems(); 
      }
    } catch (e) {
      toast.dismiss();
      toast.error("Payment failed or cancelled.");
    }
  };

  const handleBuy = async (itemId) => {
    try {
      const res = await api.post("/marketplace/purchase", { itemId });
      toast.success(res.data.message);
      if (user) user.birrBalance = res.data.newBalance;
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">T2T</div><span>TECHNOLOGIES</span></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/marketplace" className="nav-item active"><ShoppingBag size={20} /> Marketplace</Link>
          <Link to="/lottery" className="nav-item"><Trophy size={20} /> Mega Lottery</Link>
          <Link to="/safety-verification" className="nav-item"><ShieldCheck size={20} /> Food Safety</Link>
          <Link to="/credit-identity" className="nav-item"><HistoryIcon size={20} /> Credit ID</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={handleLogout} className="logout-btn-premium"><LogOut size={18} /> LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
          <div><h1>The Marketplace</h1></div>
          <div className="header-status" style={{color: '#facc15'}}><Wallet size={14} /> BALANCE: {user?.birrBalance || 0} ETB</div>
        </header>

        {!hasAccess ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Lock size={60} style={{ color: '#dc2626', marginBottom: '20px' }} className="pulse-icon" />
            <h2 style={{fontWeight: '900'}}>GATEWAY RESTRICTED</h2>
            <p style={{color: '#555', marginBottom: '30px'}}>Pay 0.001 STX to unlock the shop for 2 hours.</p>
            <button onClick={handleUnlock} className="convert-btn-ultra" style={{ maxWidth: '350px', margin: '0 auto', background: '#facc15', color: '#000' }}>
               UNLOCK WITH BITCOIN / STX
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {items.map((item) => (
              <motion.div key={item.id} className="grid-card">
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px' }} />
                <h3 style={{marginTop: '20px'}}>{item.name}</h3>
                <p style={{color: '#dc2626', fontWeight: 'bold'}}>{item.price} BIRR</p>
                <button onClick={() => handleBuy(item.id)} disabled={user?.birrBalance < item.price} className="claim-button mt-4">PURCHASE</button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;