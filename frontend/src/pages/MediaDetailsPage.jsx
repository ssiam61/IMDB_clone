import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReplyItem from '../components/ReplyItem';

export default function MediaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [formData, setFormData] = useState({ starPoint: 5, description: '' });
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    fetchMediaDetails();
  }, [id]);

  const fetchMediaDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const mediaRes = await api.get(`/media/${id}`);
      setMedia(mediaRes.data);

      try {
        const reviewsRes = await api.get(`/reviews/media/${id}`);
        console.log("REVIEWS API RESPONSE:", reviewsRes.data);
        setReviews(reviewsRes.data || []);
        console.log("STATE REVIEWS:", reviewsRes.data);
      } catch (reviewErr) {
        console.warn('Failed to fetch reviews:', reviewErr);
        setReviews([]);
      }
    } catch (err) {
      setError('Failed to load media details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (formData.description.trim().length === 0) {
      setReviewError('Please enter a review description');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');

      await api.post('/reviews', {
        media_id: id,
        star_point: parseInt(formData.starPoint),
        description: formData.description,
      });

      setFormData({ starPoint: 5, description: '' });
      await fetchMediaDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
      console.error('Review submission error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setAddingToWatchlist(true);
      await api.post('/watchlist', {
        mediaId: id,
      });
      console.log('Added to watchlist');
    } catch (err) {
      console.error('Watchlist error:', err);
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#E94560] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#A8A8B3]">Loading media details...</p>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-4">Media Not Found</h2>
          <p className="text-[#A8A8B3] mb-6">
            The media you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header with Background */}
      <div className="relative overflow-hidden pt-20 pb-32">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(233,69,96,0.15)] to-[rgba(15,15,15,0.95)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E94560] to-[#533483] rounded-full mix-blend-screen opacity-15 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="mb-8 inline-flex items-center gap-2 text-[#A8A8B3] hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Movies
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            {media.posterUrl && (
              <div className="md:w-72 flex-shrink-0">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={media.posterUrl}
                    alt={media.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {media.title || media.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#F5C518] text-3xl">⭐</span>
                  <div>
                    <p className="text-4xl font-bold text-white">
                      {media.imdbRating ? media.imdbRating.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-[#A8A8B3] text-sm">/{reviews.length} reviews</p>
                  </div>
                </div>

                {media.releaseYear && (
                  <div className="h-12 w-px bg-white/20"></div>
                )}

                {media.releaseYear && (
                  <div>
                    <p className="text-[#A8A8B3] text-sm mb-1">Release Year</p>
                    <p className="text-2xl font-bold text-white">{media.releaseYear}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <p className="text-[#EAEAEA] text-lg leading-relaxed max-w-2xl">
                {media.description}
              </p>

              <button
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-[#533483] to-[#0F3460] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(83,52,131,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                {addingToWatchlist ? 'Adding...' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Add Review Form */}
        {isLoggedIn ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Share Your Review</h2>
            <div className="glass-card p-8 max-w-2xl">
              <form onSubmit={handleSubmitReview}>
                {/* Star Rating */}
                <div className="mb-8">
                  <label className="block text-white font-semibold mb-4">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, starPoint: star })
                          }
                          className={`text-3xl transition-transform duration-200 ${
                            star <= formData.starPoint
                              ? 'text-[#F5C518] scale-110'
                              : 'text-[#A8A8B3] hover:scale-105'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <span className="text-white font-bold ml-4">
                      {formData.starPoint}/10
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Share your thoughts about this movie..."
                    rows="5"
                    className="w-full bg-[#16213E] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:ring-1 focus:ring-[#E94560] transition-all resize-none"
                  />
                </div>

                {reviewError && (
                  <div className="mb-6 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {reviewError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="mb-16 glass-card p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">Want to Share Your Review?</h3>
            <p className="text-[#A8A8B3] mb-6">
              Sign in to your account to rate and review this movie.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#A8A8B3] text-lg">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="glass-card p-6 hover-glow transition-all duration-300 animate-in fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Review Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-semibold">
                        {review.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#F5C518]">
                          ⭐ {review.star_point || 0}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-[#A8A8B3] text-sm">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Recently'}
                    </p>
                  </div>

                  {/* Review Content */}
                  <p className="text-[#EAEAEA] leading-relaxed mb-4">
                    {review.description}
                  </p>

                  {/* Voting Section */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className="text-[#A8A8B3] text-sm flex items-center gap-3">
                      <span>👍 {review.upvote || 0}</span>
                      <span>👎 {review.downvote || 0}</span>
                    </div>

                    {isLoggedIn && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                        className="ml-auto px-4 py-2 text-sm text-[#E94560] hover:text-white transition-colors rounded hover:bg-white/5"
                      >
                        + Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {isLoggedIn && replyingTo === review.id && (
                    <ReplyForm
                      onSubmit={async (text) => {
                        try {
                          await api.post('/reviews/reply', {
                            parent_review_id: review.id,
                            description: text
                          });
                          setReplyingTo(null);
                          await fetchMediaDetails();
                        } catch (err) {
                          console.error('Reply error:', err);
                        }
                      }}
                      onCancel={() => setReplyingTo(null)}
                    />
                  )}

                  {/* Nested Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                      {review.replies.map((reply) => (
                        <ReplyItem
                          key={reply.id}
                          reply={reply}
                          depth={0}
                          onReplyAdded={fetchMediaDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reply form component
function ReplyForm({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-white/10">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        rows="3"
        className="w-full bg-[#16213E] border border-white/10 rounded px-4 py-3 text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:ring-1 focus:ring-[#E94560] transition-all resize-none"
      />
      <div className="flex gap-3 mt-3">
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="px-6 py-2 bg-gradient-to-r from-[#E94560] to-[#533483] text-white text-sm font-semibold rounded hover:shadow-[0_0_10px_rgba(233,69,96,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Reply'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-white/10 text-[#A8A8B3] text-sm font-semibold rounded hover:bg-white/20 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
