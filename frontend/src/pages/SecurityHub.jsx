import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useLocation } from "react-router-dom";
import { 
  Database, ShieldAlert, Package, TrendingUp, 
  LogOut, Globe, Activity, LayoutGrid, Lock, EyeOff 
} from "lucide-react";
import '../pages/DashboardPage.css';

const SecurityHub = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand"><div className="brand-logo">T2T</div><span style={{ color: '#dc2626', fontWeight: 'bold' }}>ADMIN PANEL</span></div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item"><LayoutGrid size={18} /> USER HUB</Link>
          <Link to="/admin-dashboard" className="nav-item"><Database size={18} /> BATCH FACTORY</Link>
          <Link to="/admin/health" className="nav-item"><Activity size={18} /> NETWORK HEALTH</Link>
          <Link to="/admin/security" className="nav-item active"><ShieldAlert size={18} /> SECURITY HUB</Link>
          <Link to="/admin/inventory" className="nav-item"><Package size={18} /> INVENTORY</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={logout} className="logout-btn-premium">LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
          <h1>Security Hub</h1>
          <div className="header-status" style={{background: '#dc2626', border: 'none'}}><Lock size={14} /> LEVEL 5 CLEARANCE</div>
        </header>

        <div className="dashboard-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="grid-card vault-card" style={{border: '1px solid #dc262644'}}>
            <div className="card-header-flex"><h3>Detected Anomalies</h3><EyeOff size={18} className="text-red-500" /></div>
            <div style={{fontFamily: 'monospace', fontSize: '12px', color: '#dc2626', marginTop: '20px', background: '#000', padding: '20px', borderRadius: '15px'}}>
                <p>[!] WARNING: Multiple failed scans from IP: 192.168.1.45 (Addis Ababa)</p>
                <p>[!] ALERT: Attempted reuse of Hash: A7B2X9Z1 blocked by Ledger</p>
                <p>[!] INFO: New MetaMask identity link request from User_8802 - Verified</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SecurityHub;