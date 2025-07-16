import React, { useEffect, useState } from "react";
import {
  fetchPatientInfo,
  fetchPrescriptionsByPatient,
  fetchPatients,
} from "../services/api.js";
import PatientSelector from "../components/PatientSelector.js";
import "../styles/DashboardSections.css";

const PatientRecords = () => {
  const userRole = localStorage.getItem("userRole");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userRole === "doctor") {
      fetchPatients()
        .then((res) => {
          setPatients(res.data);
          if (res.data.length > 0 && !selectedPatientId) {
            setSelectedPatientId(res.data[0].id);
          }
        })
        .catch(() => setError("Failed to fetch patients"));
    } else {
      setSelectedPatientId(localStorage.getItem("userId"));
    }
  }, [userRole]);

  useEffect(() => {
    if (!selectedPatientId) return;
    setLoading(true);
    // For doctor, pass patientId as param; for patient, let backend use token
    const fetchPrescriptions =
      userRole === "doctor"
        ? fetchPrescriptionsByPatient(selectedPatientId)
        : fetchPrescriptionsByPatient();
    Promise.all([fetchPatientInfo(selectedPatientId), fetchPrescriptions])
      .then(([infoRes, prescRes]) => {
        setPatientInfo(infoRes.data);
        setPrescriptions(prescRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch patient records");
        setLoading(false);
      });
  }, [selectedPatientId, userRole]);

  return (
    <div className="section-page">
      <h2>Patient Records</h2>
      {userRole === "doctor" && (
        <div style={{ marginBottom: 24 }}>
          <PatientSelector
            value={selectedPatientId}
            onChange={setSelectedPatientId}
          />
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          {patientInfo && (
            <div className="patient-info-box styled-info-box">
              <h3>Patient Information</h3>
              <ul>
                <li>
                  <strong>Name:</strong> {patientInfo.name || "-"}
                </li>
                <li>
                  <strong>Email:</strong> {patientInfo.email || "-"}
                </li>
                <li>
                  <strong>Date of Birth:</strong> {patientInfo.dob || "-"}
                </li>
                <li>
                  <strong>Gender:</strong> {patientInfo.gender || "-"}
                </li>
                <li>
                  <strong>Phone:</strong> {patientInfo.phone || "-"}
                </li>
                <li>
                  <strong>Address:</strong> {patientInfo.address || "-"}
                </li>
                <li>
                  <strong>National ID/Insurance:</strong>{" "}
                  {patientInfo.national_id || "-"}
                </li>
                <li>
                  <strong>Emergency Contact:</strong>{" "}
                  {patientInfo.emergency_contact || "-"}
                </li>
              </ul>
            </div>
          )}
          <div className="prescriptions-section">
            <h3>Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <div className="no-prescriptions-found">
                <i className="fas fa-prescription-bottle-alt"></i>
                <span>No prescriptions found for this patient.</span>
              </div>
            ) : (
              <ul className="section-list prescriptions-list styled-prescriptions-list">
                {prescriptions.map((presc) => (
                  <li
                    key={presc.id}
                    className="prescription-card styled-prescription-card"
                  >
                    <div className="prescription-header styled-prescription-header">
                      <span className="prescription-date">
                        {presc.created_at?.slice(0, 10)}
                      </span>
                      <span className="prescription-doctor">
                        Dr. {presc.doctor_name}
                      </span>
                    </div>
                    <div className="prescription-content styled-prescription-content">
                      <div className="prescription-section">
                        <strong>Symptoms:</strong> {presc.symptoms || "-"}
                      </div>
                      <div className="prescription-section">
                        <strong>Diagnosis:</strong> {presc.diagnosis}
                      </div>
                      <div className="prescription-section">
                        <strong>Medications:</strong>
                        {Array.isArray(presc.medications) &&
                        presc.medications.length > 0 ? (
                          <ul className="medications-list styled-medications-list">
                            {presc.medications.map((med, idx) =>
                              typeof med === "object" && med !== null ? (
                                <li key={idx}>
                                  <strong>{med.name}</strong>
                                  <span>{med.dosage}</span>
                                  <span>{med.duration}</span>
                                </li>
                              ) : (
                                <li key={idx}>{med}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <span> - </span>
                        )}
                      </div>
                      {presc.instructions && (
                        <div className="prescription-section">
                          <strong>Additional Instructions:</strong>{" "}
                          {presc.instructions}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientRecords;
