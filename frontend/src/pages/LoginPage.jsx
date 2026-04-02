import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
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
        // Fallback if user object not in response
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.data.id || response.data.userId,
            username: response.data.username || username,
            role: response.data.role || 'user',
          })
        );
      }

      // Clear form
      setUsername('');
      setPassword('');

      // Redirect to home
      navigate('/');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.status === 401
          ? 'Invalid username or password'
          : 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0F0F0F] overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#E94560] to-[#533483] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#0F3460] to-[#E94560] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card-strong p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">Welcome</span>
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] to-[#533483]">
                Back
              </span>
            </h1>
            <p className="text-[#A8A8B3]">Sign in to your account</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#EAEAEA] font-medium mb-2 text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-[rgba(22,33,62,0.5)] border border-white/10 rounded-lg text-white placeholder-[#A8A8B3] focus:outline-none focus:border-[#E94560] focus:bg-[rgba(22,33,62,0.8)] focus:ring-2 focus:ring-[#E94560]/30 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                required
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
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#E94560] hover:text-[#ff5a75] font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-[#A8A8B3] text-xs mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
