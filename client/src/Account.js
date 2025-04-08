import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");
  const [userData, setUserData] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const universalUsers = JSON.parse(localStorage.getItem("universalUsers")) || [];
    const user = universalUsers.find((user) => user.email === currentUser);
    if (user) {
      setUserData(user);
    } else {
      navigate("/signup");
    }
  }, [currentUser, navigate]);

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const iconUrl = URL.createObjectURL(file);
      const updatedUser = { ...userData, icon: iconUrl };
      setUserData(updatedUser);

      const universalUsers = JSON.parse(localStorage.getItem("universalUsers")) || [];
      const updatedUsers = universalUsers.map((user) =>
        user.email === currentUser ? updatedUser : user
      );
      localStorage.setItem("universalUsers", JSON.stringify(updatedUsers));
    }
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-container">
      <div className="account-card">
        <div
          className="account-photo"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {userData.icon ? (
            <img src={userData.icon} alt="Profile" className="profile-img" />
          ) : (
            <div className="default-icon">
              {userData.firstName[0].toUpperCase()}
              {userData.lastName[0].toUpperCase()}
            </div>
          )}
          {hovered && (
            <label className="change-icon">
              Change Icon
              <input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="file-input"
              />
            </label>
          )}
        </div>
        <h1 className="account-name">
          {userData.firstName} {userData.lastName}
        </h1>
        <p className="account-email">{userData.email}</p>
        <button className="logout-button" onClick={() => navigate("/logout")}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;
