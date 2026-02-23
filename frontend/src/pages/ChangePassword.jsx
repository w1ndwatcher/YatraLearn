import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrftoken = localStorage.getItem("csrftoken");
    console.log(csrftoken);
    const response = await fetch("http://localhost:8001/change-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      credentials: "include",
      body: JSON.stringify({ new_password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Error updating password");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="gradient-bg d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Set New Password</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-success w-100">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;