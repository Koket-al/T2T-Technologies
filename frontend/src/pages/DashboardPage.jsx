import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore, api } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; // ✅ This import was missing!
import '../pages/DashboardPage.css';

const DashboardPage = () => {
  const { user, logout, updateUserWallet, convertPointsToCoda, isLoading } = useAuthStore();
  const [manualCode, setManualCode] = useState("");
  const [walletInput, setWalletInput] = useState(user?.walletAddress || "");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = () => logout();

  const handleLinkWallet = async (e) => {
    e.preventDefault();
    if (!walletInput.startsWith("0x") || walletInput.length < 40) {
        toast.error("Invalid Wallet Address");
        return;
    }
    try {
      await updateUserWallet(walletInput);
      toast.success("MetaMask Wallet Linked!");
    } catch (err) {
      toast.error("Failed to link wallet");
    }
  };

  const handleConvert = async () => {
    try {
      const res = await convertPointsToCoda();
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Conversion failed");
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!manualCode) return;
    setIsProcessing(true);
    setStatus("Verifying...");
    try {
      const res = await api.post("/rewards/scan", { hash: manualCode.toUpperCase() });
      setStatus(`✅ Success! +${res.data.pointsAdded} Points`);
      setManualCode("");
      if (user) user.points = (user.points || 0) + res.data.pointsAdded;
    } catch (err) {
      setStatus("❌ " + (err.response?.data?.message || "Invalid code"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='dashboard-container'>
      <h2 className='dashboard-title'>Welcome, {user?.name}!</h2>

      <div className='dashboard-content'>
        {/* Balances Card */}
        <div className='dashboard-card'>
          <h3 className='card-title'>Your Wealth</h3>
          <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className='card-text'><b>Total Points:</b> {user?.points || 0}</p>
            <p className='card-text' style={{ color: '#facc15' }}><b>CODA Coin:</b> {user?.codaBalance || 0}</p>
          </div>
          
          <button 
            onClick={handleConvert}
            disabled={isLoading || (user?.points || 0) < 100}
            className="claim-button"
            style={{ 
              marginTop: '15px', 
              background: 'linear-gradient(to right, #facc15, #eab308)', 
              color: '#000',
              opacity: (user?.points || 0) < 100 ? 0.5 : 1
            }}
          >
            {isLoading ? "CONVERTING ON BLOCKCHAIN..." : "CONVERT 100 PTS TO 1 CODA"}
          </button>
          {(user?.points || 0) < 100 && (
            <p style={{ color: '#ffffff', fontSize: '0.65rem', marginTop: '5px', opacity: 0.8 }}>
              * You need at least 100 points to claim a CODA prize.
            </p>
          )}
        </div>

        {/* Marketplace Card */}
        <div className='dashboard-card' style={{ border: '1px solid #dd0c0c' }}>
          <h3 className='card-title'>Spend Tokens</h3>
          <p className='card-text' style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
            Visit the store to buy products with your CODA Coins.
          </p>
          <Link 
            to="/marketplace" 
            className="claim-button" 
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              textDecoration: 'none', 
              background: '#333', 
              fontSize: '0.8rem' 
            }}
          >
            VISIT MARKETPLACE
          </Link>
          
        </div>
        {/* Marketplace Card */}
        <div className='dashboard-card' style={{ border: '1px solid #dd0c0c' }}>
          <h3 className='card-title'>Spend Tokens</h3>
          <p className='card-text' style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
            Visit the store to buy products with your CODA Coins.
          </p>
          <Link 
            to="/lottery" 
            className="claim-button" 
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              textDecoration: 'none', 
              background: '#333', 
              fontSize: '0.8rem' 
            }}
          >
          TRY LOTTERY CARD BY YOUR COIN
          </Link>
          
        </div>
        {/* Credit Identity Card */}
<div className='dashboard-card' style={{ border: '1px solid #4ade80' }}>
  <h3 className='card-title' style={{ color: '#4ade80' }}>Financial Identity</h3>
  <p className='card-text' style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
    Build your credit score on the Creditcoin Ledger through recycling.
  </p>
  <Link 
    to="/credit-identity" 
    className="claim-button" 
    style={{ 
      display: 'block', 
      textAlign: 'center', 
      textDecoration: 'none', 
      background: 'linear-gradient(to right, #065f46, #059669)', 
      fontSize: '0.8rem' 
    }}
  >
    VIEW CREDIT PROFILE
  </Link>
</div>

        {/* Link Wallet Card */}
        <div className='dashboard-card'>
          <h3 className='card-title'>Blockchain Wallet</h3>
          <form onSubmit={handleLinkWallet} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="0x... (Your Wallet Address)"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              className="manual-input"
              style={{ fontSize: '0.75rem', letterSpacing: '0', textAlign: 'left', padding: '10px' }}
            />
            <button type="submit" className="claim-button">
              {user?.walletAddress ? "UPDATE WALLET" : "LINK WALLET"}
            </button>
          </form>
        </div>

        {/* Redeem Card */}
        <div className='dashboard-card'>
          <h3 className='card-title'>Redeem Bottle Code</h3>
          <form onSubmit={handleClaim} className="manual-input-container">
            <input
              type="text"
              placeholder="ENTER 8-DIGIT CODE"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              className="manual-input"
              maxLength={8}
            />
            <button type="submit" className="claim-button" disabled={isProcessing}>
              {isProcessing ? "PROCESSING..." : "CLAIM REWARD"}
            </button>
          </form>
          {status && <div className={`status-display ${status.includes('✅') ? 'success-text' : 'error-text'}`}>{status}</div>}
        </div>
      </div>

      <div className='logout-container'>
        <button onClick={handleLogout} className='logout-button'>Logout</button>
      </div>
    </motion.div>
  );
};

export default DashboardPage;