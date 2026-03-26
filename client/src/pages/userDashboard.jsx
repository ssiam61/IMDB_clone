import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";

const UserDashboard = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("http://localhost:5000/media");
        const data = await response.json();
        setMedia(data);
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };

    fetchMedia();
  }, []);

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        {/* SORT + SEARCH */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary">Sort</button>

          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search..."
            />
            <button className="btn btn-outline-success">Search</button>
          </form>
        </div>

        {/* MULTI‑ROW MAIN MOVIE GRID (vertical scroll) */}
        <div 
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px"
          }}
        >
        <div
            className="d-flex flex-wrap justify-content-start"
            style={{
                gap: "20px"   // ← this WILL work regardless of Bootstrap version
            }}
        >

            {media.map((item) => (
              <MediaCard key={item.id} title={item.name} />
            ))}
          </div>
        </div>

        {/* HORIZONTAL SCROLL SECTIONS */}
        <hr className="my-4" />

        {[
          "Highly Rated",
          "Critically Acclaimed",
          "From your Watchlist",
          "Award Winners",
          "Trending",
          "Recommended for You",
          "Star Studded"
        ].map((category) => (
          <div key={category} className="mb-4">
            <h5 className="mb-2">{category}</h5>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "15px",
                paddingBottom: "10px"
              }}
            >
              {media.slice(0, 10).map((item) => (
                <MediaCard key={`${category}-${item.id}`} title={item.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserDashboard;