import React, { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating || !text.trim()) {
      setError("Please provide a rating and review text.");
      return;
    }
    await onSubmit({ rating, text });
    setRating("");
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      {error && <div className="alert alert-danger py-1 mb-2">{error}</div>}
      <div className="mb-2">
        <label className="form-label">Rating</label>
        <select
          className="form-select"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}★</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Review</label>
        <textarea
          className="form-control"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button className="btn btn-success w-100" type="submit">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
