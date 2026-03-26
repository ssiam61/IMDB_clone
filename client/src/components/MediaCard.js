import React from "react";
import "./MediaCard.css";

const MediaCard = ({ title }) => {
  return (
    <div className="media-card shadow-sm">
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
