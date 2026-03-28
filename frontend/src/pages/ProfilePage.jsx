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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-900">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {user?.username}
              </h1>
              <p className="text-gray-400 mb-2">
                {user?.email}
              </p>
              <p className="text-gray-500 text-sm">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'watchlist'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {watchlist.map((item) => (
                  <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300">
                    <div className="relative h-48 bg-gray-700">
                      {item.posterUrl && (
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold line-clamp-2">{item.title}</h3>
                      <p className="text-yellow-400 font-bold mt-2">⭐ {item.imdbRating?.toFixed(1) || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">You haven't written any reviews yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Explore Movies
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{review.movieTitle}</h3>
                        <p className="text-yellow-400 font-bold">⭐ {review.rating}/10</p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
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
