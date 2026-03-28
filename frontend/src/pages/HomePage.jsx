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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-gray-400 mt-4">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to IMDb Clone</h1>
          <p className="text-xl text-gray-400 mb-8">Discover, rate, and review your favorite movies</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search movies..."
              className="flex-1 px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
            <button className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-900 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                {movie.posterUrl && (
                  <div className="relative h-64 bg-gray-700 overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      ⭐ {movie.imdbRating ? movie.imdbRating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-gray-400 text-sm">{movie.releaseYear}</span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                    {movie.description}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-700 text-white py-2 rounded font-semibold hover:bg-gray-600 transition-colors text-sm">
                      Add to List
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
