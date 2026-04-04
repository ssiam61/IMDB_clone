import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import { authenticatedFetch, getUser, getInAdminMode } from "../utils/auth";

const PersonPage = () => {
  const { id } = useParams();
  const userId = getUser()?.id;

  const [person, setPerson] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [isFan, setIsFan] = useState(false);
  const [fanLoading, setFanLoading] = useState(false);
  const [inAdminMode, setInAdminMode] = useState(getInAdminMode());
  const [showEditPersonModal, setShowEditPersonModal] = useState(false);
  const [editPersonForm, setEditPersonForm] = useState({
    name: "",
    biography: "",
    profile_image: "",
  });
  const [editingPerson, setEditingPerson] = useState(false);

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
    profileImage: {
      width: "260px",
      height: "360px",
      borderRadius: "15px",
      objectFit: "cover",
      boxShadow: "0 8px 32px rgba(255, 90, 126, 0.2)",
      border: "1px solid rgba(255, 90, 126, 0.2)",
      margin: "0 auto",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    name: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginTop: "24px",
      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-1px",
    },
    occupation: {
      fontSize: "1.1rem",
      color: "#a855f7",
      fontWeight: "600",
      marginTop: "8px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    bioCard: {
      background: "linear-gradient(135deg, rgba(255, 90, 126, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
      border: "1px solid rgba(255, 90, 126, 0.1)",
      borderRadius: "12px",
      padding: "32px",
      marginTop: "40px",
      marginBottom: "40px",
      backdropFilter: "blur(10px)",
    },
    bioLabel: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#ff5a7e",
      marginBottom: "16px",
      paddingBottom: "12px",
      borderBottom: "2px solid rgba(255, 90, 126, 0.2)",
    },
    bioText: {
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
    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#a0aec0",
    },
    emptyStateText: {
      fontSize: "1rem",
      color: "#a0aec0",
    },
  };

  useEffect(() => {
    const loadPerson = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/person/full/${id}`);
        const data = await res.json();

        if (data.success) {
          setPerson(data.person);
          setMediaList(data.mediaList);
        }
      } catch (err) {
        console.error("Error loading person:", err);
      }
    };

    loadPerson();
  }, [id]);

  useEffect(() => {
    const checkFanStatus = async () => {
      if (!userId) return;
      try {
        const res = await authenticatedFetch(
          `http://localhost:5000/api/fan/check/${userId}/${id}`
        );
        const data = await res.json();
        setIsFan(data.isFan);
      } catch (err) {
        console.error("Error checking fan status:", err);
      }
    };

    checkFanStatus();
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

  const handleBecomeFan = async () => {
    if (!userId) return;
    setFanLoading(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/fan/add/${userId}/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        setIsFan(true);
      }
    } catch (err) {
      console.error("Error becoming fan:", err);
    } finally {
      setFanLoading(false);
    }
  };

  const handleRemoveFan = async () => {
    if (!userId) return;
    setFanLoading(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/fan/remove/${userId}/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        setIsFan(false);
      }
    } catch (err) {
      console.error("Error removing fan status:", err);
    } finally {
      setFanLoading(false);
    }
  };

  const handleOpenEditPerson = () => {
    if (person) {
      setEditPersonForm({
        name: person.name || "",
        biography: person.biography || "",
        profile_image: person.profile_image || "",
      });
      setShowEditPersonModal(true);
    }
  };

  const handleEditPerson = async () => {
    if (!editPersonForm.name) {
      alert("Person name is required");
      return;
    }
    setEditingPerson(true);
    try {
      const res = await authenticatedFetch(
        `http://localhost:5000/api/admin/person/edit/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editPersonForm.name,
            biography: editPersonForm.biography,
            profile_image: editPersonForm.profile_image,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setPerson(data.person);
        setEditPersonForm({ name: "", biography: "", profile_image: "" });
        setShowEditPersonModal(false);
        alert("Person updated successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setEditingPerson(false);
    }
  };

  if (!person) return (
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
              src={person.profile_image || "/images/placeholder.png"}
              alt={person.name}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
              style={pageStyles.profileImage}
            />
            <h2 style={pageStyles.name}>{person.name}</h2>
            <p style={pageStyles.occupation}>{person.occupation}</p>
            {person.fan_count !== undefined && (
              <p style={{ fontSize: "1rem", color: "#a0aec0", marginTop: "12px" }}>
                {person.fan_count} {person.fan_count === 1 ? 'Fan' : 'Fans'}
              </p>
            )}
            
            <button
              onClick={isFan ? handleRemoveFan : handleBecomeFan}
              disabled={fanLoading}
              style={{
                marginTop: "20px",
                padding: "12px 32px",
                background: isFan 
                  ? "rgba(255, 90, 126, 0.2)" 
                  : "linear-gradient(135deg, #ff5a7e, #a855f7)",
                border: isFan 
                  ? "1px solid rgba(255, 90, 126, 0.5)" 
                  : "none",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: fanLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: fanLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!fanLoading && !isFan) {
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 90, 126, 0.4)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {isFan ? "⭐ You're a Fan" : "+ Become a Fan"}
            </button>

            {inAdminMode && (
              <button
                onClick={handleOpenEditPerson}
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
                ✏️ Edit Person
              </button>
            )}
          </div>

          {person.biography && (
            <div style={pageStyles.bioCard}>
              <h4 style={pageStyles.bioLabel}>Biography</h4>
              <p style={pageStyles.bioText}>{person.biography}</p>
            </div>
          )}

          {mediaList.length > 0 && (
            <>
              <h3 style={pageStyles.sectionTitle}>Appears In</h3>
              <div style={pageStyles.cardsContainer}>
                {mediaList.map((media) => (
                  <MediaCard
                    key={media.id}
                    id={media.id}
                    title={media.name}
                    image={media.thumbnail}
                  />
                ))}
              </div>
            </>
          )}

          {mediaList.length === 0 && (
            <div style={pageStyles.emptyState}>
              <p style={pageStyles.emptyStateText}>
                No media associated with this person yet.
              </p>
            </div>
          )}

          {showEditPersonModal && (
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
              onClick={() => setShowEditPersonModal(false)}
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
                <h3 style={{ color: "#a855f7", marginBottom: "24px", fontSize: "1.5rem", fontWeight: "700" }}>Edit Person</h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Name *</label>
                  <input
                    type="text"
                    value={editPersonForm.name}
                    onChange={(e) => setEditPersonForm({ ...editPersonForm, name: e.target.value })}
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
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Biography</label>
                  <textarea
                    value={editPersonForm.biography}
                    onChange={(e) => setEditPersonForm({ ...editPersonForm, biography: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255, 90, 126, 0.1)",
                      border: "1px solid rgba(255, 90, 126, 0.3)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      minHeight: "120px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ color: "#b0b8d4", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px", display: "block" }}>Profile Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={editPersonForm.profile_image}
                    onChange={(e) => setEditPersonForm({ ...editPersonForm, profile_image: e.target.value })}
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
                    onClick={handleEditPerson}
                    disabled={editingPerson}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(135deg, #ff5a7e, #a855f7)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: editingPerson ? "not-allowed" : "pointer",
                      opacity: editingPerson ? 0.7 : 1,
                    }}
                  >
                    {editingPerson ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setShowEditPersonModal(false)}
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

export default PersonPage;