import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const EpisodePage = () => {
  const { id } = useParams();

  const [episode, setEpisode] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [thisIndex, setThisIndex] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/episode/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setEpisode(data.episode);
          setAllEpisodes(data.allEpisodes);
          setThisIndex(data.currentIndex);
        }
      } catch (err) {
        console.error("Error loading episode:", err);
      }
    };

    loadEpisode();
  }, [id]);

  if (!episode) return <p>Loading...</p>;

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        <div className="text-center">
          <img
            src={episode.thumbnail || "/images/placeholder.png"}
            alt="episode"
            style={{
              width: "260px",
              height: "360px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />

          <h2 className="mt-3">Episode {episode.number}</h2>

          <div className="d-flex justify-content-center gap-3 mt-3">

            {thisIndex > 0 && (
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  (window.location.href =
                    `/episode/${allEpisodes[thisIndex - 1].id}`)
                }
              >
                ← Previous Episode
              </button>
            )}

            {thisIndex < allEpisodes.length - 1 && (
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  (window.location.href =
                    `/episode/${allEpisodes[thisIndex + 1].id}`)
                }
              >
                Next Episode →
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-light shadow-sm rounded my-4">
          <p><strong>IMDB Rating:</strong> {episode.imdb_rating}</p>
          <p><strong>User Rating:</strong> {episode.user_rating}</p>

          {episode.description && (
            <>
              <p><strong>Description:</strong></p>
              <p>{episode.description}</p>
            </>
          )}
        </div>

        <hr />

        <h4>Leave a Review</h4>

        {!reviewSubmitted ? (
          <div className="p-3 bg-light rounded shadow-sm mb-4">

            <label>Star Rating</label>
            <select
              className="form-select mb-3"
              value={reviewStars}
              onChange={(e) => setReviewStars(parseInt(e.target.value))}
            >
              <option value="0">Select…</option>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Your Review</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <button
              className="btn btn-primary"
              onClick={() => setReviewSubmitted(true)}
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-success">✅ Review submitted.</p>
        )}

        <hr />

        <h4>Reviews</h4>
        <p className="text-muted">No reviews yet — coming soon.</p>

      </div>
    </>
  );
};

export default EpisodePage;
