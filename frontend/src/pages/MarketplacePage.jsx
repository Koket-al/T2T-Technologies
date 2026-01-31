import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore, api } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../pages/DashboardPage.css"; // Reuse your dashboard styles

const MarketplacePage = () => {
  const { user, purchaseItem, isLoading } = useAuthStore();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await api.get("/marketplace/items");
      setItems(res.data.items);
    };
    fetchItems();
  }, []);

  const handleBuy = async (itemId) => {
    try {
      const res = await purchaseItem(itemId);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ background: '#0e0000' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          
          <div className="text-right">
            <p className="text-red-500 font-bold">Your Balance</p>
            <h2 className="text-white text-2xl font-black">{user?.codaBalance || 0} CODA</h2>
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold mb-6 text-center">Coca-Cola <span style={{ color: '#dd0c0c' }}>Marketplace</span></h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="dashboard-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-40 object-cover rounded-lg mb-4 border-2 border-red-900" 
                />
                <h3 className="text-white text-xl font-bold">{item.name}</h3>
                <p className="text-yellow-500 font-bold text-lg mb-4">{item.price} CODA</p>
              </div>

              <button
                onClick={() => handleBuy(item.id)}
                disabled={isLoading || (user?.codaBalance < item.price)}
                className="claim-button"
                style={{ 
                  background: (user?.codaBalance >= item.price) 
                    ? 'linear-gradient(to right, #dd0c0c, #8b0000)' 
                    : '#333' 
                }}
              >
                {user?.codaBalance >= item.price ? "BUY NOW" : "NOT ENOUGH CODA"}
              </button>
            </motion.div>
          ))}
        </div>
        <Link to="/" className="text-white underline text-sm">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default MarketplacePage;