import React, { useEffect, useState } from "react";
import ParticipantLayout from "../layouts/ParticipantLayout";

const ParticipantMyProfile = () => {

  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetch("http://localhost:8001/api/reflections/participant-profile/", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const handleSave = async () => {
    await fetch("http://localhost:8001/api/reflections/participant-profile/", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    alert("Profile updated!");
  };

  return (
    <ParticipantLayout>
      <div className="card p-4">
        <h5 className="mb-4">My Profile</h5>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={profile.name || ""}
            onChange={e => setProfile({...profile, name: e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={profile.email || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <input
            className="form-control"
            value={profile.role || ""}
            onChange={e => setProfile({...profile, role: e.target.value})}
          />
        </div>

        <button className="btn btn-success" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </ParticipantLayout>
  );
};

export default ParticipantMyProfile;