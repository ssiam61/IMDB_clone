import React from "react";
import { Link } from "react-router-dom";

const SeriesCard = ({ series }) => (
  <div className="card h-100">
    {series.teaser_link && (
      <img
        src={series.teaser_link}
        alt={series.name}
        className="card-img-top"
        style={{ objectFit: "cover", height: "200px" }}
      />
    )}
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{series.name}</h5>
      {series.imdb_rating && (
        <span className="badge bg-warning text-dark mb-2">IMDb: {series.imdb_rating}</span>
      )}
      {series.user_rating && (
        <span className="badge bg-success mb-2 ms-2">User: {series.user_rating}</span>
      )}
      <p className="card-text flex-grow-1">{series.description?.slice(0, 80) || "No description."}</p>
      {series.duration && (
        <div className="mb-2 text-muted">Duration: {series.duration} min</div>
      )}
      <Link to={`/series/${series.id}`} className="btn btn-primary mt-auto">
        View Details
      </Link>
    </div>
  </div>
);

export default SeriesCard;
