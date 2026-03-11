import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";
import teamImage from "../assets/corporate.jpg";
import drawerIcon from "../assets/drawer_icon.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Manage Your Team{" "}
              <span className="highlight-green">Sessions with Ease</span>
            </h1>
            <p className="hero-description">
              The all-in-one platform for tracking employee sessions,
              expenditures, and generating comprehensive reports for
              your organization.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/signup')}>
                 Register now
              </button>
              <button className="btn-secondary" onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={teamImage}
              alt="Team collaboration"
              className="hero-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Session Tracking</h3>
              <p>Easily schedule and track all team sessions with real-time status updates and automated notifications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Detailed Analytics</h3>
              <p>Gain insights into expenditures and session completion rates with our intuitive dashboard and charts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Secure Reporting</h3>
              <p>Generate and distribute reports securely to designated recipients with full audit trails.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={drawerIcon} alt="Team Session" className="footer-logo-img" />
            <span className="footer-logo-text">Team Session</span>
          </div>
          <div className="footer-links">
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="#" className="footer-link">Privacy Policy</Link>
          </div>
          <div className="footer-copyright">
            © 2024 Team Session Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
