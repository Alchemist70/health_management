import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchLabReports,
  addLabReport,
  updateLabReport,
  deleteLabReport,
} from "../services/api.js";
import PatientSelector from "../components/PatientSelector.js";
import Modal from "../components/Modal.js";
import Notification from "../components/Notification.js";
import "../styles/DashboardSections.css";

const LabReports = () => {
  const location = useLocation();
  const patientIdFromContext =
    location.state?.patientId ||
    new URLSearchParams(location.search).get("patientId") ||
    "";
  const [selectedPatient, setSelectedPatient] = useState(patientIdFromContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, report: "", report_date: "" });
  const [editing, setEditing] = useState(false);

  const loadReports = async (pid) => {
    if (!pid) return setReports([]);
    setLoading(true);
    try {
      const res = await fetchLabReports(pid);
      setReports(res.data);
    } catch (err) {
      setError("Failed to fetch lab reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) loadReports(selectedPatient);
  }, [selectedPatient]);

  useEffect(() => {
    if (patientIdFromContext && !selectedPatient)
      setSelectedPatient(patientIdFromContext);
  }, [patientIdFromContext, selectedPatient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateLabReport({ ...form, id: form.id });
        setNotification({ message: "Lab report updated!", type: "success" });
      } else {
        await addLabReport({
          patientId: selectedPatient,
          report: form.report,
          report_date: form.report_date,
        });
        setNotification({ message: "Lab report added!", type: "success" });
      }
      setForm({ id: null, report: "", report_date: "" });
      setEditing(false);
      setModalOpen(false);
      loadReports(selectedPatient);
    } catch {
      setNotification({ message: "Failed to save lab report", type: "error" });
    }
  };

  const handleEdit = (rep) => {
    setForm({ id: rep.id, report: rep.report, report_date: rep.report_date });
    setEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab report?")) return;
    try {
      await deleteLabReport(id);
      setNotification({ message: "Lab report deleted!", type: "success" });
      loadReports(selectedPatient);
    } catch {
      setNotification({
        message: "Failed to delete lab report",
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
      <h2>Lab Reports</h2>
      <PatientSelector value={selectedPatient} onChange={setSelectedPatient} />
      <button
        className="action-button complete"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setModalOpen(true);
          setEditing(false);
          setForm({ id: null, report: "", report_date: "" });
        }}
        disabled={!selectedPatient}
      >
        Add Lab Report
      </button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 12 }}>
            {editing ? "Edit" : "Add"} Lab Report
          </h3>
          <textarea
            required
            placeholder="Lab report details..."
            value={form.report}
            onChange={(e) => setForm({ ...form, report: e.target.value })}
            style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
          />
          <input
            type="date"
            required
            value={form.report_date}
            onChange={(e) => setForm({ ...form, report_date: e.target.value })}
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
              setForm({ id: null, report: "", report_date: "" });
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
          {reports.map((rep) => (
            <li key={rep.id}>
              <strong>{rep.report}</strong>
              <span className="meta">{rep.report_date}</span>
              <div style={{ marginTop: 8 }}>
                <button
                  className="action-button complete"
                  onClick={() => handleEdit(rep)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </button>
                <button
                  className="action-button cancel"
                  onClick={() => handleDelete(rep.id)}
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

export default LabReports;
