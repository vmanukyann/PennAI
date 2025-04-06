import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email.endsWith("@phm.k12.in.us")) {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      if (existingUsers.includes(email)) {
        setError("This email is already registered. Please log in.");
        setSuccess("");
      } else {
        existingUsers.push(email); // Add new user to the list
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
      <div className="signup-box">
        <h1 className="signup-title">Sign Up</h1>
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
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
