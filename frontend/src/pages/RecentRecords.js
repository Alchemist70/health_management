import React from "react";
import "../styles/DashboardSections.css";

const mockRecords = [
  {
    id: 1,
    type: "Appointment",
    patient: "John Doe",
    date: "2024-06-18",
    details: "General checkup",
  },
  {
    id: 2,
    type: "Prescription",
    patient: "Jane Smith",
    date: "2024-06-17",
    details: "Antibiotics for infection",
  },
];

const RecentRecords = () => (
  <div className="section-page">
    <h2>Recent Records</h2>
    <ul className="section-list">
      {mockRecords.map((rec) => (
        <li key={rec.id}>
          <strong>{rec.type}</strong> for {rec.patient}
          <span className="meta">
            {rec.date} &mdash; {rec.details}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentRecords;
