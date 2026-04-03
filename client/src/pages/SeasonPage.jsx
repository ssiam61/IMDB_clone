import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import EpisodeCard from "../components/EpisodeCard";
import CommentThread from "../components/CommentThread";
import { authenticatedFetch, getUser, getInAdminMode } from "../utils/auth";

const SeasonPage = () => {
  const { id } = useParams();

  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);
  const [thisIndex, setThisIndex] = useState(null);
  const [inAdminMode, setInAdminMode] = useState(getInAdminMode());
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);
  const [addEpisodeForm, setAddEpisodeForm] = useState({
    number: "",
    title: "",
    release_date: "",
    duration: "",
  });

  const userId = getUser()?.id;
  const [addingEpisode, setAddingEpisode] = useState(false);
  const [showEditSeasonModal, setShowEditSeasonModal] = useState(false);
  const [editSeasonForm, setEditSeasonForm] = useState({
    number: "",
    title: "",
    release_date: "",
  });
  const [editingSeason, setEditingSeason] = useState(false);

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
    cardsContainer: {
      display: "flex",
      overflowX: "auto",
      gap: "20px",
      paddingBottom: "16px",
      paddingTop: "8px",
      whiteSpace: "nowrap",
      scrollBehavior: "smooth",
    },
  };

  useEffect(() => {
    const loadSeason = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/season/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setSeason(data.season);
          setEpisodes(data.episodes);
          setAllSeasons(data.allSeasons);
          setThisIndex(data.currentIndex);
        }
      } catch (err) {
        console.error("Error loading season page:", err);
      }
    };

    loadSeason();
  }, [id]);

  useEffect(() => {
    const handleAdminModeChange = (event) => {
      setInAdminMode(event.detail.inAdminMode);
    };

    window.addEventListener("adminModeChanged", handleAdminModeChange);
    return () => {
      window.removeEventListener("adminModeChanged", handleAdminModeChange);
    };
  }, []);

  const handleAddEpisode = async () => {
    if (!addEpisodeForm.number) {
      alert("Episode number is required");
      return;
    }
    setAddingEpisode(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/episode/add",
        {
          method: "POST",
          body: JSON.stringify({
            season_id: id,
            number: parseInt(addEpisodeForm.number),
            title: addEpisodeForm.title || null,
            release_date: addEpisodeForm.release_date || null,
            duration: addEpisodeForm.duration ? parseInt(addEpisodeForm.duration) : null,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEpisodes([...episodes, data.episode]);
        setAddEpisodeForm({ number: "", title: "", release_date: "", duration: "" });
        setShowAddEpisodeModal(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddingEpisode(false);
    }
  };

  const handleOpenEditSeason = () => {
    if (season) {
      setEditSeasonForm({
        number: season.number || "",
        title: season.title || "",
        release_date: season.release_date || "",
      });
      setShowEditSeasonModal(true);
    }
  };

  const handleEditSeason = async () => {
    if (!editSeasonForm.number || !editSeasonForm.release_date) {
      alert("Season number and release date are required");
      return;
    }
    setEditingSeason(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/season/edit/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            number: parseInt(editSeasonForm.number),
            title: editSeasonForm.title || null,
            release_date: editSeasonForm.release_date,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSeason(data.season);
        setEditSeasonForm({ number: "", title: "", release_date: "" });
        setShowEditSeasonModal(false);
        alert("Season updated successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setEditingSeason(false);
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/episode/delete/${episodeId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setEpisodes(episodes.filter(e => e.id !== episodeId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!season) return (
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
              src={season.thumbnail || "/images/placeholder.png"}
              alt="season"
              style={pageStyles.poster}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={pageStyles.title}>Season {season.number}</h2>
              {inAdminMode && (
                <button
                  onClick={handleOpenEditSeason}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1))",
                    border: "1px solid rgba(168, 85, 247, 0.5)",
                    color: "#a855f7",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.2))";
                    e.target.style.boxShadow = "0 6px 20px rgba(168, 85, 247, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1))";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  ✏️ Edit Season
                </button>
              )}
            </div>

            <div style={pageStyles.navigationButtons}>
              {thisIndex > 0 && (
                <button
                  onClick={() =>
                    (window.location.href = `/season/${allSeasons[thisIndex - 1].id}`)
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
                  ← Previous Season
                </button>
              )}

              {thisIndex < allSeasons.length - 1 && (
                <button
                  onClick={() =>
                    (window.location.href = `/season/${allSeasons[thisIndex + 1].id}`)
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
                  Next Season →
                </button>
              )}
            </div>
          </div>

          <div style={pageStyles.infoCard}>
            <div style={pageStyles.infoRow}>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>IMDB Rating</span>
                <span style={pageStyles.infoValue}>{season.imdb_rating || "N/A"}</span>
              </div>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>User Rating</span>
                <span style={pageStyles.infoValue}>{season.user_rating || "N/A"}</span>
              </div>
            </div>

            {season.description && (
              <div style={{ marginTop: "24px" }}>
                <span style={pageStyles.descriptionLabel}>Description</span>
                <p style={pageStyles.descriptionText}>{season.description}</p>
              </div>
            )}
          </div>

          {episodes.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>Episodes</h3>
              <div style={pageStyles.cardsContainer}>
                {episodes.map((ep) => (
                  <EpisodeCard 
                    key={ep.id} 
                    episode={ep} 
                    onDelete={inAdminMode ? handleDeleteEpisode : null}
                    showDeleteButton={inAdminMode}
                  />
                ))}
                {inAdminMode && (
                  <div
                    onClick={() => setShowAddEpisodeModal(true)}
                    style={{
                      width: "160px",
                      height: "200px",
                      borderRadius: "12px",
                      border: "2px dashed rgba(168, 85, 247, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      background: "rgba(168, 85, 247, 0.1)",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
                      e.currentTarget.style.borderColor = "#a855f7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
                      e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                    }}
                  >
                    <div style={{ fontSize: "40px", fontWeight: "800", color: "#a855f7" }}>+</div>
                  </div>
                )}
              </div>
            </>
          )}

          <h3 style={pageStyles.sectionTitle}>Reviews & Comments</h3>
          <CommentThread 
            seasonId={parseInt(id)} 
            currentUserId={userId}
          />

          {/* Add Episode Modal */}
          {showAddEpisodeModal && (
            <div style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "2000",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
                padding: "32px",
                borderRadius: "12px",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                maxWidth: "500px",
                width: "90%",
              }}>
                <h3 style={{ color: "#a855f7", marginBottom: "20px" }}>Add Episode</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Episode Number *</label>
                  <input
                    type="number"
                    value={addEpisodeForm.number}
                    onChange={(e) => setAddEpisodeForm({ ...addEpisodeForm, number: e.target.value })}
                    placeholder="e.g., 1"
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#254061",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Title</label>
                  <input
                    type="text"
                    value={addEpisodeForm.title}
                    onChange={(e) => setAddEpisodeForm({ ...addEpisodeForm, title: e.target.value })}
                    placeholder="Episode title (optional)"
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#254061",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Release Date</label>
                  <input
                    type="date"
                    value={addEpisodeForm.release_date}
                    onChange={(e) => setAddEpisodeForm({ ...addEpisodeForm, release_date: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#254061",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Duration (minutes)</label>
                  <input
                    type="number"
                    value={addEpisodeForm.duration}
                    onChange={(e) => setAddEpisodeForm({ ...addEpisodeForm, duration: e.target.value })}
                    placeholder="Duration in minutes (optional)"
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#254061",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleAddEpisode}
                    disabled={addingEpisode}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #a855f7, #668ef7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                      opacity: addingEpisode ? 0.7 : 1,
                    }}
                  >
                    {addingEpisode ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => setShowAddEpisodeModal(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(168, 85, 247, 0.2)",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditSeasonModal && (
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
              onClick={() => setShowEditSeasonModal(false)}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "12px",
                  padding: "32px",
                  maxWidth: "500px",
                  width: "90%",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ color: "#a855f7", marginBottom: "24px", fontSize: "1.5rem", fontWeight: "700" }}>Edit Season</h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Season Number *</label>
                  <input
                    type="number"
                    value={editSeasonForm.number}
                    onChange={(e) => setEditSeasonForm({ ...editSeasonForm, number: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Season Title</label>
                  <input
                    type="text"
                    value={editSeasonForm.title}
                    onChange={(e) => setEditSeasonForm({ ...editSeasonForm, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Release Date *</label>
                  <input
                    type="date"
                    value={editSeasonForm.release_date}
                    onChange={(e) => setEditSeasonForm({ ...editSeasonForm, release_date: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleEditSeason}
                    disabled={editingSeason}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: editingSeason ? "not-allowed" : "pointer",
                      opacity: editingSeason ? 0.7 : 1,
                    }}
                  >
                    {editingSeason ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setShowEditSeasonModal(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(168, 85, 247, 0.2)",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SeasonPage;
