// src/components/AdminPanel.js
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

function AdminPanel() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.type == "admin") {
      navigate("applicationList");
    } else {
      navigate("userDetails");
    }
  }, [user]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <Outlet /> {/* Renders nested routes */}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
