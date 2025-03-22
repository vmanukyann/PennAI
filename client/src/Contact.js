import React from "react";
import "./Contact.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PennAI</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">Our Mission</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

function Contact() {
  return (
    <div>
      <NavBar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Have questions or need assistance? Reach out to the <span className="brand">PennAI</span> team. 
          We're here to help and ensure you have the best experience possible.
        </p>
        <h2>Get in Touch</h2>
        <p>Email: <a href="mailto:support@pennai.com">support@pennai.com</a></p>
        <p>Phone: <a href="tel:+1234567890">+1 (574) 855-7065</a></p>
        <h2>Follow Us</h2>
        <p>
          Stay updated with the latest news and updates from PennAI:
          <ul>
            <li><a href="https://instagram.com/pennai" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </p>
      </div>
    </div>
  );
}

export default Contact;
