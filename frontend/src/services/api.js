import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Patients
export const fetchPatients = () => api.get("/api/patients");

// Lab Reports
export const fetchLabReports = (patientId) =>
  api.get("/api/lab-reports", { params: { patientId } });
export const addLabReport = (data) => api.post("/api/lab-reports", data);
export const updateLabReport = (data) => api.put("/api/lab-reports", data);
export const deleteLabReport = (id) => api.delete(`/api/lab-reports/${id}`);

// Medical History
export const fetchMedicalHistory = (patientId) =>
  api.get("/api/medical-history", { params: { patientId } });
export const addMedicalHistory = (data) =>
  api.post("/api/medical-history", data);
export const updateMedicalHistory = (data) =>
  api.put("/api/medical-history", data);
export const deleteMedicalHistory = (id) =>
  api.delete(`/api/medical-history/${id}`);

// Emergency Cases
export const fetchEmergencyCases = (patientId) =>
  api.get("/api/emergency-cases", { params: { patientId } });
export const addEmergencyCase = (data) =>
  api.post("/api/emergency-cases", data);
export const updateEmergencyCase = (data) =>
  api.put("/api/emergency-cases", data);
export const deleteEmergencyCase = (id) =>
  api.delete(`/api/emergency-cases/${id}`);

// Patient Info
export const fetchPatientInfo = (patientId) =>
  api.get(`/api/users/${patientId}`);

// Prescriptions
export const fetchPrescriptionsByPatient = (patientId) => {
  const config = {};
  if (patientId) {
    config.params = { patientId };
  }
  return api.get("/api/prescriptions", config);
};

export default api;
