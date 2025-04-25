//imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserShield, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa"; // Import icons
import "./Accounts.css";

//Function to display navbar(universal across all pages)
function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li>
          <a href="/intro">
            <FaHome className="nav-icon" /> Home
          </a>
        </li>
        <li>
          <a href="/app">
            <FaRobot className="nav-icon" /> Chatbot
          </a>
        </li>
        <li>
          <a href="/about">
            <FaBullseye className="nav-icon" /> Our Mission
          </a>
        </li>
        <li>
          <a href="/contact">
            <FaEnvelope className="nav-icon" /> Contact
          </a>
        </li>
        <li>
          <a href="/admin">
            <FaUserShield className="nav-icon" /> Admin
          </a>
        </li>
        <li>
          <a href="/signup">
            <FaUserPlus className="nav-icon" /> Register
          </a>
        </li>
        <li>
          <a href="/login">
            <FaSignInAlt className="nav-icon" /> Login
          </a>
        </li>
        <li>
          <a onClick={() => navigate("/logout")}>
            <FaSignOutAlt className="nav-icon" /> Logout
          </a>
        </li>
        <li>
          <a href="/accounts">
            <FaUsers className="nav-icon" /> Account
          </a>
        </li>
      </ul>
    </nav>
  );
}

//funcitianlity to display a certain account that has been logged in
function Accounts() {
  const accounts = JSON.parse(localStorage.getItem("universalUsers")) || [];
  
  // Assume the current user's email is stored as "currentUserEmail" in localStorage
  const currentUserEmail = localStorage.getItem("currentUserEmail");
  console.log("Accounts:", accounts);
  console.log("Current User Email:", currentUserEmail);
  
  // Find the account corresponding to the currently logged in user
  const account = accounts.find(acc => acc.email === currentUserEmail);
  
  const [editing, setEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  
  const handleEdit = (firstName, lastName) => {
    setEditing(true);
    setEditedFirstName(firstName);
    setEditedLastName(lastName);
  };

  const handleSave = () => {
    const updatedAccounts = accounts.map(acc => {
      if(acc.email === currentUserEmail) {
        return { ...acc, firstName: editedFirstName, lastName: editedLastName };
      }
      return acc;
    });
    localStorage.setItem("universalUsers", JSON.stringify(updatedAccounts));
    setEditing(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  };

  return (
    <div className="accounts-page">
      <NavBar />
      <div className="accounts-container">
        <h1 className="accounts-title">Your Account</h1>
        <ul className="accounts-list">
          {account ? (
            <li key={account.email} className="account-item">
              <div className="account-icon">
                {getInitials(account.firstName, account.lastName)}
              </div>
              {editing ? (
                <div className="account-edit">
                  <input
                    type="text"
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    className="account-input"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                    className="account-input"
                    placeholder="Last Name"
                  />
                  <button onClick={handleSave} className="account-save-button">
                    Save
                  </button>
                </div>
              ) : (
                <div className="account-details">
                  <p className="account-name">
                    {account.firstName} {account.lastName}
                  </p>
                  <p className="account-email">{account.email}</p>
                  <button
                    onClick={() => handleEdit(account.firstName, account.lastName)}
                    className="account-edit-button"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>No account found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Accounts;
