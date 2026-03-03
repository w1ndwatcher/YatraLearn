import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUsers,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import * as bootstrap from "bootstrap";

const customStyles = {
  rows: {
    style: {
      minHeight: "56px", // default is ~48px
    },
  },
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "14px",
    },
  },
  cells: {
    style: {
      fontSize: "14px",
    },
  },
};

const ReflectionList = () => {

  const [sessions, setSessions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8001/api/reflections/list/", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }, [sessions]);

  const filteredItems = useMemo(() => {
    return sessions.filter(item =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [sessions, filterText]);

  const columns = [
    {
      name: "Title",
      selector: row => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "From",
      selector: row => row.duration_from,
      sortable: true,
    },
    {
      name: "To",
      selector: row => row.duration_to,
      sortable: true,
    },
    {
      name: "Total",
      selector: row => row.total_participants,
      sortable: true,
      center: true,
    },
    {
      name: "Started",
      center: true,
      cell: row => (
        <span className="badge bg-warning text-dark small px-2 py-1">
          {row.started_count}
        </span>
      ),
    },
    {
      name: "Completed",
      center: true,
      cell: row => (
        <span className="badge bg-success small px-2 py-1">
          {row.completed_count}
        </span>
      ),
    },
    {
      name: "Progress",
      grow: 2,
      cell: row => {
        const percent =
          row.total_participants > 0
            ? Math.round(
                (row.completed_count / row.total_participants) * 100
              )
            : 0;

        return (
          <div style={{ width: "100%" }}>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <small className="text-muted">{percent}%</small>
          </div>
        );
      },
    },
    {
      name: "Actions",
      cell: row => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="View / Edit Session"
            onClick={() => navigate(`/sessions/edit/${row.id}`)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>

          <button
            className="btn btn-sm btn-outline-success"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="View Participants"
            onClick={() => navigate(`/sessions/${row.id}/participants`)}
          >
            <FontAwesomeIcon icon={faUsers} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <DashboardLayout>

      <div className="card p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Reflection Sessions</h5>

          <div style={{ width: "260px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          dense
          responsive
        //   customStyles={customStyles}
          noDataComponent="No reflection sessions found"
        />

      </div>

    </DashboardLayout>
  );
};

export default ReflectionList;