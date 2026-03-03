import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

const ParticipantProfile = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8001/api/reflections/participants/${id}/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setParticipant(data));
  }, [id]);

  const handleChange = (field, value) => {
    setParticipant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:8001/api/reflections/participants/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(participant),
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Error updating participant");
      return;
    }

    alert("Participant updated successfully!");
  };

  if (!participant) return null;

  return (
    <DashboardLayout>
      <div className="card p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5>Participant Profile</h5>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1"/>
            Back
          </button>
        </div>

        <div className="row g-3">

          <div className="col-md-6">
            <label>Name</label>
            <input
              className="form-control"
              value={participant.name}
              onChange={e => handleChange("name", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label>Email</label>
            <input
              className="form-control"
              value={participant.email}
              onChange={e => handleChange("email", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label>Role</label>
            <input
              className="form-control"
              value={participant.role}
              onChange={e => handleChange("role", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label>Department</label>
            <input
              className="form-control"
              value={participant.department || ""}
              onChange={e => handleChange("department", e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label>City</label>
            <input
              className="form-control"
              value={participant.city || ""}
              onChange={e => handleChange("city", e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label>State</label>
            <input
              className="form-control"
              value={participant.state || ""}
              onChange={e => handleChange("state", e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label>Country</label>
            <input
              className="form-control"
              value={participant.country || ""}
              onChange={e => handleChange("country", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label>Comments</label>
            <textarea
              className="form-control"
              rows="3"
              value={participant.comments || ""}
              onChange={e => handleChange("comments", e.target.value)}
            />
          </div>

        </div>

        <div className="text-end mt-4">
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="me-2"/>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ParticipantProfile;