import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css"; // Create this file for styles

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/users`
        );
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUnban = async (userId, isBanned) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}/ban`,
        { isBanned: !isBanned }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isBanned: !isBanned } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}`
      );
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Users</h2>

      {loading ? (
        <p className="info-text">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="info-text">No users found.</p>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <p className="username">{user.username}</p>
              <div className="user-actions">
                <button
                  onClick={() => handleBanUnban(user._id, user.isBanned)}
                  className={`ban-btn ${user.isBanned ? "unban" : ""}`}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
