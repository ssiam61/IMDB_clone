import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import AwardCard from "../components/AwardCard";
import SeasonCard from "../components/SeasonCard";
import CommentThread from "../components/CommentThread";
import { authenticatedFetch, getUser, getInAdminMode } from "../utils/auth";

const MediaPage = () => {
  const { id } = useParams();

  const [media, setMedia] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [cast, setCast] = useState([]);
  const [awards, setAwards] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [inAdminMode, setInAdminMode] = useState(getInAdminMode());
  const [showAddCastModal, setShowAddCastModal] = useState(false);
  const [showAddDirectorModal, setShowAddDirectorModal] = useState(false);
  const [showAddSeasonModal, setShowAddSeasonModal] = useState(false);
  const [addCastForm, setAddCastForm] = useState({ person_id: "", name: "" });
  const [addDirectorForm, setAddDirectorForm] = useState({ person_id: "", name: "" });
  const [addSeasonForm, setAddSeasonForm] = useState({ number: "", title: "", release_date: "" });
  const [addingItem, setAddingItem] = useState(false);

  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [editMediaForm, setEditMediaForm] = useState({
    name: "",
    description: "",
    imdb_rating: "",
    duration: "",
    release_date: "",
    teaser_link: "",
    thumbnail: "",
  });
  const [editingMedia, setEditingMedia] = useState(false);

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
      marginBottom: "50px",
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
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
    teaser: {
      color: "#ff5a7e",
      textDecoration: "none",
      fontWeight: "600",
      transition: "color 0.3s ease",
      wordBreak: "break-all",
    },
    playerContainer: {
      position: "relative",
      width: "100%",
      paddingBottom: "56.25%",
      height: "0",
      marginTop: "40px",
      marginBottom: "40px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(255, 90, 126, 0.2)",
      border: "1px solid rgba(255, 90, 126, 0.1)",
    },
    playerIframe: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: "12px",
    },
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/media/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setMedia(data.media);
          setDirectors(data.directors);
          setCast(data.cast);
          setAwards(data.awards);
          setSeasons(data.seasons);
        }
      } catch (err) {
        console.error("Error loading media page:", err);
      }
    };

    loadMedia();
  }, [id]);

  useEffect(() => {
    if (userId && id) {
      const checkWatchlist = async () => {
        try {
          const res = await authenticatedFetch(`http://localhost:5000/api/watchlist/check/${userId}/${id}`);
          const data = await res.json();
          setInWatchlist(data.inWatchlist);
        } catch (err) {
          console.error("Error checking watchlist:", err);
        }
      };
      checkWatchlist();
    }
  }, [userId, id]);

  useEffect(() => {
    const handleAdminModeChange = (event) => {
      setInAdminMode(event.detail.inAdminMode);
    };

    window.addEventListener("adminModeChanged", handleAdminModeChange);
    return () => {
      window.removeEventListener("adminModeChanged", handleAdminModeChange);
    };
  }, []);

  const handleAddToWatchlist = async () => {
    if (!userId) return;
    setWatchlistLoading(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/watchlist/add/${userId}/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!userId) return;
    setWatchlistLoading(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/watchlist/remove/${userId}/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        setInWatchlist(false);
      }
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleAddCast = async () => {
    if (!addCastForm.person_id) {
      alert("Please enter a person ID");
      return;
    }
    setAddingItem(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/media-personality/add",
        {
          method: "POST",
          body: JSON.stringify({
            media_id: id,
            person_id: addCastForm.person_id,
            role: "actor",
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setCast([...cast, { id: addCastForm.person_id, name: addCastForm.name, profile_image: null }]);
        setAddCastForm({ person_id: "", name: "" });
        setShowAddCastModal(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddingItem(false);
    }
  };

  const handleAddDirector = async () => {
    if (!addDirectorForm.person_id) {
      alert("Please enter a person ID");
      return;
    }
    setAddingItem(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/media-personality/add",
        {
          method: "POST",
          body: JSON.stringify({
            media_id: id,
            person_id: addDirectorForm.person_id,
            role: "director",
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setDirectors([...directors, { id: addDirectorForm.person_id, name: addDirectorForm.name, profile_image: null }]);
        setAddDirectorForm({ person_id: "", name: "" });
        setShowAddDirectorModal(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddingItem(false);
    }
  };

  const handleAddSeason = async () => {
    if (!addSeasonForm.number || !addSeasonForm.release_date) {
      alert("Season number and release date are required");
      return;
    }
    setAddingItem(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/season/add",
        {
          method: "POST",
          body: JSON.stringify({
            media_id: id,
            number: parseInt(addSeasonForm.number),
            title: addSeasonForm.title || null,
            release_date: addSeasonForm.release_date,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSeasons([...seasons, data.season]);
        setAddSeasonForm({ number: "", title: "", release_date: "" });
        setShowAddSeasonModal(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAddingItem(false);
    }
  };

  const handleOpenEditMedia = () => {
    setEditMediaForm({
      name: media.name || "",
      description: media.description || "",
      imdb_rating: media.imdb_rating || "",
      duration: media.duration || "",
      release_date: media.release_date || "",
      teaser_link: media.teaser_link || "",
      thumbnail: media.thumbnail || "",
    });
    setShowEditMediaModal(true);
  };

  const handleEditMedia = async () => {
    if (!editMediaForm.name) {
      alert("Media name is required");
      return;
    }
    setEditingMedia(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/media/edit/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editMediaForm.name,
            description: editMediaForm.description,
            imdb_rating: editMediaForm.imdb_rating ? parseFloat(editMediaForm.imdb_rating) : null,
            duration: editMediaForm.duration,
            release_date: editMediaForm.release_date,
            teaser_link: editMediaForm.teaser_link,
            thumbnail: editMediaForm.thumbnail,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMedia(data.media);
        setEditMediaForm({
          name: "",
          description: "",
          imdb_rating: "",
          duration: "",
          release_date: "",
          teaser_link: "",
          thumbnail: "",
        });
        setShowEditMediaModal(false);
        alert("Media updated successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setEditingMedia(false);
    }
  };

  const handleDeleteDirectorFromMedia = async (personId) => {
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/media-personality/remove/${id}/${personId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setDirectors(directors.filter(d => d.id !== personId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteCastFromMedia = async (personId) => {
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/media-personality/remove/${id}/${personId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setCast(cast.filter(c => c.id !== personId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteSeason = async (seasonId) => {
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/season/delete/${seasonId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setSeasons(seasons.filter(s => s.id !== seasonId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!media) return (
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
              src={media.thumbnail || "/images/placeholder.png"}
              alt={media.name}
              style={pageStyles.poster}
            />
            <h2 style={pageStyles.title}>{media.name}</h2>
            
            <button
              onClick={inWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
              disabled={watchlistLoading}
              style={{
                marginTop: "20px",
                padding: "12px 32px",
                background: inWatchlist 
                  ? "rgba(255, 90, 126, 0.2)" 
                  : "linear-gradient(135deg, #ff5a7e, #a855f7)",
                border: inWatchlist 
                  ? "1px solid rgba(255, 90, 126, 0.5)" 
                  : "none",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: watchlistLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: watchlistLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!watchlistLoading && !inWatchlist) {
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 90, 126, 0.4)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
            </button>

            {inAdminMode && (
              <button
                onClick={handleOpenEditMedia}
                style={{
                  marginTop: "20px",
                  marginLeft: "12px",
                  padding: "12px 32px",
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
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1))";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                ✏️ Edit Media
              </button>
            )}
          </div>

          {media.teaser_link && extractYoutubeId(media.teaser_link) ? (
            <div>
              <h3 style={pageStyles.sectionTitle}>Trailer</h3>
              <div style={pageStyles.playerContainer}>
                <iframe
                  style={pageStyles.playerIframe}
                  src={`https://www.youtube.com/embed/${extractYoutubeId(media.teaser_link)}?rel=0&modestbranding=1&autoplay=0`}
                  title={`${media.name} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : null}

          <div style={pageStyles.infoCard}>
            <div style={pageStyles.infoRow}>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>IMDB Rating</span>
                <span style={pageStyles.infoValue}>{media.imdb_rating || "N/A"}</span>
              </div>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>User Rating</span>
                <span style={pageStyles.infoValue}>{media.user_rating || "N/A"}</span>
              </div>
              <div style={pageStyles.infoField}>
                <span style={pageStyles.infoLabel}>Duration</span>
                <span style={pageStyles.infoValue}>{media.duration} min</span>
              </div>
            </div>

            {media.description && (
              <div style={{ marginTop: "24px" }}>
                <span style={pageStyles.descriptionLabel}>Description</span>
                <p style={pageStyles.descriptionText}>{media.description}</p>
              </div>
            )}
          </div>

          {directors.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>
                Director{directors.length > 1 ? "s" : ""}
              </h3>
              <div style={pageStyles.cardsContainer}>
                {directors.map((dir) => (
                  <MediaCard
                    key={dir.id}
                    id={dir.id}
                    title={dir.name}
                    type="person"
                    image={dir.profile_image}
                    onDelete={inAdminMode ? handleDeleteDirectorFromMedia : null}
                    showDeleteButton={inAdminMode}
                  />
                ))}
                {inAdminMode && (
                  <div
                    onClick={() => setShowAddDirectorModal(true)}
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

          {cast.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>Cast</h3>
              <div style={pageStyles.cardsContainer}>
                {cast.map((actor) => (
                  <MediaCard
                    key={actor.id}
                    id={actor.id}
                    title={actor.name}
                    type="person"
                    image={actor.profile_image}
                    onDelete={inAdminMode ? handleDeleteCastFromMedia : null}
                    showDeleteButton={inAdminMode}
                  />
                ))}
                {inAdminMode && (
                  <div
                    onClick={() => setShowAddCastModal(true)}
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

          {awards.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>Awards</h3>
              <div style={pageStyles.cardsContainer}>
                {awards.map((a, idx) => (
                  <AwardCard key={idx} award={a} />
                ))}
              </div>
            </>
          )}

          {seasons.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>Seasons</h3>
              <div style={pageStyles.cardsContainer}>
                {seasons.map((season) => (
                  <SeasonCard 
                    key={season.id} 
                    season={season} 
                    onDelete={inAdminMode ? handleDeleteSeason : null}
                    showDeleteButton={inAdminMode}
                  />
                ))}
                {inAdminMode && (
                  <div
                    onClick={() => setShowAddSeasonModal(true)}
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
                  placeholder="Share your thoughts about this media..."
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
            mediaId={parseInt(id)} 
            currentUserId={userId}
          />

          {/* Add Director Modal */}
          {showAddDirectorModal && (
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
                <h3 style={{ color: "#a855f7", marginBottom: "20px" }}>Add Director</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Person ID *</label>
                  <input
                    type="number"
                    value={addDirectorForm.person_id}
                    onChange={(e) => setAddDirectorForm({ ...addDirectorForm, person_id: e.target.value })}
                    placeholder="Enter person ID"
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
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Name (for reference)</label>
                  <input
                    type="text"
                    value={addDirectorForm.name}
                    onChange={(e) => setAddDirectorForm({ ...addDirectorForm, name: e.target.value })}
                    placeholder="Enter name"
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
                    onClick={handleAddDirector}
                    disabled={addingItem}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #a855f7, #668ef7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                      opacity: addingItem ? 0.7 : 1,
                    }}
                  >
                    {addingItem ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => setShowAddDirectorModal(false)}
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

          {/* Add Cast Modal */}
          {showAddCastModal && (
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
                <h3 style={{ color: "#a855f7", marginBottom: "20px" }}>Add Cast Member</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Person ID *</label>
                  <input
                    type="number"
                    value={addCastForm.person_id}
                    onChange={(e) => setAddCastForm({ ...addCastForm, person_id: e.target.value })}
                    placeholder="Enter person ID"
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
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Name (for reference)</label>
                  <input
                    type="text"
                    value={addCastForm.name}
                    onChange={(e) => setAddCastForm({ ...addCastForm, name: e.target.value })}
                    placeholder="Enter name"
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
                    onClick={handleAddCast}
                    disabled={addingItem}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #a855f7, #668ef7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                      opacity: addingItem ? 0.7 : 1,
                    }}
                  >
                    {addingItem ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => setShowAddCastModal(false)}
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

          {/* Add Season Modal */}
          {showAddSeasonModal && (
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
                <h3 style={{ color: "#a855f7", marginBottom: "20px" }}>Add Season</h3>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Season Number *</label>
                  <input
                    type="number"
                    value={addSeasonForm.number}
                    onChange={(e) => setAddSeasonForm({ ...addSeasonForm, number: e.target.value })}
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
                    value={addSeasonForm.title}
                    onChange={(e) => setAddSeasonForm({ ...addSeasonForm, title: e.target.value })}
                    placeholder="Season title (optional)"
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
                  <label style={{ color: "#ffffff", display: "block", marginBottom: "8px", fontWeight: "600" }}>Release Date *</label>
                  <input
                    type="date"
                    value={addSeasonForm.release_date}
                    onChange={(e) => setAddSeasonForm({ ...addSeasonForm, release_date: e.target.value })}
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
                    onClick={handleAddSeason}
                    disabled={addingItem}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #a855f7, #668ef7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                      opacity: addingItem ? 0.7 : 1,
                    }}
                  >
                    {addingItem ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => setShowAddSeasonModal(false)}
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

          {showEditMediaModal && (
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
              onClick={() => setShowEditMediaModal(false)}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "12px",
                  padding: "32px",
                  maxWidth: "600px",
                  width: "90%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ color: "#a855f7", marginBottom: "24px", fontSize: "1.5rem", fontWeight: "700" }}>Edit Media</h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Media Name *</label>
                  <input
                    type="text"
                    value={editMediaForm.name}
                    onChange={(e) => setEditMediaForm({ ...editMediaForm, name: e.target.value })}
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
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Description</label>
                  <textarea
                    value={editMediaForm.description}
                    onChange={(e) => setEditMediaForm({ ...editMediaForm, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      minHeight: "100px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>IMDB Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={editMediaForm.imdb_rating}
                      onChange={(e) => setEditMediaForm({ ...editMediaForm, imdb_rating: e.target.value })}
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
                  <div>
                    <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Duration (minutes)</label>
                    <input
                      type="number"
                      value={editMediaForm.duration}
                      onChange={(e) => setEditMediaForm({ ...editMediaForm, duration: e.target.value })}
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
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Release Date</label>
                  <input
                    type="date"
                    value={editMediaForm.release_date}
                    onChange={(e) => setEditMediaForm({ ...editMediaForm, release_date: e.target.value })}
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
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Teaser Link (YouTube)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={editMediaForm.teaser_link}
                    onChange={(e) => setEditMediaForm({ ...editMediaForm, teaser_link: e.target.value })}
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
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Thumbnail URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={editMediaForm.thumbnail}
                    onChange={(e) => setEditMediaForm({ ...editMediaForm, thumbnail: e.target.value })}
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
                    onClick={handleEditMedia}
                    disabled={editingMedia}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: editingMedia ? "not-allowed" : "pointer",
                      opacity: editingMedia ? 0.7 : 1,
                    }}
                  >
                    {editingMedia ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setShowEditMediaModal(false)}
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

export default MediaPage;