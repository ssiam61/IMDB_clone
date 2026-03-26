
import React, { useState } from "react";

import Movies from "../componenets/movies";
import Series from "../componenets/series";
import ProfileTab from "../componenets/profiletab";

const UserDashboard = () => {
  const [tab, setTab] = useState("movies");

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Dashboard</h2>
      <ul className="nav nav-tabs mb-3 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link${tab === "movies" ? " active" : ""}`}
            onClick={() => setTab("movies")}
          >
            Movies
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link${tab === "series" ? " active" : ""}`}
            onClick={() => setTab("series")}
          >
            Series
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link${tab === "profile" ? " active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
        </li>
      </ul>
      <div>
        {tab === "movies" && <Movies />}
        {tab === "series" && <Series />}
        {tab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
};

export default UserDashboard;
