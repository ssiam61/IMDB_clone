import React from "react";
import { useNavigate } from "react-router-dom";

const SeasonCard = ({ season }) => {
  const navigate = useNavigate();

  return (
    <div
      className="season-card shadow-sm"
      onClick={() => navigate(`/season/${season.id}`)}
      style={{
        cursor: "pointer",
        width: "150px",
        transition: "transform 0.15s ease"
      }}
    >
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