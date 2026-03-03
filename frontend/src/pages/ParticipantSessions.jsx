import React, { useEffect, useState } from "react";
import ParticipantLayout from "../layouts/ParticipantLayout";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";

const ParticipantSessions = () => {

  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8001/api/reflections/participant-sessions/", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  const columns = [
    {
      name: "Title",
      selector: row => row.title,
      sortable: true,
      grow: 2
    },
    {
      name: "Duration",
      selector: row => `${row.duration_from} - ${row.duration_to}`,
      grow: 2
    },
    {
      name: "Status",
      selector: row => row.status,
      center: true
    },
    {
      name: "Actions",
      cell: row => (
        <div className="d-flex gap-2">

          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => navigate(`/participant/chat/${row.id}`)}
          >
            <FontAwesomeIcon icon={faComments} className="me-1" />
            Chat
          </button>

          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => navigate(`/participant/report/${row.id}`)}
          >
            <FontAwesomeIcon icon={faChartBar} className="me-1" />
            View Report
          </button>

        </div>
      )
    }
  ];

  return (
    <ParticipantLayout>
      <div className="card p-4">
        <h5 className="mb-4">My Reflection Sessions</h5>

        <DataTable
          columns={columns}
          data={sessions}
          pagination
          dense
          highlightOnHover
          responsive
        />
      </div>
    </ParticipantLayout>
  );
};

export default ParticipantSessions;