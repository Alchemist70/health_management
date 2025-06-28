import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// Patients
export const fetchPatients = () =>
  axios.get(`${API_BASE}/patients`, { headers: authHeader() });

// Lab Reports
export const fetchLabReports = (patientId) =>
  axios.get(`${API_BASE}/lab-reports`, {
    params: { patientId },
    headers: authHeader(),
  });
export const addLabReport = (data) =>
  axios.post(`${API_BASE}/lab-reports`, data, { headers: authHeader() });
export const updateLabReport = (data) =>
  axios.put(`${API_BASE}/lab-reports`, data, { headers: authHeader() });
export const deleteLabReport = (id) =>
  axios.delete(`${API_BASE}/lab-reports/${id}`, { headers: authHeader() });

// Medical History
export const fetchMedicalHistory = (patientId) =>
  axios.get(`${API_BASE}/medical-history`, {
    params: { patientId },
    headers: authHeader(),
  });
export const addMedicalHistory = (data) =>
  axios.post(`${API_BASE}/medical-history`, data, { headers: authHeader() });
export const updateMedicalHistory = (data) =>
  axios.put(`${API_BASE}/medical-history`, data, { headers: authHeader() });
export const deleteMedicalHistory = (id) =>
  axios.delete(`${API_BASE}/medical-history/${id}`, { headers: authHeader() });

// Emergency Cases
export const fetchEmergencyCases = (patientId) =>
  axios.get(`${API_BASE}/emergency-cases`, {
    params: { patientId },
    headers: authHeader(),
  });
export const addEmergencyCase = (data) =>
  axios.post(`${API_BASE}/emergency-cases`, data, { headers: authHeader() });
export const updateEmergencyCase = (data) =>
  axios.put(`${API_BASE}/emergency-cases`, data, { headers: authHeader() });
export const deleteEmergencyCase = (id) =>
  axios.delete(`${API_BASE}/emergency-cases/${id}`, { headers: authHeader() });

// Patient Info
export const fetchPatientInfo = (patientId) =>
  axios.get(`${API_BASE}/users/${patientId}`, { headers: authHeader() });

// Prescriptions
export const fetchPrescriptionsByPatient = (patientId) => {
  const config = {
    headers: authHeader(),
  };

  // Only add patientId to params if it's provided (for doctors)
  if (patientId) {
    config.params = { patientId };
  }

  return axios.get(`${API_BASE}/prescriptions/patient`, config);
};
