import React from "react";
import "./MediaCard.css";
import { useNavigate } from "react-router-dom";

const MediaCard = ({ title, id, image, type = "media", onDelete, showDeleteButton = false }) => {
  const navigate = useNavigate();

  const goTo = (e) => {
    if (e.target.closest('.delete-button')) {
      return;
    }
    if (type === "media") navigate(`/media/${id}`);
    else if (type === "person") navigate(`/person/${id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this?")) {
      onDelete(id);
    }
  };

  return (
    <div
      className="media-card shadow-sm"
      onClick={goTo}
      style={{ cursor: "pointer", position: "relative" }}
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
      <div className="media-card-image">
        <img
          src={image || "/images/placeholder.png"}
          onError={(e) => (e.target.src = "/images/placeholder.png")}
          alt={title}
          className="img-fluid rounded"
        />
      </div>

      <p className="media-card-title mt-2">{title}</p>
    </div>
  );
};

export default MediaCard;