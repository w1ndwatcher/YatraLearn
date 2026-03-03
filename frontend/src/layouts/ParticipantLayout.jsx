import React from "react";
import Navbar from "../components/Navbar";
import ParticipantSidebar from "../components/ParticipantSidebar";

const ParticipantLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <ParticipantSidebar />

      <main className="dashboard-content">
        {children}
      </main>
    </>
  );
};

export default ParticipantLayout;