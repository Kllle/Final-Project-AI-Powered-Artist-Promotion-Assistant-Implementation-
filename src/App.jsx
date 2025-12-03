// src/App.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Edit3,
  RefreshCw,
  Instagram,
  Linkedin,
  User,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  History,
  MessageSquare
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Components & utils
import Dashboard from './components/Dashboard';
import ExportCSVButton from './components/ExportCSVButton';
import { calculateScore } from './utils/score';
import { estimateROI } from './utils/roi';

/* ------------------ Expanded Mock Leads ------------------ */
const MOCK_LEADS_POOL = [
  { id: 1, user: "interior_visionary", platform: "instagram", avatar: "IV", persona: "Interior Designer", content: "This piece would look amazing in a hotel lobby. Do you ship to NYC?", opportunityScore: 92, aiDraft: "Yes! I can ship to NYC. Want dimensions and pricing?", timestamp: "2m ago" },
  { id: 2, user: "office_space_pro", platform: "linkedin", avatar: "OS", persona: "Corporate Buyer", content: "We’re redesigning our workspace and looking for modern artwork.", opportunityScore: 86, aiDraft: "Happy to provide curated options for your office.", timestamp: "5m ago" },
  { id: 3, user: "artlover_daily", platform: "instagram", avatar: "AD", persona: "Art Enthusiast", content: "This is beautiful!! Do you have prints available?", opportunityScore: 68, aiDraft: "Yes! Prints available in multiple sizes.", timestamp: "8m ago" },
  { id: 4, user: "renovationqueen", platform: "instagram", avatar: "RQ", persona: "Homeowner", content: "I’m remodeling my living room and this piece would fit perfectly!", opportunityScore: 75, aiDraft: "I can help match the piece to your new layout.", timestamp: "12m ago" },
  { id: 5, user: "marketing_minds", platform: "linkedin", avatar: "MM", persona: "Brand/Agency Buyer", content: "Looking for unique visuals for a brand campaign — do you take commissions?", opportunityScore: 83, aiDraft: "Yes! I regularly partner with agencies.", timestamp: "18m ago" },
  { id: 6, user: "gallerywatch", platform: "instagram", avatar: "GW", persona: "Gallery Scout", content: "Your style is very unique — have you exhibited recently?", opportunityScore: 72, aiDraft: "Yes! I can share portfolio & upcoming exhibitions.", timestamp: "22m ago" },
  { id: 7, user: "home_decorator", platform: "instagram", avatar: "HD", persona: "Homeowner", content: "Looking for a statement piece for my dining room.", opportunityScore: 80, aiDraft: "I have some perfect pieces for dining rooms.", timestamp: "30m ago" },
  { id: 8, user: "corporate_creative", platform: "linkedin", avatar: "CC", persona: "Corporate Buyer", content: "We want a mural for our lobby.", opportunityScore: 88, aiDraft: "I can design a custom mural for your lobby.", timestamp: "45m ago" },
  { id: 9, user: "museum_curator", platform: "linkedin", avatar: "MC", persona: "Curator", content: "Interested in featuring your work in our gallery.", opportunityScore: 91, aiDraft: "I’d love to collaborate with your gallery.", timestamp: "1h ago" },
  { id: 10, user: "design_fan", platform: "instagram", avatar: "DF", persona: "Art Enthusiast", content: "Love your style, can I buy this piece?", opportunityScore: 65, aiDraft: "Yes! I can provide pricing and shipping info.", timestamp: "1h 15m ago" },
  { id: 11, user: "startup_ceo", platform: "linkedin", avatar: "SC", persona: "Corporate Buyer", content: "Need art for our new startup office.", opportunityScore: 77, aiDraft: "I can suggest modern, energetic pieces for your space.", timestamp: "2h ago" },
  { id: 12, user: "interior_blogger", platform: "instagram", avatar: "IB", persona: "Influencer", content: "Can I feature your artwork in my blog?", opportunityScore: 70, aiDraft: "Absolutely! I can provide images and details.", timestamp: "2h 30m ago" }
];

/* ------------------ Small reusable components ------------------ */
const ScoreBadge = ({ score }) => {
  let cls = "badge-gray";
  if (score >= 80) cls = "badge-green";
  else if (score >= 50) cls = "badge-yellow";
  return <span className={`score-badge ${cls}`}>{score}</span>;
};

const MetricCard = ({ title, value, subtext }) => (
  <div className="card metric-card">
    <div className="card-body">
      <p className="muted">{title}</p>
      <h3 className="metric-value">{value}</h3>
      {subtext && <span className="muted-sm">{subtext}</span>}
    </div>
  </div>
);

/* ------------------ App Component ------------------ */
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState(
    MOCK_LEADS_POOL.map(lead => {
      const score = calculateScore(lead);
      const estimatedROI = estimateROI({ ...lead, score });
      return { ...lead, score, estimatedROI, suggestedResponse: '' };
    })
  );

  const [selectedLead, setSelectedLead] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedResponse, setEditedResponse] = useState("");
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const [brandVoice, setBrandVoice] = useState("Professional yet Creative");
  const [autoReplyThreshold] = useState(90);

  const [approvedLeads, setApprovedLeads] = useState([]);
  const [dismissedLeads, setDismissedLeads] = useState([]);

  /* ------------------ Utility functions ------------------ */
  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2600);
  };

  const fetchNewLead = () => {
    const idx = Math.floor(Math.random() * MOCK_LEADS_POOL.length);
    const newLead = { ...MOCK_LEADS_POOL[idx], id: Date.now(), timestamp: "Just now" };
    setLeads(prev => [newLead, ...prev]);
    notify(`New lead from ${newLead.platform}`);
  };

  const openLead = (lead) => {
    setSelectedLead(lead);
    setEditedResponse(lead.aiDraft);
    setEditMode(false);
  };

  const handleApprove = (id) => {
    const lead = leads.find(l => l.id === id);
    setApprovedLeads(prev => [...prev, lead]);
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedLead(null);
    notify("Approved & queued for posting");
  };

  const handleDismiss = (id) => {
    const lead = leads.find(l => l.id === id);
    setDismissedLeads(prev => [...prev, lead]);
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedLead(null);
  };

  const filteredLeads = () => {
    if (filter === "all") return leads;
    if (filter === "high-value") return leads.filter(l => l.opportunityScore >= 80);
    return leads.filter(l => l.platform === filter);
  };

  /* ------------------ Mock analytics chart ------------------ */
  const chartData = [
    { name: 'Instagram', approved: approvedLeads.filter(l => l.platform === "instagram").length, dismissed: dismissedLeads.filter(l => l.platform === "instagram").length },
    { name: 'LinkedIn', approved: approvedLeads.filter(l => l.platform === "linkedin").length, dismissed: dismissedLeads.filter(l => l.platform === "linkedin").length },
  ];

  /* ------------------ Render ------------------ */
  return (
    <div className="app-root">
      {notification && (
        <div className="toast">
          <CheckCircle className="w-4 h-4 mr-2" />
          <div>{notification}</div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <Sparkles className="w-5 h-5" />
          <div>
            <div className="brand-title">ArtAssist.ai</div>
            <div className="brand-sub">Client: Joe Fleishman</div>
          </div>
        </div>

        <nav className="nav">
          <button className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button className={`nav-btn ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
          <button className={`nav-btn ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
            <History className="w-4 h-4" /> History
          </button>
          <button className={`nav-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <Settings className="w-4 h-4" /> Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="main-header">
          <div>
            <h1 className="title">{activeTab.replace("-", " ")}</h1>
            <p className="subtitle">
              {activeTab === "dashboard" && "Review & approve AI-suggested replies for leads"}
              {activeTab === "analytics" && "Performance overview & KPIs"}
              {activeTab === "history" && "Engagement log & response history"}
              {activeTab === "settings" && "Control brand voice & automation behavior"}
            </p>
          </div>

          <div className="header-actions">
            <div className="status-pill">AI Engine Online</div>
            <button className="sim-btn" onClick={fetchNewLead}>
              <RefreshCw className="w-4 h-4" /> Simulate
            </button>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <Dashboard
            leads={filteredLeads()}
            openLead={openLead}
            selectedLead={selectedLead}
            handleApprove={handleApprove}
            handleDismiss={handleDismiss}
            editMode={editMode}
            setEditMode={setEditMode}
            editedResponse={editedResponse}
            setEditedResponse={setEditedResponse}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <section className="analytics">
            <h2>Performance Analytics</h2>
            <div className="metrics">
              <MetricCard title="Total Leads Processed" value={approvedLeads.length + dismissedLeads.length} subtext="Approved + Dismissed" />
              <MetricCard title="Approval Rate" value={`${((approvedLeads.length / ((approvedLeads.length + dismissedLeads.length) || 1)) * 100).toFixed(1)}%`} subtext="CTR / Leads Approved" />
              <MetricCard title="High-Value Opportunities" value={leads.filter(l => l.opportunityScore >= 80).length} subtext="Score >= 80" />
              <MetricCard title="Estimated Revenue" value={`$${approvedLeads.reduce((sum, l) => sum + l.estimatedROI, 0)}`} subtext="From approved leads" />
            </div>

            <h3>Lead Approval Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="approved" stackId="a" fill="#4ade80" />
                <Bar dataKey="dismissed" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <section className="history">
            <h2>Engagement Log</h2>
            <div className="history-box muted-sm">No engagement logged yet.</div>
          </section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <section className="settings">
            <div className="settings-card">
              <h2>AI Configuration</h2>
              <label className="muted-sm">Brand Voice</label>
              <select value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} className="select">
                <option>Professional yet Creative</option>
                <option>Casual & Friendly</option>
                <option>High-End / Luxury</option>
              </select>

              <label className="muted-sm">Auto-draft Threshold ({autoReplyThreshold}%)</label>
              <input type="range" min="50" max="100" defaultValue={autoReplyThreshold} className="range" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
