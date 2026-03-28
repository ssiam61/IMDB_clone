import React from "react";

const SeriesDetail = ({ series }) => {
  if (!series) return <div className="text-muted">No series found.</div>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        {/* Header with title and image */}
        <div className="row">
          <div className="col-md-4">
            {series.teaser_link && (
              <img 
                src={series.teaser_link} 
                alt={series.name}
                className="img-fluid mb-3"
                style={{ maxHeight: 400, objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="col-md-8">
            <h2 className="card-title">{series.name}</h2>
            
            {/* Ratings */}
            <div className="mb-3">
              {series.imdb_rating && (
                <span className="badge bg-warning text-dark me-2">
                  IMDb: {series.imdb_rating}/10
                </span>
              )}
              {series.reviewStats?.avgUserRating && (
                <span className="badge bg-info">
                  User: {series.reviewStats.avgUserRating}/10 ({series.reviewStats.totalReviews} reviews)
                </span>
              )}
            </div>

            {/* Duration */}
            {series.duration && (
              <p className="card-text">
                <b>Duration:</b> {series.duration} minutes per episode
              </p>
            )}

            {/* Description */}
            <p className="card-text mt-3">
              {series.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Genres */}
        {series.genres && series.genres.length > 0 && (
          <div className="mt-4">
            <h5>Genres</h5>
            <div>
              {series.genres.map((genre) => (
                <span key={genre.id} className="badge bg-secondary me-2 mb-2">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cast */}
        {series.cast && series.cast.actors && series.cast.actors.length > 0 && (
          <div className="mt-4">
            <h5>Cast</h5>
            <div className="row">
              {series.cast.actors.map((actor) => (
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
        {series.cast && series.cast.directors && series.cast.directors.length > 0 && (
          <div className="mt-4">
            <h5>Directors</h5>
            <ul className="list-unstyled">
              {series.cast.directors.map((director) => (
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
        {series.cast && series.cast.writers && series.cast.writers.length > 0 && (
          <div className="mt-4">
            <h5>Writers</h5>
            <ul className="list-unstyled">
              {series.cast.writers.map((writer) => (
                <li key={writer.id} className="mb-2">
                  <strong>{writer.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Producers */}
        {series.cast && series.cast.producers && series.cast.producers.length > 0 && (
          <div className="mt-4">
            <h5>Producers</h5>
            <ul className="list-unstyled">
              {series.cast.producers.map((producer) => (
                <li key={producer.id} className="mb-2">
                  <strong>{producer.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {series.awards && series.awards.length > 0 && (
          <div className="mt-4">
            <h5>Awards</h5>
            <ul className="list-unstyled">
              {series.awards.map((award, index) => (
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

export default SeriesDetail;
