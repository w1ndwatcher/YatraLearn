import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

const objectivesList = [
  "Leadership",
  "Teamwork",
  "Conflict Management",
  "Communication",
];

const EditReflection = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    learning_objectives: [],
    duration_from: "",
    duration_to: "",
    design: "",
    execution: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8001/api/reflections/${id}/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  const toggleObjective = (val) => {
    setForm(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.includes(val)
        ? prev.learning_objectives.filter(i => i !== val)
        : [...prev.learning_objectives, val]
    }));
  };

  const handleSave = async () => {

    await fetch(`http://localhost:8001/api/reflections/${id}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(form),
    });

    alert("Reflection Session updated successfully!");
    navigate("/sessions/list");
  };

  return (
    <DashboardLayout>

      <div className="card p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5>Edit Reflection Session</h5>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </button>
        </div>

        <label className="fw-semibold mb-1">Title</label>
        <input
          className="form-control mb-3"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="fw-semibold">From</label>
            <input
              type="date"
              className="form-control"
              value={form.duration_from}
              onChange={e => setForm({...form, duration_from: e.target.value})}
            />
          </div>

          <div className="col-md-6">
            <label className="fw-semibold">To</label>
            <input
              type="date"
              className="form-control"
              value={form.duration_to}
              onChange={e => setForm({...form, duration_to: e.target.value})}
            />
          </div>
        </div>

        <label className="fw-semibold mb-2">Learning Objectives</label>
        <div className="mb-4">
          {objectivesList.map(o => (
            <span
              key={o}
              className={`badge me-2 mb-2 ${
                form.learning_objectives.includes(o)
                  ? "bg-success"
                  : "bg-light text-dark border"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => toggleObjective(o)}
            >
              {o}
            </span>
          ))}
        </div>

        <label className="fw-semibold mb-2">Design</label>
        <RichTextEditor
          id="edit-design"
          value={form.design}
          onChange={(content) =>
            setForm(prev => ({ ...prev, design: content }))
          }
        />

        <label className="fw-semibold mt-4 mb-2">Execution</label>
        <RichTextEditor
          id="edit-execution"
          value={form.execution}
          onChange={(content) =>
            setForm(prev => ({ ...prev, execution: content }))
          }
        />

        <div className="mt-4 text-end">
          <button
            className="btn btn-success"
            onClick={handleSave}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save Changes
          </button>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default EditReflection;