import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Users from "./Users";
import Posts from "./Posts";
import "./admin.css";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-dashboard">
      <Sidebar setSelectedTab={setSelectedTab} handleLogout={handleLogout} />
      <div className="admin-content">
        {selectedTab === "users" ? <Users /> : <Posts />}
      </div>
    </div>
  );
};

export default AdminDashboard;
