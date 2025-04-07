import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data
    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastLoginTime");

    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h1 className="logout-title">Logging Out...</h1>
        <p className="logout-message">You are being redirected to the login page.</p>
      </div>
    </div>
  );
}

export default Logout;
