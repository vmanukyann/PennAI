import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (email.endsWith("@phm.k12.in.us")) {
      if (existingUsers.some(user => user.email === email)) {
        setError("");
        localStorage.setItem("currentUser", email); // Track the currently logged-in user
        navigate("/app"); // Redirect to the chatbot page
      } else {
        setError("No account found. Please sign up.");
      }
    } else {
      setError("Only PHM email addresses are allowed.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="container"></div> {/* Add the container for the background */}
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className="login-input"
        />
        {error && <p className="login-error">{error}</p>}
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
