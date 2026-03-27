import React from "react";

const SeriesDetail = ({ series }) => {
  if (!series) return <div className="text-muted">No series found.</div>;
  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2 className="card-title">{series.name}</h2>
        <h6 className="card-subtitle mb-2 text-muted">ID: {series.id}</h6>
        <p className="card-text">{series.description || "No description available."}</p>
        <ul className="list-unstyled">
          {series.imdb_rating && <li><b>IMDb:</b> {series.imdb_rating}</li>}
          {series.user_rating && <li><b>User:</b> {series.user_rating}</li>}
          {series.duration && <li><b>Duration:</b> {series.duration} min</li>}
        </ul>
        {series.teaser_link && (
          <img src={series.teaser_link} alt={series.name} className="img-fluid mt-3" style={{maxHeight:300}} />
        )}
      </div>
    </div>
  );
};

export default SeriesDetail;
