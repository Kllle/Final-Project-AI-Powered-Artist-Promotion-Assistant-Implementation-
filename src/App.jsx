// src/App.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  CheckCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  DollarSign,
  History
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import { calculateScore } from "./utils/score";
import { estimateROI } from "./utils/roi";

/* ------------------ MOCK LEADS ------------------ */
const MOCK_LEADS_POOL = [
  {
    id: 1,
    user: "interior_visionary",
    platform: "instagram",
    avatar: "IV",
    persona: "Interior Designer",
    content: "This piece would look amazing in a hotel lobby. Do you ship to NYC?",
    opportunityScore: 92,
    aiDraft:
      "Thank you so much! Yes — I absolutely ship to NYC. I’d love to help you find the perfect piece for your hotel project. Would you like dimensions, pricing, or alternative color options?",
    timestamp: "2m ago"
  },
  {
    id: 2,
    user: "office_space_pro",
    platform: "linkedin",
    avatar: "OS",
    persona: "Corporate Buyer",
    content: "We’re redesigning our workspace and looking for modern artwork.",
    opportunityScore: 86,
    aiDraft:
      "That sounds exciting! I specialize in modern, space-enhancing pieces. I’d be happy to recommend options based on your office size and aesthetic. Would you like me to send a curated shortlist?",
    timestamp: "5m ago"
  },
  {
    id: 3,
    user: "artlover_daily",
    platform: "instagram",
    avatar: "AD",
    persona: "Art Enthusiast",
    content: "This is beautiful!! Do you have prints available?",
    opportunityScore: 68,
    aiDraft:
      "Thank you! Yes, I offer high-quality prints in multiple sizes. Would you like me to share available formats and pricing?",
    timestamp: "8m ago"
  },
  {
    id: 4,
    user: "renovationqueen",
    platform: "instagram",
    avatar: "RQ",
    persona: "Homeowner",
    content: "I’m remodeling my living room and this piece would fit perfectly!",
    opportunityScore: 75,
    aiDraft:
      "That means a lot — thank you! If you'd like, I can help match the piece to your room’s new colors and layout. Want to share a photo of the space?",
    timestamp: "12m ago"
  },
  {
    id: 5,
    user: "marketing_minds",
    platform: "linkedin",
    avatar: "MM",
    persona: "Brand/Agency Buyer",
    content:
      "We're looking for unique visuals for a brand campaign — do you take commissions?",
    opportunityScore: 83,
    aiDraft:
      "Yes, absolutely! I regularly partner with agencies for bespoke artwork and campaign visuals. I’d love to learn more about your theme and deliverables.",
    timestamp: "18m ago"
  },
  {
    id: 6,
    user: "gallerywatch",
    platform: "instagram",
    avatar: "GW",
    persona: "Gallery Scout",
    content: "Your style is very unique — have you exhibited recently?",
    opportunityScore: 72,
    aiDraft:
      "Thank you so much! I’ve participated in several recent exhibitions. I’d be glad to share my portfolio or upcoming availability.",
    timestamp: "22m ago"
  },
  // extra mock items
  {
    id: 7,
    user: "modern_art_hunter",
    platform: "linkedin",
    avatar: "MA",
    persona: "Collector",
    content: "Looking for contemporary pieces for my gallery.",
    opportunityScore: 88,
    aiDraft: "Excited to connect! I can recommend several contemporary pieces perfect for your gallery.",
    timestamp: "30m ago"
  },
  {
    id: 8,
    user: "home_decorator",
    platform: "instagram",
    avatar: "HD",
    persona: "Interior Designer",
    content: "Need some vibrant artwork for a client’s living room.",
    opportunityScore: 77,
    aiDraft: "I have a few vibrant pieces that could work beautifully. Want a curated selection?",
    timestamp: "35m ago"
  }
];

/* ------------------ MOCK CHART DATA (static for POC) ------------------ */
const MOCK_CHART_DATA = [
  { day: "Mon", approved: 2, dismissed: 1 },
  { day: "Tue", approved: 3, dismissed: 0 },
  { day: "Wed", approved: 1, dismissed: 2 },
  { day: "Thu", approved: 4, dismissed: 1 },
  { day: "Fri", approved: 5, dismissed: 2 },
  { day: "Sat", approved: 0, dismissed: 1 },
  { day: "Sun", approved: 0, dismissed: 2 }
];

/* ------------------ Small Reusable Components ------------------ */
const MetricCard = ({ title, value, subtext, Icon }) => (
  <div className="card metric-card">
    <div className="icon-wrap">
      {Icon && <Icon className="w-6 h-6" />}
    </div>
    <div className="card-body">
      <p className="muted">{title}</p>
      <h3 className="metric-value">{value}</h3>
      {subtext && <p className="muted-sm">{subtext}</p>}
    </div>
  </div>
);

/* ------------------ App ------------------ */
export default function App() {
  // initialize leads with score & estimatedROI computed from utils
  const [leads, setLeads] = useState(
    MOCK_LEADS_POOL.map((lead) => {
      const score = calculateScore(lead);
      const estimatedROI = estimateROI({ ...lead, score });
      return { ...lead, score, estimatedROI, suggestedResponse: "" };
    })
  );

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedResponse, setEditedResponse] = useState("");
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const [brandVoice, setBrandVoice] = useState("Professional yet Creative");
  const [autoReplyThreshold] = useState(90);

  const [approvedLeads, setApprovedLeads] = useState([]);
  const [dismissedLeads, setDismissedLeads] = useState([]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2600);
  };

  const fetchNewLead = () => {
    const idx = Math.floor(Math.random() * MOCK_LEADS_POOL.length);
    const newLead = { ...MOCK_LEADS_POOL[idx], id: Date.now(), timestamp: "Just now" };
    // compute score/roi for new item
    const score = calculateScore(newLead);
    const estimatedROI = estimateROI({ ...newLead, score });
    setLeads((prev) => [{ ...newLead, score, estimatedROI, suggestedResponse: "" }, ...prev]);
    notify(`New lead from ${newLead.platform}`);
  };

  const openLead = (lead) => {
    setSelectedLead(lead);
    setEditedResponse(lead.aiDraft || "");
    setEditMode(false);
  };

  const handleApprove = (id) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    setApprovedLeads((prev) => [...prev, lead]);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    notify("Approved & queued for posting");
  };

  const handleDismiss = (id) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    setDismissedLeads((prev) => [...prev, lead]);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
    notify("Dismissed");
  };

  const filteredLeads = () => {
    if (filter === "all") return leads;
    if (filter === "high-value") return leads.filter((l) => l.opportunityScore >= 80);
    return leads.filter((l) => l.platform === filter);
  };

  /* ------------------ Derived analytics (dynamic from actions) ------------------ */
  const totalProcessed = approvedLeads.length + dismissedLeads.length;
  const estimatedRevenue = approvedLeads.reduce((sum, l) => sum + (l.estimatedROI || 500), 0); // fallback per-lead
  const approvalRate = totalProcessed > 0 ? ((approvedLeads.length / totalProcessed) * 100).toFixed(1) : "0.0";

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
              {activeTab === "dashboard" && "Review & approve AI-suggested replies for real leads"}
              {activeTab === "analytics" && "Performance overview & KPI metrics"}
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

        {/* DASHBOARD */}
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

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <section className="analytics">
            <h2>Performance Analytics</h2>

            <div className="metrics">
              <MetricCard Icon={TrendingUp} title="Total Leads Processed" value={totalProcessed} subtext="Approved + Dismissed" />
              <MetricCard Icon={DollarSign} title="Estimated Revenue" value={`$${estimatedRevenue}`} subtext="From approved leads" />
              <MetricCard Icon={CheckCircle} title="Approval Rate" value={`${approvalRate}%`} subtext="Approved / Processed" />
              <MetricCard Icon={LayoutDashboard} title="High-Value Opportunities" value={leads.filter(l => l.opportunityScore >= 80).length} subtext="Score >= 80" />
            </div>

            {/* MOCK CHART — horizontal bar rows */}
            <div className="mock-chart">
              <h3>Weekly Lead Activity</h3>

              <div className="chart-rows">
                {MOCK_CHART_DATA.map((d) => {
                  const scale = 18; // px per unit
                  const approvedWidth = d.approved * scale;
                  const dismissedWidth = d.dismissed * scale;

                  return (
                    <div className="chart-row" key={d.day}>
                      <div className="chart-day">{d.day}</div>

                      <div className="chart-bars-row">
                        <div className="bar-group">
                          <div className="bar approved-bar" style={{ width: `${approvedWidth}px` }}>
                            {d.approved > 0 ? d.approved : ""}
                          </div>
                          <div className="bar-label">Approved</div>
                        </div>

                        <div className="bar-group">
                          <div className="bar dismissed-bar" style={{ width: `${dismissedWidth}px` }}>
                            {d.dismissed > 0 ? d.dismissed : ""}
                          </div>
                          <div className="bar-label">Dismissed</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="legend">
                <div className="legend-item"><span className="legend-approved" /> Approved</div>
                <div className="legend-item"><span className="legend-dismissed" /> Dismissed</div>
                <div style={{ marginLeft: "auto", color: "#333", fontWeight: 700 }}>Data is simulated for POC</div>
              </div>
            </div>
          </section>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <section className="history">
            <h2>Engagement Log</h2>
            <div className="history-box muted-sm">No engagement logged yet.</div>
          </section>
        )}

        {/* SETTINGS */}
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
