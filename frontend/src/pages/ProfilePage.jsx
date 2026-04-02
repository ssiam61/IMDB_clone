import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('watchlist');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserData(userId);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const [userRes, watchlistRes, reviewsRes] = await Promise.all([
        api.get(`/user/${userId}`),
        api.get(`/watchlist/${userId}`),
        api.get(`/review/user/${userId}`),
      ]);

      setUser(userRes.data);
      setWatchlist(watchlistRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError('Failed to load profile data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#E94560] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#A8A8B3]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitial = () => user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Profile Header */}
      <div className="relative overflow-hidden py-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[rgba(233,69,96,0.1)] to-[rgba(15,15,15,0.9)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E94560] to-[#533483] rounded-full mix-blend-screen opacity-20 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar with Gradient Ring */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#E94560] to-[#533483] rounded-full p-1">
                <div className="w-full h-full bg-[#16213E] rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] to-[#533483]">
                    {getInitial()}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-[#00B4D8] to-[#00B4D8] rounded-full flex items-center justify-center border-2 border-[#0F0F0F] cursor-pointer hover:ring-2 hover:ring-[#E94560] transition-all">
                <span className="text-lg">✎</span>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user?.username}
              </h1>
              <p className="text-[#A8A8B3] mb-1">{user?.email}</p>
              <p className="text-sm text-[#A8A8B3]">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-gradient-to-r from-[#E94560] to-[#533483] text-3xl font-bold mb-2">
                {watchlist.length}
              </div>
              <p className="text-[#A8A8B3] text-sm">In Watchlist</p>
            </div>
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-[#E94560] text-3xl font-bold mb-2">
                {reviews.length}
              </div>
              <p className="text-[#A8A8B3] text-sm">Reviews</p>
            </div>
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F3460] to-[#533483] text-3xl font-bold mb-2">
                {Math.floor(Math.random() * 50) + 1}
              </div>
              <p className="text-[#A8A8B3] text-sm">Following</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm">
            {error}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-4 font-semibold text-sm transition-all duration-300 border-b-2 ${
              activeTab === 'watchlist'
                ? 'text-white border-gradient-to-r from-[#E94560] to-[#533483] border-[#E94560]'
                : 'text-[#A8A8B3] border-transparent hover:text-white'
            }`}
          >
            My Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 font-semibold text-sm transition-all duration-300 border-b-2 ${
              activeTab === 'reviews'
                ? 'text-white border-gradient-to-r from-[#E94560] to-[#533483] border-[#E94560]'
                : 'text-[#A8A8B3] border-transparent hover:text-white'
            }`}
          >
            My Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'watchlist' && (
          <div className="animate-in fade-in">
            {watchlist.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-white mb-3">Your watchlist is empty</h3>
                <p className="text-[#A8A8B3] mb-6">
                  Start adding movies to keep track of what you want to watch
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
                >
                  Explore Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {watchlist.map((item, index) => (
                  <div
                    key={item.id}
                    className="glass-card overflow-hidden hover-glow hover-lift transition-all duration-300 animate-in fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-56 bg-gradient-to-br from-[#16213E] to-[#0F3460] overflow-hidden group">
                      {item.posterUrl && (
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-[#E94560] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[#F5C518] font-bold">⭐ {item.imdbRating?.toFixed(1) || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-in fade-in">
            {reviews.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-white mb-3">No reviews yet</h3>
                <p className="text-[#A8A8B3] mb-6">
                  Share your thoughts about the movies you've watched
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
                >
                  Explore Movies
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="glass-card p-6 hover-glow transition-all duration-300 animate-in fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#E94560] transition-colors">
                          {review.movieTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[#F5C518] font-bold text-lg">
                            ⭐ {review.rating}/10
                          </span>
                          <span className="badge">{Math.floor(Math.random() * 100) + 1} helpful</span>
                        </div>
                      </div>
                      <p className="text-[#A8A8B3] text-sm">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <p className="text-[#EAEAEA] leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
