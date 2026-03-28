import React, { useEffect, useState } from "react";
import "./profiletab.css";

const ProfileTab = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [watchlistMedia, setWatchlistMedia] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    
    const userObj = JSON.parse(stored);
    setUser(userObj);

    // Fetch user info
    fetch(`http://localhost:5000/users/${userObj.id}`)
      .then(res => res.json())
      .then(setUser)
      .catch(err => console.error("Failed to fetch user:", err));

    // Fetch watchlist
    fetch("http://localhost:5000/watchlist")
      .then(res => res.json())
      .then(data => {
        const userWatchlist = data.filter(w => w.user_id === userObj.id);
        setWatchlist(userWatchlist);
        
        // Fetch media details for watchlist items
        userWatchlist.forEach(item => {
          fetch(`http://localhost:5000/media/${item.media_id}`)
            .then(res => res.json())
            .then(mediaData => {
              setWatchlistMedia(prev => ({
                ...prev,
                [item.media_id]: mediaData
              }));
            })
            .catch(err => console.error("Failed to fetch media:", err));
        });
      })
      .catch(err => console.error("Failed to fetch watchlist:", err));

    // Fetch reviews
    fetch("http://localhost:5000/review")
      .then(res => res.json())
      .then(data => {
        const userReviews = data.filter(r => r.user_id === userObj.id);
        setReviews(userReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      })
      .catch(err => console.error("Failed to fetch reviews:", err));

    // Fetch comments
    fetch("http://localhost:5000/reply")
      .then(res => res.json())
      .then(data => {
        const userComments = data.filter(c => c.user_id === userObj.id);
        setComments(userComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      })
      .catch(err => console.error("Failed to fetch comments:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">Unable to load profile</div>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={user.name} className="avatar-image" />
            ) : (
              <div className="avatar-initials">{getInitials(user.name)}</div>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-email">📧 {user.email}</p>
            <p className="profile-joined">📅 Joined {formatDate(user.created_at)}</p>
          </div>

          <div className="profile-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">Member</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{watchlist.length}</div>
          <div className="stat-label">Watchlist</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reviews.length}</div>
          <div className="stat-label">Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{comments.length}</div>
          <div className="stat-label">Comments</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <span className="tab-icon">📊</span> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
          onClick={() => setActiveTab("watchlist")}
        >
          <span className="tab-icon">🎬</span> Watchlist
        </button>
        <button
          className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <span className="tab-icon">⭐</span> Reviews
        </button>
        <button
          className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          <span className="tab-icon">💬</span> Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {reviews.length > 0 && (
                    <div className="activity-item">
                      <span className="activity-icon">⭐</span>
                      <div>
                        <p className="activity-title">Posted a review</p>
                        <p className="activity-date">{formatDate(reviews[0].created_at)}</p>
                      </div>
                    </div>
                  )}
                  {comments.length > 0 && (
                    <div className="activity-item">
                      <span className="activity-icon">💬</span>
                      <div>
                        <p className="activity-title">Posted a comment</p>
                        <p className="activity-date">{formatDate(comments[0].created_at)}</p>
                      </div>
                    </div>
                  )}
                  {watchlist.length > 0 && (
                    <div className="activity-item">
                      <span className="activity-icon">🎬</span>
                      <div>
                        <p className="activity-title">Added to watchlist</p>
                        <p className="activity-date">Latest item</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>Account Info</h3>
                <ul className="info-list">
                  <li>
                    <span className="info-label">Username:</span>
                    <span className="info-value">@{user.username}</span>
                  </li>
                  <li>
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email}</span>
                  </li>
                  <li>
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">{formatDate(user.created_at)}</span>
                  </li>
                  <li>
                    <span className="info-label">Account Status:</span>
                    <span className="info-value">{user.is_banned ? "Banned" : "Active"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === "watchlist" && (
          <div className="tab-content">
            {watchlist.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎬</span>
                <h3>No items in watchlist</h3>
                <p>Start adding movies and series to your watchlist!</p>
              </div>
            ) : (
              <div className="watchlist-grid">
                {watchlist.map(item => {
                  const media = watchlistMedia[item.media_id];
                  return (
                    <div key={item.media_id} className="watchlist-card">
                      {media?.teaser_link && (
                        <div className="watchlist-image">
                          <img src={media.teaser_link} alt={media.name} />
                        </div>
                      )}
                      <div className="watchlist-info">
                        <h4 className="watchlist-title">{media?.name || `Media ${item.media_id}`}</h4>
                        {media?.imdb_rating && (
                          <p className="watchlist-rating">★ {media.imdb_rating}/10</p>
                        )}
                        <p className="watchlist-desc">{media?.description?.substring(0, 100)}...</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="tab-content">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⭐</span>
                <h3>No reviews yet</h3>
                <p>Share your thoughts about movies and series!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-rating">
                        <span className="stars">★</span>
                        <span className="rating-num">{review.star_point}</span>
                      </div>
                      <span className="review-date">{formatDate(review.created_at)}</span>
                    </div>
                    <p className="review-text">{review.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="tab-content">
            {comments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">💬</span>
                <h3>No comments yet</h3>
                <p>Join discussions and comment on reviews!</p>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="comment-text">{comment.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
