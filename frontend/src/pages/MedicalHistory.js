import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchMedicalHistory,
  addMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
} from "../services/api.js";
import PatientSelector from "../components/PatientSelector.js";
import Modal from "../components/Modal.js";
import Notification from "../components/Notification.js";
import "../styles/DashboardSections.css";

const MedicalHistory = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const patientIdFromContext =
    location.state?.patientId ||
    new URLSearchParams(location.search).get("patientId") ||
    "";
  const [selectedPatient, setSelectedPatient] = useState(patientIdFromContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, history: "", history_date: "" });
  const [editing, setEditing] = useState(false);
  const [pdf, setPdf] = useState(null);

  // For patients, always use their own ID
  useEffect(() => {
    if (userRole === "patient") {
      setSelectedPatient(localStorage.getItem("userId"));
    }
  }, [userRole]);

  const loadHistory = async (pid) => {
    if (!pid) return setHistory([]);
    setLoading(true);
    try {
      const res = await fetchMedicalHistory(pid);
      setHistory(res.data);
    } catch (err) {
      setError("Failed to fetch medical history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) loadHistory(selectedPatient);
  }, [selectedPatient]);

  useEffect(() => {
    if (patientIdFromContext && !selectedPatient && userRole !== "patient")
      setSelectedPatient(patientIdFromContext);
  }, [patientIdFromContext, selectedPatient, userRole]);

  // Doctor-only handlers
  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("patient_id", selectedPatient);
      formData.append("history", form.history);
      formData.append("history_date", form.history_date);
      if (pdf) {
        formData.append("pdf", pdf);
      }
      if (editing) {
        formData.append("id", form.id);
        await updateMedicalHistory(formData, true); // true = isFormData
        setNotification({
          message: "Medical history updated!",
          type: "success",
        });
      } else {
        await addMedicalHistory(formData, true); // true = isFormData
        setNotification({ message: "Medical history added!", type: "success" });
      }
      setForm({ id: null, history: "", history_date: "" });
      setPdf(null);
      setEditing(false);
      setModalOpen(false);
      loadHistory(selectedPatient);
    } catch {
      setNotification({
        message: "Failed to save medical history",
        type: "error",
      });
    }
  };

  const handleEdit = (rec) => {
    setForm({
      id: rec.id,
      history: rec.history,
      history_date: rec.history_date,
    });
    setEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medical history entry?")) return;
    try {
      await deleteMedicalHistory(id);
      setNotification({ message: "Medical history deleted!", type: "success" });
      loadHistory(selectedPatient);
    } catch {
      setNotification({
        message: "Failed to delete medical history",
        type: "error",
      });
    }
  };

  return (
    <div className="section-page">
      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />
      <h2>Medical History</h2>
      {userRole !== "patient" && (
        <PatientSelector
          value={selectedPatient}
          onChange={setSelectedPatient}
        />
      )}
      {userRole !== "patient" && (
        <button
          className="action-button complete"
          style={{ marginBottom: 16 }}
          onClick={() => {
            setModalOpen(true);
            setEditing(false);
            setForm({ id: null, history: "", history_date: "" });
          }}
          disabled={!selectedPatient}
        >
          Add Medical History
        </button>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 12 }}>
            {editing ? "Edit" : "Add"} Medical History
          </h3>
          <textarea
            required
            placeholder="Medical history details..."
            value={form.history}
            onChange={(e) => setForm({ ...form, history: e.target.value })}
            style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
          />
          <input
            type="date"
            required
            value={form.history_date}
            onChange={(e) => setForm({ ...form, history_date: e.target.value })}
            style={{ marginBottom: 8 }}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ marginBottom: 8 }}
          />
          <button
            type="submit"
            className="action-button complete"
            style={{ marginRight: 8 }}
          >
            {editing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            className="action-button cancel"
            onClick={() => {
              setModalOpen(false);
              setEditing(false);
              setForm({ id: null, history: "", history_date: "" });
              setPdf(null);
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <ul className="section-list">
          {history.map((rec) => (
            <li key={rec.id}>
              <strong>{rec.history}</strong>
              <span className="meta">{rec.history_date}</span>
              {rec.pdf && (
                <div>
                  <a
                    href={`/uploads/${rec.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </div>
              )}
              {userRole !== "patient" && (
                <div style={{ marginTop: 8 }}>
                  <button
                    className="action-button complete"
                    onClick={() => handleEdit(rec)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={() => handleDelete(rec.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicalHistory;
