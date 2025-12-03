// src/components/Dashboard.jsx
import React from 'react';
import { Edit3, XCircle, CheckCircle, User, LayoutDashboard } from 'lucide-react';
import ExportCSVButton from './ExportCSVButton.jsx';
import { generateResponse } from '../services/aiSimulator';
import { trackEvent } from '../services/analytics';

export default function Dashboard({
  leads,
  setLeads,
  openLead,
  selectedLead,
  handleApprove,
  handleDismiss,
  editMode,
  setEditMode,
  editedResponse,
  setEditedResponse
}) {

  const handleGenerateResponse = async (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const response = await generateResponse(lead, { tone: 'friendly', style: 'concise' });

    setLeads(prevLeads =>
      prevLeads.map(l =>
        l.id === leadId ? { ...l, suggestedResponse: response } : l
      )
    );
  };

  const approveLead = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    trackEvent('lead_approved', { leadId: lead.id, score: lead.opportunityScore });
    handleApprove(leadId);
  };

  const dismissLead = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    trackEvent('lead_dismissed', { leadId: lead.id });
    handleDismiss(leadId);
  };

  return (
    <section className="dashboard-grid">
      {/* FEED ----------------------------------------------------- */}
      <div className="feed">
        <div className="feed-header">
          <h2>Live Feed</h2>
          <ExportCSVButton leads={leads} />
        </div>

        <div className="lead-list">
          {leads.length === 0 && <div className="empty">No leads yet.</div>}

          {leads.map((lead) => (
            <article
              key={lead.id}
              className={`lead-card ${selectedLead?.id === lead.id ? 'selected' : ''}`}
              onClick={() => openLead(lead)}
            >
              <div className="lead-head">
                <div className="lead-meta">
                  <div className="avatar">{lead.avatar}</div>
                  <div>
                    <div className="lead-user">@{lead.user}</div>
                    <div className="lead-sub muted-sm">
                      {lead.timestamp} • {lead.platform}
                    </div>
                  </div>
                </div>
                <div className={`score-badge ${lead.opportunityScore >= 80 ? 'badge-green' : lead.opportunityScore >= 50 ? 'badge-yellow' : 'badge-gray'}`}>
                  {lead.opportunityScore}
                </div>
              </div>

              <p className="lead-content">"{lead.content}"</p>

              <div className="lead-footer muted-sm">
                <User className="w-3 h-3 inline-block mr-1" />
                {lead.persona}
              </div>

              <div className="lead-actions mt-2">
                <button onClick={() => handleGenerateResponse(lead.id)}>Suggest Response</button>
                <button onClick={() => approveLead(lead.id)}>Approve</button>
                <button onClick={() => dismissLead(lead.id)}>Dismiss</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ACTION PANEL -------------------------------------------- */}
      <div className="action-panel">
        {!selectedLead ? (
          <div className="empty-panel">
            <LayoutDashboard className="w-16 h-16 muted" />
            <div className="muted">Select a lead to review AI suggestions</div>
          </div>
        ) : (
          <div className="lead-detail">
            <div className="detail-head">
              <div className="avatar-lg">{selectedLead.avatar}</div>

              <div>
                <div className="lead-user">@{selectedLead.user}</div>
                <div className="muted-sm">
                  {selectedLead.platform} • {selectedLead.persona}
                </div>
              </div>

              <div className="score-large">{selectedLead.opportunityScore}%</div>
            </div>

            <div className="quote">"{selectedLead.content}"</div>

            {/* Suggested Response */}
            <div className="suggestion">
              <div className="suggestion-head">
                <h4>Suggested Response</h4>
                {!editMode && (
                  <button className="link" onClick={() => setEditMode(true)}>
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <textarea
                  value={editedResponse}
                  onChange={(e) => setEditedResponse(e.target.value)}
                  className="response-editor"
                />
              ) : (
                <div className="response-box">{selectedLead.suggestedResponse || selectedLead.aiDraft}</div>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="btn-outline"
                onClick={() => dismissLead(selectedLead.id)}
              >
                <XCircle /> Dismiss
              </button>

              <div className="actions-right">
                {editMode && (
                  <button className="btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                )}

                <button
                  className="btn-primary"
                  onClick={() => approveLead(selectedLead.id)}
                >
                  <CheckCircle /> {editMode ? "Save & Approve" : "Approve & Post"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
