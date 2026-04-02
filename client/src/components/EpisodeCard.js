import React from "react";
import { useNavigate } from "react-router-dom";
import "./EpisodeCard.css";

const EpisodeCard = ({ episode, onDelete, showDeleteButton = false }) => {
  const navigate = useNavigate();

  const goToEpisode = (e) => {
    if (e.target.closest('.delete-button')) {
      return;
    }
    navigate(`/episode/${episode.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this episode?")) {
      onDelete(episode.id);
    }
  };

  return (
    <div
      className="episode-card shadow-sm"
      onClick={goToEpisode}
      style={{ cursor: "pointer", width: "150px", position: "relative" }}
    >
      {showDeleteButton && (
        <button
          className="delete-button"
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255, 90, 126, 0.9)",
            border: "none",
            color: "#ffffff",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "100",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 90, 126, 1)";
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 90, 126, 0.9)";
            e.target.style.transform = "scale(1)";
          }}
        >
          ✕
        </button>
      )}
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
