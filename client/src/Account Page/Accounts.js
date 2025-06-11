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
  const [imagePreview, setImagePreview] = useState(null); // Add preview state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
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
          // Set the full URL for existing images
          setImagePreview(`http://localhost:5000/uploads/${data.profile_image}`);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setAccount(null);
        setError("Failed to load user data");
      }
    };
    fetchAccount();
  }, []);


  useEffect(() => {
    const updateProfile = async (firstName, lastName) => {
      if (!firstName || !lastName) return;
      try {
        const { data } = await axios.put("http://localhost:5000/update-user", {
          first_name: firstName.trim(),
          last_name: lastName.trim()
        }, {
          withCredentials: true,
        });
        // Update the account state with the returned data
        setAccount(prevAccount => ({
          ...prevAccount,
          first_name: data.first_name || firstName.trim(),
          last_name: data.last_name || lastName.trim()
        }));
        console.log("Account updated successfully"); // Debug log
      } catch (err) {
        console.error("Update failed:", err);
        setError("Failed to update account. Please try again.");
      }
    };
    if (editing) {
      updateProfile(editedFirstName, editedLastName);
    }
  }, [editing, editedFirstName, editedLastName]);
  
  
  const handleSave = async () => {
    // Add validation
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.put("http://localhost:5000/update-user", {
        first_name: editedFirstName.trim(),
        last_name: editedLastName.trim()
      }, {
        withCredentials: true,
      });
      
      // Update the account state with the returned data
      setAccount(prevAccount => ({
        ...prevAccount,
        first_name: data.first_name || editedFirstName.trim(),
        last_name: data.last_name || editedLastName.trim()
      }));
      
      setEditing(false);
      console.log("Account updated successfully"); // Debug log
      
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleCancel = () => {
    // Reset to original values
    setEditedFirstName(account.first_name);
    setEditedLastName(account.last_name);
    setEditing(false);
    setError(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Create preview immediately for better UX
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

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
      // Update preview with server URL
      setImagePreview(`http://localhost:5000/uploads/${data.profile_image}`);
      
    } catch (err) {
      console.error("Image upload failed:", err);
      setError('Failed to upload image. Please try again.');
      // Reset preview on error
      if (account.profile_image) {
        setImagePreview(`http://localhost:5000/uploads/${account.profile_image}`);
      } else {
        setImagePreview(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (first, last) => {
    if (!first || !last) return "??";
    return `${first[0].toUpperCase()}${last[0].toUpperCase()}`;
  };

  const renderProfileImage = () => {
    if (imagePreview || profileImage) {
      return (
        <img 
          src={imagePreview || `http://localhost:5000/uploads/${profileImage}`}
          alt="Profile" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
          onError={() => {
            // Fallback if image fails to load
            setImagePreview(null);
            setProfileImage(null);
          }}
        />
      );
    }
    return getInitials(account?.first_name, account?.last_name);
  };

  if (!account) {
    return (
      <div className="accounts-page">
        <NavBar />
        <div className="accounts-container">
          <h1 className="accounts-title">Your Account</h1>
          <p>Loading account information...</p>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-page">
      <NavBar />
      <div className="accounts-container">
        <h1 className="accounts-title">Your Account</h1>
        {error && <div className="error-message">{error}</div>}
        
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
                disabled={loading}
              />
              <input
                type="text"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="account-input"
                placeholder="Last Name"
                disabled={loading}
              />
              <div className="button-group">
                <button 
                  onClick={handleSave} 
                  className="account-save-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleCancel} 
                  className="account-cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="account-details">
              <p className="account-name">{account.first_name} {account.last_name}</p>
              <p className="account-email">{account.username}</p>
              <button 
                onClick={() => setEditing(true)} 
                className="account-edit-button"
                disabled={loading}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        {loading && <p>Processing...</p>}
      </div>
    </div>
  );
}

export default Accounts;