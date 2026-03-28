import React from "react";
import "./reviewcomment.css";

const CommentCard = ({ username, text, date }) => {
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

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-user">
          <span className="comment-avatar">💬</span>
          <div className="comment-meta">
            <span className="comment-username">{username || "Anonymous"}</span>
            <span className="comment-time">{formatDate(date)}</span>
          </div>
        </div>
      </div>
      
      <div className="comment-body">
        <p className="comment-text">{text}</p>
      </div>

      <div className="comment-actions">
        <button className="comment-action-btn">👍</button>
        <button className="comment-action-btn">👎</button>
      </div>
    </div>
  );
};

export default CommentCard;
