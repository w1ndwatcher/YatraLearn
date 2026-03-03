import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ParticipantReport = () => {

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="card p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5>AI Reflection Report</h5>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1"/>
            Back
          </button>
        </div>

        <p>This report will be generated once participant completes chat.</p>

      </div>
    </DashboardLayout>
  );
};

export default ParticipantReport;