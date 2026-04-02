import React, { useState, useEffect } from "react";
import { login, signup, isAuthenticated } from "../utils/auth";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("authToken");
      
      const verifyAuth = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/profile/" + user?.id, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (response.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            return;
          }
          
          window.location.href = user?.id ? "/user-dashboard" : "/";
        } catch (err) {
          console.log("Auth verification failed, staying on login page");
        }
      };
      
      verifyAuth();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!username || !password) {
          setError("Username and password are required");
          setLoading(false);
          return;
        }

        const data = await login(username, password);

        window.location.href = "/user-dashboard";
      } else {
        if (!username || !name || !email || !password || !confirmPassword) {
          setError("All fields are required");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const data = await signup(username, name, email, password);
        window.location.href = "/user-dashboard";
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="auth-background" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "rgba(26, 39, 73, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "48px",
            width: "100%",
            maxWidth: "420px",
            border: "1px solid rgba(255, 90, 126, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#ffffff",
                margin: "0 0 8px 0",
              }}
            >
              {mode === "login" ? "Welcome Back" : "Create Your"}
              <br />
              <span style={{ background: "linear-gradient(135deg, #ff5a7e, #a855f7)", 
                           WebkitBackgroundClip: "text", 
                           WebkitTextFillColor: "transparent" }}>
                {mode === "login" ? "!" : "Account"}
              </span>
            </h1>
            <p style={{ color: "#d0d8e8", fontSize: "14px", margin: "8px 0 0 0" }}>
              {mode === "login"
                ? "Sign in to your account"
                : "Join us and explore amazing media"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: mode === "login" ? "linear-gradient(135deg, #ff5a7e, #a855f7)" : "rgba(255, 90, 126, 0.1)",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                if (mode !== "login") {
                  e.target.style.background = "rgba(255, 90, 126, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== "login") {
                  e.target.style.background = "rgba(255, 90, 126, 0.1)";
                }
              }}
            >
              Login
            </button>

            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: mode === "signup" ? "linear-gradient(135deg, #ff5a7e, #a855f7)" : "rgba(168, 85, 247, 0.1)",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                if (mode !== "signup") {
                  e.target.style.background = "rgba(168, 85, 247, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (mode !== "signup") {
                  e.target.style.background = "rgba(168, 85, 247, 0.1)";
                }
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <p
              style={{
                color: "#ff5a7e",
                textAlign: "center",
                fontSize: "14px",
                marginBottom: "20px",
                background: "rgba(255, 90, 126, 0.1)",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 90, 126, 0.3)",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#ffffff", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose your username"
                disabled={loading}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#254061",
                  border: "1px solid rgba(255, 90, 126, 0.3)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  outline: "none",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "text",
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = "#ff5a7e";
                    e.target.style.boxShadow = "0 0 12px rgba(255, 90, 126, 0.3)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", color: "#ffffff", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#254061",
                    border: "1px solid rgba(255, 90, 126, 0.3)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    outline: "none",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = "#ff5a7e";
                      e.target.style.boxShadow = "0 0 12px rgba(255, 90, 126, 0.3)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", color: "#ffffff", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#254061",
                    border: "1px solid rgba(255, 90, 126, 0.3)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    outline: "none",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = "#ff5a7e";
                      e.target.style.boxShadow = "0 0 12px rgba(255, 90, 126, 0.3)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", color: "#ffffff", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#254061",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                  outline: "none",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "text",
                }}
                onFocus={(e) => {
                  if (!loading) {
                    e.target.style.borderColor = "#a855f7";
                    e.target.style.boxShadow = "0 0 12px rgba(168, 85, 247, 0.3)";
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(168, 85, 247, 0.3)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", color: "#ffffff", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#254061",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                    outline: "none",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = "#a855f7";
                      e.target.style.boxShadow = "0 0 12px rgba(168, 85, 247, 0.3)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(168, 85, 247, 0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                marginTop: "16px",
                background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(255, 90, 126, 0.4)",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 90, 126, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(255, 90, 126, 0.4)";
              }}
            >
              {loading ? "Processing..." : (mode === "login" ? "Login" : "Create Account")}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#b0b8d4",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            By using this site, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;