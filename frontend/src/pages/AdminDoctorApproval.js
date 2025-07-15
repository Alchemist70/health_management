import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

const AdminDoctorApproval = () => {
  const [adminCode, setAdminCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "";

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Try to fetch pending doctors with the admin code
      const res = await axios.get(`${API_BASE}/api/doctors/pending`, {
        headers: { "x-admin-code": adminCode },
      });
      setPendingDoctors(res.data);
      setIsAuthenticated(true);
      localStorage.setItem("isAdmin", "true");
    } catch (err) {
      setError("Invalid admin code or server error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/doctors/pending`, {
        headers: { "x-admin-code": adminCode },
      });
      setPendingDoctors(res.data);
    } catch (err) {
      setError("Failed to fetch pending doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      window.open(
        `${API_BASE}/api/doctors/credentials/${id}?admin_code=${adminCode}`
      );
    } catch (err) {
      setError("Failed to download credentials.");
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/doctors/approve/${id}`,
        { admin_code: adminCode },
        { headers: { "x-admin-code": adminCode } }
      );
      fetchPendingDoctors();
    } catch (err) {
      setError("Failed to approve doctor.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/doctors/reject/${id}`,
        { admin_code: adminCode },
        { headers: { "x-admin-code": adminCode } }
      );
      fetchPendingDoctors();
    } catch (err) {
      setError("Failed to reject doctor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="register-container">
        <div className="register-box">
          <h2>Admin Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label htmlFor="adminCode">Enter Admin Secret Code</label>
              <input
                type="password"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login as Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Add admin logout button
  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.reload();
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Pending Doctor Registrations</h2>
        <button
          onClick={handleAdminLogout}
          style={{ float: "right", marginBottom: 10 }}
        >
          Logout Admin
        </button>
        {error && <div className="error-message">{error}</div>}
        {loading && <div>Loading...</div>}
        {pendingDoctors.length === 0 && !loading && (
          <div>No pending registrations.</div>
        )}
        {pendingDoctors.length > 0 && (
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>License #</th>
                <th>Experience</th>
                <th>Credentials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.name}</td>
                  <td>{doc.email}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.license_number}</td>
                  <td>{doc.years_experience}</td>
                  <td>
                    <button onClick={() => handleDownload(doc._id)}>
                      Download PDF
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleApprove(doc._id)}
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc._id)}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDoctorApproval;
