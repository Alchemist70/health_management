import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DashboardSections.css";

const ActivePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
      } catch (err) {
        setError("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="section-page">
      <h2>Active Patients</h2>
      <ul className="section-list">
        {patients.map((patient) => (
          <li key={patient.id}>
            <strong>{patient.name}</strong>
            <span className="meta">{patient.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivePatients;
