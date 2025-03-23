import React from "react";
import "../Home.css";
import truckhomepage from "../Images/truckhomepage.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaTwitter, FaTiktok, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Home() {
  const companyName = "GlobeTrans Logistics";
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication (Assuming token is stored in localStorage)
    localStorage.removeItem("authToken");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="home-wrapper">
      <div className="hero-section">
        <img src={truckhomepage} alt="Fleet of trucks" className="hero-image" />

        <div className="hero-text">
          <h1 className="highlight-green">
            Welcome to <span>{companyName}</span>
          </h1>
          <p>
            Your trusted <span>reliable partner</span>
          </p>
        </div>

        {/* Login and Logout buttons */}
        <div className="auth-buttons">
          <Link to="/login" className="login-button-overlay">
            Login
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {/* Company Description with Yellow Background + Contact Info */}
      <div className="company-description yellow-bg">
        <p>
          Established in <span className="highlight-blue">2010</span>,{" "}
          <span className="highlight-blue">GlobeTrans Logistics</span> has grown into a leading name in the{" "}
          <span className="highlight-blue">transportation and logistics</span> industry, renowned for delivering excellence with every mile.
        </p>

        {/* Contact Info Section */}
        <div className="contact-info">
          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />
            <span>+254 700 123 456</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
