import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-b from-[rgba(15,15,15,0.8)] to-[rgba(26,26,46,0.4)] border-b border-white/8">
      <style>{`
        .nav-link {
          position: relative;
          color: #EAEAEA;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #E94560, #533483);
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link:hover {
          color: #E94560;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <div className="text-2xl font-bold">
              <span className="text-white">IMDb</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94560] to-[#533483]">
                clone
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <Link to="/watchlist" className="nav-link">
                  Watchlist
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:shadow-2xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
                >
                  Login
                </Link>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-[#E94560] to-[#533483] hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <svg
                className={`h-6 w-6 text-white transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-90' : ''
                }`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in duration-300">
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/watchlist"
                  className="block px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Watchlist
                </Link>
              </>
            )}

            <div className="pt-2 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 rounded-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-[#E94560] to-[#533483] text-white font-semibold hover:shadow-[0_0_30px_rgba(233,69,96,0.4)] transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
