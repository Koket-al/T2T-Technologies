import React, { useState, useEffect } from "react";
import "./HomePage.css";

export default function CocaColaRewardsLanding() {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [faqsOpen, setFaqsOpen] = useState({});
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const toggleFaq = (i) => setFaqsOpen((s) => ({ ...s, [i]: !s[i] }));

  // 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // rotateY
      const y = (e.clientY / window.innerHeight - 0.5) * 20; // rotateX
      setTilt({ rotateX: -y, rotateY: x });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="cc-page">
      <header className="cc-hero">
        <nav className="cc-nav">
          <div className="cc-brand">Coca-Cola Rewards</div>
          <div className="cc-nav-actions">
            <button className="btn ghost" onClick={() => setShowSignup(true)}>Sign In</button>
            <button className="btn primary" onClick={() => setShowSignup(true)}>Sign Up</button>
          </div>
        </nav>

        <div
          className="cc-hero-content"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          }}
        >
          {/* Left Text */}
          <div className="hero-left">
            <h1>Sip, Scan, & Score Rewards!</h1>
            <p className="sub">
              Scan QR codes under bottle caps to earn points, unlock CodaCoin tokens,
              and redeem exclusive prizes.
            </p>
            <div className="hero-ctas">
              <button className="btn primary" onClick={() => setShowSignup(true)}>Get Started</button>
              <a className="btn ghost" href="#how">How it works</a>
            </div>
          </div>

          {/* Right 3D Visuals */}
          <div className="hero-right">
            {/* Phone Mock */}
            <div className="phone-mock">
              <img

                alt="App Preview"
              />
              <div className="points-pill">
                Points: <strong>from backend</strong>
              </div>
            </div>

            {/* Bottle + Coins */}
            <div className="prize-mock">
              <img

                alt="Coca-Cola Bottle"
              />
              {/* Coins will be rendered via CSS pseudo-elements: .coin-a & .coin-b */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        <section id="how" className="how">
          <h2>How it works</h2>
          <p className="muted">A few simple steps to start earning right away.</p>
          <div className="steps">
            <div className="step">
              <div className="icon">👤</div>
              <h3>Register & Login</h3>
              <p>Sign up securely with your phone or email.</p>
            </div>
            <div className="step">
              <div className="icon">📱</div>
              <h3>Scan & Earn</h3>
              <p>Buy a Coke, scan the unique QR code under the cap.</p>
            </div>
            <div className="step">
              <div className="icon">🪙</div>
              <h3>Convert & Redeem</h3>
              <p>Convert points to CodaCoin tokens and claim rewards.</p>
            </div>
            <div className="step">
              <div className="icon">🏆</div>
              <h3>Win Big</h3>
              <p>Enter draws for experiences and grand prizes like cars.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal">
          <div className="modal-card">
            <button className="close" onClick={() => setShowSignup(false)}>✕</button>
            <h3>Create your account</h3>
            <p className="muted">Secure OTP login. We only ask for what we need.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Mock signup: OTP will be sent to ${email}`);
                setShowSignup(false);
              }}
            >
              <label>Email or phone</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com or +123456789"
              />
              <div className="modal-actions">
                <button className="btn ghost" type="button" onClick={() => setShowSignup(false)}>Cancel</button>
                <button className="btn primary" type="submit">Send OTP</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
