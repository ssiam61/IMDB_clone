import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import CategoryRow from "../components/CategoryRow";
import AdminModePanel from "../components/AdminModePanel";
import { authenticatedFetch, getUser, getInAdminMode } from "../utils/auth";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const [allMedia, setAllMedia] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [criticallyAcclaimed, setCriticallyAcclaimed] = useState([]);
  const [watchlistMedia, setWatchlistMedia] = useState([]);
  const [awardWinners, setAwardWinners] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [starStudded, setStarStudded] = useState([]);
  const [directedByFavorites, setDirectedByFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [inAdminMode, setInAdminMode] = useState(getInAdminMode());

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const user = getUser();
        const userId = user?.id;

        if (!userId) {
          throw new Error("User data not found");
        }

        const res = await authenticatedFetch(`http://localhost:5000/api/home/${userId}`);
        const data = await res.json();

        if (data.success) {
          setAllMedia(data.allMedia);
          setHighlyRated(data.highlyRated);
          setCriticallyAcclaimed(data.criticallyAcclaimed);
          setWatchlistMedia(data.watchlistMedia);
          setAwardWinners(data.awardWinners);
          setTrending(data.trending);
          setRecommended(data.recommended);
          setStarStudded(data.starStudded);
          setDirectedByFavorites(data.directedByFavorites);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHome();
  }, []);

  useEffect(() => {
    const handleAdminModeChange = (event) => {
      setInAdminMode(event.detail.inAdminMode);
    };

    window.addEventListener("adminModeChanged", handleAdminModeChange);
    return () => {
      window.removeEventListener("adminModeChanged", handleAdminModeChange);
    };
  }, []);

  const fetchSearchResults = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await authenticatedFetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success) {
        setSearchResults(data.results);
        setShowDropdown(data.results.length > 0);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDropdown]);

  useEffect(() => {
    const updatePosition = () => {
      if (searchWrapperRef.current) {
        const rect = searchWrapperRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (showDropdown && searchWrapperRef.current) {
      requestAnimationFrame(() => {
        updatePosition();
      });

      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showDropdown, searchResults]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 300);
  };

  const handleResultClick = (result) => {
    if (result.type === "person") {
      navigate(`/person/${result.id}`);
    } else {
      navigate(`/media/${result.id}`);
    }
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <UserNavbar />

      {inAdminMode && <AdminModePanel />}

      <div
        style={{
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f2847 100%)",
          padding: "80px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: "16px",
                letterSpacing: "-1px",
              }}
            >
              Explore Thousands of Movies
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#d0d8e8",
                marginBottom: "0",
              }}
            >
              Rate them, build your watchlist, and share reviews with our community
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              ref={searchWrapperRef}
              style={{
                position: "relative",
                flex: "1",
                maxWidth: "500px",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#d0d8e8",
                  fontSize: "18px",
                }}
              >
                🔍
              </div>
              <input
                type="text"
                placeholder="Search movies, shows, people..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 50px",
                  background: "rgba(37, 64, 97, 0.4)",
                  border: "1px solid rgba(255, 90, 126, 0.3)",
                  borderRadius: "50px",
                  color: "#ffffff",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ff5a7e";
                  e.target.style.boxShadow = "0 0 20px rgba(255, 90, 126, 0.4)";
                  e.target.style.background = "rgba(37, 64, 97, 0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(37, 64, 97, 0.4)";
                }}
              />
              {showDropdown && searchResults.length > 0 &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "fixed",
                      top: `${dropdownPos.top}px`,
                      left: `${dropdownPos.left}px`,
                      width: `${dropdownPos.width}px`,
                      maxHeight: "400px",
                      overflowY: "auto",
                      background: "rgba(26, 31, 58, 0.95)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      zIndex: 9999,
                    }}
                  >
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleResultClick(result)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderBottom: index !== searchResults.length - 1 ? "1px solid rgba(255, 90, 126, 0.1)" : "none",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 90, 126, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <img
                          src={result.thumbnail || "/images/placeholder.png"}
                          alt={result.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "6px",
                            marginRight: "12px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "/images/placeholder.png";
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: "500",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {result.name}
                          </div>
                        </div>
                        <span
                          style={{
                            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 90, 126, 0.3))",
                            color: result.type === "person" ? "#a855f7" : "#ff5a7e",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            marginLeft: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {result.type === "person" ? "Person" : result.type === "series" ? "Series" : "Movie"}
                        </span>
                      </div>
                    ))}
                  </div>,
                  document.body
                )}
              {showDropdown && searchResults.length === 0 && searchQuery.trim().length >= 2 &&
                createPortal(
                  <div
                    style={{
                      position: "fixed",
                      top: `${dropdownPos.top}px`,
                      left: `${dropdownPos.left}px`,
                      width: `${dropdownPos.width}px`,
                      maxHeight: "400px",
                      overflowY: "auto",
                      background: "rgba(26, 31, 58, 0.95)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "12px",
                      padding: "16px",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      zIndex: 9999,
                      textAlign: "center",
                      color: "#d0d8e8",
                      fontSize: "14px",
                    }}
                  >
                    No results found
                  </div>,
                  document.body
                )}
            </div>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                border: "none",
                color: "#ffffff",
                padding: "16px 40px",
                borderRadius: "50px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(255, 90, 126, 0.4)",
                whiteSpace: "nowrap",
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
              Search
            </button>
          </form>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(180deg, #0a0e27 0%, #0f1628 100%)",
          minHeight: "100vh",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ marginBottom: "80px" }}>
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
                  height: "32px",
                  background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                  borderRadius: "2px",
                }}
              />
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#ffffff",
                  margin: "0",
                }}
              >
                Featured Movies & Shows
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "20px",
                maxHeight: "500px",
                overflowY: "auto",
                paddingRight: "10px",
                paddingBottom: "20px",
              }}
            >
              {allMedia.map((item) => (
                <div
                  key={item.id}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <MediaCard
                    id={item.id}
                    title={item.name}
                    image={item.thumbnail}
                  />
                </div>
              ))}
            </div>
          </div>

          {highlyRated.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="⭐ Highly Rated" list={highlyRated} />
            </div>
          )}

          {criticallyAcclaimed.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🎬 Critically Acclaimed" list={criticallyAcclaimed} />
            </div>
          )}

          {watchlistMedia.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="📌 From Your Watchlist" list={watchlistMedia} />
            </div>
          )}

          {trending.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🔥 Trending Now" list={trending} />
            </div>
          )}

          {awardWinners.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🏆 Award Winners" list={awardWinners} />
            </div>
          )}

          {starStudded.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🎬 Starred by Favorite Actors" list={starStudded} />
            </div>
          )}

          {directedByFavorites.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="🎥 Directed by Favorite Directors" list={directedByFavorites} />
            </div>
          )}

          {recommended.length > 0 && (
            <div style={{ marginBottom: "60px" }}>
              <CategoryRow title="💫 Recommended For You" list={recommended} />
            </div>
          )}

          <div
            style={{
              background: "linear-gradient(135deg, rgba(26, 39, 73, 0.8) 0%, rgba(15, 40, 71, 0.8) 100%)",
              border: "1px solid rgba(255, 90, 126, 0.2)",
              borderRadius: "16px",
              padding: "60px 40px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              marginTop: "80px",
            }}
          >
            <h2
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              Ready to Rate and Share?
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#d0d8e8",
                marginBottom: "32px",
                maxWidth: "600px",
                margin: "0 auto 32px",
              }}
            >
              Create an account to build your watchlist, rate movies, and share reviews with our growing community.
            </p>
            <button
              style={{
                background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                border: "none",
                color: "#ffffff",
                padding: "16px 48px",
                borderRadius: "50px",
                fontWeight: "700",
                fontSize: "16px",
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
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;