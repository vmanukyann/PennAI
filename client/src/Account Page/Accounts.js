import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome, FaRobot, FaBullseye, FaEnvelope, FaUserShield,
  FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers, FaCamera
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
        <li><a href="/signup"><FaUserPlus className="nav-icon" /> Register</a></li>
        <li><a href="/login"><FaSignInAlt className="nav-icon" /> Login</a></li>
        <li><a onClick={() => navigate("/logout")}><FaSignOutAlt className="nav-icon" /> Logout</a></li>
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
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/current-user", {
          withCredentials: true,
        });
        setAccount(data);
        setEditedFirstName(data.first_name);
        setEditedLastName(data.last_name);
        
        // Load existing profile image if available
        if (data.profile_image) {
          setProfileImage(data.profile_image);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setAccount(null);
      }
    };
    fetchAccount();
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await axios.put("http://localhost:5000/update-user", {
        first_name: editedFirstName,
        last_name: editedLastName
      }, {
        withCredentials: true,
      });
      setAccount(data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const { data } = await axios.post("http://localhost:5000/upload-profile-image", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update the profile image
      setProfileImage(data.profile_image);
      setAccount(prev => ({ ...prev, profile_image: data.profile_image }));
      
    } catch (err) {
      console.error("Image upload failed:", err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (first, last) => `${first[0].toUpperCase()}${last[0].toUpperCase()}`;

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <img 
          src={`http://localhost:5000/uploads/${profileImage}`} 
          alt="Profile" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      );
    }
    return getInitials(account.first_name, account.last_name);
  };

  return (
    <div className="accounts-page">
      <NavBar />
      <div className="accounts-container">
        <h1 className="accounts-title">Your Account</h1>
        {account ? (
          <div className="account-item">
            <div className="account-icon" onClick={() => fileInputRef.current?.click()}>
              {renderProfileImage()}
              <div className="image-overlay">
                <FaCamera />
                <span>Change Photo</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
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
                <button onClick={() => setEditing(true)} className="account-edit-button">Edit</button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading or no account found.</p>
        )}
        {loading && <p>Uploading image...</p>}
      </div>
    </div>
  );
}

export default Accounts;