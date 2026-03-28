import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetail from "./moviedetail";
import ReviewList from "./reviewlist";
import ReviewForm from "./reviewform";
import CommentList from "./commentlist";
import CommentForm from "./commentform";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch complete media details with genres, cast, awards
        const response = await fetch(`http://localhost:5000/media/${id}/full`);
        if (!response.ok) throw new Error("Movie not found");
        const data = await response.json();
        setMovie(data);
        // Fetch reviews for this media
        const reviewsRes = await fetch("http://localhost:5000/review");
        const allReviews = await reviewsRes.json();
        const movieReviews = allReviews.filter(r => r.media_id === data.id);
        setReviews(movieReviews);
        // Fetch all comments (replies)
        const commentsRes = await fetch("http://localhost:5000/reply");
        const allComments = await commentsRes.json();
        setComments(allComments);
      } catch (err) {
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleReviewSubmit = async ({ rating, text }) => {
    if (!user) return;
    await fetch("http://localhost:5000/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        media_id: movie.id,
        star_point: rating,
        description: text
      })
    });
    // Refresh reviews
    const reviewsRes = await fetch("http://localhost:5000/review");
    const allReviews = await reviewsRes.json();
    setReviews(allReviews.filter(r => r.media_id === movie.id));
  };

  const handleCommentSubmit = async ({ text }) => {
    if (!user || !selectedReviewId) return;
    await fetch("http://localhost:5000/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        parent_review_id: selectedReviewId,
        description: text
      })
    });
    // Refresh comments
    const commentsRes = await fetch("http://localhost:5000/reply");
    const allComments = await commentsRes.json();
    setComments(allComments);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <MovieDetail movie={movie} />
      <div className="mt-4">
        <h4>Reviews</h4>
        <ReviewForm onSubmit={handleReviewSubmit} />
        <ReviewList
          reviews={reviews.map(r => ({
            username: r.user_id, // Optionally fetch username
            rating: r.star_point,
            text: r.description,
            date: r.created_at,
            ...r
          }))}
        />
        <h5 className="mt-4">Comments</h5>
        <div className="mb-2">
          <label>Select a review to comment on:</label>
          <select
            className="form-select"
            value={selectedReviewId || ""}
            onChange={e => setSelectedReviewId(Number(e.target.value))}
          >
            <option value="">Choose review</option>
            {reviews.map(r => (
              <option key={r.id} value={r.id}>
                {r.description?.slice(0, 30) || r.id}
              </option>
            ))}
          </select>
        </div>
        <CommentForm onSubmit={handleCommentSubmit} />
        <CommentList
          comments={comments
            .filter(c => c.parent_review_id && reviews.some(r => r.id === c.parent_review_id))
            .map(c => ({
              username: c.user_id, // Optionally fetch username
              text: c.description,
              date: c.created_at,
              ...c
            }))}
        />
      </div>
    </div>
  );
};

export default MovieDetailPage;
