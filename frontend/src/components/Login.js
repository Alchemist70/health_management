import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with email:", formData.email);

      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );

      // Log the entire response data
      console.log("Full login response data:", response.data);

      // Extract user data
      const { token, role, name, userId, email } = response.data;

      // Validate the name
      if (!name) {
        console.error("Error: No name received in login response");
        setError(
          "Login successful but user data incomplete. Please try again."
        );
        return;
      }

      console.log("Received user data:", {
        token: "exists",
        role,
        name,
        userId,
      });

      // Store user data in localStorage
      localStorage.clear(); // Clear any existing data first
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", name);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("userEmail", formData.email); // Store the email used for login

      // Force a window storage event for the Header component
      window.dispatchEvent(new Event("storage"));

      // Double check storage
      const storedName = localStorage.getItem("userName");
      console.log("Verification - Stored name in localStorage:", storedName);

      if (!storedName) {
        console.error("Error: Name not properly stored in localStorage");
        setError("Error storing user data. Please try again.");
        return;
      }

      // Redirect to the main home page
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <p className="register-link" style={{ marginTop: "0.5rem" }}>
          Forgot password? <a href="/reset-password">Reset it here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
