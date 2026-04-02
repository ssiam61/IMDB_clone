import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/media');
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
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
          <p className="text-[#A8A8B3]">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(233,69,96,0.15)] to-[rgba(15,15,15,0.8)]"></div>
          <div className="absolute top-0 left-0 w-full h-full blur-3xl">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#E94560] to-[#533483] rounded-full mix-blend-screen opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-1/4 w-80 h-80 bg-gradient-to-bl from-[#0F3460] to-[#E94560] rounded-full mix-blend-screen opacity-15 animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Discover Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] via-[#533483] to-[#0F3460]">
              Next Favorite
            </span>
            <br />
            <span className="text-white">Movie</span>
          </h1>

          <p className="text-xl text-[#A8A8B3] mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore thousands of movies, rate them, and share your reviews with our community
          </p>

          {/* Search & CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex-1 sm:max-w-md glass-card-strong px-6 py-1 flex items-center rounded-full">
              <svg
                className="w-5 h-5 text-[#A8A8B3] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                className="flex-1 bg-transparent border-none text-white placeholder-[#A8A8B3] focus:outline-none py-3"
              />
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {error && (
          <div className="mb-8 p-6 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm">
            {error}
          </div>
        )}

        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#A8A8B3] text-lg">No movies available yet.</p>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-bold mb-8 text-white">Featured Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="group glass-card overflow-hidden hover-glow hover-lift animate-in fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Movie Poster */}
                  {movie.posterUrl && (
                    <div className="relative h-64 bg-gradient-to-br from-[#16213E] to-[#0F3460] overflow-hidden">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Info Section */}
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#E94560] transition-colors">
                      {movie.title}
                    </h3>

                    {/* Rating & Year */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5C518] font-bold text-lg">
                          ⭐ {movie.imdbRating ? movie.imdbRating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <span className="text-[#A8A8B3] text-sm px-3 py-1 bg-white/5 rounded-full">
                        {movie.releaseYear}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#A8A8B3] text-sm line-clamp-3 mb-4">
                      {movie.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-[#E94560] to-[#533483] text-white py-2 rounded-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.3)] transition-all duration-300 font-semibold text-sm">
                        View Details
                      </button>
                      <button className="flex-1 bg-white/10 border border-white/20 text-white py-2 rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold text-sm">
                        + Add List
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E94560]/10 to-[#533483]/10 opacity-50"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to rate and share?
          </h2>
          <p className="text-[#A8A8B3] mb-8 text-lg">
            Create an account to rate movies, build your watchlist, and share reviews with the community
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(233,69,96,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
