import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { logout, getIsAdmin, getInAdminMode, toggleAdminMode } from "../utils/auth";

const UserNavbar = () => {
  const [inAdminMode, setInAdminMode] = useState(getInAdminMode());
  const isAdmin = getIsAdmin();

  useEffect(() => {
    // Listen for admin mode changes
    const handleAdminModeChange = (event) => {
      setInAdminMode(event.detail.inAdminMode);
    };

    window.addEventListener("adminModeChanged", handleAdminModeChange);
    return () => {
      window.removeEventListener("adminModeChanged", handleAdminModeChange);
    };
  }, []);

  const handleAdminToggle = () => {
    toggleAdminMode();
  };
  const getNavLinkStyle = ({ isActive }) => ({
    color: isActive ? "#ff5a7e" : "#b0b8d4",
    padding: "8px 16px",
    borderRadius: "6px",
    background: isActive ? "rgba(255, 90, 126, 0.1)" : "transparent",
    transition: "all 0.3s ease",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "400",
  });

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 90, 126, 0.1)",
        padding: "16px 24px",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
        <NavLink
          to="/user-dashboard"
          style={{
            fontSize: "24px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
            textDecoration: "none",
          }}
        >
          IMDb Clone
        </NavLink>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <NavLink
            to="/user-dashboard"
            style={getNavLinkStyle}
          >
            Home
          </NavLink>

          <NavLink
            to="/posts"
            style={getNavLinkStyle}
          >
            Posts
          </NavLink>

          <NavLink
            to="/profile"
            style={getNavLinkStyle}
          >
            Profile
          </NavLink>

          <NavLink
            to="/notifications"
            style={getNavLinkStyle}
          >
            Notifications
          </NavLink>

          {isAdmin && (
            <button
              onClick={handleAdminToggle}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: inAdminMode ? "1px solid rgba(168, 85, 247, 0.5)" : "1px solid rgba(168, 85, 247, 0.3)",
                background: inAdminMode ? "linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0.1) 100%)" : "rgba(168, 85, 247, 0.1)",
                color: inAdminMode ? "#a855f7" : "#b0b8d4",
                cursor: "pointer",
                fontWeight: "600",
                transition: "border-color 0.3s ease, background-color 0.3s ease",
                marginLeft: "8px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = inAdminMode ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)";
                e.target.style.borderColor = "#a855f7";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = inAdminMode ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.1)";
                e.target.style.borderColor = inAdminMode ? "rgba(168, 85, 247, 0.5)" : "rgba(168, 85, 247, 0.3)";
              }}
            >
              {inAdminMode ? "🔩 Surf as User" : "🔧 Enter Admin Mode"}
            </button>
          )}

          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 90, 126, 0.3)",
              background: "rgba(255, 90, 126, 0.1)",
              color: "#ff5a7e",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              marginLeft: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 90, 126, 0.2)";
              e.target.style.borderColor = "#ff5a7e";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 90, 126, 0.1)";
              e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;