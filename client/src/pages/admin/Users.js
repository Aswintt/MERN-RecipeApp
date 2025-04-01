import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleBanUnban = async (userId, isBanned) => {
    await axios.put(
      `${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}/ban`,
      {
        isBanned: !isBanned,
      }
    );
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, isBanned: !isBanned } : user
      )
    );
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}`
    );
    setUsers(users.filter((user) => user._id !== userId));
  };

  if (loading) return <h2>Loading users...</h2>;

  return (
    <div className="admin-users">
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="user-card">
            <p>{user.username}</p>
            <button
              onClick={() => handleBanUnban(user._id, user.isBanned)}
              className="ban-btn"
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
        ))
      )}
    </div>
  );
};

export default Users;
