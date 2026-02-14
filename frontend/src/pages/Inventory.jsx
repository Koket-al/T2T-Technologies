import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Link, useLocation } from "react-router-dom";
import { 
  Database, ShieldAlert, Package, TrendingUp, 
  LogOut, Globe, Activity, LayoutGrid, Box, Truck 
} from "lucide-react";
import '../pages/DashboardPage.css';

const Inventory = () => {
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
          <Link to="/admin/security" className="nav-item"><ShieldAlert size={18} /> SECURITY HUB</Link>
          <Link to="/admin/inventory" className="nav-item active"><Package size={18} /> INVENTORY</Link>
        </nav>
        <div className="sidebar-footer"><button onClick={logout} className="logout-btn-premium">LOGOUT</button></div>
      </aside>

      <main className="t2t-content-area">
        <header className="content-header">
          <h1>Inventory Management</h1>
          <div className="header-status"><Box size={14} /> TOTAL UNITS: 42,000</div>
        </header>

        <div className="dashboard-grid">
           <div className="grid-card">
              <h3>Marketplace Stock</h3>
              <div style={{marginTop: '20px'}}>
                  <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between'}}><span>Classic Coke (350ml):</span> <b>1,200</b></p>
                  <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}><span>Coke T-Shirts:</span> <b>85</b></p>
                  <p style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}><span>Vintage Caps:</span> <b>12</b></p>
              </div>
           </div>

           <div className="grid-card" style={{background: 'linear-gradient(145deg, #111, #000)'}}>
              <h3>Logistics Status</h3>
              <Truck size={30} style={{margin: '20px 0', color: '#dc2626'}} />
              <p style={{fontSize: '12px', color: '#666'}}>Incoming PET plastic from 142 collection nodes. Average purity: 98.4%.</p>
           </div>
        </div>
      </main>
    </div>
  );
};
export default Inventory;