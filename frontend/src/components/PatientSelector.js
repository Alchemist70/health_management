import React, { useEffect, useState } from "react";
import { fetchPatients } from "../services/api.js";

const PatientSelector = ({ value, onChange }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients().then((res) => {
      setPatients(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginBottom: 16, minWidth: 200 }}
    >
      <option value="" disabled>
        {loading ? "Loading patients..." : "Select patient"}
      </option>
      {patients.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} ({p.email})
        </option>
      ))}
    </select>
  );
};

export default PatientSelector;
