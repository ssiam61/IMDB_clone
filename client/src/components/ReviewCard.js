import React, { useState } from "react";
import "../styles/ReviewCard.css";
import ReplyComposer from "./ReplyComposer";


const ReviewCard = ({
  review,
  onReply,
  onDeleteReview,
  onDeleteReply,
  onVote,
  currentUserId,
  inAdminMode
}) => {

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
      onDeleteReview(review.id);
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
        {(isOwnReview || inAdminMode) && (
          <button 
            className="review-delete-btn"
            onClick={handleDeleteClick}
            title={isOwnReview ? "Delete review" : "Delete review (Admin)"}
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
            className={`vote-btn upvote ${review.userVote === "upvote" ? "active" : ""}`}
            onClick={() => handleVoteClick("upvote")}
            title="Upvote"
          >
            👍 {review.upvote}
          </button>
          <button 
            className={`vote-btn downvote ${review.userVote === "downvote" ? "active" : ""}`}
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
        <ReplyComposer
          onSubmit={(description, attachmentUrls) => {
            onReply(review.id, description, false, attachmentUrls);
            setShowReplyComposer(false);
          }}
          onCancel={() => setShowReplyComposer(false)}
          placeholder="Write a reply to this review..."
        />
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
            onDeleteReply={onDeleteReply}
            onVote={onVote}
            currentUserId={currentUserId}
            inAdminMode={inAdminMode}
            depth={0}
          />

          )}
        </div>
      )}
    </div>
  );
};

const ReplyThread = ({
  replies,
  parentReviewId,
  onReply,
  onDeleteReply,
  onVote,
  currentUserId,
  inAdminMode,
  depth
}) => {
  return (
    <div className="reply-thread" style={{ marginLeft: `${depth * 24}px` }}>
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          parentReviewId={parentReviewId}
          onReply={onReply}
          onDeleteReply={onDeleteReply}
          onVote={onVote}
          currentUserId={currentUserId}
          inAdminMode={inAdminMode}
          depth={depth}
        />
      ))}
    </div>
  );
};


const ReplyCard = ({
  reply,
  parentReviewId,
  onReply,
  onDeleteReply,
  onVote,
  currentUserId,
  inAdminMode,
  depth
}) => {

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
    console.log("Delete clicked for reply:", reply.id);
    if (window.confirm("Are you sure you want to delete this reply?")) {
      console.log("Confirmed delete, calling onDeleteReply");
      onDeleteReply(reply.id);
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
        {(isOwnReply || inAdminMode) && (
          <button 
            className="reply-delete-btn"
            onClick={handleDeleteClick}
            title={isOwnReply ? "Delete reply" : "Delete reply (Admin)"}
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
            className={`vote-btn upvote ${reply.userVote === "upvote" ? "active" : ""}`}
            onClick={() => handleVoteClick("upvote")}
            title="Upvote"
          >
            👍 {reply.upvote}
          </button>
          <button 
            className={`vote-btn downvote ${reply.userVote === "downvote" ? "active" : ""}`}
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
        <ReplyComposer
          onSubmit={(description, attachmentUrls) => {
            onReply(reply.id, description, true, attachmentUrls);
            setShowReplyComposer(false);
          }}
          onCancel={() => setShowReplyComposer(false)}
          placeholder="Write a reply to this thread..."
        />
      )}

      {reply.replies && reply.replies.length > 0 && (
        <div className="nested-replies">
          <button
            className="toggle-nested-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide" : "Show"} {reply.replies.length}{" "}
            {reply.replies.length === 1 ? "reply" : "replies"}
          </button>

          {showReplies && (
            <ReplyThread
              replies={reply.replies}          // ✅ FIXED
              parentReviewId={parentReviewId}  // ✅ FIXED
              onReply={onReply}
              onDeleteReply={onDeleteReply}
              onVote={onVote}
              currentUserId={currentUserId}
              inAdminMode={inAdminMode}
              depth={depth + 1}                // ✅ FIXED
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
