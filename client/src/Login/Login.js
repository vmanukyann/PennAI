import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaEnvelope, FaLock, FaExclamationCircle, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";
import axios from "axios";

// Token management utility
const tokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getAuthHeaders: () => {
    const token = tokenManager.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate PHM email
    if (!email.endsWith("@phm.k12.in.us")) {
      setError("Only PHM email addresses are allowed.");
      setIsLoading(false);
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password.");
      setIsLoading(false);
      return;
    }

    try {
      // Hash password using SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashedArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashedArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log("Attempting login for:", email);

      const response = await axios.post("http://localhost:5000/login", {
        username: email,
        password: hashedPassword
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        tokenManager.setToken(response.data.token);
        console.log("Token stored successfully");
        navigate("/app");
      } else {
        setError("Login failed - no authentication token received.");
      }

    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Redirect to Google OAuth endpoint on your backend
      // Your backend should handle the OAuth flow and return to a callback URL
      window.location.href = "http://localhost:5000/auth/google";
      
      // Alternative: If you're using a popup approach
      // const width = 500;
      // const height = 600;
      // const left = window.screen.width / 2 - width / 2;
      // const top = window.screen.height / 2 - height / 2;
      // 
      // const popup = window.open(
      //   "http://localhost:5000/auth/google",
      //   "Google Sign In",
      //   `width=${width},height=${height},left=${left},top=${top}`
      // );
      //
      // // Listen for message from popup
      // window.addEventListener('message', (event) => {
      //   if (event.origin !== window.location.origin) return;
      //   
      //   if (event.data.token) {
      //     tokenManager.setToken(event.data.token);
      //     popup.close();
      //     navigate("/app");
      //   }
      // });

    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-background"></div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
            <FaRobot className="login-logo-icon" />
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to Penn Chatbot</p>
          </div>

          {error && (
            <div className="login-error">
              <FaExclamationCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button 
            onClick={handleGoogleSignIn} 
            className="google-button"
            disabled={isLoading}
          >
            <FcGoogle className="google-icon" />
            Sign in with Google
          </button>

          <div className="login-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                PHM Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.name@phm.k12.in.us"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-loading"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="redirect-signup">
              Don't have an account?{" "}
              <span 
                onClick={() => navigate("/signup")} 
                className="redirect-link"
              >
                Sign Up
              </span>
            </p>
            <p className="back-home">
              <a href="/intro">← Back to Home</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export { tokenManager };
export default Login;