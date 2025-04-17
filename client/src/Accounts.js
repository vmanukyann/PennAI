import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Accounts.css";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/intro")}>Penn Chatbot</div>
      <ul className="nav-links">
        <li><a href="/intro">Home</a></li>
        <li><a href="/app">Chatbot</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/accounts">Accounts</a></li>
      </ul>
    </nav>
  );
}

function Accounts() {
  const accounts = JSON.parse(localStorage.getItem("universalUsers")) || [];
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const handleEdit = (index, firstName, lastName) => {
    setEditingIndex(index);
    setEditedFirstName(firstName);
    setEditedLastName(lastName);
  };

  const handleSave = (index) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].firstName = editedFirstName;
    updatedAccounts[index].lastName = editedLastName;
    localStorage.setItem("universalUsers", JSON.stringify(updatedAccounts));
    setEditingIndex(null);
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
          {accounts.length > 0 ? (
            accounts.map((account, index) => (
              <li key={index} className="account-item">
                <div className="account-icon">
                  {getInitials(account.firstName, account.lastName)}
                </div>
                {editingIndex === index ? (
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
                    <button
                      onClick={() => handleSave(index)}
                      className="account-save-button"
                    >
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
                      onClick={() =>
                        handleEdit(index, account.firstName, account.lastName)
                      }
                      className="account-edit-button"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li>No accounts found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Accounts;
