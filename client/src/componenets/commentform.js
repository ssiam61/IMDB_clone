import React, { useState } from "react";
import "./reviewcomment.css";

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!text.trim()) {
      setError("Please enter a comment.");
      return;
    }

    if (text.trim().length < 3) {
      setError("Comment must be at least 3 characters long.");
      return;
    }

    setIsSubmitting(true);
    await onSubmit({ text });
    setText("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form-container">
      {error && <div className="form-alert alert-error">⚠️ {error}</div>}
      
      <div className="comment-input-wrapper">
        <span className="comment-icon">💭</span>
        <input
          className="comment-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          maxLength={500}
        />
        <button 
          className="btn-submit comment-submit" 
          type="submit"
          disabled={isSubmitting || !text.trim()}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
