import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const universalUsers = JSON.parse(localStorage.getItem("universalUsers")) || [];
    setUsers(universalUsers);
  }, []);

  const handleApprove = (email) => {
    const updatedUsers = users.map(user =>
      user.email === email ? { ...user, approved: true } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("universalUsers", JSON.stringify(updatedUsers));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <h2>Signed-up Users</h2>
      {users.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>First Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Last Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Timestamp</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Disapprove</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Approve</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.firstName}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.lastName}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.timestamp}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.approved ? "Yes" : "No"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {user.disapproved ? "Yes" : "No"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {!user.approved && (
                    <button onClick={() => handleApprove(user.email)}>Approve</button>
                  )}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {!user.disapproved && (
                    <button onClick={() => handleApprove(user.email)}>Disapprove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
