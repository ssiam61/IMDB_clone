import React, { useEffect, useState } from "react";

const ProfileTab = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const userObj = JSON.parse(stored);
    setUser(userObj);
    // Fetch user info (in case it's updated)
    fetch(`http://localhost:5000/users/${userObj.id}`)
      .then(res => res.json())
      .then(setUser);
    // Fetch watchlist
    fetch("http://localhost:5000/watchlist")
      .then(res => res.json())
      .then(data => setWatchlist(data.filter(w => w.user_id === userObj.id)));
    // Fetch reviews
    fetch("http://localhost:5000/review")
      .then(res => res.json())
      .then(data => setReviews(data.filter(r => r.user_id === userObj.id)));
    // Fetch comments (replies)
    fetch("http://localhost:5000/reply")
      .then(res => res.json())
      .then(data => setComments(data.filter(c => c.user_id === userObj.id)));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="row mt-4">
      <div className="col-md-4 text-center">
        {user.profile_picture ? (
          <img src={user.profile_picture} alt="Profile" className="img-thumbnail mb-3" style={{maxWidth:200}} />
        ) : (
          <div className="mb-3">No profile picture</div>
        )}
        <h4>{user.name}</h4>
        <p className="text-muted">@{user.username}</p>
        <p>{user.email}</p>
      </div>
      <div className="col-md-8">
        <h5>Watchlist</h5>
        {watchlist.length === 0 ? <p className="text-muted">No items in watchlist.</p> : (
          <ul>
            {watchlist.map(w => <li key={w.media_id}>Media ID: {w.media_id}</li>)}
          </ul>
        )}
        <h5 className="mt-4">Reviews</h5>
        {reviews.length === 0 ? <p className="text-muted">No reviews yet.</p> : (
          <ul>
            {reviews.map(r => <li key={r.id}>Media ID: {r.media_id} — {r.description}</li>)}
          </ul>
        )}
        <h5 className="mt-4">Comments</h5>
        {comments.length === 0 ? <p className="text-muted">No comments yet.</p> : (
          <ul>
            {comments.map(c => <li key={c.id}>On Review/Reply ID: {c.parent_review_id || c.parent_reply_id} — {c.description}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
