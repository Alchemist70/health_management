import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ViewPrescriptions.css";

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching prescriptions with token:",
        token ? "Present" : "Not found"
      );

      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/prescriptions/patient",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Prescriptions API response:", response.data);
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      const errorMessage = error.response
        ? `Error: ${error.response.status} - ${
            error.response.data.message || error.response.statusText
          }`
        : "Failed to connect to the server. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="prescriptions-container">
        <div className="loading">Loading prescriptions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h1>My Prescriptions</h1>
        <p>View and manage your prescriptions</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="no-prescriptions">
          <i className="fas fa-prescription-bottle-alt"></i>
          <p>No prescriptions found</p>
        </div>
      ) : (
        <div className="prescriptions-grid">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className={`prescription-card ${
                selectedPrescription === prescription.id ? "expanded" : ""
              }`}
              onClick={() =>
                setSelectedPrescription(
                  selectedPrescription === prescription.id
                    ? null
                    : prescription.id
                )
              }
            >
              <div className="prescription-header">
                <div className="prescription-date">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{formatDate(prescription.created_at)}</span>
                </div>
                <div className="prescription-doctor">
                  <i className="fas fa-user-md"></i>
                  <span>Dr. {prescription.doctor_name}</span>
                </div>
              </div>

              <div className="prescription-content">
                <div className="prescription-section">
                  <h3>Symptoms</h3>
                  <p>{prescription.symptoms}</p>
                </div>

                <div className="prescription-section">
                  <h3>Diagnosis</h3>
                  <p>{prescription.diagnosis}</p>
                </div>

                <div className="prescription-section">
                  <h3>Medications</h3>
                  <ul className="medications-list">
                    {prescription.medications.map((medication, index) => (
                      <li key={index}>
                        <strong>{medication.name}</strong>
                        <span>{medication.dosage}</span>
                        <span>{medication.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {prescription.instructions && (
                  <div className="prescription-section">
                    <h3>Additional Instructions</h3>
                    <p>{prescription.instructions}</p>
                  </div>
                )}
              </div>

              <div className="prescription-footer">
                <button
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implement download functionality
                  }}
                >
                  <i className="fas fa-download"></i> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPrescriptions;
