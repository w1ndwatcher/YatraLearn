import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("TRAINER");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const endpoint =
        role === "TRAINER"
          ? "http://localhost:8001/"
          : "http://localhost:8001/api/reflections/participant-login/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // -------------------------
      // Redirect Logic
      // -------------------------

      if (role === "TRAINER") {

        if (data.must_change_password) {
          navigate("/change-password");
        } else {
          navigate("/dashboard");
        }

      } else {
        // Participant
        navigate("/participant/chat");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="gradient-bg d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-4">

            <div className="card p-4 shadow-lg">

              <h3 className="text-center mb-4">
                {role === "TRAINER" ? "Trainer Login" : "Participant Login"}
              </h3>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              {/* Role Selector */}
              <div className="mb-3 text-center">
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${role === "TRAINER" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setRole("TRAINER")}
                  >
                    Trainer
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${role === "TRAINEE" ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setRole("TRAINEE")}
                  >
                    Participant
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

              {/* Trainer Register Link */}
              {role === "TRAINER" && (
                <div className="text-center mt-3">
                  <small>
                    New trainer?{" "}
                    <span
                      style={{ cursor: "pointer", color: "#0F6B68" }}
                      onClick={() => navigate("/trainer/register")}
                    >
                      Register here
                    </span>
                  </small>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;