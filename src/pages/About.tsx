import React from "react";
import "./About.css";
import teamMeeting from "../assets/chat.jpg";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-content">
          <h1 className="about-title">Empowering Teams to Achieve More</h1>
          <p className="about-subtitle">
            Team Session Manager was born out of a simple need: to make team collaboration and
            administrative tracking seamless. We believe that tools should work for you, not the
            other way around.
          </p>
        </div>
      </div>

      <div className="about-section">
        <div className="content-wrapper">
          <div className="mission-section">
            <div className="mission-image">
              <img
                src={teamMeeting}
                alt="Team collaboration"
                loading="lazy"
              />
            </div>
            <div className="mission-content">
              <h2 className="section-heading">Our Mission</h2>
              <p className="section-text">
                To provide organizations with a robust, transparent,
                and efficient way to manage their internal sessions
                and expenditures, fostering a culture of
                accountability and growth.
              </p>
              <ul className="mission-features">
                <li className="mission-feature">
                  <svg className="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Transparent tracking</span>
                </li>
                <li className="mission-feature">
                  <svg className="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Automated reporting</span>
                </li>
                <li className="mission-feature">
                  <svg className="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Secure data management</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="why-section">
            <h2 className="section-heading">Why Choose Us?</h2>
            <p className="section-text">
              Unlike generic project management tools, Team Session Manager is specifically tailored for session-based
              workflows. Whether you're tracking training sessions, client meetings, or internal workshops, our platform
              provides the specific granularity you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
