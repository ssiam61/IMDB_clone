import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import EpisodeCard from "../components/EpisodeCard";

const SeasonPage = () => {
  const { id } = useParams();
  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [allSeasons, setAllSeasons] = useState([]);
  const [thisIndex, setThisIndex] = useState(null);

  useEffect(() => {
    const loadSeason = async () => {
      try {
        const seasonRes = await fetch(`http://localhost:5000/season/${id}`);
        const seasonData = await seasonRes.json();
        setSeason(seasonData);

        const seriesRes = await fetch("http://localhost:5000/series");
        const seriesData = await seriesRes.json();
        const thisSeries = seriesData.find(s => s.id === seasonData.series_id);

        if (thisSeries) {
        const allSeasonRes = await fetch("http://localhost:5000/season");
        const allSeasonData = await allSeasonRes.json();

        const seasonsForSeries = allSeasonData.filter(s => s.series_id === thisSeries.id);
        seasonsForSeries.sort((a, b) => a.number - b.number);

        setAllSeasons(seasonsForSeries);
        setThisIndex(seasonsForSeries.findIndex(s => s.id == id));
        }

        const epRes = await fetch("http://localhost:5000/episode");
        const epData = await epRes.json();
        setEpisodes(epData.filter(e => e.season_id == id));

      } catch (err) {
        console.error("Error loading season page:", err);
      }
    };

    loadSeason();
  }, [id]);

  if (!season) return <p>Loading...</p>;

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">
        <div className="text-center">
          <img
            src="/images/placeholder.png"
            alt="season"
            style={{
              width: "260px",
              height: "360px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />
          <h2 className="mt-3">Season {season.number}</h2>
          <div className="d-flex justify-content-center gap-3 mt-3">
            {thisIndex > 0 && (
                <button
                className="btn btn-outline-primary"
                onClick={() =>
                    window.location.href = `/season/${allSeasons[thisIndex - 1].id}`
                }
                >
                ← Previous Season
                </button>
            )}

            {thisIndex < allSeasons.length - 1 && (
                <button
                className="btn btn-outline-primary"
                onClick={() =>
                    window.location.href = `/season/${allSeasons[thisIndex + 1].id}`
                }
                >
                Next Season →
                </button>
            )}

            </div>
        </div>

        <div className="p-4 bg-light shadow-sm rounded my-4">
          <p><strong>IMDB Rating:</strong> {season.imdb_rating}</p>
          <p><strong>User Rating:</strong> {season.user_rating}</p>
        </div>

        <h4>Episodes</h4>

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
          {episodes.map(ep => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
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
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Your Review</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write something…"
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

export default SeasonPage;