import React from "react";
import "./AwardCard.css";

const AwardCard = ({ award }) => {
  return (
    <div className="award-card shadow-sm p-2 rounded" style={{ width: "160px" }}>
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