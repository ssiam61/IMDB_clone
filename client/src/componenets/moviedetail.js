import React from "react";

const MovieDetail = ({ movie }) => {
  if (!movie) return <div className="text-muted">No movie found.</div>;
  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2 className="card-title">{movie.name}</h2>
        <h6 className="card-subtitle mb-2 text-muted">{movie.year}</h6>
        <p className="card-text">{movie.description || "No description available."}</p>
        {/* Add more fields as needed, e.g. genre, director, etc. */}
        <ul className="list-unstyled">
          {movie.genre && <li><b>Genre:</b> {movie.genre}</li>}
          {movie.director && <li><b>Director:</b> {movie.director}</li>}
          {movie.rating && <li><b>Rating:</b> {movie.rating}</li>}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetail;
