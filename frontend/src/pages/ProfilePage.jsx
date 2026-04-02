import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userRes = await api.get('/users/profile');
      const userData = userRes.data;
      setUser(userData);

      // Fetch user reviews using user id
      if (userData.id) {
        try {
          const reviewsRes = await api.get(`/users/${userData.id}/reviews`);
          setReviews(reviewsRes.data || []);
        } catch (reviewErr) {
          console.warn('Failed to fetch reviews:', reviewErr);
          setReviews([]);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load profile data.');
      }
      console.error('Profile fetch error:', err);
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
                {user?.username || 'User'}
              </h1>
              <p className="text-[#A8A8B3] mb-1">{user?.email || 'No email'}</p>
              <p className="text-sm text-[#A8A8B3]">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] to-[#533483] text-3xl font-bold mb-2">
                {reviews.length}
              </div>
              <p className="text-[#A8A8B3] text-sm">Reviews Written</p>
            </div>
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-[#E94560] text-3xl font-bold mb-2">
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </div>
              <p className="text-[#A8A8B3] text-sm">Account Type</p>
            </div>
            <div className="glass-card p-6 text-center hover-glow transition-all duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F3460] to-[#533483] text-3xl font-bold mb-2">
                {user?.id ? '✓' : '—'}
              </div>
              <p className="text-[#A8A8B3] text-sm">Active</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 backdrop-blur-sm flex items-start gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">My Reviews</h2>

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-white mb-3">No reviews yet</h3>
            <p className="text-[#A8A8B3] mb-6">
              Share your thoughts about the movies you've watched
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transform hover:-translate-y-0.5 transition-all duration-300"
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
                    <h3 className="text-xl font-bold text-white hover:text-[#E94560] transition-colors">
                      {review.movieTitle || 'Movie'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#F5C518] font-bold text-lg">
                        ⭐ {review.rating || 0}/10
                      </span>
                      <span className="badge">{Math.floor(Math.random() * 100) + 1} helpful</span>
                    </div>
                  </div>
                  <p className="text-[#A8A8B3] text-sm whitespace-nowrap ml-4">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently'}
                  </p>
                </div>
                <p className="text-[#EAEAEA] leading-relaxed">{review.comment || review.text || 'No comment'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
