import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = ({ title, children }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{title}</h1>
        <div className="user-info">
          <span className="user-role">{userRole}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li>
            <button onClick={() => navigate("/appointments")}>
              View Appointments
            </button>
          </li>
          {userRole === "patient" && (
            <li>
              <button onClick={() => navigate("/book")}>
                Book Appointment
              </button>
            </li>
          )}
          <li>
            <button onClick={() => navigate("/profile")}>
              Profile Settings
            </button>
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">{children}</main>
    </div>
  );
};

export default Dashboard;
