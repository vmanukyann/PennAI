import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; 
import "./Contact.css";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li>
          <a href="/intro">
            <FaHome className="nav-icon" /> {/* Home icon */}
          </a>
        </li>
        <li>
          <a href="/app">Chatbot</a>
        </li>
        <li>
          <a href="/about">Our Mission</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li>
          <a href="/admin">Admin</a>
        </li>
        <li>
          <a href="/signup">Register</a>
        </li>
        <li>
          <a href="/login">
            <FaSignInAlt className="nav-icon" /> {/* Login icon */}
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/logout")}>
            <FaSignOutAlt className="nav-icon" /> {/* Logout icon */}
          </a>
        </li>
      </ul>
    </nav>
  );
}

function Contact() {
  return (
    <div>
      <NavBar />
      <div className="contact-container">
        <div className="contact-card">
          <h1>Contact Us</h1>
          <p>
            Have questions or need assistance? Reach out to the <span className="brand">Penn Chatbot</span> team. 
            We're here to help and ensure you have the best experience possible.
          </p>
          <h2>Get in Touch</h2>
          <p>Email: <a href="mailto:support@pennchatbot.com">penncomputerclub@phm.k12.in.us</a></p>
          <p>Phone: <a href="tel:+5748557065">+1 (574) 855-7065</a></p>
          <h2>Follow Us</h2>
          <p>
            Stay updated with the latest news and updates from Penn Chatbot:
            <ul>
              <li><a href="https://instagram.com/pennchatbotclub" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
