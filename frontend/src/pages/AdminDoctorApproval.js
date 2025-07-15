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

  // Add inline styles for the admin page
  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  };
  const boxStyle = {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 8px 32px rgba(30,58,138,0.12)",
    padding: "2.5rem 2.5rem 2rem 2.5rem",
    minWidth: 340,
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
  };
  const headingStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#1e293b",
  };
  const errorStyle = {
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    marginBottom: 18,
    fontWeight: 500,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    marginBottom: 18,
    fontSize: 16,
  };
  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 8,
    marginBottom: 8,
    transition: "background 0.2s",
  };
  const logoutButtonStyle = {
    ...buttonStyle,
    background: "#e5e7eb",
    color: "#1e293b",
    width: "auto",
    padding: "0.5rem 1.25rem",
    float: "right",
    marginBottom: 10,
    marginTop: 0,
  };

  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <div style={boxStyle}>
          <h2 style={headingStyle}>Admin Login</h2>
          {error && <div style={errorStyle}>{error}</div>}
          <form onSubmit={handleAuth} style={{ marginTop: 16 }}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label
                htmlFor="adminCode"
                style={{
                  fontWeight: 500,
                  color: "#334155",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Enter Admin Secret Code
              </label>
              <input
                type="password"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" style={buttonStyle} disabled={loading}>
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
    <div style={pageStyle}>
      <div style={boxStyle}>
        <button onClick={handleAdminLogout} style={logoutButtonStyle}>
          Logout Admin
        </button>
        <h2 style={headingStyle}>Pending Doctor Registrations</h2>
        {error && <div style={errorStyle}>{error}</div>}
        {loading && <div>Loading...</div>}
        {pendingDoctors.length === 0 && !loading && (
          <div>No pending registrations.</div>
        )}
        {pendingDoctors.length > 0 && (
          <table
            className="doctor-table"
            style={{ width: "100%", marginTop: 18, borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: 10, borderRadius: 6 }}>Name</th>
                <th style={{ padding: 10, borderRadius: 6 }}>Email</th>
                <th style={{ padding: 10, borderRadius: 6 }}>Specialization</th>
                <th style={{ padding: 10, borderRadius: 6 }}>License #</th>
                <th style={{ padding: 10, borderRadius: 6 }}>Experience</th>
                <th style={{ padding: 10, borderRadius: 6 }}>Credentials</th>
                <th style={{ padding: 10, borderRadius: 6 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map((doc) => (
                <tr key={doc._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: 10 }}>{doc.name}</td>
                  <td style={{ padding: 10 }}>{doc.email}</td>
                  <td style={{ padding: 10 }}>{doc.specialization}</td>
                  <td style={{ padding: 10 }}>{doc.license_number}</td>
                  <td style={{ padding: 10 }}>{doc.years_experience}</td>
                  <td style={{ padding: 10 }}>
                    <button
                      style={{
                        ...buttonStyle,
                        width: "auto",
                        background: "#1e40af",
                        fontSize: 14,
                        padding: "0.4rem 1rem",
                      }}
                      onClick={() => handleDownload(doc._id)}
                    >
                      Download PDF
                    </button>
                  </td>
                  <td style={{ padding: 10 }}>
                    <button
                      style={{
                        ...buttonStyle,
                        width: "auto",
                        background: "#16a34a",
                        fontSize: 14,
                        padding: "0.4rem 1rem",
                        marginRight: 6,
                      }}
                      onClick={() => handleApprove(doc._id)}
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      style={{
                        ...buttonStyle,
                        width: "auto",
                        background: "#dc2626",
                        fontSize: 14,
                        padding: "0.4rem 1rem",
                      }}
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
