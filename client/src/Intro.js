import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/app"); // Navigate to the main app page
  };

  return (
    <div className="intro">
      <h1>Welcome to PennAI</h1>
      <p>Penn High School's personalized chatbot tailored for your needs.</p>
      <button className="start-button" onClick={handleStart}>
        Get Started
      </button>
    </div>
  );
}

export default Intro;
