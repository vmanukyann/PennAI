import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.endsWith("@phm.k12.in.us")) {
      setError("Only PHM email addresses are allowed.");
      return;
    }

    try {
      // Hash password using SHA-256 (same as in signup)
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashedArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashedArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await axios.post("http://localhost:5000/login", {
        username: email,
        password: hashedPassword
      });

      if (response.data.message === "Login successful") {
        navigate("/app"); // Redirect to chatbot
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again later.");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-container">
      <div className="container"></div>
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <input
          type="email"
          placeholder="PHM Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="login-input"
        />
        {error && <p className="login-error">{error}</p>}
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <p className="redirect-signup">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="redirect-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
