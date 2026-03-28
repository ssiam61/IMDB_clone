import React from "react";

const MovieDetail = ({ movie }) => {
  if (!movie) return <div className="text-muted">No movie found.</div>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        {/* Header with title and image */}
        <div className="row">
          <div className="col-md-4">
            {movie.teaser_link && (
              <img 
                src={movie.teaser_link} 
                alt={movie.name} 
                className="img-fluid mb-3"
                style={{ maxHeight: 400, objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="col-md-8">
            <h2 className="card-title">{movie.name}</h2>
            
            {/* Ratings */}
            <div className="mb-3">
              {movie.imdb_rating && (
                <span className="badge bg-warning text-dark me-2">
                  IMDb: {movie.imdb_rating}/10
                </span>
              )}
              {movie.reviewStats?.avgUserRating && (
                <span className="badge bg-info">
                  User: {movie.reviewStats.avgUserRating}/10 ({movie.reviewStats.totalReviews} reviews)
                </span>
              )}
            </div>

            {/* Duration */}
            {movie.duration && (
              <p className="card-text">
                <b>Duration:</b> {movie.duration} minutes
              </p>
            )}

            {/* Description */}
            <p className="card-text mt-3">
              {movie.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mt-4">
            <h5>Genres</h5>
            <div>
              {movie.genres.map((genre) => (
                <span key={genre.id} className="badge bg-secondary me-2 mb-2">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.actors && movie.cast.actors.length > 0 && (
          <div className="mt-4">
            <h5>Cast</h5>
            <div className="row">
              {movie.cast.actors.map((actor) => (
                <div key={actor.id} className="col-md-4 col-sm-6 mb-3">
                  <div className="card">
                    {actor.picture && (
                      <img 
                        src={actor.picture} 
                        alt={actor.name}
                        className="card-img-top"
                        style={{ height: 250, objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body p-2">
                      <h6 className="card-title mb-0">{actor.name}</h6>
                      <small className="text-muted">Actor</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directors */}
        {movie.cast && movie.cast.directors && movie.cast.directors.length > 0 && (
          <div className="mt-4">
            <h5>Directors</h5>
            <ul className="list-unstyled">
              {movie.cast.directors.map((director) => (
                <li key={director.id} className="mb-2">
                  <strong>{director.name}</strong>
                  {director.biography && (
                    <p className="small text-muted mb-0">{director.biography.substring(0, 150)}...</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Writers */}
        {movie.cast && movie.cast.writers && movie.cast.writers.length > 0 && (
          <div className="mt-4">
            <h5>Writers</h5>
            <ul className="list-unstyled">
              {movie.cast.writers.map((writer) => (
                <li key={writer.id} className="mb-2">
                  <strong>{writer.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Producers */}
        {movie.cast && movie.cast.producers && movie.cast.producers.length > 0 && (
          <div className="mt-4">
            <h5>Producers</h5>
            <ul className="list-unstyled">
              {movie.cast.producers.map((producer) => (
                <li key={producer.id} className="mb-2">
                  <strong>{producer.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {movie.awards && movie.awards.length > 0 && (
          <div className="mt-4">
            <h5>Awards</h5>
            <ul className="list-unstyled">
              {movie.awards.map((award, index) => (
                <li key={index} className="mb-2">
                  <strong>{award.name}</strong>
                  <br />
                  <small className="text-muted">
                    {award.awarded_by} • {award.year}
                    {award.prize_money && ` • ${award.prize_money}`}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
