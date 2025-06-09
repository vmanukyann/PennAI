import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserShield, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import "./Intro.css";
import { FaUser } from "react-icons/fa";

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
            <FaUsers className="nav-icon" /> Account
          </a>
        </li>
      </ul>
    </nav>
  );
}

function WordCarousel({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true); // Start fade in
      }, 200); // Half of transition duration
      
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  // Find the longest word to set consistent width
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <div className="loader">
      Chatbot is   
      <div className="words" style={{ 
        minWidth: `${longestWord.length * 0.6}em`, // Consistent width based on longest word
        display: 'inline-block',
        textAlign: 'left'
      }}>
        <span 
          className="word" 
          style={{ 
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            display: 'inline-block',
            minWidth: '100%'
          }}
        >
          {words[currentIndex]}
        </span>
      </div>
    </div>
  );
}

// Matrix Animation Component
function MatrixAnimation() {
  return (
    <div className="matrix-pattern">
      {/* Generate 20 matrix columns */}
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} className="matrix-column"></div>
      ))}
    </div>
  );
}

function Intro() {
  const navigate = useNavigate();
  const words = [" Empowering", " Helpful", " Innovative", " Supportive"];

  const handleStart = () => {
    navigate("/signup");
  };

  return (
    <div className="intro-container">
      <NavBar />

      {/* First section */}
      <section className="intro-hero">
        <div className="split-container">
          <div className="left-panel">
            <div className="content-wrapper">
              <div className="card">
                <WordCarousel words={words} />
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
      </section>

      {/* Black screen + stats section */}
      <section className="first-stat-panel">
        <div className="first-stat-split">
          <div className="first-stat-left">
            <div className="first-stat-content">
              <h3 className="first-stat-title">5,000+</h3>
              <p className="first-stat-description">Questions Answered</p>
            </div>
          </div>
          <div className="first-stat-right">
            <MatrixAnimation />
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="stats-content">
          <h2>What has Chatbot done?</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>99%</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-card">
              <FaUser className="stat-icon" />
              <h3>1,200+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Support Availability</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Intro;