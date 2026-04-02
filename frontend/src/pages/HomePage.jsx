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

  // Format duration helper (e.g., 142 minutes -> "2h 28m")
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
                  className="group h-full cursor-pointer animate-in fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/media/${movie.id}`)}
                >
                  {/* Card Container */}
                  <div className="relative h-full rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(233,69,96,0.3)] hover:scale-105 bg-gradient-to-br from-[#16213E] to-[#0F3460]">
                    
                    {/* Image/Background Section */}
                    <div className="relative h-48 bg-gradient-to-br from-[#16213E] to-[#0F3460] overflow-hidden">
                      {/* Placeholder or image background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E94560]/20 to-[#533483]/20"></div>
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F3460] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Video icon or play button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l5.5 3.5A.75.75 0 0114 10.5v-1a.75.75 0 00-1.126-.659l-3.874 2.409v-2.5a.75.75 0 00-1.126-.659l-2.5 1.5a.75.75 0 00.252 1.325z" />
                        </svg>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col h-full">
                      
                      {/* Title & Rating */}
                      <div className="mb-4">
                        <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-[#E94560] transition-colors mb-2">
                          {movie.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[#F5C518] font-bold text-lg">⭐</span>
                          <span className="text-white font-semibold">{movie.imdbRating ? movie.imdbRating.toFixed(1) : 'N/A'}</span>
                          {movie.userRating && (
                            <span className="text-[#A8A8B3] text-sm">({movie.userRating.toFixed(1)})</span>
                          )}
                        </div>
                      </div>

                      {/* Genres as pills */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {movie.genres.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className="inline-block text-xs px-2.5 py-1 bg-[#E94560]/20 text-[#E94560] rounded-full border border-[#E94560]/30">
                              {genre}
                            </span>
                          ))}
                          {movie.genres.length > 3 && (
                            <span className="inline-block text-xs px-2.5 py-1 bg-white/5 text-[#A8A8B3] rounded-full border border-white/10">
                              +{movie.genres.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Duration & Director */}
                      <div className="mb-4 space-y-1 text-xs text-[#A8A8B3]">
                        {movie.duration && (
                          <div>⏱ {formatDuration(movie.duration)}</div>
                        )}
                        {movie.director && (
                          <div className="line-clamp-1">Directed by: <span className="text-white font-medium">{movie.director}</span></div>
                        )}
                        {movie.type && (
                          <div className="text-[#F5C518] font-medium uppercase text-xs tracking-wide">
                            {movie.type}
                          </div>
                        )}
                      </div>

                      {/* Cast Members */}
                      {movie.cast && movie.cast.length > 0 && (
                        <div className="mb-4 text-xs text-[#A8A8B3]">
                          <div className="font-semibold text-white mb-1">Cast:</div>
                          <div className="space-y-0.5">
                            {movie.cast.slice(0, 2).map((actor, idx) => (
                              <div key={idx} className="text-white line-clamp-1">
                                • {actor}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hover: Description section */}
                      <div className="mt-auto pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-[#A8A8B3] text-xs line-clamp-3 mb-4">
                          {movie.description || 'No description available'}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/media/${movie.id}`);
                          }}
                          className="w-full bg-gradient-to-r from-[#E94560] to-[#533483] text-white py-2 rounded-lg hover:shadow-[0_0_20px_rgba(233,69,96,0.3)] transition-all duration-300 font-semibold text-sm"
                        >
                          View Details
                        </button>
                      </div>
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
