import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email.endsWith("@phm.k12.in.us")) {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      if (existingUsers.some(user => user.email === email)) {
        setError("This email is already registered. Please log in.");
        setSuccess("");
      } else {
        const newUser = {
          firstName,
          lastName,
          email,
          timestamp: new Date().toLocaleString(),
        };
        existingUsers.push(newUser); // Add new user to the list
        localStorage.setItem("users", JSON.stringify(existingUsers));
        setError("");
        setSuccess("Account created successfully! You can now log in.");
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
