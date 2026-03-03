import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faSearch,
  faPlus,
  faUser,
  faChartBar
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

  const { id } = useParams(); // session id
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    role: "",
    years_experience: "",
    department: "",
    city: "",
    state: "",
    country: "India",
    comments: ""
  });

  const [deleteId, setDeleteId] = useState(null);

  // -------------------------------
  // Fetch participants
  // -------------------------------
  const fetchParticipants = async () => {
    const res = await fetch(
      `http://localhost:8001/api/reflections/${id}/participants/`,
      { credentials: "include" }
    );
    const data = await res.json();
    setParticipants(data);
  };

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  // -------------------------------
  // Search filtering
  // -------------------------------
  const filteredItems = useMemo(() => {
    return participants.filter(p =>
      Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [participants, filterText]);

  // -------------------------------
  // Add Participant
  // -------------------------------
  const handleAddParticipant = async () => {

    const res = await fetch(
      `http://localhost:8001/api/reflections/${id}/participants/add/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(newParticipant),
      }
    );

    if (!res.ok) {
      alert("Error adding participant");
      return;
    }

    setShowModal(false);

    // Reset form
    setNewParticipant({
      name: "",
      email: "",
      role: "",
      years_experience: "",
      department: "",
      city: "",
      state: "",
      country: "India",
      comments: ""
    });

    fetchParticipants();
  };

  // -------------------------------
  // Delete Participant
  // -------------------------------
  const confirmDelete = async () => {
    await fetch(
        `http://localhost:8001/api/reflections/participants/${deleteId}/delete/`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
        }
    );
    setParticipants(prev =>
        prev.filter(p => p.id !== deleteId)
    );
    setDeleteId(null);
  };

  // -------------------------------
  // DataTable Columns
  // -------------------------------
  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Role",
      selector: row => row.role,
      sortable: true,
    },
    {
      name: "Status",
      center: true,
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
    },
    {
      name: "Actions",
      cell: row => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-outline-primary"
            title="View Profile"
            onClick={() => navigate(`/participants/${row.id}`)}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          <button
            className="btn btn-sm btn-outline-info"
            title="View AI Report"
            onClick={() => navigate(`/participants/${row.id}/report`)}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete Participant"
            onClick={() => setDeleteId(row.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // -------------------------------
  // Counts
  // -------------------------------
  const startedCount = participants.filter(
    p => p.status === "STARTED"
  ).length;

  const completedCount = participants.filter(
    p => p.status === "COMPLETED"
  ).length;

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <DashboardLayout>

      <div className="card p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1">Participants</h5>
            <small className="text-muted">
              Total: {participants.length} | Started: {startedCount} | Completed: {completedCount}
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1"/>
              Add Participant
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back
            </button>
          </div>
        </div>

        {/* Search */}
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

        {/* Table */}
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

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-4">

              <h5 className="mb-3">Add Participant</h5>

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={newParticipant.name}
                onChange={e =>
                  setNewParticipant({...newParticipant, name: e.target.value})
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Email"
                value={newParticipant.email}
                onChange={e =>
                  setNewParticipant({...newParticipant, email: e.target.value})
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Role"
                value={newParticipant.role}
                onChange={e =>
                  setNewParticipant({...newParticipant, role: e.target.value})
                }
              />

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleAddParticipant}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
            <div className="modal-content p-4">

                <h5 className="mb-3 text-danger">Confirm Delete</h5>

                <p>Are you sure you want to remove this participant?</p>

                <div className="text-end">
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => setDeleteId(null)}
                >
                    Cancel
                </button>

                <button
                    className="btn btn-danger"
                    onClick={confirmDelete}
                >
                    Delete
                </button>
                </div>

            </div>
            </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Participants;