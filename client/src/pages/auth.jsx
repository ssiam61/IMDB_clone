import React, { useState } from "react";
import "./auth.css";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      try {
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();

        const found = users.find(
          (u) => u.username === username && u.password === password
        );

        if (!found) {
          setError("Invalid username or password");
          return;
        }

        if (role === "admin") {
          const adminsRes = await fetch("http://localhost:5000/admin");
          const admins = await adminsRes.json();
          const isAdmin = admins.find((a) => a.user_id === found.id);

          if (!isAdmin) {
            setError("This user is not an admin.");
            return;
          }

          localStorage.setItem("user", JSON.stringify(found));
          window.location.href = "/admin-dashboard";
        } else {
          localStorage.setItem("user", JSON.stringify(found));
          window.location.href = "/user-dashboard";
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    } 
    else {
      try {
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();

        const exists = users.find((u) => u.username === username);
        if (exists) {
          setError("Username already taken");
          return;
        }

        const createdRes = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            name: username,
            email: `${username}@example.com`,
            password,
            profile_picture: "",
          }),
        });

        const createdUser = await createdRes.json();

        if (role === "admin") {
          await fetch("http://localhost:5000/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: createdUser.id,
              role: "moderator",
              granted_by: null
            })
          });

          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/user-dashboard";
        }

      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-bg-animation">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      {/* Main Content */}
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Logo/Header */}
          <div className="auth-header">
            <h1 className="auth-title">🎬 IMDb Clone</h1>
            <p className="auth-subtitle">Your Entertainment Hub</p>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              className={`toggle-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              <span className="toggle-icon">🔐</span>
              Login
            </button>

            <button
              className={`toggle-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              <span className="toggle-icon">✨</span>
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="form-input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="role-selector">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-text">👥 Regular User</span>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-text">⭐ Admin</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button className="submit-btn" type="submit">
              {mode === "login" ? "Sign In" : "Create Account"}
              <span className="btn-icon">→</span>
            </button>
          </form>

          {/* Footer Info */}
          <div className="auth-footer">
            <p className="footer-text">
              {mode === "login" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                type="button"
                className="footer-link"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;