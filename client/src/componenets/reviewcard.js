import React from "react";

const ReviewCard = ({ username, rating, text, date }) => (
  <div className="card mb-3">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0">{username}</h6>
        <span className="badge bg-primary">{rating}★</span>
      </div>
      <p className="mb-1">{text}</p>
      <small className="text-muted">{date}</small>
    </div>
  </div>
);

export default ReviewCard;
