import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";

function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

const handleSignUp = async () => {
  setError("");
  setSuccess("");

  if (!email.endsWith("@phm.k12.in.us")) {
    setError("Only PHM email addresses are allowed.");
    return;
  }

  try {
    // Hash the password using SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashedArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashedArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log("Submitting registration with:", {
      username: email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const response = await axios.post("http://localhost:5000/register", {
      username: email,
      password: hashedPassword,
      firstName,
      lastName
    });

    console.log("Server response:", response.data);

    if (response.data.message) {
      setSuccess("Account created successfully! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError("Unknown response format. Check server logs.");
    }

  } catch (err) {
    console.error("Registration error:", err);

    if (err.response) {
      console.error("Server responded with:", err.response.data);
      setError(`Server error: ${err.response.data.error || "Unknown error"}`);
    } else if (err.request) {
      setError("No response from server. Is it running?");
    } else {
      setError(`Request failed: ${err.message}`);
    }
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSignUp();
  };

  return (
    <div className="signup-container">
      <div className="container"></div>
      <div className="signup-box">
        <h1 className="signup-title">Sign Up</h1>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="signup-input"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="PHM Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          className="signup-input"
        />
        {error && <p className="signup-error">{error}</p>}
        {success && <p className="signup-success">{success}</p>}
        <button onClick={handleSignUp} className="signup-button">Sign Up</button>
        <p className="redirect-login">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="redirect-link">Log in</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
