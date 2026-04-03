import React, { useState } from "react";
import "../styles/ReviewCard.css";

const ReviewCard = ({ review, onReply, onDelete, onVote, currentUserId }) => {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      onDelete(review.id);
    }
  };

  const handleVoteClick = (voteType) => {
    onVote(review.id, voteType, false);
  };

  const isOwnReview = currentUserId === review.user_id;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user-info">
          <img 
            src={review.profile_picture || "https://via.placeholder.com/40"} 
            alt={review.username}
            className="review-profile-pic"
          />
          <div className="review-user-meta">
            <span className="review-username">{review.username}</span>
            <span className="review-time">{formatDate(review.created_at)}</span>
          </div>
        </div>
        {isOwnReview && (
          <button 
            className="review-delete-btn"
            onClick={handleDeleteClick}
            title="Delete review"
          >
            ✕
          </button>
        )}
      </div>

      {review.star_point && (
        <div className="review-rating">
          {"★".repeat(Math.min(review.star_point, 5))} {review.star_point}/10
        </div>
      )}

      <div className="review-content">
        {review.description}
      </div>

      {review.attachments && review.attachments.length > 0 && (
        <div className="review-attachments">
          {review.attachments.map((attachment, idx) => (
            <img 
              key={idx} 
              src={attachment} 
              alt={`Attachment ${idx + 1}`}
              className="review-attachment-img"
            />
          ))}
        </div>
      )}

      <div className="review-actions">
        <div className="review-votes">
          <button 
            className="vote-btn upvote"
            onClick={() => handleVoteClick("upvote")}
            title="Upvote"
          >
            👍 {review.upvote}
          </button>
          <button 
            className="vote-btn downvote"
            onClick={() => handleVoteClick("downvote")}
            title="Downvote"
          >
            👎 {review.downvote}
          </button>
        </div>
        <button 
          className="reply-btn"
          onClick={() => setShowReplyComposer(!showReplyComposer)}
        >
          Reply
        </button>
      </div>

      {showReplyComposer && (
        <div className="reply-composer">
          <textarea 
            className="reply-input"
            placeholder="Write a reply..."
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowReplyComposer(false);
            }}
          />
          <button 
            className="submit-reply-btn"
            onClick={() => {
              const textarea = document.querySelector(".reply-input");
              if (textarea.value.trim()) {
                onReply(review.id, textarea.value);
                textarea.value = "";
                setShowReplyComposer(false);
              }
            }}
          >
            Post Reply
          </button>
          <button 
            className="cancel-reply-btn"
            onClick={() => setShowReplyComposer(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className="review-replies">
          <button 
            className="toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide" : "Show"} {review.replies.length} {review.replies.length === 1 ? "reply" : "replies"}
          </button>
          {showReplies && (
            <ReplyThread 
              replies={review.replies}
              parentReviewId={review.id}
              onReply={onReply}
              onDelete={onDelete}
              onVote={onVote}
              currentUserId={currentUserId}
              depth={0}
            />
          )}
        </div>
      )}
    </div>
  );
};

const ReplyThread = ({ replies, parentReviewId, onReply, onDelete, onVote, currentUserId, depth }) => {
  return (
    <div className="reply-thread" style={{ marginLeft: `${depth * 24}px` }}>
      {replies.map((reply) => (
        <ReplyCard 
          key={reply.id}
          reply={reply}
          parentReviewId={parentReviewId}
          onReply={onReply}
          onDelete={onDelete}
          onVote={onVote}
          currentUserId={currentUserId}
          depth={depth}
        />
      ))}
    </div>
  );
};

const ReplyCard = ({ reply, parentReviewId, onReply, onDelete, onVote, currentUserId, depth }) => {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      onDelete(reply.id);
    }
  };

  const handleVoteClick = (voteType) => {
    onVote(reply.id, voteType, true);
  };

  const isOwnReply = currentUserId === reply.user_id;

  return (
    <div className="reply-card" style={{ marginLeft: `${depth * 24}px` }}>
      <div className="reply-header">
        <div className="reply-user-info">
          <img 
            src={reply.profile_picture || "https://via.placeholder.com/40"} 
            alt={reply.username}
            className="reply-profile-pic"
          />
          <div className="reply-user-meta">
            <span className="reply-username">{reply.username}</span>
            <span className="reply-time">{formatDate(reply.created_at)}</span>
          </div>
        </div>
        {isOwnReply && (
          <button 
            className="reply-delete-btn"
            onClick={handleDeleteClick}
            title="Delete reply"
          >
            ✕
          </button>
        )}
      </div>

      <div className="reply-content">
        {reply.description}
      </div>

      {reply.attachments && reply.attachments.length > 0 && (
        <div className="reply-attachments">
          {reply.attachments.map((attachment, idx) => (
            <img 
              key={idx} 
              src={attachment} 
              alt={`Attachment ${idx + 1}`}
              className="reply-attachment-img"
            />
          ))}
        </div>
      )}

      <div className="reply-actions">
        <div className="reply-votes">
          <button 
            className="vote-btn upvote"
            onClick={() => handleVoteClick("upvote")}
            title="Upvote"
          >
            👍 {reply.upvote}
          </button>
          <button 
            className="vote-btn downvote"
            onClick={() => handleVoteClick("downvote")}
            title="Downvote"
          >
            👎 {reply.downvote}
          </button>
        </div>
        <button 
          className="reply-to-reply-btn"
          onClick={() => setShowReplyComposer(!showReplyComposer)}
        >
          Reply
        </button>
      </div>

      {showReplyComposer && (
        <div className="nested-reply-composer">
          <textarea 
            className="nested-reply-input"
            placeholder="Write a reply..."
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowReplyComposer(false);
            }}
          />
          <button 
            className="submit-nested-reply-btn"
            onClick={() => {
              const textarea = document.querySelector(".nested-reply-input");
              if (textarea.value.trim()) {
                onReply(reply.id, textarea.value, true);
                textarea.value = "";
                setShowReplyComposer(false);
              }
            }}
          >
            Post Reply
          </button>
          <button 
            className="cancel-nested-reply-btn"
            onClick={() => setShowReplyComposer(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {reply.replies && reply.replies.length > 0 && (
        <div className="nested-replies">
          <button 
            className="toggle-nested-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide" : "Show"} {reply.replies.length} {reply.replies.length === 1 ? "reply" : "replies"}
          </button>
          {showReplies && (
            <ReplyThread 
              replies={reply.replies}
              parentReviewId={parentReviewId}
              onReply={onReply}
              onDelete={onDelete}
              onVote={onVote}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
