import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/WritePrescription.css";

const WritePrescription = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", duration: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_BASE = process.env.REACT_APP_API_URL || "";
      const response = await axios.get(`${API_BASE}/api/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to fetch patients");
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", duration: "" }]);
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const API_BASE = process.env.REACT_APP_API_URL || "";
      const prescriptionData = {
        patient_id: selectedPatient,
        symptoms,
        diagnosis,
        medications: medications.filter(
          (med) => med.name && med.dosage && med.duration
        ),
        instructions,
      };

      const response = await axios.post(
        `${API_BASE}/api/prescriptions`,
        prescriptionData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatientEmail(response.data.patient_email);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating prescription:", error);
      setError("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/doctor-dashboard");
  };

  return (
    <div className="prescription-container">
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <i className="fas fa-check-circle"></i>
            <h2>Prescription Added Successfully!</h2>
            <p>
              A notification email has been sent to the patient @ {patientEmail}
            </p>
            <button onClick={handleModalClose} className="modal-ok-btn">
              Ok
            </button>
          </div>
        </div>
      )}

      <div className="prescription-header">
        <h1>Write Prescription</h1>
        <p>Create a new prescription for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="prescription-form">
        <div className="form-group">
          <label htmlFor="patient">Select Patient</label>
          <select
            id="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Symptoms</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter patient symptoms"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="diagnosis">Diagnosis</label>
          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
            required
          />
        </div>

        <div className="medications-section">
          <h3>Medications</h3>
          {medications.map((medication, index) => (
            <div key={index} className="medication-group">
              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  value={medication.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  placeholder="Enter medication name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input
                  type="text"
                  value={medication.dosage}
                  onChange={(e) =>
                    handleMedicationChange(index, "dosage", e.target.value)
                  }
                  placeholder="e.g., 500mg twice daily"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={medication.duration}
                  onChange={(e) =>
                    handleMedicationChange(index, "duration", e.target.value)
                  }
                  placeholder="e.g., 7 days"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-medication-btn"
            onClick={handleAddMedication}
          >
            Add Another Medication
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Additional Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter any additional instructions for the patient"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/doctor-dashboard")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePrescription;
