// src/components/Dashboard.jsx
import React from 'react';
import { calculateScore } from '../utils/score';
import { estimateROI } from '../utils/roi';
import { generateResponse } from '../services/aiSimulator';
import { trackEvent } from '../services/analytics';
import ExportCSVButton from './ExportCSVButton.jsx';

export default function Dashboard({ leads }) {
  const handleGenerateResponse = async (leadId) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        generateResponse(lead, { tone: 'friendly', style: 'concise' }).then((response) => {
          lead.suggestedResponse = response;
        });
      }
      return lead;
    });
  };

  const approveLead = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    trackEvent('lead_approved', { leadId: lead.id, score: lead.score });
    alert(`Lead approved: ${lead.name}`);
  };

  const dismissLead = (leadId) => {
    const lead = leads.find((l) => l.id === leadId);
    trackEvent('lead_dismissed', { leadId: lead.id });
    alert(`Lead dismissed: ${lead.name}`);
  };

  return (
    <div>
      <h2>Lead Dashboard</h2>
      {/* CSV Export Button */}
      <ExportCSVButton leads={leads} />

      <table border="1" cellPadding="8" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Platform</th>
            <th>Engagement</th>
            <th>Reach</th>
            <th>Score</th>
            <th>Estimated ROI</th>
            <th>Suggested Response</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.platform}</td>
              <td>{lead.engagement}</td>
              <td>{lead.reach}</td>
              <td>{lead.score}</td>
              <td>${lead.estimatedROI}</td>
              <td>{lead.suggestedResponse}</td>
              <td>
                <button onClick={() => handleGenerateResponse(lead.id)}>Suggest Response</button>
                <button onClick={() => approveLead(lead.id)}>Approve</button>
                <button onClick={() => dismissLead(lead.id)}>Dismiss</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
