import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer.js";
import "../styles/DoctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem("userName") || "Doctor";
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/appointments/doctor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const todayAppts = response.data
        .filter((appointment) => {
          const apptDateStr = appointment.appointment_date.split("T")[0];
          return apptDateStr === todayStr;
        })
        .map((appointment) => {
          const appointmentDateTime = new Date(appointment.appointment_date);
          const now = new Date();

          // Calculate time difference in hours
          const timeDiffHours = (now - appointmentDateTime) / (1000 * 60 * 60);

          // Check if appointment should be marked as elapsed
          let status = appointment.status || "scheduled";
          if (status === "scheduled" && timeDiffHours >= 3) {
            status = "elapsed";
          }

          return {
            time: new Date(appointment.appointment_date).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            ),
            isElapsed: timeDiffHours >= 3,
            patient:
              appointment.patient_name || `Patient ${appointment.patient_id}`,
            type: appointment.type || "Consultation",
            status: status,
            symptoms: appointment.symptoms || "Not specified",
            appointmentDateTime: appointmentDateTime,
          };
        })
        .sort((a, b) => {
          const timeA = new Date(`1970/01/01 ${a.time}`);
          const timeB = new Date(`1970/01/01 ${b.time}`);
          return timeA - timeB;
        });

      console.log("Today's filtered appointments:", todayAppts);
      setTodayAppointments(todayAppts);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const quickStats = [
    {
      title: "Today's Appointments",
      value: `${todayAppointments.length} Scheduled`,
      icon: "fa-calendar-alt",
      color: "#4299e1",
      action: () => navigate("/appointments"),
    },
    {
      title: "Active Patients",
      value: "Manage List",
      icon: "fa-user-injured",
      color: "#48bb78",
      action: () => navigate("/patients"),
    },
    {
      title: "Recent Records",
      value: "View Updates",
      icon: "fa-notes-medical",
      color: "#ed8936",
      action: () => navigate("/records"),
    },
  ];

  const quickActions = [
    {
      title: "View Appointments",
      description: "Check your schedule",
      icon: "fa-calendar-check",
      action: () => navigate("/appointments"),
      color: "#4299e1",
    },
    {
      title: "Manage Schedule",
      description: "Set your availability",
      icon: "fa-clock",
      action: () => navigate("/manage-schedule"),
      color: "#ed8936",
    },
    {
      title: "Patient Records",
      description: "Access medical files",
      icon: "fa-file-medical",
      action: () => navigate("/patient-records"),
      color: "#48bb78",
    },
    {
      title: "Write Prescription",
      description: "Create new prescription",
      icon: "fa-prescription",
      action: () => navigate("/write-prescription"),
      color: "#9f7aea",
    },
  ];

  const quickTools = [
    {
      title: "Lab Reports",
      description: "View test results",
      icon: "fa-flask",
      action: () => navigate("/lab-reports"),
      color: "#48bb78",
    },
    {
      title: "Medical History",
      description: "Access patient history",
      icon: "fa-history",
      action: () => navigate("/medical-history"),
      color: "#ed8936",
    },
    {
      title: "Emergency Cases",
      description: "View urgent cases",
      icon: "fa-ambulance",
      action: () => navigate("/emergency"),
      color: "#ef4444",
    },
  ];

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Dr. {doctorName} Dashboard</h1>
            <p>Manage your practice and patient care</p>
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

        <div className="dashboard-grid">
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

          <div className="tools-section">
            <h2>Quick Tools</h2>
            <div className="tools-grid">
              {quickTools.map((tool, index) => (
                <div
                  key={index}
                  className="tool-card"
                  onClick={tool.action}
                  style={{ borderTop: `4px solid ${tool.color}` }}
                >
                  <div className="tool-icon" style={{ color: tool.color }}>
                    <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="appointments-section">
            <h2>Today's Schedule</h2>
            <div className="appointments-list">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="appointment-card"
                    style={{
                      borderLeft: `4px solid ${
                        appointment.status === "elapsed"
                          ? "#718096"
                          : appointment.status.toLowerCase() === "scheduled"
                          ? "#48bb78"
                          : appointment.status.toLowerCase() === "cancelled"
                          ? "#ef4444"
                          : "#ed8936"
                      }`,
                    }}
                  >
                    <div className="appointment-time">
                      <i className="fas fa-clock"></i>
                      <span
                        className={appointment.isElapsed ? "elapsed-time" : ""}
                      >
                        {appointment.time}
                        {appointment.status === "elapsed" && (
                          <span className="elapsed-tag">Time Elapsed</span>
                        )}
                        {appointment.status === "completed" && (
                          <span className="completed-tag">Completed</span>
                        )}
                      </span>
                    </div>
                    <div className="appointment-info">
                      <h4>Patient: {appointment.patient}</h4>
                      <p>{appointment.type}</p>
                      {appointment.symptoms && (
                        <p className="symptoms">
                          Symptoms: {appointment.symptoms}
                        </p>
                      )}
                    </div>
                    <div
                      className={`appointment-status ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-appointments">
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorDashboard;
