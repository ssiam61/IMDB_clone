import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchWatchlist();
  }, [navigate]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/watchlist');
      setWatchlist(response.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load watchlist. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (mediaId) => {
    try {
      await api.delete(`/watchlist/${mediaId}`);
      setWatchlist(watchlist.filter((item) => item.id !== mediaId));
    } catch (err) {
      console.error('Remove from watchlist error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-3 border-white/20 border-t-[#E94560] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#A8A8B3]">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="relative overflow-hidden py-20 pt-28">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(233,69,96,0.1)] to-[rgba(15,15,15,0.9)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E94560] to-[#533483] rounded-full mix-blend-screen opacity-15 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            My Watchlist
          </h1>
          <p className="text-[#A8A8B3] text-xl max-w-2xl">
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {error && (
          <div className="mb-8 p-6 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm">
            {error}
          </div>
        )}

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-[#A8A8B3] opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 19V5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Watchlist is empty</h3>
            <p className="text-[#A8A8B3] mb-8 text-lg">
              Start adding movies to your watchlist to keep track of what you want to watch
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {watchlist.map((media, index) => (
              <div
                key={media.id}
                className="group glass-card overflow-hidden hover-glow hover-lift transition-all duration-300 animate-in fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Movie Poster */}
                {media.posterUrl && (
                  <div className="relative h-80 bg-gradient-to-br from-[#16213E] to-[#0F3460] overflow-hidden cursor-pointer">
                    <img
                      src={media.posterUrl}
                      alt={media.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110"
                      onClick={() => navigate(`/media/${media.id}`)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => navigate(`/media/${media.id}`)}
                        className="px-6 py-2 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.4)] transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Info Section */}
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#E94560] transition-colors">
                    {media.title}
                  </h3>

                  {/* Rating & Year */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F5C518] font-bold text-lg">
                        ⭐ {media.imdbRating ? media.imdbRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    {media.releaseYear && (
                      <span className="text-[#A8A8B3] text-sm px-3 py-1 bg-white/5 rounded-full">
                        {media.releaseYear}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[#A8A8B3] text-sm line-clamp-2 mb-4">
                    {media.description}
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWatchlist(media.id)}
                    className="w-full bg-red-500/15 border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/25 hover:border-red-500/50 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
