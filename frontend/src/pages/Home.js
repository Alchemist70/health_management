import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.js";
import "../styles/Home.css";

const DoctorHome = () => {
  const doctorName = localStorage.getItem("userName") || "Doctor";

  return (
    <>
      <div className="doctor-hero-section">
        <div className="hero-content">
          <h1>Welcome back, Dr. {doctorName}</h1>
          <p>Your trusted platform for efficient healthcare management</p>
        </div>
      </div>

      <section className="features-section">
        <h2>Why Choose MedCare?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-user-clock"></i>
            <h3>Smart Scheduling</h3>
            <p>
              Efficiently manage your appointments with our intelligent
              scheduling system
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-notes-medical"></i>
            <h3>Digital Records</h3>
            <p>Access and maintain patient records securely in one place</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Practice Analytics</h3>
            <p>Gain insights into your practice with comprehensive analytics</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-mobile-alt"></i>
            <h3>Mobile Access</h3>
            <p>Access your practice information anytime, anywhere</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Day?</h2>
          <p>
            Access your dashboard to view appointments and manage patient care
          </p>
          <Link to="/doctor-dashboard" className="cta-button">
            <i className="fas fa-columns"></i> Go to Dashboard
          </Link>
        </div>
      </section>

      <section className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="info-content">
              <h3>Secure Platform</h3>
              <p>
                Your data is protected with enterprise-grade security and
                encryption
              </p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-headset"></i>
            </div>
            <div className="info-content">
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is always here to help you</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-sync"></i>
            </div>
            <div className="info-content">
              <h3>Regular Updates</h3>
              <p>
                Continuous improvements and new features to enhance your
                experience
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="resources-section">
        <h2>Resources & Tools</h2>
        <div className="resources-grid">
          <Link to="/help-center" className="resource-card">
            <i className="fas fa-book-medical"></i>
            <h3>Help Center</h3>
            <p>Access guides and documentation</p>
          </Link>
          <Link to="/training" className="resource-card">
            <i className="fas fa-graduation-cap"></i>
            <h3>Training</h3>
            <p>Learn how to use MedCare effectively</p>
          </Link>
          <Link to="/updates" className="resource-card">
            <i className="fas fa-bell"></i>
            <h3>Latest Updates</h3>
            <p>Stay informed about new features</p>
          </Link>
          <Link to="/community" className="resource-card">
            <i className="fas fa-users"></i>
            <h3>Community</h3>
            <p>Connect with other healthcare professionals</p>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

const PatientHome = () => {
  const isLoggedIn =
    localStorage.getItem("token") &&
    localStorage.getItem("userRole") === "patient";
  const patientName = localStorage.getItem("userName");

  return (
    <>
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MedCare</h1>
          <p className="hero-subtitle">
            Your trusted platform for medical appointments
          </p>
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Register
              </Link>
            </div>
          ) : (
            <div className="patient-welcome">
              <div className="welcome-card">
                <div className="welcome-content">
                  <h2>Welcome back, {patientName}</h2>
                  <p>What would you like to do today?</p>
                  <div className="action-buttons">
                    <Link to="/book" className="action-button book">
                      <i className="fas fa-calendar-plus"></i>
                      Book Appointment
                    </Link>
                    <Link to="/appointments" className="action-button view">
                      <i className="fas fa-calendar-check"></i>
                      View Appointments
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose MedCare?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Easy Appointments</h3>
            <p>Book your medical appointments with just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Expert Doctors</h3>
            <p>Access to a network of qualified healthcare professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Digital Records</h3>
            <p>Keep track of your medical history and appointments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>24/7 Access</h3>
            <p>Manage your healthcare anytime, anywhere</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

const Home = () => {
  const userRole = localStorage.getItem("userRole");
  const isDoctor = userRole === "doctor";

  return isDoctor ? <DoctorHome /> : <PatientHome />;
};

export default Home;
