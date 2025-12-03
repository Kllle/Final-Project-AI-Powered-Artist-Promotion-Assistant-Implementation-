// src/components/Dashboard.jsx
import React from 'react';
import { calculateScore } from '../utils/score';
import { estimateROI } from '../utils/roi';
import ExportCSVButton from './ExportCSVButton.jsx';

export default function Dashboard({ leads }) {
  // Calculate scores and ROI for display
  const processedLeads = leads.map((lead) => ({
    ...lead,
    score: lead.score ?? calculateScore(lead),
    estimatedROI: lead.estimatedROI ?? estimateROI(lead),
  }));

  return (
    <div className="dashboard">
      <h2>Lead Dashboard</h2>

      {/* CSV Export Button */}
      <div style={{ marginBottom: '10px' }}>
        <ExportCSVButton leads={processedLeads} />
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Platform</th>
            <th>Score</th>
            <th>Engagement</th>
            <th>Reach</th>
            <th>Estimated ROI</th>
            <th>Suggested Response</th>
          </tr>
        </thead>
        <tbody>
          {processedLeads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.user}</td>
              <td>{lead.platform}</td>
              <td>{lead.score}</td>
              <td>{lead.engagement ?? '-'}</td>
              <td>{lead.reach ?? '-'}</td>
              <td>${lead.estimatedROI}</td>
              <td>{lead.aiDraft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
