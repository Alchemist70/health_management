import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";
import "../styles/PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Patient";

  const quickStats = [
    {
      title: "Upcoming Appointments",
      value: "View Schedule",
      icon: "fa-calendar-alt",
      color: "#4299e1",
      action: () => navigate("/appointments"),
    },
    {
      title: "Medical Records",
      value: "Access Files",
      icon: "fa-file-medical",
      color: "#48bb78",
      action: () => navigate("/medical-history"),
    },
    {
      title: "Prescriptions",
      value: "View Active",
      icon: "fa-prescription",
      color: "#ed8936",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Lab Reports",
      value: "View Results",
      icon: "fa-flask",
      color: "#4299e1",
      action: () => navigate("/lab-reports-patient"),
    },
    {
      title: "Emergency Cases",
      value: "View Cases",
      icon: "fa-ambulance",
      color: "#ef4444",
      action: () => navigate("/emergency-cases-patient"),
    },
  ];

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule a new consultation",
      icon: "fa-calendar-plus",
      action: () => navigate("/book"),
      color: "#4299e1",
    },
    {
      title: "View Appointments",
      description: "Check your scheduled visits",
      icon: "fa-calendar-check",
      action: () => navigate("/appointments"),
      color: "#48bb78",
    },
    {
      title: "Medical History",
      description: "Access your health records",
      icon: "fa-notes-medical",
      action: () => navigate("/medical-history"),
      color: "#ed8936",
    },
    {
      title: "Prescriptions",
      description: "View and manage medications",
      icon: "fa-prescription-bottle-alt",
      action: () => navigate("/prescriptions"),
      color: "#9f7aea",
    },
  ];

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>{userName} Dashboard</h1>
            <p>Manage your healthcare journey with ease</p>
          </div>
        </div>

        <div className="quick-stats">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              onClick={stat.action}
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
              <div className="stat-arrow">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card"
                onClick={action.action}
                style={{ borderTop: `4px solid ${action.color}` }}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  <i className={`fas ${action.icon}`}></i>
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="health-reminders">
          <h2>Health Tips & Reminders</h2>
          <div className="reminders-grid">
            <div className="reminder-card">
              <i className="fas fa-heartbeat"></i>
              <h4>Regular Check-ups</h4>
              <p>Schedule your routine health check-up</p>
            </div>
            <div className="reminder-card">
              <i className="fas fa-pills"></i>
              <h4>Medication Tracking</h4>
              <p>Keep track of your prescriptions</p>
            </div>
            <div className="reminder-card">
              <i className="fas fa-walking"></i>
              <h4>Stay Active</h4>
              <p>Maintain a healthy lifestyle</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatientDashboard;
