import React from "react";
import { NavLink } from "react-router-dom";

const UserNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <NavLink className="navbar-brand" to="/user-dashboard">
        IMDB Clone
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#userNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="userNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <NavLink 
              to="/user-dashboard" 
              className={({ isActive }) =>
                "nav-link " + (isActive ? "active fw-bold" : "")
              }
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/posts" 
              className={({ isActive }) =>
                "nav-link " + (isActive ? "active fw-bold" : "")
              }
            >
              Posts
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/profile" 
              className={({ isActive }) =>
                "nav-link " + (isActive ? "active fw-bold" : "")
              }
            >
              Profile
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink 
              to="/notifications" 
              className={({ isActive }) =>
                "nav-link " + (isActive ? "active fw-bold" : "")
              }
            >
              Notifications
            </NavLink>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default UserNavbar;