import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav
      className="navbar dashboard-gradient fixed-top px-4 d-flex justify-content-between align-items-center"
      style={{ height: "60px" }}
    >
      <span className="navbar-brand text-white fw-bold fs-5">
        YatraLearn
      </span>

      <div className="d-flex align-items-center gap-4 text-white">

        <FontAwesomeIcon icon={faBell} style={{ cursor: "pointer" }} />

        <button className="btn btn-light btn-sm d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;