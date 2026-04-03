import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import ReviewComposer from "./ReviewComposer";
import "../styles/CommentThread.css";

const API_BASE_URL = "http://localhost:5000/api";

const CommentThread = ({ mediaId, seasonId, episodeId, currentUserId, inAdminMode }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [mediaId, seasonId, episodeId]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = "";
      if (mediaId) {
        endpoint = `${API_BASE_URL}/review/media/${mediaId}?userId=${currentUserId}`;
      } else if (seasonId) {
        endpoint = `${API_BASE_URL}/review/season/${seasonId}?userId=${currentUserId}`;
      } else if (episodeId) {
        endpoint = `${API_BASE_URL}/review/episode/${episodeId}?userId=${currentUserId}`;
      } else {
        setError("No media, season, or episode ID provided");
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (description, starPoint, attachments) => {
    try {
      const payload = {
        userId: currentUserId,
        description,
        starPoint: starPoint || null,
        attachments: attachments || [],
      };

      if (mediaId) payload.mediaId = mediaId;
      if (seasonId) payload.seasonId = seasonId;
      if (episodeId) payload.episodeId = episodeId;

      const response = await fetch(`${API_BASE_URL}/review/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setShowComposer(false);
      } else {
        setError(data.error || "Failed to create review");
      }
    } catch (err) {
      console.error("Error creating review:", err);
      setError("Failed to create review");
    }
  };

  const handleReply = async (parentId, replyText, isReplyToReply = false, attachmentUrls = []) => {
    try {
      const payload = {
        userId: currentUserId,
        description: replyText,
        attachments: attachmentUrls,
      };

      if (isReplyToReply) {
        payload.parentReplyId = parentId;
      } else {
        payload.parentReviewId = parentId;
      }

      const response = await fetch(`${API_BASE_URL}/reply/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        await fetchReviews();
      } else {
        setError(data.error || "Failed to create reply");
      }
    } catch (err) {
      console.error("Error creating reply:", err);
      setError("Failed to create reply");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ userId: currentUserId, isAdmin: inAdminMode }),
      });

      const data = await response.json();

      if (data.success) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      } else {
        setError(data.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review");
    }
  };

  const handleDeleteReply = async (replyId) => {
    console.log("handleDeleteReply called with replyId:", replyId, "userId:", currentUserId, "isAdmin:", inAdminMode);
    try {
      const response = await fetch(`${API_BASE_URL}/reply/${replyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ userId: currentUserId, isAdmin: inAdminMode }),
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (data.success) {
        await fetchReviews();
      } else {
        setError(data.error || "Failed to delete reply");
      }
    } catch (err) {
      console.error("Error deleting reply:", err);
      setError("Failed to delete reply");
    }
  };

  const handleVote = async (itemId, voteType, isReply = false) => {
    try {
      // Helper to find item recursively
      const findItem = (items, targetId, isTarget) => {
        for (let item of items) {
          // Check if this item matches: correct ID and correct type
          const itemIsReply = item.type === 'reply';
          if (item.id === targetId && itemIsReply === isTarget) {
            return item;
          }
          // Recursively search nested replies
          if (item.replies && item.replies.length > 0) {
            const found = findItem(item.replies, targetId, isTarget);
            if (found) return found;
          }
        }
        return null;
      };

      const item = findItem(reviews, itemId, isReply);
      if (!item) {
        console.warn(`Item not found: ${isReply ? 'reply' : 'review'} id=${itemId}`);
        return;
      }

      let voteToSend = voteType;
      if (item.userVote === voteType) voteToSend = "remove";

      // Update UI optimistically
      const updateReviewsRecursive = (items, targetId, updated, isTarget) => {
        return items.map((r) => {
          const itemIsReply = r.type === 'reply';
          if (r.id === targetId && itemIsReply === isTarget) {
            return updated;
          }
          if (r.replies && r.replies.length > 0) {
            return { ...r, replies: updateReviewsRecursive(r.replies, targetId, updated, isTarget) };
          }
          return r;
        });
      };

      let upDelta = 0, downDelta = 0;
      if (item.userVote === voteType) {
        if (voteType === "upvote") upDelta = -1;
        if (voteType === "downvote") downDelta = -1;
      } else if (item.userVote) {
        if (item.userVote === "upvote") upDelta = -1;
        if (item.userVote === "downvote") downDelta = -1;
        if (voteType === "upvote") upDelta += 1;
        if (voteType === "downvote") downDelta += 1;
      } else {
        if (voteType === "upvote") upDelta = 1;
        if (voteType === "downvote") downDelta = 1;
      }

      setReviews(updateReviewsRecursive(reviews, itemId, {
        ...item,
        upvote: item.upvote + upDelta,
        downvote: item.downvote + downDelta,
        userVote: voteToSend === "remove" ? null : voteType
      }, isReply));

      const endpoint = isReply ? `${API_BASE_URL}/reply/vote/${itemId}` : `${API_BASE_URL}/review/vote/${itemId}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ userId: currentUserId, voteType: voteToSend }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.error || "Failed to vote");
        await fetchReviews();
      }
    } catch (err) {
      console.error("Error voting:", err);
      setError("Failed to vote");
      await fetchReviews();
    }
  };

  if (loading) {
    return (
      <div className="comment-thread-container">
        <div className="loading-state">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="comment-thread-container">
      <div className="comments-section">
        <div className="comments-header">
          <h2 className="comments-title">Reviews & Comments</h2>
          <button 
            className="write-review-btn"
            onClick={() => setShowComposer(!showComposer)}
          >
            {showComposer ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {showComposer && (
          <ReviewComposer 
            onSubmit={handleCreateReview}
            onCancel={() => setShowComposer(false)}
            currentUserId={currentUserId}
          />
        )}

        {error && (
          <div className="error-message">
            {error}
            <button 
              className="close-error-btn"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews-state">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard 
                key={review.id}
                review={review}
                onReply={handleReply}
                onDeleteReview={handleDeleteReview}
                onDeleteReply={handleDeleteReply}
                onVote={handleVote}
                currentUserId={currentUserId}
                inAdminMode={inAdminMode}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentThread;
