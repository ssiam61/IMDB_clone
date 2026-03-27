import React from "react";
import { useNavigate } from "react-router-dom";
import "./EpisodeCard.css";

const EpisodeCard = ({ episode }) => {
  const navigate = useNavigate();

  return (
    <div
      className="episode-card shadow-sm"
      onClick={() => navigate(`/episode/${episode.id}`)}
      style={{ cursor: "pointer", width: "150px" }}
    >
    <div className="episode-card-image">
        <img
            src="/images/placeholder.png"
            alt="Episode"
            className="img-fluid rounded"
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
    </div>

      <p className="episode-card-title mt-2 text-center">
        Episode {episode.number}
      </p>
    </div>
  );
};

export default EpisodeCard;
