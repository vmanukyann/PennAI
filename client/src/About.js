import React from "react";
import "./About.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">PennAI</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

function About() {
  return (
    <div>
      <NavBar />
      <div className="about-container">
        <h1>About Us</h1>
        <p>
          Welcome to <span className="brand">PennAI</span>, your ultimate academic companion. We’re dedicated to revolutionizing learning at Penn High School by harnessing cutting-edge AI technology. Our mission is to deliver smart, dependable support that makes education more efficient, engaging, and accessible for everyone.
        </p>
        <h2>Our Vision</h2>
        <p>
        At PennAI, we believe that technology can bridge the gap between students and knowledge. We envision a future where every learner is empowered to explore, innovate, and achieve their fullest potential—transforming challenges into opportunities for growth.

        </p>
        <h2>Our Team</h2>
        <p>
        PennAI is crafted by a passionate team of students and educators who believe in the power of technology to transform education. United by our commitment to innovation and excellence, we create dynamic tools that enhance the academic journey and inspire a love for learning.
        </p>
      </div>
    </div>
  );
}

export default About;
