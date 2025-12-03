🎵 AI-Powered Artist Promotion Assistant (POC)

Course: ITAI 4373
Term: Fall 2025
Project Type: Functional Proof of Concept (POC)
Student: Kaylee Auguillard
Client: Joe Fleishman

🔗 Live Demo (Vercel Deployment)

You can view the live Proof of Concept (POC) application here:

👉 https://final-project-ai-powered-a-git-73c8ee-kaylees-projects-3076c988.vercel.app

This deployed version demonstrates:
- Mock live platform monitoring
- AI opportunity scoring simulation
- Lead management approval/denial workflow
- Performance analytics with mock metrics

📌 Project Overview

The AI-Powered Artist Promotion Assistant is a simulated marketing intelligence platform designed to help artists and managers identify promotion opportunities using AI-driven analysis. The system monitors multiple platforms, evaluates engagement opportunities, assigns AI scores, and tracks performance analytics through a centralized dashboard.

This version is a working Proof of Concept (POC) showcasing:

- Platform monitoring simulation
- Lead scoring and approval workflow
- Performance analytics with mock data
- AI-powered ranking logic (simulated)

✅ Key Features
- ✅ Live Monitoring Simulation
Simulates tracking across multiple digital platforms (Instagram, TikTok, YouTube).
- ✅ AI Opportunity Scoring System
Each lead receives a dynamically generated AI score based on:
- Engagement level
- Follower count
- ontent type
- Platform type

✅ Approval & Denial Workflow
Users can:

Approve leads for outreach

Dismiss irrelevant leads

Track decision history

✅ Performance Analytics Dashboard

Weekly lead activity

Total approvals vs dismissals

Conversion performance (mock)

Growth trend indicators

✅ Mock Data Pools

Expanded mock lead database

Realistic artist engagement scenarios

🧠 AI Logic (Simulated)

The AI scoring system is based on weighted criteria:

Factor	Weight
Engagement Volume	40%
Follower Count	25%
Platform Influence	20%
Content Relevance	15%

Final Score = Weighted sum of all factors (0–100)

This allows ranking and prioritization of promotional opportunities.

🏗️ Technical Architecture

Frontend:

React (Vite-based build)

HTML5 / CSS3

JavaScript (ES6)

State Management:

React useState

Component-level data handling

Data Layer:

Local mock lead pools

Static performance analytics datasets

Deployment:

Vercel

📂 Project Structure
/src
  ├── App.jsx
  ├── index.css
  ├── main.jsx
/index.html
/package.json

📊 Functional POC Deliverables (Completed)
Requirement	Status
Live Monitoring (2+ Platforms)	✅ Completed
AI Analysis & Opportunity Scoring	✅ Completed
Approval / Denial Workflow	✅ Completed
Analytics Dashboard	✅ Completed
Mock Data Pools	✅ Completed
Vercel Deployment	✅ Completed
🚀 How to Run Locally
npm install
npm run dev

⚠️ Limitations (POC Scope)

This system is a Proof of Concept, which means:

No real API integrations

No real AI model training

No real-time data ingestion

All metrics are mock-generated

Future versions may integrate:

TikTok, Instagram, Spotify, and YouTube APIs

Real-time NLP analysis

Machine learning ranking models

📈 Future Enhancements

Live social media API monitoring

True AI/ML opportunity ranking

Automated artist outreach emails

Campaign ROI prediction

CRM system integration

📜 License

This project is for academic demonstration purposes only.
