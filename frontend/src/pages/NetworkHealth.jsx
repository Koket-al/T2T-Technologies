import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useLocation } from "react-router-dom";
import { 
  Database, ShieldAlert, Package, TrendingUp, 
  LogOut, Globe, Activity, LayoutGrid, Server, Wifi 
} from "lucide-react";
import '../pages/DashboardPage.css';

const NetworkHealth = () => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="t2t-main-layout">
      <aside className="t2t-sidebar">
        <div className="sidebar-brand">
            <div className="brand-logo">T2T</div>
            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>ADMIN PANEL</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${isActive('/')}`}><LayoutGrid size={18} /> USER HUB</Link>
          <Link to="/admin-dashboard" className={`nav-item ${isActive('/admin-dashboard')}`}><Database size={18} /> BATCH FACTORY</Link>
          <Link to="/admin/health" className={`nav-item ${isActive('/admin/health')}`}><Activity size={18} /> NETWORK HEALTH</Link>
          <Link to="/admin/security" className={`nav-item ${isActive('/admin/security')}`}><ShieldAlert size={18} /> SECURITY HUB</Link>
          <Link to="/admin/inventory" className={`nav-item ${isActive('/admin/inventory')}`}><Package size={18} /> INVENTORY</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={logout} className="logout-btn-premium">LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
          <h1>Network Health</h1>
          <div className="header-status" style={{color: '#22c55e'}}><Wifi size={14} className="pulse-icon" /> ALL SYSTEMS OPERATIONAL</div>
        </header>

        <div className="dashboard-grid">
          <div className="grid-card vault-card">
            <h3>Infrastructure Latency</h3>
            <div className="balance-display">
                <div className="balance-item"><span className="label">SEPOLIA NODE</span><span className="value" style={{color: '#60a5fa'}}>12ms</span></div>
                <div className="balance-item"><span className="label">MONGODB</span><span className="value" style={{color: '#60a5fa'}}>45ms</span></div>
                <div className="balance-item"><span className="label">AI VISION NODE</span><span className="value" style={{color: '#60a5fa'}}>102ms</span></div>
            </div>
          </div>

          <div className="grid-card">
            <div className="card-header-flex"><h3>Server Status</h3><Server size={18} /></div>
            <div style={{marginTop: '20px'}}>
                <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}><span>Mainnet Bridge:</span> <span style={{color: '#22c55e'}}>ONLINE</span></p>
                <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}><span>Database Cluster:</span> <span style={{color: '#22c55e'}}>ONLINE</span></p>
                <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between'}}><span>Auth Gateway:</span> <span style={{color: '#22c55e'}}>ONLINE</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default NetworkHealth;