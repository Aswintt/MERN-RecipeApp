const Sidebar = ({ setTab, handleLogout }) => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <nav className="sidebar-nav">
        <button onClick={() => setTab("users")}>Users</button>
        <button onClick={() => setTab("posts")}>Posts</button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
