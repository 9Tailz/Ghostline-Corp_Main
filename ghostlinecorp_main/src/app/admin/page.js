"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("user");
    const [message, setMessage] = useState(null);


// useEffect(() => {
//     fetchProfiles();
// }, [],);

useEffect(() => {
  async function fetchUsers() {
    const res = await fetch('/api/admin/users');
    const json = await res.json();
    if (!res.ok) {
      setMessage({ type: 'error', text: json.error });
    } else {
      setProfiles(json.profiles); 
    }
    setLoading(false);
  }
  fetchUsers();
}, []);

async function addUser(e) {
  e.preventDefault();
  setMessage(null);

  if (!newEmail || !newName || !newRole) {
    setMessage({ type: "error", text: "Name, Email and Role required" });
    return;
  }

  try {
    const res = await fetch('/api/admin/addUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: "password", // or generate securely in backend
        display_name: newName,
        role: newRole,
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Failed to add user" });
      return;
    }

    setMessage({ type: "success", text: "User added successfully!" });
    setNewName("");
    setNewEmail("");
    setNewRole("user");
    fetchUsers(); // refresh user list
  } catch (error) {
    setMessage({ type: "error", text: error.message });
  }

}

async function removeUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const res = await fetch('/api/admin/removeUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
      return;
    }

    setMessage({ type: 'success', text: data.message });
    fetchUsers(); // refresh user list after deletion
  } catch (error) {
    setMessage({ type: 'error', text: error.message });
  }
}

return (
  <>
    <style jsx>{`
      .container {
        padding: 2rem;
        font-family: 'Poppins', sans-serif;
      }
      h2 {
        margin-bottom: 1rem;
      }
      form {
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
      }
      input, select {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        flex: 1 1 200px;
      }
      button {
        padding: 0.6rem 1rem;
        background: #5a67d8;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      button:hover {
        background: #434190;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      th, td {
        text-align: left;
        border-bottom: 1px solid #ccc;
        padding: 0.8rem;
      }
      .role {
        font-weight: 600;
        text-transform: capitalize;
        color: #4c51bf;
      }
      .message {
        margin-top: 1rem;
        font-weight: 600;
      }
      .message.error {
        color: #e53e3e;
      }
      .message.success {
        color: #48bb78;
      }
    `}</style>

    <div className="container">
      <h2>User Management</h2>

      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Full Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {loading && <p>Loading users...</p>}

      {!loading && profiles.length === 0 && <p>No users found.</p>}

      {!loading && profiles.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(({ id, display_name, email, role }) => (
              <tr key={id}>
                <td>{display_name}</td>
                <td>{email}</td>
                <td className="role">{role}</td>
                <td>
                  <button onClick={() => removeUser(id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && (
        <p className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </p>
      )}
    </div>
  </>
);
}