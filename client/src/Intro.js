import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PennAI</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/app");
  };

  return (
    <div>
      <NavBar />
      <div className="split-container">
        <div className="left-panel">
          <div className="content-wrapper">
            <div className="logo">PennAI</div>
            <h2 className="tagline">Intelligent Academic Support</h2>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="content-wrapper">
            <h1 className="welcome-title">
              Welcome to <span className="brand">PennAI</span>
            </h1>
            <p className="description">
              Your personalized academic assistant from Penn High School
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
