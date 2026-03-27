import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import AwardCard from "../components/AwardCard";
import SeasonCard from "../components/SeasonCard";

const MediaPage = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [awards, setAwards] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const mediaRes = await fetch(`http://localhost:5000/media/${id}`);
        const mediaData = await mediaRes.json();
        setMedia(mediaData);

        const mpRes = await fetch("http://localhost:5000/media_personality");
        const mpData = await mpRes.json();

        const personRes = await fetch("http://localhost:5000/person");
        const personData = await personRes.json();

        const directorLinks = mpData.filter(m => m.media_id == id && m.role === "director");
        const castLinks = mpData.filter(m => m.media_id == id && m.role === "actor");

        const directorData = directorLinks
        .map(link => personData.find(p => p.id === link.person_id))
        .filter(Boolean);

        const castData = castLinks
        .map(link => personData.find(p => p.id === link.person_id))
        .filter(Boolean);

        setDirectors(directorData);
        setCast(castData);

        const awardRes = await fetch("http://localhost:5000/media_award");
        const awardData = await awardRes.json();

        const awardInfoRes = await fetch("http://localhost:5000/award");
        const awardInfo = await awardInfoRes.json();

        const awardList = awardData
        .filter(a => a.media_id == id)
        .map(a => ({
            ...awardInfo.find(info => info.id === a.award_id),
            year: a.year
        }))
        .filter(Boolean);

        setAwards(awardList);

        const seriesRes = await fetch("http://localhost:5000/series");
        const seriesData = await seriesRes.json();

        const thisSeries = seriesData.find(s => s.media_id == id);

        if (thisSeries) {
            const seasonRes = await fetch("http://localhost:5000/season");
            const seasonData = await seasonRes.json();

            const filtered = seasonData.filter(season => season.series_id === thisSeries.id);
            setSeasons(filtered);
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
            src="/images/placeholder.png"
            alt="media"
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
          <p><strong>Teaser Link:</strong> <a href={media.teaser_link} target="_blank">{media.teaser_link}</a></p>
          <p><strong>Description:</strong></p>
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
            directors.map(dir => (
            <MediaCard key={dir.id} id={dir.id} title={dir.name} />
            ))
        ) : (
            <p>No director information available</p>
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
            cast.map(actor => (
            <MediaCard key={actor.id} id={actor.id} title={actor.name} type="person" />
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
            {awards.map((a, index) => (
                <AwardCard key={`award-${index}`} award={a} />
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
