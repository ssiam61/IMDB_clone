import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import AwardCard from "../components/AwardCard";
import SeasonCard from "../components/SeasonCard";

const MediaPage = () => {
  const { id } = useParams();

  const [media, setMedia] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [cast, setCast] = useState([]);
  const [awards, setAwards] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/media/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setMedia(data.media);
          setDirectors(data.directors);
          setCast(data.cast);
          setAwards(data.awards);
          setSeasons(data.seasons);
        }
      } catch (err) {
        console.error("Error loading media page:", err);
      }
    };

    loadMedia();
  }, [id]);

  if (!media) return <p>Loading...</p>;

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">
        <div className="text-center">
          <img
            src={media.thumbnail || "/images/placeholder.png"}
            alt={media.name}
            style={{
              width: "260px",
              height: "360px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />

          <h2 className="mt-3">{media.name}</h2>
        </div>

        <div className="p-4 bg-light shadow-sm rounded my-4">
          <p><strong>IMDB Rating:</strong> {media.imdb_rating}</p>
          <p><strong>User Rating:</strong> {media.user_rating}</p>
          <p><strong>Duration:</strong> {media.duration} min</p>

          <p><strong>Teaser Link:</strong></p>
          <a href={media.teaser_link} target="_blank" rel="noreferrer">
            {media.teaser_link}
          </a>

          <p className="mt-3"><strong>Description:</strong></p>
          <p>{media.description}</p>
        </div>

        <h4 className="mt-4">Director{directors.length > 1 ? "s" : ""}</h4>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px",
            paddingTop: "5px",
            whiteSpace: "nowrap"
          }}
        >
          {directors.length > 0 ? (
            directors.map((dir) => (
              <MediaCard
                id={dir.id}
                title={dir.name}
                type="person"
                image={dir.profile_image}
              />
            ))
          ) : (
            <p>No directors available</p>
          )}
        </div>

        <hr />

        <h4>Cast</h4>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px",
            paddingTop: "5px",
            whiteSpace: "nowrap"
          }}
        >
          {cast.length > 0 ? (
            cast.map((actor) => (
              <MediaCard
                id={actor.id}
                title={actor.name}
                type="person"
                image={actor.profile_image}
              />
            ))
          ) : (
            <p>No cast available</p>
          )}
        </div>

        {awards.length > 0 && (
          <>
            <hr />
            <h4>Awards</h4>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                paddingBottom: "10px",
                paddingTop: "5px",
                whiteSpace: "nowrap"
              }}
            >
              {awards.map((a, idx) => (
                <AwardCard key={idx} award={a} />
              ))}
            </div>
          </>
        )}

        {seasons.length > 0 && (
          <>
            <hr />
            <h4>Seasons</h4>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                paddingBottom: "10px",
                paddingTop: "5px",
                whiteSpace: "nowrap"
              }}
            >
              {seasons.map((season) => (
                <SeasonCard key={season.id} season={season} />
              ))}
            </div>
          </>
        )}

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

            <label>Attachments</label>
            <input type="file" className="form-control mb-3" multiple disabled />

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

export default MediaPage;