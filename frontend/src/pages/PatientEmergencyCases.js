import React, { useEffect, useState } from "react";
import { fetchEmergencyCases } from "../services/api.js";
import "../styles/DashboardSections.css";

const PatientEmergencyCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");
    if (!patientId) {
      setError("No patient ID found.");
      setLoading(false);
      return;
    }
    fetchEmergencyCases(patientId)
      .then((res) => {
        setCases(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch emergency cases");
        setLoading(false);
      });
  }, []);

  return (
    <div className="section-page">
      <h2>Emergency Cases</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <ul className="section-list">
          {cases.map((em) => (
            <li key={em.id}>
              <strong>{em.case_description}</strong>
              <span className="meta">{em.case_date}</span>
              {em.doctor_id && em.doctor_name && (
                <span className="meta">Written by Dr. {em.doctor_name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientEmergencyCases;
