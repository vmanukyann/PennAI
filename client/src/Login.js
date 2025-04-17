import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    if (lastLoginTime) {
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - new Date(lastLoginTime).getTime() < oneHour) {
        navigate("/app"); // Redirect to the chatbot if within 1 hour
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    const universalUsers = JSON.parse(localStorage.getItem("universalUsers")) || [];
    if (email.endsWith("@phm.k12.in.us")) {
      const user = universalUsers.find(user => user.email === email);

      if (email === "vmanukyan135@phm.k12.in.us") {
        // Automatically approve this specific user
        if (!user) {
          const newUser = {
            firstName: "Vazgen",
            lastName: "Manukyan",
            email,
            timestamp: new Date().toLocaleString(),
            approved: true, // Automatically approved
          };
          universalUsers.push(newUser);
          localStorage.setItem("universalUsers", JSON.stringify(universalUsers));
        } else if (!user.approved) {
          user.approved = true; // Ensure the user is approved
          localStorage.setItem("universalUsers", JSON.stringify(universalUsers));
        }
        setError("");
        localStorage.setItem("currentUser", email); // Track the currently logged-in user
        localStorage.setItem("lastLoginTime", new Date().toISOString()); // Save the login timestamp
        navigate("/app"); // Redirect to the chatbot page
      } else if (user) {
        if (user.approved) {
          setError("");
          localStorage.setItem("currentUser", email); // Track the currently logged-in user
          localStorage.setItem("lastLoginTime", new Date().toISOString()); // Save the login timestamp
          navigate("/app"); // Redirect to the chatbot page
        } else {
          setError("Your account is not approved yet. Please wait for admin approval.");
        }
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
