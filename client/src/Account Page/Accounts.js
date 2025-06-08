// Updated Account Page with MongoDB (No localStorage)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserShield, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers 
} from "react-icons/fa";
import './Accounts.css'; 

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo">Penn Chatbot</div>
      <ul className="nav-links">
        <li><a href="/intro"><FaHome className="nav-icon" /> Home</a></li>
        <li><a href="/app"><FaRobot className="nav-icon" /> Chatbot</a></li>
        <li><a href="/about"><FaBullseye className="nav-icon" /> Our Mission</a></li>
        <li><a href="/contact"><FaEnvelope className="nav-icon" /> Contact</a></li>
        <li><a href="/admin"><FaUserShield className="nav-icon" /> Admin</a></li>
        <li><a href="/signup"><FaUserPlus className="nav-icon" /> Register</a></li>
        <li><a href="/login"><FaSignInAlt className="nav-icon" /> Login</a></li>
        <li><a onClick={() => navigate("/logout") }><FaSignOutAlt className="nav-icon" /> Logout</a></li>
        <li><a href="/accounts"><FaUsers className="nav-icon" /> Account</a></li>
      </ul>
    </nav>
  );
}

function Accounts() {
  const [account, setAccount] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/current-user");
        setAccount(data);
        setEditedFirstName(data.first_name);
        setEditedLastName(data.last_name);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchAccount();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put("http://localhost:5000/update-user", {
        first_name: editedFirstName,
        last_name: editedLastName
      });
      setAccount(response.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const getInitials = (first, last) => `${first[0].toUpperCase()}${last[0].toUpperCase()}`;

  return (
    <div className="accounts-page">
      <NavBar />
      <div className="accounts-container">
        <h1 className="accounts-title">Your Account</h1>
        {account ? (
          <div className="account-item">
            <div className="account-icon">{getInitials(account.first_name, account.last_name)}</div>
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
                <button onClick={handleSave} className="account-save-button">Save</button>
              </div>
            ) : (
              <div className="account-details">
                <p className="account-name">{account.first_name} {account.last_name}</p>
                <p className="account-email">{account.username}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="account-edit-button"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading or no account found.</p>
        )}
      </div>
    </div>
  );
}

export default Accounts;
