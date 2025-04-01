const Sidebar = ({ setSelectedTab, handleLogout }) => {
  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <button onClick={() => setSelectedTab("users")}>Users</button>
      <button onClick={() => setSelectedTab("posts")}>Posts</button>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
