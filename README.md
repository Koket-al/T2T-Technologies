
T2T (Trash to Token) is a Bitcoin‑secured circular economy platform that transforms plastic waste into a financial identity. By bridging physical recycling with blockchain technology, AI verification, and micro‑finance, T2T creates a transparent, incentive‑driven ecosystem where every bottle has value.

"Every bottle becomes a digital asset. Every recycler builds a credit history."

🚨 The Problem We Solve
Plastic waste chokes Ethiopia – millions of bottles end up in landfills and rivers with no value to collectors.

Counterfeit products kill – fake drinks and medicine flood the market with no way to verify authenticity.

70% of Ethiopians are unbanked – they have no savings, no credit, no access to loans.

Recycling has no reward – consumers and waste pickers have zero incentive to return bottles.

Brands and government fly blind – no data on what actually gets recycled or who is doing the work.

T2T fixes all five by giving every bottle a digital twin that pays you instantly when you recycle and builds your financial identity on the blockchain.

✨ The Solution – 7‑Step Circular Protocol
1️⃣ Corporate Provisioning (Factory Level)
Factory admin pays a 1 STX license fee via x402 to activate the system.

Admin generates unique 8‑digit codes (Cap & Body) for every bottle.

Codes are laser‑etched under the cap and on the bottle body.

Official batch data (MFG date, expiry, ingredients) is attached and verified by the Conformity Assessment Enterprise.

2️⃣ Safety Oracle (Consumer Protection)
Consumer enters the Cap Code on the Safety Oracle page.

A micro‑payment (0.001 STX) unlocks the government‑verified safety manifest.

Manufacturing history, ingredients, and authenticity proof are displayed instantly.

3️⃣ Loyalty Reward (Sip & Earn)
After drinking, the user redeems the Cap Code again.

Backend instantly credits Points + Internal Birr to the user's MongoDB profile – fast and gas‑free.

4️⃣ AI Smart Bin (Proof of Recycling)
User logs in at the bin with their T2T‑ID.

Computer Vision AI verifies the bottle (PET plastic, Coca‑Cola brand, physical presence).

Only after AI confirmation can the user enter the Body Code.

Double rewards are credited for physically recycling.

5️⃣ Premium Marketplace
A micro‑fee (0.001 STX) grants entry to the Marketplace.

Users spend their earned Birr on real Coca‑Cola products, T‑shirts, movie tickets – balance deducted instantly.

6️⃣ Mega Lottery
Pay 0.005 STX to enter the Lottery room.

Use Birr to buy tickets for a chance to win a Car, House, or Motorbike.

Each entry burns tokens, strengthening the economy.

7️⃣ Liquidity Exit
Convert digital Birr to real cash directly to Telebirr or bank account.

Trash becomes money – instantly.

🛠️ Tech Stack
Frontend

React 18 (Vite)

Zustand (state management)

Framer Motion (animations)

React Router DOM

Axios

Lucide React (icons)

Backend

Node.js + Express

MongoDB + Mongoose

JWT authentication

bcryptjs

Blockchain & Payments

Stacks (Bitcoin Layer 2) – @stacks/connect

x402 micropayment protocol

Creditcoin (for green credit scoring – planned)

AI & Hardware

Computer Vision AI integration (for smart bin verification)

IoT Smart Bin interface (planned)

🏗️ Architecture
text
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React Frontend│ ─── │   Express API   │ ─── │    MongoDB       │
│   (Vite)        │      │   (Backend)     │      │   (Database)     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                         │                         │
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Leather Wallet │ ─── │  Stacks Node    │ ─── │  Creditcoin      │
│  (x402 payments)│      │  (Bitcoin L2)   │      │  (Credit Score)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
🚀 Getting Started
Prerequisites
Node.js v16+ (v18 recommended)

npm or yarn

MongoDB instance (local or Atlas)

Stacks wallet (Leather / Hiro) for testing payments

Git

Installation
1️⃣ Clone the repository
bash
git clone https://github.com/Koket-al/T2T-Technologies.git
cd T2T-Technologies
2️⃣ Backend Setup
bash
cd backend
npm install
Create a .env file in the backend folder (see Environment Variables).

bash
npm run dev
Server will run on http://localhost:5000.

3️⃣ Frontend Setup
bash
cd ../frontend
npm install
Create a .env file in the frontend folder (see Environment Variables).

bash
npm run dev
Frontend will run on http://localhost:5173.

🔐 Environment Variables
Backend .env
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/t2t
JWT_SECRET=your_super_secret_jwt_key
STACKS_ADMIN_ADDRESS=ST1PQHQKV0RJ7V66A9KTC18A5M0939W826GPX8SR
NODE_ENV=development
Frontend .env
env
VITE_API_URL=http://localhost:5000/api
📚 API Reference
Method	Endpoint	Description	Auth Required
POST	/api/auth/signup	Register new user	No
POST	/api/auth/login	Login user	No
GET	/api/auth/check-auth	Verify JWT token	Yes
GET	/api/admin/check-status	Check if admin license is active	Yes (Admin)
POST	/api/admin/unlock-panel	Activate admin panel (payment optional)	Yes (Admin)
POST	/api/admin/generate-batch	Generate new batch of codes	Yes (Admin)
GET	/api/admin/batch-history	Fetch all batches	Yes (Admin)
GET	/api/admin/export/:batchId	Export hashes for a batch	Yes (Admin)
POST	/api/rewards/convert	Convert points to Birr	Yes
POST	/api/marketplace/purchase	Purchase item with Birr	Yes
POST	/api/lottery/unlock	Unlock lottery access	Yes
POST	/api/credit/swap	Swap Birr to CTC	Yes
POST	/api/credit/apply-loan	Apply for micro‑loan	Yes
Full API documentation available at /api-docs (if Swagger integrated).

🧪 Running Tests
bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Please read our Contributing Guidelines for more details.

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

🙏 Acknowledgments
Stacks Foundation – for the x402 micropayment protocol and Bitcoin Layer 2 infrastructure.

Creditcoin – for green credit scoring and lending capabilities.

Coca‑Cola Ethiopia – for pilot collaboration and industry insights.

Conformity Assessment Enterprise – for product safety verification standards.

All contributors, testers, and early adopters who believe in turning trash into treasure.

📬 Contact
Project Link: https://github.com/Koket-al/T2T-Technologies

Issues: https://github.com/Koket-al/T2T-Technologies/issues

