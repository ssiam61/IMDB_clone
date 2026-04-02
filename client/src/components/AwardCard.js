import React from "react";
import "./AwardCard.css";

const AwardCard = ({ award, onDelete, showDeleteButton = false }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this award?")) {
      onDelete(award.id);
    }
  };

  return (
    <div className="award-card shadow-sm p-2 rounded" style={{ width: "160px", position: "relative" }}>
      {showDeleteButton && (
        <button
          className="delete-button"
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "rgba(255, 90, 126, 0.9)",
            border: "none",
            color: "#ffffff",
            fontSize: "16px",
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
      <h6 className="mb-1">{award.name}</h6>
      <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>
        {award.awarded_by}
      </p>
      <p className="mb-0" style={{ fontSize: "0.8rem" }}>
        Year: {award.year}
      </p>
    </div>
  );
};

export default AwardCard;