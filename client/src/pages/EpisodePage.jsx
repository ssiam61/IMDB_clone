import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import CommentThread from "../components/CommentThread";
import { getUser } from "../utils/auth";

const EpisodePage = () => {
  const { id } = useParams();

  const [episode, setEpisode] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [thisIndex, setThisIndex] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const userId = getUser()?.id;

  const pageStyles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f2847 100%)",
      paddingTop: "40px",
      paddingBottom: "60px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    },
    innerContainer: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "0 20px",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    poster: {
      width: "260px",
      height: "360px",
      objectFit: "cover",
      borderRadius: "15px",
      boxShadow: "0 8px 32px rgba(255, 90, 126, 0.2)",
      border: "1px solid rgba(255, 90, 126, 0.2)",
      margin: "0 auto",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginTop: "24px",
      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-1px",
      marginBottom: "24px",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      flexWrap: "wrap",
      marginTop: "24px",
    },
    navButton: {
      padding: "12px 24px",
      borderRadius: "8px",
      border: "2px solid rgba(255, 90, 126, 0.3)",
      background: "linear-gradient(135deg, rgba(255, 90, 126, 0.1), rgba(168, 85, 247, 0.1))",
      color: "#ff5a7e",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    infoCard: {
      background: "linear-gradient(135deg, rgba(255, 90, 126, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
      border: "1px solid rgba(255, 90, 126, 0.1)",
      borderRadius: "12px",
      padding: "32px",
      marginTop: "40px",
      marginBottom: "40px",
      backdropFilter: "blur(10px)",
    },
    infoRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "24px",
      marginBottom: "24px",
    },
    infoField: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    infoLabel: {
      fontSize: "0.875rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#a855f7",
    },
    infoValue: {
      fontSize: "1rem",
      color: "#e0e7ff",
      lineHeight: "1.6",
    },
    descriptionLabel: {
      fontSize: "0.875rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#a855f7",
      marginBottom: "12px",
      display: "block",
    },
    descriptionText: {
      fontSize: "1rem",
      color: "#c0c8e0",
      lineHeight: "1.8",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#ff5a7e",
      marginTop: "48px",
      marginBottom: "24px",
      paddingBottom: "12px",
      borderBottom: "2px solid rgba(255, 90, 126, 0.2)",
    },
  };

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/episode/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setEpisode(data.episode);
          setAllEpisodes(data.allEpisodes);
          setThisIndex(data.currentIndex);
        }
      } catch (err) {
        console.error("Error loading episode:", err);
      }
    };

    loadEpisode();
  }, [id]);

  if (!episode) return (
    <>
      <UserNavbar />
      <div style={pageStyles.container}>
        <div style={pageStyles.innerContainer}>
          <p style={{ color: "#e0e7ff", textAlign: "center", fontSize: "1.1rem" }}>Loading...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <UserNavbar />

      <div style={pageStyles.container}>
        <div style={pageStyles.innerContainer}>
          <div style={pageStyles.header}>
            <img
              src={episode.thumbnail || "/images/placeholder.png"}
              alt="episode"
              style={pageStyles.poster}
            />
            <h2 style={pageStyles.title}>Episode {episode.number}</h2>

            <div style={pageStyles.navigationButtons}>
              {thisIndex > 0 && (
                <button
                  onClick={() =>
                    (window.location.href = `/episode/${allEpisodes[thisIndex - 1].id}`)
                  }
                  style={pageStyles.navButton}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.6)";
                    e.target.style.background = "linear-gradient(135deg, rgba(255, 90, 126, 0.2), rgba(168, 85, 247, 0.2))";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                    e.target.style.background = "linear-gradient(135deg, rgba(255, 90, 126, 0.1), rgba(168, 85, 247, 0.1))";
                  }}
                >
                  ← Previous Episode
                </button>
              )}

              {thisIndex < allEpisodes.length - 1 && (
                <button
                  onClick={() =>
                    (window.location.href = `/episode/${allEpisodes[thisIndex + 1].id}`)
                  }
                  style={pageStyles.navButton}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.6)";
                    e.target.style.background = "linear-gradient(135deg, rgba(255, 90, 126, 0.2), rgba(168, 85, 247, 0.2))";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(255, 90, 126, 0.3)";
                    e.target.style.background = "linear-gradient(135deg, rgba(255, 90, 126, 0.1), rgba(168, 85, 247, 0.1))";
                  }}
                >
                  Next Episode →
                </button>
              )}
            </div>
          </div>

          <div style={pageStyles.infoCard}>
            <div style={pageStyles.infoRow}>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>IMDB Rating</span>
                <span style={pageStyles.infoValue}>{episode.imdb_rating || "N/A"}</span>
              </div>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>User Rating</span>
                <span style={pageStyles.infoValue}>{episode.user_rating || "N/A"}</span>
              </div>
            </div>

            {episode.description && (
              <div style={{ marginTop: "24px" }}>
                <span style={pageStyles.descriptionLabel}>Description</span>
                <p style={pageStyles.descriptionText}>{episode.description}</p>
              </div>
            )}
          </div>

          <h3 style={pageStyles.sectionTitle}>Leave a Review</h3>

          {!reviewSubmitted ? (
            <div style={{
              ...pageStyles.infoCard,
              marginTop: "24px",
              marginBottom: "40px",
            }}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{...pageStyles.infoLabel, marginBottom: "12px", display: "block"}}>
                  Star Rating
                </label>
                <select
                  value={reviewStars}
                  onChange={(e) => setReviewStars(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 90, 126, 0.2)",
                    background: "rgba(10, 14, 39, 0.8)",
                    color: "#e0e7ff",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <option value="0">Select Rating...</option>
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{...pageStyles.infoLabel, marginBottom: "12px", display: "block"}}>
                  Your Review
                </label>
                <textarea
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this episode..."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 90, 126, 0.2)",
                    background: "rgba(10, 14, 39, 0.8)",
                    color: "#e0e7ff",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    transition: "border-color 0.3s ease",
                  }}
                ></textarea>
              </div>

              <button
                onClick={() => setReviewSubmitted(true)}
                disabled={reviewStars === 0 || reviewText.trim() === ""}
                style={{
                  padding: "12px 32px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255, 90, 126, 0.3)",
                  opacity: (reviewStars === 0 || reviewText.trim() === "") ? "0.5" : "1",
                }}
                onMouseEnter={(e) => {
                  if (reviewStars !== 0 && reviewText.trim() !== "") {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(255, 90, 126, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(255, 90, 126, 0.3)";
                }}
              >
                Submit Review
              </button>
            </div>
          ) : (
            <div style={{
              padding: "20px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(74, 222, 128, 0.05))",
              border: "1px solid rgba(74, 222, 128, 0.3)",
              marginTop: "24px",
              marginBottom: "40px",
            }}>
              <p style={{ color: "#4ade80", fontSize: "1.1rem", margin: "0" }}>
                ✅ Review submitted successfully!
              </p>
            </div>
          )}

          <h3 style={pageStyles.sectionTitle}>Reviews</h3>
          <CommentThread 
            episodeId={parseInt(id)} 
            currentUserId={userId}
          />
        </div>
      </div>
    </>
  );
};

export default EpisodePage;
