import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignInAlt, FaSignOutAlt, FaEnvelope, FaUserShield, FaUserPlus, FaUsers } from "react-icons/fa"; // Import additional icons
import "./About.css";

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
          <a href="/app">Chatbot</a>
        </li>
        <li>
          <a href="/about">Our Mission</a>
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



function About() {
  return (
    <div>
      <NavBar />
      <div className="about-container">
        <div className="about-card">
          <h1>Our Mission</h1>
          <p>
            Welcome to <span className="brand">Penn Chatbot</span>, your ultimate academic companion. We’re dedicated to revolutionizing learning at Penn High School by harnessing cutting-edge AI technology. Our mission is to deliver smart, dependable support that makes education more efficient, engaging, and accessible for everyone.
          </p>
          <h2>Our Vision</h2>
          <p>
            At Penn Chatbot, we believe that technology can bridge the gap between students and knowledge. We envision a future where every learner is empowered to explore, innovate, and achieve their fullest potential—transforming challenges into opportunities for growth.
          </p>
          <h2>Our Team</h2>
          <p>
            Penn Chatbot is crafted by a passionate team of students and educators who believe in the power of technology to transform education. United by our commitment to innovation and excellence, we create dynamic tools that enhance the academic journey and inspire a love for learning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
