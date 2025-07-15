import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    national_id: "",
    specialization: "",
    license_number: "",
    years_experience: "",
  });
  const [credentialFile, setCredentialFile] = useState(null);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password[0])) {
      errors.push("Password must start with a capital letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordErrors(validatePassword(newPassword));
    setPasswordsMatch(newPassword === formData.confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword: newConfirmPassword });
    setPasswordsMatch(newConfirmPassword === formData.password);
  };

  const handleFileChange = (e) => {
    setCredentialFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setIsSubmitting(false);
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    if (!credentialFile) {
      setError("Please upload your credentials as a PDF file.");
      setIsSubmitting(false);
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      data.append("credentials", credentialFile);
      // Submit to a new endpoint for doctor registration (pending approval)
      const response = await axios.post("/api/doctors/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Doctor Signup</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="national_id">National ID/Insurance Number</label>
            <input
              type="text"
              id="national_id"
              value={formData.national_id}
              onChange={(e) =>
                setFormData({ ...formData, national_id: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="license_number">Medical License Number</label>
            <input
              type="text"
              id="license_number"
              value={formData.license_number}
              onChange={(e) =>
                setFormData({ ...formData, license_number: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="years_experience">Years of Experience</label>
            <input
              type="number"
              id="years_experience"
              value={formData.years_experience}
              onChange={(e) =>
                setFormData({ ...formData, years_experience: e.target.value })
              }
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handlePasswordChange}
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle`}
                onClick={() => togglePasswordVisibility("password")}
              ></i>
            </div>
            {passwordErrors.length > 0 && (
              <div className="password-requirements">
                {passwordErrors.map((error, index) => (
                  <div key={index} className="requirement-item">
                    <i className="fas fa-times-circle"></i>
                    {error}
                  </div>
                ))}
              </div>
            )}
            <div className="password-info">
              <i className="fas fa-info-circle"></i>
              Password must:
              <ul>
                <li>Start with a capital letter</li>
                <li>Be at least 8 characters long</li>
                <li>Contain at least one number</li>
                <li>Contain at least one special character</li>
              </ul>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle`}
                onClick={() => togglePasswordVisibility("confirm")}
              ></i>
            </div>
            {!passwordsMatch && formData.confirmPassword && (
              <div className="password-match-error">
                <i className="fas fa-times-circle"></i> Passwords do not match
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="credentials">Upload Credentials (PDF)</label>
            <input
              type="file"
              id="credentials"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register as Doctor"}
          </button>
        </form>
        {showSuccessModal && (
          <div className="success-modal">
            <div className="modal-content">
              <h3>Registration Submitted!</h3>
              <p>
                Your registration is pending admin approval. You will be
                notified once approved.
              </p>
              <button onClick={handleGoToLogin}>Go to Login</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRegister;
