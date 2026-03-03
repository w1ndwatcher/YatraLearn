import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ParticipantLogin = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8001/api/participant-login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    navigate(`/reflection/chat/${data.participant_id}`);
  };

  return (
    <div className="container mt-5">
      <h4>Participant Login</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={e => setForm({...form, username: e.target.value})}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default ParticipantLogin;