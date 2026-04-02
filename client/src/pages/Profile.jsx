import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import CategoryRow from "../components/CategoryRow";
import { authenticatedFetch, getUser } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storedUser = getUser();
  const userId = storedUser?.id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authenticatedFetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setEditData({
            name: data.user.name || "",
            email: data.user.email || "",
            bio: data.user.bio || "",
          });
          setWatchlist(data.watchlist);
        }

        const peopleRes = await authenticatedFetch(`http://localhost:5000/api/fan/user/${userId}`);
        const peopleData = await peopleRes.json();
        if (peopleData.success) {
          setFavoriteActors(peopleData.actors);
          setFavoriteDirectors(peopleData.directors);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const handleEditClick = () => {
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!editData.name || !editData.email) {
        setError("Name and email are required");
        setLoading(false);
        return;
      }

      const response = await authenticatedFetch(
        `http://localhost:5000/api/profile/update/${userId}`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify(editData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          setModalOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavbar />

      <div
        style={{
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f2847 100%)",
          minHeight: "100vh",
          padding: "40px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              background: "rgba(26, 39, 73, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "48px",
              border: "1px solid rgba(255, 90, 126, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  margin: "0 auto",
                  overflow: "hidden",
                  border: "3px solid rgba(255, 90, 126, 0.3)",
                  boxShadow: "0 0 20px rgba(255, 90, 126, 0.2)",
                }}
              >
                <img
                  src={user?.profile_picture || "/images/placeholder.png"}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            {user ? (
              <>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "#ffffff",
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {user.name}
                </h1>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#b0b8d4",
                    margin: "0 0 24px 0",
                    fontWeight: "500",
                  }}
                >
                  @{user.username}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "16px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255, 90, 126, 0.1)",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 90, 126, 0.2)",
                    }}
                  >
                    <p style={{ color: "#b0b8d4", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "600" }}>
                      Email
                    </p>
                    <p style={{ color: "#e0e7ff", fontSize: "13px", margin: "0", wordBreak: "break-all" }}>
                      {user.email}
                    </p>
                  </div>

                  <div
                    style={{
                      background: "rgba(168, 85, 247, 0.1)",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(168, 85, 247, 0.2)",
                    }}
                  >
                    <p style={{ color: "#b0b8d4", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", fontWeight: "600" }}>
                      Member Since
                    </p>
                    <p style={{ color: "#e0e7ff", fontSize: "13px", margin: "0" }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {user.bio && (
                  <p
                    style={{
                      color: "#c0c8e0",
                      fontSize: "14px",
                      margin: "0 0 24px 0",
                      fontStyle: "italic",
                    }}
                  >
                    "{user.bio}"
                  </p>
                )}

                <button
                  onClick={handleEditClick}
                  style={{
                    background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                    border: "none",
                    color: "#ffffff",
                    padding: "14px 40px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 90, 126, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 25px rgba(255, 90, 126, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(255, 90, 126, 0.4)";
                  }}
                >
                  Edit Your Information
                </button>
              </>
            ) : (
              <p style={{ color: "#b0b8d4", fontSize: "16px" }}>Loading profile...</p>
            )}
          </div>

          {watchlist.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "28px",
                    background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                    borderRadius: "2px",
                  }}
                />
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#ffffff",
                    margin: "0",
                  }}
                >
                  📌 Your Watchlist
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "20px",
                }}
              >
                {watchlist.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    image={item.thumbnail}
                  />
                ))}
              </div>
            </div>
          )}

          {favoriteActors.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🎬 Your Favorite Actors" list={favoriteActors} type="person" />
            </div>
          )}

          {favoriteDirectors.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🎥 Your Favorite Directors" list={favoriteDirectors} type="person" />
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            {["posts", "reviews", "replies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 28px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background:
                    activeTab === tab
                      ? "linear-gradient(135deg, #ff5a7e, #a855f7)"
                      : "rgba(255, 90, 126, 0.1)",
                  color:
                    activeTab === tab
                      ? "#ffffff"
                      : "#b0b8d4",
                  border:
                    activeTab === tab
                      ? "none"
                      : "1px solid rgba(255, 90, 126, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.target.style.background = "rgba(255, 90, 126, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.target.style.background = "rgba(255, 90, 126, 0.1)";
                  }
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(26, 39, 73, 0.8) 0%, rgba(15, 40, 71, 0.8) 100%)",
              border: "1px solid rgba(255, 90, 126, 0.2)",
              borderRadius: "16px",
              padding: "60px 40px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                color: "#b0b8d4",
                fontSize: "16px",
                margin: "0",
              }}
            >
              No {activeTab} yet — coming soon.
            </p>
          </div>
        </div>

        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(5px)",
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                background: "#1a1f3a",
                borderRadius: "16px",
                padding: "40px",
                maxWidth: "500px",
                width: "90%",
                border: "1px solid rgba(255, 90, 126, 0.3)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                }}
              >
                Edit Your Information
              </h2>
              <p
                style={{
                  color: "#b0b8d4",
                  fontSize: "14px",
                  margin: "0 0 24px 0",
                }}
              >
                Update your profile details
              </p>

              {error && (
                <div
                  style={{
                    background: "rgba(255, 90, 126, 0.1)",
                    border: "1px solid rgba(255, 90, 126, 0.5)",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#ff5a7e",
                    fontSize: "13px",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid rgba(74, 222, 128, 0.5)",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#4ade80",
                    fontSize: "13px",
                    marginBottom: "20px",
                  }}
                >
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#254061",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff5a7e";
                      e.target.style.boxShadow = "0 0 12px rgba(255, 90, 126, 0.3)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#254061",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "all 0.3s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff5a7e";
                      e.target.style.boxShadow = "0 0 12px rgba(255, 90, 126, 0.3)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    disabled={loading}
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#254061",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      transition: "all 0.3s ease",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#a855f7";
                      e.target.style.boxShadow = "0 0 12px rgba(168, 85, 247, 0.3)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(168, 85, 247, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#b0b8d4",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.background = "rgba(255, 90, 126, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 90, 126, 0.1)";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;