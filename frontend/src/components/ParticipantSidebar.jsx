import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

const ParticipantSidebar = () => {
  return (
    <div className="sidebar dashboard-gradient">

      <NavLink to="/participant/sessions">
        <FontAwesomeIcon icon={faClipboardList} />
        My Sessions
      </NavLink>

      <NavLink to="/participant/profile">
        <FontAwesomeIcon icon={faUser} />
        My Profile
      </NavLink>

    </div>
  );
};

export default ParticipantSidebar;