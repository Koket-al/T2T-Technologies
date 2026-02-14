import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { useAuthStore, api } from "../store/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Camera, ShieldCheck, Cpu, Trash2, UserCheck, ChevronRight, Loader2 } from "lucide-react";
import '../pages/DashboardPage.css';

const SmartBinAI = () => {
  const { user } = useAuthStore();
  const videoRef = useRef(null);
  
  // Logic Steps: 1 (AI Scan), 2 (Body Hash), 3 (T2T-ID), 4 (Success)
  const [step, setStep] = useState(1); 
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("Initializing AI Sensors...");
  const [isAiLoading, setIsAiLoading] = useState(true);
  
  // Data for Backend
  const [bodyCode, setBodyCode] = useState("");
  const [t2tId, setT2tId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ YOUR REAL AI MODEL LINK
  const MODEL_URL = "https://teachablemachine.withgoogle.com/models/u8dv4qbJs/"; 

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        setModel(loadedModel);
        setIsAiLoading(false);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        toast.error("Camera Access Denied. Required for AI.");
      }
    };
    loadModel();
    return () => { if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop()); };
  }, []);

  // AI Detection Loop
  useEffect(() => {
    if (!model || step !== 1) return;
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const result = await model.predict(videoRef.current);
        // Look for the class named "cocacola class" from your screenshot
        const coke = result.find(p => p.className === "cocacola class");
        const prob = (coke?.probability * 100).toFixed(0);
        setPrediction(`DETECTING: ${prob}% COCA-COLA MATCH`);

        if (coke?.probability > 0.90) {
          clearInterval(interval);
          toast.success("AI VERIFIED: PHYSICAL BOTTLE DETECTED");
          setStep(2); // Unlock Step 2
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [model, step]);

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // 📡 CONTACT BACKEND
      const res = await api.post("/rewards/scan", { 
        hash: bodyCode.toUpperCase(), 
        recyclerId: t2tId.toUpperCase(), 
        isAiVerified: true 
      });
      toast.success(res.data.message);
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification Failed");
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="t2t-main-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ color: '#dc2626', fontWeight: '900', letterSpacing: '4px', marginBottom: '10px' }}>T2T <span style={{ color: '#fff' }}>SMART BIN</span></h1>
        
        <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '40px', padding: '40px', minHeight: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '25px', overflow: 'hidden', border: '2px solid #dc2626' }}>
                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {isAiLoading && <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>}
              </div>
              <h3 style={{ marginTop: '20px' }}>AI Vision Scanning...</h3>
              <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{prediction}</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <Trash2 size={50} style={{ color: '#dc2626', margin: '0 auto 20px' }} />
              <h3>Enter Body Hash</h3>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '20px' }}>AI Verification successful. Input the 8-digit code from the bottle plastic.</p>
              <input type="text" className="manual-input" value={bodyCode} onChange={(e) => setBodyCode(e.target.value.toUpperCase())} maxLength={8} placeholder="BODY CODE" />
              <button onClick={() => setStep(3)} className="claim-button">NEXT</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <UserCheck size={50} style={{ color: '#10b981', margin: '0 auto 20px' }} />
              <h3>Enter Recycler T2T-ID</h3>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '20px' }}>Which account should receive the reward?</p>
              <input type="text" className="manual-input" value={t2tId} onChange={(e) => setT2tId(e.target.value.toUpperCase())} placeholder="e.g. T2T-5590" />
              <button onClick={handleFinalSubmit} disabled={isProcessing} className="claim-button" style={{ background: '#10b981' }}>{isProcessing ? "TRANSMITTING..." : "MINT REWARD"}</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              <ShieldCheck size={80} style={{ color: '#10b981', margin: '0 auto 20px' }} />
              <h2 style={{ color: '#10b981' }}>SUCCESS</h2>
              <p style={{ color: '#ccc' }}>Material confirmed. Birr balance updated on Stacks Ledger.</p>
              <Link to="/" style={{ color: '#dc2626', display: 'block', marginTop: '20px' }}>CLOSE SESSION</Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SmartBinAI;