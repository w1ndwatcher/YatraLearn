import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faSearch
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

const Participants = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8001/api/reflections/${id}/participants/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setParticipants(data));
  }, [id]);

  const filteredItems = useMemo(() => {
    return participants.filter(p =>
      Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [participants, filterText]);

  const handleDelete = async (participantId) => {
    if (!window.confirm("Remove this participant?")) return;

    await fetch(
      `http://localhost:8001/api/reflections/participants/${participantId}/delete/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );

    setParticipants(prev =>
      prev.filter(p => p.id !== participantId)
    );
  };

  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: row => row.role,
    },
    {
      name: "Status",
      cell: row => {
        const badgeColor =
          row.status === "COMPLETED"
            ? "bg-success"
            : row.status === "STARTED"
            ? "bg-warning text-dark"
            : "bg-secondary";

        return (
          <span className={`badge ${badgeColor} px-2 py-1`}>
            {row.status}
          </span>
        );
      },
      center: true,
    },
    {
      name: "Actions",
      cell: row => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDelete(row.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  const startedCount = participants.filter(p => p.status === "STARTED").length;
  const completedCount = participants.filter(p => p.status === "COMPLETED").length;

  return (
    <DashboardLayout>

      <div className="card p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1">Participants</h5>
            <small className="text-muted">
              Total: {participants.length} | Started: {startedCount} | Completed: {completedCount}
            </small>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </button>
        </div>

        <div className="mb-3" style={{ width: "260px" }}>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search participants..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          dense
          responsive
          noDataComponent="No participants found"
        />

      </div>

    </DashboardLayout>
  );
};

export default Participants;