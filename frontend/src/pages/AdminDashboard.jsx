import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore, api } from "../store/authStore";
import { 
  Database, ShieldAlert, LogOut, Globe, Cpu, Lock, 
  Terminal, Activity, Layers, LayoutGrid, History, FileDown,
  CheckCircle2, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import '../pages/DashboardPage.css';

const AdminDashboard = () => {
  const { user, logout, payX402, unlockAdmin } = useAuthStore();
  const location = useLocation();
  
  const [hasAccess, setHasAccess] = useState(false); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [batches, setBatches] = useState([]); 
  
  // Form State
  const [form, setForm] = useState({ 
    count: 50, 
    batchId: "T2T-BATCH-2026", 
    expDate: "", 
    ingredients: "Carbonated Water, Sugar, Caramel Color, Phosphoric Acid, Caffeine" 
  });

  // Helper to check active route
  const isActive = (path) => location.pathname === path ? 'active' : '';

  // 1. ACCESS CONTROL: Check if Corporate License is active
  useEffect(() => {
    if (user?.hasMarketplaceAccess) {
        setHasAccess(true);
        fetchHistory();
    }
  }, [user]);

  // 2. FETCH PRODUCTION HISTORY
  const fetchHistory = async () => {
    try {
        const res = await api.get("/admin/batch-history");
        setBatches(res.data.batches);
    } catch (err) { 
        console.error("Ledger Node Offline"); 
    }
  };

  // 3. EXPORT HASHES TO TXT FILE
  const handleDownload = async (batchId) => {
    try {
        const res = await api.get(`/admin/export/${batchId}`);
        const element = document.createElement("a");
        const file = new Blob([res.data.codeList], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `T2T_FACTORY_BATCH_${batchId}.txt`;
        document.body.appendChild(element);
        element.click();
        toast.success("Industrial Hashes Exported for Etching");
    } catch (e) { 
        toast.error("Export Protocol Failure"); 
    }
  };

  // 4. B2B HANDSHAKE: Pay 1 STX via x402 to Unlock Admin Panel
  const handleCorporateUnlock = async () => {
    setIsUnlocking(true);
    try {
        toast("Initiating Corporate Handshake...", { icon: '🤝' });
        
        const txId = await payX402({ 
            amount: 1000000, // 1 STX
            recipient: "ST1PQHQKV0RJ7V66A9KTC18A5M0939W826GPX8SR" 
        });
        
        toast.loading("Verifying License on Bitcoin Layer...");
        await unlockAdmin(txId);
        
        toast.dismiss();
        toast.success("T2T Enterprise Node Active!");
    } catch (e) { 
        toast.dismiss();
        toast.error("License Handshake Cancelled"); 
    } finally { 
        setIsUnlocking(false); 
    }
  };

  // 5. EXECUTE GENERATION: Creates Pairs (Cap + Body)
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.batchId || !form.count || !form.expDate) {
        return toast.error("PROTOCOL ERROR: Missing Batch Parameters");
    }

    setIsGenerating(true);
    try {
      const res = await api.post("/admin/generate-batch", form);
      toast.success(res.data.message, { icon: '🏭' });
      fetchHistory(); 
      setForm({ ...form, batchId: "" }); // Reset ID
    } catch (err) { 
        toast.error("Database Connection Failed"); 
    } finally { 
        setIsGenerating(false); 
    }
  };

  const handleLogout = () => logout();

  // --- STYLING CONSTANTS ---
  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: '900',
    color: '#dc2626',
    marginBottom: '8px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase'
  };

  const inputStyle = {
    width: '100%',
    background: '#000000', // Black background
    border: '1px solid #333',
    padding: '15px',
    borderRadius: '12px',
    color: '#ffffff', // ✅ FIXED: White font color so you can see it
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  };

  const inputContainerStyle = {
    background: 'rgba(255,255,255,0.02)',
    padding: '15px',
    borderRadius: '15px',
    border: '1px solid #111'
  };

  // --- RENDER LOCKED SCREEN (B2B Paywall) ---
  if (!user?.hasMarketplaceAccess) {
    return (
        <div className="t2t-main-layout" style={{justifyContent: 'center', alignItems: 'center', background: '#000'}}>
            <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="grid-card" style={{maxWidth: '450px', textAlign: 'center', border: '1px solid #dc2626', padding: '50px'}}>
                <Lock size={60} style={{color: '#dc2626', margin: '0 auto 20px'}} className="pulse-icon" />
                <h1 style={{fontWeight: '900', color: '#fff', fontSize: '24px', letterSpacing: '-1px'}}>ROOT ACCESS LOCKED</h1>
                <p style={{color: '#666', marginBottom: '30px', fontSize: '13px', lineHeight: '1.6'}}>To enable the Batch Production Engine, this node must be provisioned with a 1 STX Corporate License via the Stacks protocol.</p>
                
                <button 
                    onClick={handleCorporateUnlock} 
                    disabled={isUnlocking} 
                    className="convert-btn-ultra" 
                    style={{background: '#dc2626', color: '#fff', boxShadow: '0 0 30px rgba(220, 38, 38, 0.3)'}}
                >
                    {isUnlocking ? "AUTHENTICATING..." : "PROVISION CORPORATE NODE (1 STX)"}
                </button>
                
                <button onClick={handleLogout} style={{background: 'none', border: 'none', color: '#333', marginTop: '20px', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline'}}>TERMINATE SESSION</button>
            </motion.div>
        </div>
    );
  }

  // --- RENDER FULL ADMIN DASHBOARD ---
  return (
    <div className="t2t-main-layout">
      {/* SIDEBAR */}
      <aside className="t2t-sidebar">
        <div className="sidebar-brand">
            <div className="brand-logo" style={{color: '#fff'}}>T2T</div>
            <span style={{color: '#dc2626', fontWeight: 'bold'}}>ADMIN PANEL</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${isActive('/')}`}>
            <LayoutGrid size={18} /> USER HUB
          </Link>
          <Link to="/admin-dashboard" className={`nav-item ${isActive('/admin-dashboard')}`}>
            <Database size={18} /> BATCH FACTORY
          </Link>
          <Link to="/admin/health" className={`nav-item ${isActive('/admin/health')}`}>
            <Activity size={18} /> NETWORK HEALTH
          </Link>
          <Link to="/admin/security" className={`nav-item ${isActive('/admin/security')}`}>
            <ShieldAlert size={18} /> SECURITY HUB
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn-premium" style={{borderColor: '#dc2626', color: '#fff'}}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="t2t-content-area">
        <header className="content-header">
          <div>
            <h1>System Command</h1>
            <p style={{color: '#555'}}>Superuser Authority: <span className="text-red-500 font-bold">{user?.name}</span></p>
          </div>
          <div className="header-status" style={{background: '#dc2626', color: '#fff', border: 'none', boxShadow: '0 0 15px rgba(220, 38, 38, 0.3)'}}>
            <Globe size={14} className="pulse-icon" /> ADMIN ONLINE
          </div>
        </header>

        <div className="dashboard-grid">
          
          {/* BATCH PRODUCTION ENGINE */}
          <div className="grid-card vault-card" style={{gridColumn: 'span 2'}}>
            <div className="card-header-flex">
                <h3>Industrial Batch Production</h3>
                <Cpu size={24} className="text-red-500 animate-pulse" />
            </div>
            <p className="card-subtext" style={{marginBottom: '30px'}}>Provisioning 1 Unit creates a unique CAP HASH and BODY HASH pair.</p>
            
            <form onSubmit={handleGenerate} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px'}}>
               
               <div style={inputContainerStyle}>
                  <label style={labelStyle}>Batch Identifier</label>
                  <input 
                    type="text" 
                    style={inputStyle} 
                    value={form.batchId} 
                    onChange={e => setForm({...form, batchId: e.target.value})} 
                    placeholder="e.g. COKE-ETH-001" 
                  />
               </div>

               <div style={inputContainerStyle}>
                  <label style={labelStyle}>Bottle Quantity (Sets)</label>
                  <input 
                    type="number" 
                    style={inputStyle} 
                    value={form.count} 
                    onChange={e => setForm({...form, count: e.target.value})} 
                  />
               </div>

               <div style={inputContainerStyle}>
                  <label style={labelStyle}>Bottle Expiry Date</label>
                  <input 
                    type="date" 
                    style={inputStyle} 
                    value={form.expDate} 
                    onChange={e => setForm({...form, expDate: e.target.value})} 
                  />
               </div>

               <div style={inputContainerStyle}>
                  <label style={labelStyle}>Verified Ingredients</label>
                  <input 
                    type="text" 
                    style={inputStyle} 
                    value={form.ingredients} 
                    onChange={e => setForm({...form, ingredients: e.target.value})} 
                    placeholder="List components" 
                  />
               </div>

               <button type="submit" disabled={isGenerating} className="convert-btn-ultra" style={{gridColumn: 'span 2', background: '#dc2626', color: '#fff', fontSize: '1rem', letterSpacing: '1px'}}>
                 {isGenerating ? "TRANSMITTING DATA TO LEDGER..." : "EXECUTE BATCH GENERATION"}
               </button>
            </form>
          </div>

          {/* PRODUCTION HISTORY TABLE */}
          <div className="grid-card" style={{gridColumn: 'span 2'}}>
            <div className="card-header-flex">
                <h3 style={{letterSpacing: '2px'}}>Production Ledger History</h3>
                <History size={18} />
            </div>
            <table style={{width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '11px', marginTop: '20px'}}>
                <thead>
                    <tr style={{textAlign: 'left', color: '#444', borderBottom: '1px solid #111'}}>
                        <th style={{padding: '10px 0'}}>BATCH ID</th>
                        <th>UNITS (PAIRS)</th>
                        <th>EXPIRY</th>
                        <th style={{textAlign: 'right'}}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.map(b => (
                        <tr key={b._id} style={{borderBottom: '1px solid #0a0a0a'}}>
                            <td style={{padding: '12px 0', fontWeight: 'bold', color: '#dc2626'}}>{b._id}</td>
                            <td>{b.totalUnits / 2} Sets</td>
                            <td>{b.expDate}</td>
                            <td style={{textAlign: 'right'}}>
                                <button onClick={() => handleDownload(b._id)} style={{background: '#111', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '10px', transition: '0.3s'}}>
                                    <FileDown size={14} style={{verticalAlign: 'middle', marginRight: '5px'}} /> EXPORT HASHES
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {batches.length === 0 && <p style={{textAlign: 'center', color: '#333', marginTop: '20px'}}>No production batches found on ledger.</p>}
          </div>

          {/* REAL-TIME LOGS */}
          <div className="grid-card" style={{gridColumn: 'span 2'}}>
             <div className="card-header-flex"><h3>Protocol Logs</h3><Terminal size={18} className="text-blue-500" /></div>
             <div style={{fontFamily: 'monospace', fontSize: '11px', color: '#10b981', background: '#000', padding: '25px', borderRadius: '25px', border: '1px solid #111', lineHeight: '1.8'}}>
                <p><span style={{color: '#444'}}>[{new Date().toLocaleTimeString()}]</span> <span style={{color: '#60a5fa'}}>SYNC:</span> Node AAU_ETH_01 connected to Stacks Layer 2.</p>
                <p><span style={{color: '#444'}}>[{new Date().toLocaleTimeString()}]</span> <span style={{color: '#22c55e'}}>LEDGER:</span> Identity T2T-9902 verified by AI Vision node.</p>
                <p><span style={{color: '#444'}}>[{new Date().toLocaleTimeString()}]</span> <span style={{color: '#dc2626'}}>WARN:</span> Batch {form.batchId} pending industrial etching confirmation.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;