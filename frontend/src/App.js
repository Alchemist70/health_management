import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.js";
import Login from "./components/Login.js";
import ResetPassword from "./components/ResetPassword.js";
import BookAppointment from "./pages/BookAppointment.js";
import ViewAppointments from "./components/ViewAppointments.js";
import DoctorDashboard from "./pages/DoctorDashboard.js";
import PatientDashboard from "./pages/PatientDashboard.js";
import Home from "./pages/Home.js";
import Header from "./components/Header.js";
import ViewAppointment from "./pages/ViewAppointment.js";
import ManageSchedule from "./pages/ManageSchedule.js";
import WritePrescription from "./components/WritePrescription.js";
import ViewPrescriptions from "./components/ViewPrescriptions.js";
import ActivePatients from "./pages/ActivePatients.js";
import RecentRecords from "./pages/RecentRecords.js";
import PatientRecords from "./pages/PatientRecords.js";
import LabReports from "./pages/LabReports.js";
import MedicalHistory from "./pages/MedicalHistory.js";
import EmergencyCases from "./pages/EmergencyCases.js";
import PatientLabReports from "./pages/PatientLabReports.js";
import PatientEmergencyCases from "./pages/PatientEmergencyCases.js";
import DoctorRegister from "./pages/DoctorRegister.js";
import "./styles/App.css";

function App() {
  console.log("App component loaded!");

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<ViewAppointments />} />
          <Route
            path="/appointments/view/:appointmentId"
            element={<ViewAppointment />}
          />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/manage-schedule" element={<ManageSchedule />} />
          <Route path="/write-prescription" element={<WritePrescription />} />
          <Route path="/prescriptions" element={<ViewPrescriptions />} />
          <Route path="/patients" element={<ActivePatients />} />
          <Route path="/records" element={<RecentRecords />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/lab-reports" element={<LabReports />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/emergency" element={<EmergencyCases />} />
          <Route path="/lab-reports-patient" element={<PatientLabReports />} />
          <Route
            path="/emergency-cases-patient"
            element={<PatientEmergencyCases />}
          />
          <Route path="/doctor-register" element={<DoctorRegister />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
