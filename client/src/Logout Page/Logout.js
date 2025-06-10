import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Call Flask logout route to clear session cookie
    axios.post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Logged out from server");
      })
      .catch(err => {
        console.error("Logout error:", err);
      });

    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);

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
