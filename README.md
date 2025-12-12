# MedAI – Emergency First Aid AI Assistant

## 🩺 What It Does

MedAI is a **Progressive Web App (PWA)** that provides instant medical triage assessment 
using **Gemini 3 Pro Vision**.

### Features
- 📸 **Photo-based injury analysis** – Upload a photo, get instant AI assessment
- 🎤 **Voice symptom input** – Optional symptom description
- 🤖 **Gemini 3 Pro Vision** – State-of-the-art medical imaging AI
- 🚨 **Emergency detection** – Automatically flags critical injuries
- 📋 **Personalized first aid** – Step-by-step guidance
- 🌐 **Works offline** – PWA with service worker caching
- 📱 **Mobile-first** – Responsive design for all devices

## 🎯 Problem Statement

In emergencies, seconds matter. Many people don't know if they need immediate professional 
help or if home care is sufficient. Rural and low-connectivity areas lack real-time medical guidance.

**MedAI solves this** by providing AI-powered triage assessment instantly, on any device.

## 🧰 Tech Stack

- **Frontend:** React + Progressive Web App (PWA)
- **AI Engine:** Google Gemini 3 Pro Vision API
- **Backend:** Firebase (Firestore + Hosting + Auth)
- **Deployment:** Google AI Studio Build Mode (Vibe Coding)
- **Build Tool:** Vite / Create React App

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- Firebase project
- Gemini 3 Pro API key

### Installation

Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/medai.git
cd medai
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Firebase and Gemini API keys:
```env
REACT_APP_GEMINI_API_KEY=your_key_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# ... (other Firebase config)
```

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## 📊 Triage Scoring

MedAI uses a **1-5 severity scale**:
- **1 (Minor):** Home care, monitor
- **2 (Moderate):** See doctor within 24-48 hours
- **3 (Moderate-Severe):** Visit ER today
- **4 (Severe):** ER urgent (1-2 hours)
- **5 (Critical):** Call 911 immediately

Safety escalation is built-in: if AI confidence is low or critical keywords are detected, 
severity is automatically escalated.

## 🔒 Safety & Privacy

- ⚠️ **NOT a medical diagnosis tool** – For triage guidance only
- 🔐 **No personal data stored** – Only anonymized triage results
- 🚨 **Always recommends professional care** when in doubt
- 📋 **Includes medical disclaimer** on all screens

## 📱 Demo

**Live URL:** [https://medai-xxxxx.web.app](https://medai-xxxxx.web.app)  
**Demo Video:** [YouTube Link - 2 min walkthrough](https://youtu.be/xxx)

## 📈 Performance

- ⚡ Page load: < 3 seconds
- 🤖 Gemini analysis: 5-10 seconds
- 📊 Total flow: < 15 seconds

## 🛠️ Architecture
User → MedAI PWA (React) → Gemini 3 Pro Vision API
→ Triage Scoring Logic → Firebase Firestore → Results Display

## 🎓 Learnings & Future Work

### Phase 2 (Post-Hackathon)
- Real-time hospital wait times API
- Multilingual support (Hindi, Urdu, Spanish)
- Voice-to-text for symptom intake
- Doctor-friendly summaries for ER handoff
- Telemedicine integration

## 📄 License

MIT License – Feel free to fork and contribute

## 👥 Team

Built for the **Google DeepMind – Vibe Code with Gemini 3 Pro** hackathon

## ⚕️ Medical Disclaimer

**MedAI is NOT a substitute for professional medical advice.**

- Always seek immediate professional help for life-threatening emergencies
- Call 911 (or your local emergency number) when in doubt
- This tool is for educational and triage guidance only

---

**Built with ❤️ using Google AI Studio, Gemini 3 Pro, and Firebase**