import React from "react";
import "./MediaCard.css";
import { useNavigate } from "react-router-dom";

const MediaCard = ({ title, id, type = "media" }) => {
  const navigate = useNavigate();

  const goTo = () => {
    if (type === "media") navigate(`/media/${id}`);
    else if (type === "person") navigate(`/person/${id}`);
  };

  return (
    <div className="media-card shadow-sm" onClick={goTo} style={{ cursor: "pointer" }}>
      <div className="media-card-image">
        <img
          src="/images/placeholder.png"
          alt={title}
          className="img-fluid rounded"
        />
      </div>
      <p className="media-card-title mt-2">{title}</p>
    </div>
  );
};

export default MediaCard;