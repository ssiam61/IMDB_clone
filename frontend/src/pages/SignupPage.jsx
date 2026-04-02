import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter an email address');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);

    try {
      // Debug log
      console.log('Form data:', formData);

      const response = await api.post('/auth/signup', {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Store token
      localStorage.setItem('authToken', response.data.token);

      // Store user object with id, username, and role
      if (response.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.data.user.id,
            username: response.data.user.username,
            role: response.data.user.role || 'user',
          })
        );
      } else {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.data.id || response.data.userId,
            username: response.data.username || formData.username,
            role: response.data.role || 'user',
          })
        );
      }

      // Clear form
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
      });

      // Redirect to home
      navigate('/');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.status === 409
          ? 'Username or email already exists'
          : 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0F0F0F] overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-[#533483] to-[#0F3460] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-tl from-[#E94560] to-[#533483] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card-strong p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">Create Your</span>
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] to-[#533483]">
                Account
              </span>
            </h1>
            <p className="text-[#A8A8B3]">Join us today and explore amazing movies</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm backdrop-blur-sm animate-in fade-in flex items-start gap-3">
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
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Choose your username"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-bold py-3 px-4 rounded-full hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none transform hover:-translate-y-0.5 transition-all duration-300 mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#16213E] text-[#A8A8B3]">or</span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[#A8A8B3] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E94560] hover:text-[#ff5a75] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-[#A8A8B3] text-xs mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
