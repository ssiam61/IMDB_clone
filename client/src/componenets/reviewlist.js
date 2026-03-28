import React, { useState } from "react";
import ReviewCard from "./reviewcard";
import "./reviewcomment.css";

const ReviewList = ({ reviews }) => {
  const [sortBy, setSortBy] = useState("recent");

  const getSortedReviews = () => {
    const sorted = [...reviews];
    if (sortBy === "recent") {
      return sorted.reverse();
    } else if (sortBy === "highest") {
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "lowest") {
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }
    return sorted;
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const sortedReviews = getSortedReviews();

  return (
    <div className="reviews-container">
      {reviews.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p className="empty-text">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <>
          <div className="reviews-header">
            <div className="reviews-stats">
              <div className="stat-item">
                <span className="stat-label">Reviews</span>
                <span className="stat-value">{reviews.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Rating</span>
                <span className="stat-value">★ {avgRating}</span>
              </div>
            </div>
            
            <div className="sort-controls">
              <label className="sort-label">Sort:</label>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="reviews-list">
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id || review.date + review.username} {...review} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;
