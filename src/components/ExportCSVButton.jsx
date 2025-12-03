// src/components/ExportCSVButton.jsx
import React from "react";
import { saveAs } from "file-saver";

export default function ExportCSVButton({ leads }) {
  const exportCSV = () => {
    const headers = ["User", "Platform", "Score", "Engagement", "Reach", "Estimated ROI"];
    const rows = leads.map((lead) => [
      lead.user,               // <-- use 'user' instead of 'name'
      lead.platform,
      lead.score,
      lead.engagement ?? "-",  // fallback if undefined
      lead.reach ?? "-",
      lead.estimatedROI ?? "-"
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "lead_metrics.csv");
  };

  return <button onClick={exportCSV}>Export CSV</button>;
}
