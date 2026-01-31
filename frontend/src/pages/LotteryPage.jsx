import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore, api } from "../store/authStore"; // ✅ Fixed import
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const LotteryPage = () => {
  const { user } = useAuthStore();
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(user?.codaBalance || 0);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await api.get("/lottery/items");
        setPrizes(res.data.items);
      } catch (err) {
        console.error("Failed to load lottery items");
      }
    };
    fetchPrizes();
  }, []);

  const handlePlay = async (prizeId) => {
    if (balance < 1) {
        toast.error("You need CODA coins to play!");
        return;
    }
    setIsSpinning(true);
    try {
      const res = await api.post("/lottery/play", { prizeId });
      setBalance(res.data.newBalance);
      
      if (res.data.isWinner) {
        toast.success(res.data.message, { duration: 6000, icon: '🎉' });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lottery error");
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #0e0000, #dd0c0c)', 
      minHeight: '100vh', 
      width: '100vw',
      color: 'white',
      padding: '20px',
      overflowX: 'hidden'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'underline' }}>← Back to Dashboard</Link>
          <div style={{ background: '#facc15', padding: '10px 20px', borderRadius: '12px', color: 'black', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            WALLET: {balance} CODA
          </div>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '900', marginBottom: '10px', fontStyle: 'italic' }}>
            COCA-COLA <span style={{ color: '#facc15' }}>LOTTERY</span>
        </h1>
        <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '50px' }}>Trade your CODA coins for a chance to win life-changing prizes!</p>

        {/* Prize Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px' 
        }}>
          {prizes.length > 0 ? prizes.map((prize) => (
            <motion.div 
              key={prize.id}
              whileHover={{ scale: 1.03 }}
              style={{ 
                background: 'rgba(0,0,0,0.7)', 
                borderRadius: '20px', 
                padding: '20px', 
                border: '2px solid #facc15',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <img 
                src={prize.image} 
                alt={prize.name} 
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px', marginBottom: '15px', border: '1px solid #333' }} 
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{prize.name}</h3>
              <p style={{ color: '#facc15', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
                Entry: {prize.price} CODA
              </p>
              
              <button
                onClick={() => handlePlay(prize.id)}
                disabled={isSpinning || balance < prize.price}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  background: balance >= prize.price ? 'linear-gradient(to right, #facc15, #eab308)' : '#333',
                  color: 'black',
                  fontWeight: '900',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {isSpinning ? "ROLLING..." : "TRY YOUR LUCK"}
              </button>
            </motion.div>
          )) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Connecting to Coca-Cola Prize Server...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;