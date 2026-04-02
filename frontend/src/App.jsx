import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/media/:id" element={<MediaDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
