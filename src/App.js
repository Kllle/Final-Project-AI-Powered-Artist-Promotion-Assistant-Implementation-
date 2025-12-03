import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Send, 
  RefreshCw, 
  Instagram, 
  Linkedin, 
  User, 
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  History,
  Filter,
  Sliders
} from 'lucide-react';

// --- MOCK DATA & SIMULATION UTILITIES ---

const MOCK_LEADS_POOL = [
  {
    id: 101,
    platform: 'instagram',
    user: 'design_studio_nyc',
    avatar: 'DS',
    content: "We are looking for unique digital abstract pieces for a corporate lobby project in Manhattan. DM us if interested!",
    persona: 'Interior Designer',
    opportunityScore: 95,
    scoreReason: "High purchasing intent detected. Specific location and project type mentioned.",
    aiDraft: "Hi! I'd love to discuss your lobby project. My portfolio features several abstract digital series that work well in corporate spaces. Sending you a DM now!",
    timestamp: '2 mins ago'
  },
  {
    id: 102,
    platform: 'linkedin',
    user: 'Sarah Jenkins',
    avatar: 'SJ',
    content: "Does anyone know artists who specialize in neo-futurism? Need a cover artist for our tech magazine.",
    persona: 'Corporate Buyer',
    opportunityScore: 88,
    scoreReason: "Commercial opportunity identified. Matches 'neo-futurism' keyword tag.",
    aiDraft: "Hello Sarah, I specialize in neo-futurism and have experience with editorial illustration. You can view my relevant samples at [Link].",
    timestamp: '15 mins ago'
  },
  {
    id: 103,
    platform: 'instagram',
    user: 'art_fan_99',
    avatar: 'AF',
    content: "Wow this is so cool! 🔥",
    persona: 'Art Enthusiast',
    opportunityScore: 45,
    scoreReason: "Low commercial intent. High engagement value.",
    aiDraft: "Thanks so much! Glad you like the vibe. 🔥",
    timestamp: '1 hour ago'
  },
  {
    id: 104,
    platform: 'instagram',
    user: 'gallery_scout_london',
    avatar: 'GL',
    content: "Are you represented in the UK yet? We have an open call for digital surrealism.",
    persona: 'Art Collector',
    opportunityScore: 92,
    scoreReason: "Potential partnership/representation opportunity.",
    aiDraft: "Hi there! I am currently unrepresented in the UK and would love to learn more about the open call.",
    timestamp: 'Just now'
  },
  {
    id: 105,
    platform: 'linkedin',
    user: 'TechStart Inc',
    avatar: 'TS',
    content: "We need a mural for our new office. Any digital artists do large format prints?",
    persona: 'Corporate Buyer',
    opportunityScore: 78,
    scoreReason: "Matches 'mural' and 'office' keywords.",
    aiDraft: "Hi team! I specialize in high-res digital art suitable for large format printing. Let's connect!",
    timestamp: '3 hours ago'
  },
  {
    id: 106,
    platform: 'instagram',
    user: 'dog_lover_xoxo',
    avatar: 'DL',
    content: "Omg do you do pet portraits in this glitch style? My pug needs this!",
    persona: 'Private Commission',
    opportunityScore: 85,
    scoreReason: "Direct commission inquiry detected.",
    aiDraft: "I definitely do! I love working on pet portraits in my glitch style. I'll DM you my rate sheet.",
    timestamp: '5 mins ago'
  },
  {
    id: 107,
    platform: 'linkedin',
    user: 'Global Publishing',
    avatar: 'GP',
    content: "Looking to license abstract #3 for an upcoming sci-fi novel cover. Please connect.",
    persona: 'Corporate Buyer',
    opportunityScore: 98,
    scoreReason: "Specific licensing request for existing asset.",
    aiDraft: "Hello, I would be delighted to discuss licensing Abstract #3. I have sent you a connection request to discuss terms.",
    timestamp: '20 mins ago'
  },
  {
    id: 108,
    platform: 'instagram',
    user: 'crypto_king_22',
    avatar: 'CK',
    content: "Yo let's collab. I have 50k followers. Exposure for art?",
    persona: 'Influencer',
    opportunityScore: 30,
    scoreReason: "Low value proposition. 'Exposure' keyword detected.",
    aiDraft: "Thanks for the offer! I'm currently fully booked with paid commissions, but best of luck with your channel.",
    timestamp: '4 hours ago'
  },
  {
    id: 109,
    platform: 'instagram',
    user: 'urban_decor_mag',
    avatar: 'UD',
    content: "Can we feature this piece in our 'Digital Spaces' monthly roundup? We credit fully.",
    persona: 'Press/Media',
    opportunityScore: 65,
    scoreReason: "Media exposure opportunity. Non-monetary but high brand value.",
    aiDraft: "I'd love to be featured! Please feel free to use the image with credit tag @JoeFleishmanArt.",
    timestamp: '1 day ago'
  },
  {
    id: 110,
    platform: 'linkedin',
    user: 'EventHorizon LLC',
    avatar: 'EH',
    content: "We are organizing a Digital Art Summit in Austin. Are you open to speaking panels?",
    persona: 'Event Organizer',
    opportunityScore: 72,
    scoreReason: "Speaking engagement/Thought leadership opportunity.",
    aiDraft: "Hi team, I am interested in learning more about the Summit panels. Let's connect to discuss the schedule.",
    timestamp: '2 hours ago'
  }
];

// --- COMPONENTS ---

const ScoreBadge = ({ score }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (score >= 80) colorClass = "bg-green-100 text-green-800 border border-green-200";
  else if (score >= 50) colorClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
  else colorClass = "bg-gray-100 text-gray-600 border border-gray-200";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {score}/100 Opportunity
    </span>
  );
};

const PlatformIcon = ({ platform }) => {
  if (platform === 'instagram') return <Instagram className="w-4 h-4 text-pink-600" />;
  if (platform === 'linkedin') return <Linkedin className="w-4 h-4 text-blue-700" />;
  return <MessageSquare className="w-4 h-4 text-gray-500" />;
};

const MetricCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
    <div className="p-3 bg-indigo-50 rounded-lg">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      <div className="flex items-center mt-1 space-x-2">
        <span className="text-xs text-green-600 font-medium flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
        <span className="text-xs text-gray-400">{subtext}</span>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState(MOCK_LEADS_POOL.slice(0, 5));
  const [history, setHistory] = useState([]);
  const [processedCount, setProcessedCount] = useState(142);
  const [timeSaved, setTimeSaved] = useState(12); // hours
  const [selectedLead, setSelectedLead] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedResponse, setEditedResponse] = useState("");
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState('all'); // all, instagram, linkedin, high-value
  
  // Settings State
  const [brandVoice, setBrandVoice] = useState('Professional yet Creative');
  const [autoReplyThreshold, setAutoReplyThreshold] = useState(90);

  // Simulate "Live Monitoring"
  const fetchNewLead = () => {
    const randomIdx = Math.floor(Math.random() * MOCK_LEADS_POOL.length);
    const randomLead = { 
      ...MOCK_LEADS_POOL[randomIdx], 
      id: Date.now(),
      timestamp: 'Just now' 
    };
    setLeads(prev => [randomLead, ...prev]);
    showNotification(`New lead detected from ${randomLead.platform === 'instagram' ? 'Instagram' : 'LinkedIn'}!`);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (id) => {
    const leadToApprove = leads.find(l => l.id === id);
    if (leadToApprove) {
        // Move to history
        const approvedItem = {
            ...leadToApprove,
            approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            finalResponse: editMode ? editedResponse : leadToApprove.aiDraft
        };
        setHistory(prev => [approvedItem, ...prev]);
    }
    
    setLeads(leads.filter(l => l.id !== id));
    setProcessedCount(prev => prev + 1);
    setTimeSaved(prev => prev + 0.2); 
    setSelectedLead(null);
    showNotification("Response posted successfully!");
  };

  const handleDismiss = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    setSelectedLead(null);
  };

  const openLead = (lead) => {
    setSelectedLead(lead);
    setEditedResponse(lead.aiDraft);
    setEditMode(false);
  };

  const getFilteredLeads = () => {
    if (filter === 'all') return leads;
    if (filter === 'high-value') return leads.filter(l => l.opportunityScore >= 80);
    return leads.filter(l => l.platform === filter);
  };

  // --- VIEWS ---

  const renderDashboard = () => (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left: Feed */}
      <div className="w-1/2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
             <h2 className="text-lg font-semibold text-gray-800">Live Feed</h2>
             <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{leads.length}</span>
          </div>
          <button 
            onClick={fetchNewLead}
            className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Simulate
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
          {['all', 'instagram', 'linkedin', 'high-value'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {getFilteredLeads().map(lead => (
            <div 
              key={lead.id}
              onClick={() => openLead(lead)}
              className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedLead?.id === lead.id ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`p-1.5 rounded-full ${lead.platform === 'instagram' ? 'bg-pink-50' : 'bg-blue-50'}`}>
                    <PlatformIcon platform={lead.platform} />
                  </span>
                  <span className="text-sm font-semibold text-gray-700">@{lead.user}</span>
                  <span className="text-xs text-gray-400">• {lead.timestamp}</span>
                </div>
                <ScoreBadge score={lead.opportunityScore} />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">"{lead.content}"</p>
              <div className="flex items-center text-xs text-gray-400">
                 <User className="w-3 h-3 mr-1" />
                 Identified as: <span className="font-medium text-gray-600 ml-1">{lead.persona}</span>
              </div>
            </div>
          ))}
          {getFilteredLeads().length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No leads match this filter.</p>
              <button onClick={() => setFilter('all')} className="text-indigo-600 text-sm font-medium mt-2 hover:underline">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Action Area */}
      <div className="w-1/2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {selectedLead ? (
          <>
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {selectedLead.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">@{selectedLead.user}</h3>
                    <p className="text-xs text-gray-500">{selectedLead.platform} • {selectedLead.persona}</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">AI Confidence</div>
                   <div className="text-2xl font-bold text-indigo-600">{selectedLead.opportunityScore}%</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 italic">
                "{selectedLead.content}"
              </div>
              <div className="mt-3 flex items-center text-xs text-indigo-600 bg-indigo-50 p-2 rounded border border-indigo-100">
                <Sparkles className="w-3 h-3 mr-2" />
                AI Insight: {selectedLead.scoreReason}
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Suggested Response</h4>
                {!editMode && (
                  <button onClick={() => setEditMode(true)} className="text-xs flex items-center text-gray-500 hover:text-indigo-600">
                    <Edit3 className="w-3 h-3 mr-1" /> Edit
                  </button>
                )}
              </div>
              
              {editMode ? (
                <textarea 
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="w-full flex-1 p-4 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm text-gray-700"
                />
              ) : (
                <div className="w-full flex-1 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {editedResponse}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <button 
                onClick={() => handleDismiss(selectedLead.id)}
                className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dismiss
              </button>
              <div className="flex space-x-3">
                 {editMode && (
                   <button 
                     onClick={() => setEditMode(false)}
                     className="px-4 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium"
                   >
                     Cancel
                   </button>
                 )}
                 <button 
                   onClick={() => handleApprove(selectedLead.id)}
                   className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition-all transform hover:scale-105"
                 >
                   <CheckCircle className="w-4 h-4 mr-2" />
                   {editMode ? 'Save & Approve' : 'Approve & Post'}
                 </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10">
            <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-400">Select a lead to review AI suggestions</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
      <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Engagement Log</h2>
            <button className="text-sm text-indigo-600 hover:underline">Export CSV</button>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {history.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No messages approved yet.</p>
                 </div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Platform</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Our Response</th>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <PlatformIcon platform={item.platform} />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">@{item.user}</td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.finalResponse}>
                                    {item.finalResponse}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{item.approvedAt}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Posted
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>
      </div>
  );

  const renderSettings = () => (
      <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Sliders className="w-5 h-5 mr-2 text-indigo-600"/> 
                  AI Configuration
              </h2>
              
              <div className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand Voice</label>
                      <select 
                        value={brandVoice}
                        onChange={(e) => setBrandVoice(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                          <option>Professional yet Creative</option>
                          <option>Casual & Friendly</option>
                          <option>High-End / Luxury</option>
                          <option>Minimalist</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Determines the tone of AI-generated drafts.</p>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Personas</label>
                      <div className="flex flex-wrap gap-2">
                          {['Interior Designer', 'Corporate Buyer', 'Art Collector', 'Gallery Owner'].map(p => (
                              <span key={p} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  {p}
                                  <button className="ml-2 hover:text-indigo-900">×</button>
                              </span>
                          ))}
                          <button className="px-3 py-1 rounded-full text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600">
                              + Add Persona
                          </button>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                       <label className="block text-sm font-medium text-gray-700 mb-4">
                           Auto-Draft Threshold
                           <span className="ml-2 text-xs font-normal text-gray-500">(Current: {autoReplyThreshold}%)</span>
                       </label>
                       <input 
                         type="range" 
                         min="50" 
                         max="100" 
                         value={autoReplyThreshold} 
                         onChange={(e) => setAutoReplyThreshold(e.target.value)}
                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                       <div className="flex justify-between text-xs text-gray-400 mt-2">
                           <span>Aggressive (50%)</span>
                           <span>Conservative (100%)</span>
                       </div>
                  </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                      Save Configuration
                  </button>
              </div>
          </div>
      </div>
  );

  const renderAnalytics = () => (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance & Business Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Engagement Growth" 
          value="+28%" 
          subtext="vs. last month" 
          trend="4.2%"
          icon={TrendingUp} 
        />
        <MetricCard 
          title="Hours Saved" 
          value={`${Math.floor(timeSaved)}h ${Math.round((timeSaved % 1) * 60)}m`} 
          subtext="Manual outreach reduced" 
          trend="40%"
          icon={Clock} 
        />
        <MetricCard 
          title="Projected Revenue" 
          value="$12.4k" 
          subtext={`From ${processedCount} leads`} 
          trend="15%"
          icon={DollarSign} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Source Breakdown</h3>
          <div className="space-y-4">
             {/* Simple Custom Bar Chart */}
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 flex items-center"><Instagram className="w-3 h-3 mr-1"/> Instagram</span>
                 <span className="font-bold text-gray-800">65%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2.5">
                 <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 flex items-center"><Linkedin className="w-3 h-3 mr-1"/> LinkedIn</span>
                 <span className="font-bold text-gray-800">35%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2.5">
                 <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
               </div>
             </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
            <strong>Analysis:</strong> Instagram remains the primary driver for visual discovery, while LinkedIn converts higher for corporate commissions.
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Accuracy (Human Review)</h3>
          <div className="flex items-center justify-center py-6">
             <div className="relative w-32 h-32">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                 <circle cx="64" cy="64" r="56" stroke="#4f46e5" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="35.18" />
               </svg>
               <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                 <span className="text-2xl font-bold text-indigo-600">92%</span>
                 <span className="text-xs text-gray-500">Approval Rate</span>
               </div>
             </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Only 8% of responses required major manual editing.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center animate-bounce-in">
          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
          {notification}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">ArtAssist.ai</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Client: Joe Fleishman</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
            {leads.length > 0 && <span className="ml-auto bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">{leads.length}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <History className="w-5 h-5" />
            <span>History Log</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics & ROI</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-indigo-900 rounded-xl p-4 text-white">
            <p className="text-xs opacity-70 mb-1">Total Processed</p>
            <h3 className="text-2xl font-bold">{processedCount}</h3>
            <div className="h-1 w-full bg-indigo-800 rounded-full mt-2 overflow-hidden">
               <div className="h-full bg-green-400 w-3/4"></div>
            </div>
            <p className="text-xs mt-2 text-indigo-200">System Healthy</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-sm text-gray-500">
              {activeTab === 'dashboard' && 'Review and approve AI-generated engagement.'}
              {activeTab === 'history' && 'Audit log of all AI-driven interactions.'}
              {activeTab === 'analytics' && 'Track KPIs and business growth.'}
              {activeTab === 'settings' && 'Configure brand voice and target personas.'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600">AI Engine Online</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}