import React, { useEffect, useState } from "react";
import { fetchLabReports } from "../services/api.js";
import "../styles/DashboardSections.css";

const PatientLabReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");
    if (!patientId) {
      setError("No patient ID found.");
      setLoading(false);
      return;
    }
    fetchLabReports(patientId)
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch lab reports");
        setLoading(false);
      });
  }, []);

  return (
    <div className="section-page">
      <h2>Lab Reports</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <ul className="section-list">
          {reports.map((rep) => (
            <li key={rep.id}>
              <strong>{rep.report}</strong>
              <span className="meta">{rep.report_date}</span>
              {rep.doctor_id && rep.doctor_name && (
                <span className="meta">Written by Dr. {rep.doctor_name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientLabReports;
