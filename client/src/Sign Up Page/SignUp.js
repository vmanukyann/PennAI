import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaRobot, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./SignUp.css";
import axios from "axios";

function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  // Calculate password strength
  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 2) setPasswordStrength("weak");
    else if (strength <= 3) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return false;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return false;
    }

    if (!email.endsWith("@phm.k12.in.us")) {
      setError("Only PHM email addresses (@phm.k12.in.us) are allowed.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Hash the password using SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashedArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashedArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log("Submitting registration with:", {
        username: email,
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
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Unexpected response from server. Please try again.");
      }

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        setError(err.response.data.error || "Registration failed. Please try again.");
      } else if (err.request) {
        setError("Cannot reach server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Redirect to Google OAuth endpoint
      window.location.href = "http://localhost:5000/auth/google";
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Google sign-up failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="signup-background"></div>
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-logo">
            <FaRobot className="signup-logo-icon" />
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join Penn Chatbot today</p>
          </div>

          {error && (
            <div className="signup-error">
              <FaExclamationCircle className="message-icon" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="signup-success">
              <FaCheckCircle className="message-icon" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-Up Button */}
          <button 
            onClick={handleGoogleSignUp} 
            className="google-signup-button"
            disabled={isLoading}
          >
            <FcGoogle className="google-icon" />
            Sign up with Google
          </button>

          <div className="signup-divider">
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSignUp} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Frank"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="signup-input"
                  disabled={isLoading}
                  autoComplete="given-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Sinatra"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="signup-input"
                  disabled={isLoading}
                  autoComplete="family-name"
                />
              </div>
            </div>

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
                className="signup-input"
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
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                className="signup-input"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {passwordStrength && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    <div className={`password-strength-fill strength-${passwordStrength}`}></div>
                  </div>
                  <span style={{ 
                    color: passwordStrength === 'weak' ? '#dc2626' : 
                           passwordStrength === 'medium' ? '#f59e0b' : '#10b981' 
                  }}>
                    Password strength: {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="signup-input"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-loading"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="signup-footer">
            <p className="redirect-login">
              Already have an account?{" "}
              <span 
                onClick={() => navigate("/login")} 
                className="redirect-link"
              >
                Log In
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

export default SignUp;