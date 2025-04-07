import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li><a href="/intro">Home</a></li>
        <li><a href="/about">Our Mission</a></li>
        <li><a href="/contact">Contact</a></li>
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
                  <span className="word">Amazing</span>
                  <span className="word">Helpful</span>
                  <span className="word">Innovative</span>
                  <span className="word">Supportive</span>
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
              Get Started
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
