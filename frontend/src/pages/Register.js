import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
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
    emergency_contact: "",
    role: "patient",
  });
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

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        submitData
      );

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
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="emergency_contact">Emergency Contact</label>
            <input
              type="text"
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) =>
                setFormData({ ...formData, emergency_contact: e.target.value })
              }
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
                <i className="fas fa-times-circle"></i>
                Passwords do not match
              </div>
            )}
          </div>
          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
        {/* <p className="doctor-register-link">
          Are you a doctor? <a href="/doctor-register">Register as Doctor</a>
        </p> */}
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Registration Successful!</h3>
            <p>Your account has been created successfully.</p>
            {/* <p className="success-message">Registration Successful!</p> */}
            <button className="go-to-login-button" onClick={handleGoToLogin}>
              Go to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
