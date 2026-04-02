import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import CategoryRow from "../components/CategoryRow";
import AdminModePanel from "../components/AdminModePanel";
import { authenticatedFetch, getUser, getInAdminMode } from "../utils/auth";

const UserDashboard = () => {
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
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
                color: "#b0b8d4",
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
              style={{
                position: "relative",
                flex: "1",
                maxWidth: "500px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#b0b8d4",
                  fontSize: "18px",
                }}
              >
                🔍
              </div>
              <input
                type="text"
                placeholder="Search movies, shows, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                color: "#b0b8d4",
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