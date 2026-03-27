import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import MediaPage from "./pages/MediaPage";
import PersonPage from "./pages/PersonPage";

import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {}
        <Route path="/" element={<Auth />} />

        {}

        <Route path="/media/:id" element={<MediaPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/person/:id" element={<PersonPage />} />

        {}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;