import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./LandingLayout.css";
import drawerIcon from "../assets/drawer_icon.png";

const LandingLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-layout">
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-circle">
              <img
                loading="lazy"
                src={drawerIcon}
                alt="Team Session"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="logo-text">Team Session</span>
          </div>
          
          <div className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/faq" className="nav-link">FAQ</Link>
          </div>
          
          <div className="nav-actions">
            <button 
              className="btn-login" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn-signup" 
              onClick={() => navigate('/signup')}
            >
              Register now
            </button>
          </div>
        </div>
      </nav>
      
      <main className="landing-content">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
