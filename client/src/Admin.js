import React from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <h2>Signed-up Emails</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      ) : (
        <p>No users have signed up yet.</p>
      )}
      <button onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>
        Back to Home
      </button>
    </div>
  );
}

export default Admin;
