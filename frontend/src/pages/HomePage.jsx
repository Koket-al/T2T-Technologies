import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, Recycle, BarChart3, Cpu, Zap, Globe, 
  ArrowRight, Factory, ShoppingBag, Trophy, Banknote, 
  Leaf, Smartphone, Lock, CheckCircle2, Wallet,
  QrCode, Eye, ScanLine, Gift, Award, Coins,
  Sparkles, Flame, Gem, Orbit, Infinity, Rocket,
  TrendingUp, Users, Globe2, Bitcoin, Droplets
} from "lucide-react";
import "./HomePage.css";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particle background (same as before)
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(220, 38, 38, ${Math.random() * 0.3})`,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const cardHover = {
    whileHover: { 
      y: -15, 
      scale: 1.02,
      transition: { duration: 0.3 },
      boxShadow: "0 20px 40px rgba(220,38,38,0.3)"
    }
  };

  return (
    <div className="t2t-landing">
      <canvas id="particle-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}></canvas>

      <nav className="t2t-nav" style={{ backdropFilter: 'blur(20px)', background: 'rgba(5,5,5,0.6)' }}>
        <div className="nav-container">
          <div className="brand">
            <span className="logo">T2T</span>
            <span className="logo-sub">TECHNOLOGIES</span>
          </div>
          <div className="nav-links">
            <a href="#about" className="nav-item-link">Vision</a>
            <a href="#lifecycle" className="nav-item-link">The Protocol</a>
            {isAuthenticated ? (
              <Link to="/" className="btn-primary">DASHBOARD</Link>
            ) : (
              <Link to="/login" className="btn-primary">ENTER ECOSYSTEM</Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO – BIG, BOLD, REVOLUTIONARY */}
      <motion.header 
        ref={heroRef}
        className="hero-section" 
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div 
          className="hero-container"
          style={{ 
            transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="hero-text">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="badge-wrapper">
                    <span className="badge glow-red" style={{ boxShadow: '0 0 20px #dc2626' }}>POWERED BY BITCOIN</span>
                    <span className="badge-alt glow-green" style={{ boxShadow: '0 0 20px #10b981' }}>MADE IN ETHIOPIA</span>
                </div>
                <h1 className="gradient-text" style={{ background: 'linear-gradient(135deg, #fff 0%, #dc2626 50%, #facc15 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  TURN TRASH INTO<br />A FINANCIAL IDENTITY
                </h1>
                <p className="hero-subtitle">
                  Every plastic bottle you recycle builds your <strong>green credit score</strong> on the Bitcoin blockchain. 
                  Earn, spend, borrow – no bank account needed. <br />
                  <span className="highlight">7 steps from bottle to bank.</span>
                </p>
                <div className="hero-btns">
                  <motion.button 
                    whileHover={{ scale: 1.1, boxShadow: '0 0 30px #dc2626' }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/signup")} 
                    className="btn-main"
                  >
                    CLAIM YOUR T2T-ID
                  </motion.button>
                  <a href="#lifecycle" className="btn-outline">DISCOVER THE PROTOCOL</a>
                </div>
            </motion.div>
          </div>

          <div className="hero-visual">
            <motion.div 
              className="cyber-frame"
              animate={{ 
                y: [0, -15, 0],
                rotateZ: [0, 2, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
               <div className="glass-card" style={{ backdropFilter: 'blur(30px)', border: '1px solid rgba(220,38,38,0.3)' }}>
                  <div className="status-row">
                    <span className="glow-dot"></span>
                    <span>BITCOIN LAYER ACTIVE</span>
                  </div>
                  <div className="id-preview">
                    <p>YOUR DIGITAL TWIN</p>
                    <h2 style={{ background: 'linear-gradient(135deg, #dc2626, #facc15)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>T2T-PROTOCOL</h2>
                  </div>
                  <div className="stats-preview">
                    <motion.div whileHover={{ scale: 1.2 }}><p>BOTTLES RECYCLED</p><span>42.5K</span></motion.div>
                    <motion.div whileHover={{ scale: 1.2 }}><p>BIRR EARNED</p><span>1.2M</span></motion.div>
                  </div>
                  <div className="floating-icons">
                    <Bitcoin className="orbit-icon" style={{ animation: 'spin 10s linear infinite' }} />
                    <Droplets className="sparkle-icon" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  </div>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>

      {/* VISION – THE PROBLEM WE SOLVE */}
      <section id="about" className="vision-section" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div {...fadeIn} className="section-header">
          <Leaf className="f-icon green" size={48} />
          <h2>Recycling is Broken. We Fixed It.</h2>
          <p className="simple-text">
            In Ethiopia, millions of plastic bottles end up in landfills or rivers – worthless to the people who collect them. 
            <strong className="text-emerald"> T2T Technologies</strong> gives every bottle a digital twin secured by Bitcoin. 
            Suddenly, picking up trash becomes the most profitable job in the city, and your recycling history becomes your 
            <strong> passport to financial services</strong> – loans, savings, and more.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '60px' }}>
            <div><TrendingUp size={32} className="text-red" /><p style={{ color: '#aaa' }}>42.5K bottles scanned</p></div>
            <div><Users size={32} className="text-gold" /><p style={{ color: '#aaa' }}>5,000+ active recyclers</p></div>
            <div><Globe2 size={32} className="text-green" /><p style={{ color: '#aaa' }}>100+ smart bins deployed</p></div>
          </div>
        </motion.div>
      </section>

      {/* THE 7-STEP PROTOCOL – EXACT STEPS WITH POWERFUL COPY */}
      <section id="lifecycle" className="features-grid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <span className="badge">THE T2T PROTOCOL</span>
          <h2>From Factory to Fortune</h2>
          <p>Seven steps. One revolution. Your financial identity, built one bottle at a time.</p>
        </div>

        <div className="cards-container">
          {/* Step 1 */}
          <motion.div {...fadeIn} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #dc2626, #facc15) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <Factory className="f-icon red" size={36} />
            <span className="step-tag">STEP 01</span>
            <h3>Corporate Provisioning</h3>
            <p className="simple-text">The factory pays a <strong>1 STX Corporate License Fee</strong> via x402. Admin generates unique 8‑digit codes (Cap & Body) with official batch data (MFG, Expiry, Ingredients) verified by the Conformity Assessment Enterprise.</p>
            <p className="step-quote">“Every bottle born with a digital passport.”</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #3b82f6, #10b981) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <Eye className="f-icon blue" size={36} />
            <span className="step-tag">STEP 02</span>
            <h3>Safety Oracle</h3>
            <p className="simple-text">Consumer enters the <strong>Cap Code</strong> and pays <strong>0.001 STX</strong> to unlock the government-verified safety manifest – manufacturing history, ingredients, and authenticity proof. No more fake products.</p>
            <p className="step-quote">“Know what you drink. Trust the chain.”</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #facc15, #dc2626) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <Gift className="f-icon gold" size={36} />
            <span className="step-tag">STEP 03</span>
            <h3>Loyalty Reward</h3>
            <p className="simple-text">After drinking, user redeems the <strong>Cap Code</strong> again. Backend instantly credits <strong>Points + Internal Birr</strong> to their MongoDB profile – fast, free, and builds loyalty.</p>
            <p className="step-quote">“Sip, scan, earn. It’s that simple.”</p>
          </motion.div>

          {/* Step 4 */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #10b981, #3b82f6) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <ScanLine className="f-icon green" size={36} />
            <span className="step-tag">STEP 04</span>
            <h3>AI Smart Bin</h3>
            <p className="simple-text">User logs in with <strong>T2T-ID</strong>. Computer Vision verifies PET plastic & brand. Only after AI confirmation can they enter the <strong>Body Code</strong> to earn double rewards for recycling.</p>
            <p className="step-quote">“The bin sees you. The planet thanks you.”</p>
          </motion.div>

          {/* Step 5 */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #dc2626, #facc15) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <ShoppingBag className="f-icon red" size={36} />
            <span className="step-tag">STEP 05</span>
            <h3>Premium Marketplace</h3>
            <p className="simple-text">Pay a micro‑fee <strong>(0.001 STX)</strong> via x402 to enter. Spend earned <strong>Birr</strong> on real Coca‑Cola products, T‑shirts, movie tickets – deducted instantly from your balance.</p>
            <p className="step-quote">“Your recycling power buys real things.”</p>
          </motion.div>

          {/* Step 6 */}
          <motion.div {...fadeIn} transition={{ delay: 0.5 }} {...cardHover} className="feature-card" style={{ borderImage: 'linear-gradient(45deg, #facc15, #dc2626) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <Award className="f-icon gold" size={36} />
            <span className="step-tag">STEP 06</span>
            <h3>Mega Lottery</h3>
            <p className="simple-text">Pay <strong>0.005 STX</strong> to enter the Lottery room. Use Birr to buy tickets for a chance to win a <strong>Car, House, or Motorbike</strong> – each entry burns tokens, strengthening the economy.</p>
            <p className="step-quote">“From trash to treasure – literally.”</p>
          </motion.div>

          {/* Step 7 */}
          <motion.div {...fadeIn} transition={{ delay: 0.6 }} {...cardHover} className="feature-card full-width" style={{ borderImage: 'linear-gradient(45deg, #10b981, #3b82f6) 1', borderWidth: '2px', borderStyle: 'solid', borderColor: 'transparent' }}>
            <Coins className="f-icon green" size={36} />
            <span className="step-tag">STEP 07</span>
            <h3>Liquidity Exit</h3>
            <p className="simple-text">Convert your digital Birr to real cash directly to <strong>Telebirr</strong> or your bank account. Trash becomes money – instantly.</p>
            <p className="step-quote">“Cash in your green credit. Any time.”</p>
          </motion.div>
        </div>
      </section>

      {/* TECH PILLARS – WHY IT WORKS */}
      <section className="tech-section" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <h2>Built on Unshakeable Foundations</h2>
        </div>
        <div className="tech-container">
            <motion.div whileHover={{ scale: 1.1 }} className="tech-box">
                <Bitcoin className="text-red" size={40} />
                <h4>Bitcoin Security</h4>
                <p>Every transaction is settled on Stacks, anchored to Bitcoin. Your green credit is as secure as the world's most powerful blockchain.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="tech-box">
                <Smartphone className="text-blue" size={40} />
                <h4>Invisible UX</h4>
                <p>No wallets, no seed phrases. Just a T2T-ID and Telebirr. The blockchain works in the background – you just recycle.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="tech-box">
                <CheckCircle2 className="text-green" size={40} />
                <h4>Government Verified</h4>
                <p>Fully compliant with the Conformity Assessment Enterprise. Every product passport is trusted by regulators and brands.</p>
            </motion.div>
        </div>
      </section>

      {/* FINAL CALL – JOIN THE MOVEMENT */}
      <section className="cta-section" style={{ padding: '120px 50px', textAlign: 'center', background: 'radial-gradient(circle at 30% 30%, rgba(220,38,38,0.3), #000)', position: 'relative', zIndex: 2 }}>
        <motion.div {...fadeIn}>
          <motion.h2 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-3px', background: 'linear-gradient(135deg, #fff 0%, #dc2626 50%, #facc15 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Be Part of the Revolution
          </motion.h2>
          <p style={{ color: '#aaa', fontSize: '1.3rem', maxWidth: '600px', margin: '20px auto' }}>
            Join thousands of Ethiopians who are turning plastic waste into financial power. Get your free T2T-ID and start earning today.
          </p>
          <motion.button 
            whileHover={{ scale: 1.1, boxShadow: '0 0 40px #dc2626' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")} 
            className="btn-main"
            style={{ marginTop: '20px', padding: '20px 50px', fontSize: '1.2rem' }}
          >
            CREATE YOUR T2T-ID
          </motion.button>
        </motion.div>
      </section>

      <footer className="landing-footer" style={{ position: 'relative', zIndex: 2 }}>
        <div className="footer-content">
          <div className="footer-brand">
             <span className="logo">T2T</span>
             <p>Architecting the Circular Economy. Ethiopia 2026.</p>
          </div>
          <div className="footer-status">
              <div className="status-dot"></div> BITCOIN LAYER ACTIVE
          </div>
        </div>
      </footer>
    </div>
  );
}