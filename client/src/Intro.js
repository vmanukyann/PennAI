import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserShield, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa"; // Import icons
import "./Intro.css";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li>
          <a href="/intro">
            <FaHome className="nav-icon" /> Home
          </a>
        </li>
        <li>
          <a href="/app">
            <FaRobot className="nav-icon" /> Chatbot
          </a>
        </li>
        <li>
          <a href="/about">
            <FaBullseye className="nav-icon" /> Our Mission
          </a>
        </li>
        <li>
          <a href="/contact">
            <FaEnvelope className="nav-icon" /> Contact
          </a>
        </li>
        <li>
          <a href="/admin">
            <FaUserShield className="nav-icon" /> Admin
          </a>
        </li>
        <li>
          <a href="/signup">
            <FaUserPlus className="nav-icon" /> Register
          </a>
        </li>
        <li>
          <a href="/login">
            <FaSignInAlt className="nav-icon" /> Login
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/logout")}>
            <FaSignOutAlt className="nav-icon" /> Logout
          </a>
        </li>
        <li>
          <a href="/accounts">
            <FaUsers className="nav-icon" /> Accounts
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/signup"); // Redirect to the SignUp page
  };

  return (
    <div>
      <NavBar />
      <div className="split-container">
        <div className="left-panel">
          <div className="content-wrapper">
            <div className="card">
              <div className="loader">
                Chatbot is   
                <div className="words">
                  <span className="word"> Empowering</span>
                  <span className="word"> Helpful</span>
                  <span className="word"> Innovative</span>
                  <span className="word"> Supportive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="content-wrapper">
            <h1 className="welcome-title">
              Welcome to the <span className="brand">Penn Chatbot</span>
            </h1>
            <p className="description">
              Your personalized academic assistant from Penn High School.
            </p>
            <button className="start-button" onClick={handleStart}>
              Register
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
