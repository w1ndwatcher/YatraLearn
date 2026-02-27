import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faPlusCircle,
  faClipboardList,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div className="sidebar dashboard-gradient">

      <NavLink to="/dashboard">
        <FontAwesomeIcon icon={faHome} />
        Dashboard
      </NavLink>

      <NavLink to="/trainer/profile">
        <FontAwesomeIcon icon={faUser} />
        My Profile
      </NavLink>

      <NavLink to="/sessions/create">
        <FontAwesomeIcon icon={faPlusCircle} />
        Create Session
      </NavLink>

      <NavLink to="/sessions/list">
        <FontAwesomeIcon icon={faClipboardList} />
        Reflection Sessions
      </NavLink>

      <NavLink to="/analytics">
        <FontAwesomeIcon icon={faChartBar} />
        Analytics
      </NavLink>

    </div>
  );
};

export default Sidebar;