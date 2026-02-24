import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="dashboard-content">
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;