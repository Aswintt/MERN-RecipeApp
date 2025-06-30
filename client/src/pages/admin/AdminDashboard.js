import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Users from "./Users/Users.js";
import Posts from "./Posts/Posts.js";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [tab, setTab] = useState("users");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <Sidebar setTab={setTab} handleLogout={handleLogout} />
      <main className="admin-main">
        {tab === "users" ? <Users /> : <Posts />}
      </main>
    </div>
  );
};

export default AdminDashboard;
