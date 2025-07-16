import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Register.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    national_id: "",
    emergency_contact: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "";
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/users/${localStorage.getItem("userId")}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          dob: response.data.dob || "",
          gender: response.data.gender || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          national_id: response.data.national_id || "",
          emergency_contact: response.data.emergency_contact || "",
        });
      } catch (err) {
        setError("Failed to fetch profile information");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "";
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>My Profile</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="national_id">National ID/Insurance Number</label>
              <input
                type="text"
                id="national_id"
                name="national_id"
                value={formData.national_id}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emergency_contact">Emergency Contact</label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="register-button">
              Update Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
