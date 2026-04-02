import React from "react";
import { useNavigate } from "react-router-dom";

const SeasonCard = ({ season, onDelete, showDeleteButton = false }) => {
  const navigate = useNavigate();

  const goToSeason = (e) => {
    if (e.target.closest('.delete-button')) {
      return;
    }
    navigate(`/season/${season.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this season?")) {
      onDelete(season.id);
    }
  };

  return (
    <div
      className="season-card shadow-sm"
      onClick={goToSeason}
      style={{
        cursor: "pointer",
        width: "150px",
        transition: "transform 0.15s ease",
        position: "relative"
      }}
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
      <div className="season-card-image">
        <img
          src="/images/placeholder.png"
          alt={`Season ${season.number}`}
          className="img-fluid rounded"
        />
      </div>

      <p className="season-card-title mt-2 text-center">
        Season {season.number}
      </p>
    </div>
  );
};

export default SeasonCard;