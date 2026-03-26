import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => (
  <div className="card h-100">
    {movie.teaser_link && (
      <img
        src={movie.teaser_link}
        alt={movie.name}
        className="card-img-top"
        style={{ objectFit: "cover", height: "200px" }}
      />
    )}
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{movie.name}</h5>
      {movie.imdb_rating && (
        <span className="badge bg-warning text-dark mb-2">IMDb: {movie.imdb_rating}</span>
      )}
      {movie.user_rating && (
        <span className="badge bg-success mb-2 ms-2">User: {movie.user_rating}</span>
      )}
      <p className="card-text flex-grow-1">{movie.description?.slice(0, 80) || "No description."}</p>
      {movie.duration && (
        <div className="mb-2 text-muted">Duration: {movie.duration} min</div>
      )}
      <Link to={`/movies/${movie.id}`} className="btn btn-primary mt-auto">
        View Details
      </Link>
    </div>
  </div>
);

export default MovieCard;
