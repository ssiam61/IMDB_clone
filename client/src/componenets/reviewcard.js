import React from "react";
import "./reviewcomment.css";

const ReviewCard = ({ username, rating, text, date }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "excellent";
    if (rating >= 3) return "good";
    if (rating >= 2) return "average";
    return "poor";
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <h5 className="username">{username || "Anonymous"}</h5>
            <span className="review-date">{formatDate(date)}</span>
          </div>
        </div>
        <div className={`rating-badge ${getRatingColor(rating)}`}>
          <span className="star-display">★</span>
          <span className="rating-number">{rating}</span>
        </div>
      </div>
      
      <div className="review-content">
        <p className="review-text">{text}</p>
      </div>

      <div className="review-footer">
        <button className="action-btn">👍 Helpful</button>
        <button className="action-btn">👎 Not Helpful</button>
      </div>
    </div>
  );
};

export default ReviewCard;
