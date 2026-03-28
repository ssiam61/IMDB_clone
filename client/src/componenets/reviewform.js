import React, { useState } from "react";
import "./reviewcomment.css";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!rating || !text.trim()) {
      setError("Please provide a rating and review text.");
      return;
    }

    if (text.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    await onSubmit({ rating, text });
    setRating(0);
    setText("");
    setSuccess("Review posted successfully!");
    setIsSubmitting(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form-container">
      {error && <div className="form-alert alert-error">⚠️ {error}</div>}
      {success && <div className="form-alert alert-success">✓ {success}</div>}
      
      <div className="form-section">
        <label className="form-label">★ Rating</label>
        <div className="star-rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-btn ${star <= (hoverRating || rating) ? "active" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              title={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
          {rating > 0 && <span className="rating-text">{rating}/5</span>}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">💬 Write Your Review</label>
        <textarea
          className="form-textarea"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what you think about this movie/series. Be honest and helpful!"
          maxLength={1000}
        />
        <div className="char-count">{text.length}/1000</div>
      </div>

      <button 
        className="btn-submit review-submit" 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
