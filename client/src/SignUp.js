import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserCircle } from "react-icons/fa"; // Import icons
import "./SignUp.css";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/intro")}>Penn Chatbot</div>
      <ul className="nav-links">
        <li>
          <a href="/intro">
            <FaHome className="nav-icon" /> {/* Home icon */}
          </a>
        </li>
        <li>
          <a href="/login">
            <FaSignInAlt className="nav-icon" /> {/* Login icon */}
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/account")}>
            <FaUserCircle className="nav-icon" /> {/* Account icon */}
          </a>
        </li>
      </ul>
    </nav>
  );
}

function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email.endsWith("@phm.k12.in.us")) {
      const universalUsers = JSON.parse(localStorage.getItem("universalUsers")) || [];
      if (universalUsers.some(user => user.email === email)) {
        setError("This email is already registered. Please log in.");
        setSuccess("");
      } else {
        const newUser = {
          firstName,
          lastName,
          email,
          timestamp: new Date().toLocaleString(),
          approved: false, // Mark as not approved by default
        };
        universalUsers.push(newUser); // Add new user to the universal list
        localStorage.setItem("universalUsers", JSON.stringify(universalUsers));
        setError("");
        setSuccess("Account created successfully! Please wait for admin approval.");
      }
    } else {
      setError("Only PHM email addresses are allowed.");
      setSuccess("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignUp();
    }
  };

  return (
    <div className="signup-container">
      <NavBar /> {/* Add the navbar */}
      <div className="container"></div> {/* Add the container for the background */}
      <div className="signup-box">
        <h1 className="signup-title">Sign Up</h1>
        <input
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="signup-input"
        />
        <input
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className="signup-input"
        />
        {error && <p className="signup-error">{error}</p>}
        {success && <p className="signup-success">{success}</p>}
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>
        <p className="redirect-login">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="redirect-link">
            Log in 
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
