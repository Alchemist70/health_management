import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchEmergencyCases,
  addEmergencyCase,
  updateEmergencyCase,
  deleteEmergencyCase,
} from "../services/api.js";
import PatientSelector from "../components/PatientSelector.js";
import Modal from "../components/Modal.js";
import Notification from "../components/Notification.js";
import "../styles/DashboardSections.css";

const EmergencyCases = () => {
  const location = useLocation();
  const patientIdFromContext =
    location.state?.patientId ||
    new URLSearchParams(location.search).get("patientId") ||
    "";
  const [selectedPatient, setSelectedPatient] = useState(patientIdFromContext);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    case_description: "",
    case_date: "",
  });
  const [editing, setEditing] = useState(false);
  const [pdf, setPdf] = useState(null);

  const loadCases = async (pid) => {
    if (!pid) return setCases([]);
    setLoading(true);
    try {
      const res = await fetchEmergencyCases(pid);
      console.log("Fetched emergency cases:", res.data); // Debug log
      setCases(res.data);
    } catch (err) {
      setError("Failed to fetch emergency cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) loadCases(selectedPatient);
  }, [selectedPatient]);

  useEffect(() => {
    if (patientIdFromContext && !selectedPatient)
      setSelectedPatient(patientIdFromContext);
  }, [patientIdFromContext, selectedPatient]);

  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("patient_id", selectedPatient);
      formData.append("case_description", form.case_description);
      formData.append("case_date", form.case_date);
      if (pdf) {
        formData.append("pdf", pdf);
      }
      if (editing) {
        formData.append("id", form.id);
        await updateEmergencyCase(formData, true); // true = isFormData
        setNotification({
          message: "Emergency case updated!",
          type: "success",
        });
      } else {
        await addEmergencyCase(formData, true); // true = isFormData
        setNotification({ message: "Emergency case added!", type: "success" });
      }
      setForm({ id: null, case_description: "", case_date: "" });
      setPdf(null);
      setEditing(false);
      setModalOpen(false);
      loadCases(selectedPatient);
    } catch {
      setNotification({
        message: "Failed to save emergency case",
        type: "error",
      });
    }
  };

  const handleEdit = (em) => {
    setForm({
      id: em._id,
      case_description: em.case_description,
      case_date: em.case_date,
    });
    setEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this emergency case?")) return;
    try {
      await deleteEmergencyCase(id);
      setNotification({ message: "Emergency case deleted!", type: "success" });
      loadCases(selectedPatient);
    } catch {
      setNotification({
        message: "Failed to delete emergency case",
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
      <h2>Emergency Cases</h2>
      <PatientSelector value={selectedPatient} onChange={setSelectedPatient} />
      <button
        className="action-button complete"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setModalOpen(true);
          setEditing(false);
          setForm({ id: null, case_description: "", case_date: "" });
        }}
        disabled={!selectedPatient}
      >
        Add Emergency Case
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 12 }}>
            {editing ? "Edit" : "Add"} Emergency Case
          </h3>
          <textarea
            required
            placeholder="Emergency case details..."
            value={form.case_description}
            onChange={(e) =>
              setForm({ ...form, case_description: e.target.value })
            }
            style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
          />
          <input
            type="date"
            required
            value={form.case_date}
            onChange={(e) => setForm({ ...form, case_date: e.target.value })}
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
              setForm({ id: null, case_description: "", case_date: "" });
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
          {cases.map((em) => (
            <li key={em._id}>
              <strong>{em.case_description}</strong>
              <span className="meta">{em.case_date}</span>
              {em.pdf && (
                <div>
                  <a
                    href={`/uploads/${em.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <button
                  className="action-button complete"
                  onClick={() => handleEdit(em)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </button>
                <button
                  className="action-button cancel"
                  onClick={() => handleDelete(em._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmergencyCases;
