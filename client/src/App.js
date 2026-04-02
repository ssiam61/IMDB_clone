import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import MediaPage from "./pages/MediaPage";
import PersonPage from "./pages/PersonPage";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import SeasonPage from "./pages/SeasonPage";
import EpisodePage from "./pages/EpisodePage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route
          path="/media/:id"
          element={
            <ProtectedRoute>
              <MediaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/person/:id"
          element={
            <ProtectedRoute>
              <PersonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/season/:id"
          element={
            <ProtectedRoute>
              <SeasonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/episode/:id"
          element={
            <ProtectedRoute>
              <EpisodePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;