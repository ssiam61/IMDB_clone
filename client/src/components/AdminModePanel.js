import React, { useState } from "react";
import { authenticatedFetch, getUser } from "../utils/auth";

const AdminModePanel = () => {
  const userId = getUser()?.id;
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [awardForm, setAwardForm] = useState({
    name: "",
    awarded_by: "",
    prize_money: "",
  });

  const [personForm, setPersonForm] = useState({
    name: "",
    occupation: "",
    profile_image: "",
    biography: "",
  });

  const [mediaForm, setMediaForm] = useState({
    name: "",
    media_type: "movie",
    teaser_link: "",
    thumbnail: "",
    description: "",
    imdb_rating: "",
    duration: "",
    release_date: "",
  });

  const [awardEventForm, setAwardEventForm] = useState({
    type: "person",
    person_id: "",
    media_id: "",
    award_id: "",
    year: new Date().getFullYear().toString(),
    result: "win",
  });

  const panelStyles = {
    container: {
      background: "linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)",
      border: "1px solid rgba(168, 85, 247, 0.2)",
      borderRadius: "12px",
      padding: "32px",
      marginTop: "20px",
      marginBottom: "20px",
      backdropFilter: "blur(10px)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "800",
      background: "linear-gradient(135deg, #a855f7, #ff5a7e)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "24px",
      textAlign: "center",
    },
    buttonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "16px",
      marginBottom: "32px",
    },
    formButton: {
      padding: "16px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 90, 126, 0.2))",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      color: "#ffffff",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "14px",
    },
    formContainer: {
      background: "rgba(255, 90, 126, 0.05)",
      border: "1px solid rgba(168, 85, 247, 0.2)",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "24px",
    },
    formTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#a855f7",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeButton: {
      background: "rgba(255, 90, 126, 0.2)",
      border: "none",
      borderRadius: "4px",
      color: "#ff5a7e",
      cursor: "pointer",
      padding: "4px 12px",
      fontWeight: "600",
      fontSize: "14px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "600",
      display: "flex",
      gap: "4px",
    },
    required: {
      color: "#ff5a7e",
    },
    input: {
      padding: "12px",
      background: "#254061",
      border: "1px solid rgba(255, 90, 126, 0.3)",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
    },
    textarea: {
      padding: "12px",
      background: "#254061",
      border: "1px solid rgba(255, 90, 126, 0.3)",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    select: {
      padding: "12px",
      background: "#254061",
      border: "1px solid rgba(255, 90, 126, 0.3)",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
    },
    submitButton: {
      padding: "14px 32px",
      background: "linear-gradient(135deg, #a855f7, #668ef7)",
      border: "none",
      borderRadius: "8px",
      color: "#ffffff",
      fontWeight: "700",
      fontSize: "14px",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      opacity: loading ? 0.7 : 1,
    },
    messageBox: {
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
      fontSize: "14px",
      fontWeight: "600",
    },
  };

  const validateForm = (data, fields) => {
    const missing = fields.filter(field => !data[field] || data[field].toString().trim() === "");
    if (missing.length > 0) {
      setMessage(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleAddAward = async (e) => {
    e.preventDefault();
    if (!validateForm(awardForm, ["name", "awarded_by"])) return;

    setLoading(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/award/add",
        {
          method: "POST",
          body: JSON.stringify(awardForm),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("Award added successfully!");
        setAwardForm({ name: "", awarded_by: "", prize_money: "" });
        setTimeout(() => setActiveForm(null), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!validateForm(personForm, ["name", "occupation"])) return;

    setLoading(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/person/add",
        {
          method: "POST",
          body: JSON.stringify(personForm),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("Person added successfully!");
        setPersonForm({
          name: "",
          occupation: "",
          profile_image: "",
          biography: "",
        });
        setTimeout(() => setActiveForm(null), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!validateForm(mediaForm, ["name", "media_type", "release_date"])) return;

    setLoading(true);
    try {
      const res = await authenticatedFetch(
        "http://localhost:5000/api/admin/media/add",
        {
          method: "POST",
          body: JSON.stringify(mediaForm),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("Media added successfully!");
        setMediaForm({
          name: "",
          media_type: "movie",
          teaser_link: "",
          thumbnail: "",
          description: "",
          imdb_rating: "",
          duration: "",
          release_date: "",
        });
        setTimeout(() => setActiveForm(null), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAwardEvent = async (e) => {
    e.preventDefault();
    const requiredFields = ["award_id", "year"];
    if (awardEventForm.type === "person" && !awardEventForm.person_id) requiredFields.push("person_id");
    if (awardEventForm.type === "media") requiredFields.push("media_id", "result");

    if (!validateForm(awardEventForm, requiredFields)) return;

    setLoading(true);
    try {
      const endpoint =
        awardEventForm.type === "person"
          ? "http://localhost:5000/api/admin/award-event/add-person"
          : "http://localhost:5000/api/admin/award-event/add-media";

      const res = await authenticatedFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(awardEventForm),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Award event added successfully!");
        setAwardEventForm({
          type: "person",
          person_id: "",
          media_id: "",
          award_id: "",
          year: new Date().getFullYear().toString(),
          result: "win",
        });
        setTimeout(() => setActiveForm(null), 2000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={panelStyles.container}>
      <h2 style={panelStyles.title}>🔧 Admin Control Panel</h2>

      <div style={panelStyles.buttonGrid}>
        <button
          onClick={() => setActiveForm("award")}
          style={{
            ...panelStyles.formButton,
            background: activeForm === "award" ? "linear-gradient(135deg, #a855f7, #ff5a7e)" : "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 90, 126, 0.2))",
          }}
        >
          🏆 Add Award
        </button>
        <button
          onClick={() => setActiveForm("person")}
          style={{
            ...panelStyles.formButton,
            background: activeForm === "person" ? "linear-gradient(135deg, #a855f7, #ff5a7e)" : "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 90, 126, 0.2))",
          }}
        >
          👤 Add Actor/Director
        </button>
        <button
          onClick={() => setActiveForm("media")}
          style={{
            ...panelStyles.formButton,
            background: activeForm === "media" ? "linear-gradient(135deg, #a855f7, #ff5a7e)" : "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 90, 126, 0.2))",
          }}
        >
          🎬 Add Media
        </button>
        <button
          onClick={() => setActiveForm("award-event")}
          style={{
            ...panelStyles.formButton,
            background: activeForm === "award-event" ? "linear-gradient(135deg, #a855f7, #ff5a7e)" : "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 90, 126, 0.2))",
          }}
        >
          🎖️ Add Award Event
        </button>
      </div>

      {activeForm === "award" && (
        <div style={panelStyles.formContainer}>
          <div style={panelStyles.formTitle}>
            🏆 Add New Award
            <button
              onClick={() => setActiveForm(null)}
              style={panelStyles.closeButton}
            >
              Close
            </button>
          </div>
          {message && (
            <div
              style={{
                ...panelStyles.messageBox,
                background: message.includes("Error") ? "rgba(255, 90, 126, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: message.includes("Error") ? "#ff5a7e" : "#a855f7",
              }}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleAddAward}>
            <div style={panelStyles.formGrid}>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Award Name <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={awardForm.name}
                  onChange={(e) =>
                    setAwardForm({ ...awardForm, name: e.target.value })
                  }
                  placeholder="e.g., Academy Award"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Awarded By <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={awardForm.awarded_by}
                  onChange={(e) =>
                    setAwardForm({ ...awardForm, awarded_by: e.target.value })
                  }
                  placeholder="e.g., The Academy"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>Prize Money</label>
                <input
                  type="number"
                  value={awardForm.prize_money}
                  onChange={(e) =>
                    setAwardForm({ ...awardForm, prize_money: e.target.value })
                  }
                  placeholder="Optional prize amount"
                  style={panelStyles.input}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={panelStyles.submitButton}
            >
              {loading ? "Adding..." : "Add Award"}
            </button>
          </form>
        </div>
      )}

      {activeForm === "person" && (
        <div style={panelStyles.formContainer}>
          <div style={panelStyles.formTitle}>
            👤 Add Actor or Director
            <button
              onClick={() => setActiveForm(null)}
              style={panelStyles.closeButton}
            >
              Close
            </button>
          </div>
          {message && (
            <div
              style={{
                ...panelStyles.messageBox,
                background: message.includes("Error") ? "rgba(255, 90, 126, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: message.includes("Error") ? "#ff5a7e" : "#a855f7",
              }}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleAddPerson}>
            <div style={panelStyles.formGrid}>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Full Name <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={personForm.name}
                  onChange={(e) =>
                    setPersonForm({ ...personForm, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Occupation <span style={panelStyles.required}>*</span>
                </label>
                <select
                  value={personForm.occupation}
                  onChange={(e) =>
                    setPersonForm({ ...personForm, occupation: e.target.value })
                  }
                  style={panelStyles.select}
                >
                  <option value="">Select occupation</option>
                  <option value="actor">Actor</option>
                  <option value="director">Director</option>
                </select>
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>Profile Image URL</label>
                <input
                  type="text"
                  value={personForm.profile_image}
                  onChange={(e) =>
                    setPersonForm({
                      ...personForm,
                      profile_image: e.target.value,
                    })
                  }
                  placeholder="Image URL"
                  style={panelStyles.input}
                />
              </div>
            </div>
            <div style={panelStyles.formGroup}>
              <label style={panelStyles.label}>Biography</label>
              <textarea
                value={personForm.biography}
                onChange={(e) =>
                  setPersonForm({ ...personForm, biography: e.target.value })
                }
                placeholder="Enter biography (optional)"
                style={panelStyles.textarea}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={panelStyles.submitButton}
            >
              {loading ? "Adding..." : "Add Person"}
            </button>
          </form>
        </div>
      )}

      {activeForm === "media" && (
        <div style={panelStyles.formContainer}>
          <div style={panelStyles.formTitle}>
            🎬 Add New Media
            <button
              onClick={() => setActiveForm(null)}
              style={panelStyles.closeButton}
            >
              Close
            </button>
          </div>
          {message && (
            <div
              style={{
                ...panelStyles.messageBox,
                background: message.includes("Error") ? "rgba(255, 90, 126, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: message.includes("Error") ? "#ff5a7e" : "#a855f7",
              }}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleAddMedia}>
            <div style={panelStyles.formGrid}>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Title <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={mediaForm.name}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, name: e.target.value })
                  }
                  placeholder="Media title"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Type <span style={panelStyles.required}>*</span>
                </label>
                <select
                  value={mediaForm.media_type}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, media_type: e.target.value })
                  }
                  style={panelStyles.select}
                >
                  <option value="movie">Movie</option>
                  <option value="series">Series</option>
                </select>
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Release Date <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="date"
                  value={mediaForm.release_date}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, release_date: e.target.value })
                  }
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>Duration (minutes)</label>
                <input
                  type="number"
                  value={mediaForm.duration}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, duration: e.target.value })
                  }
                  placeholder="Duration in minutes"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>Thumbnail URL</label>
                <input
                  type="text"
                  value={mediaForm.thumbnail}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, thumbnail: e.target.value })
                  }
                  placeholder="Thumbnail image URL"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>Teaser Link</label>
                <input
                  type="text"
                  value={mediaForm.teaser_link}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, teaser_link: e.target.value })
                  }
                  placeholder="Teaser/trailer URL"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>IMDb Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={mediaForm.imdb_rating}
                  onChange={(e) =>
                    setMediaForm({ ...mediaForm, imdb_rating: e.target.value })
                  }
                  placeholder="Rating 0-10"
                  style={panelStyles.input}
                />
              </div>
            </div>
            <div style={panelStyles.formGroup}>
              <label style={panelStyles.label}>Description</label>
              <textarea
                value={mediaForm.description}
                onChange={(e) =>
                  setMediaForm({ ...mediaForm, description: e.target.value })
                }
                placeholder="Enter media description"
                style={panelStyles.textarea}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={panelStyles.submitButton}
            >
              {loading ? "Adding..." : "Add Media"}
            </button>
          </form>
        </div>
      )}

      {activeForm === "award-event" && (
        <div style={panelStyles.formContainer}>
          <div style={panelStyles.formTitle}>
            🎖️ Add Award Event
            <button
              onClick={() => setActiveForm(null)}
              style={panelStyles.closeButton}
            >
              Close
            </button>
          </div>
          {message && (
            <div
              style={{
                ...panelStyles.messageBox,
                background: message.includes("Error") ? "rgba(255, 90, 126, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: message.includes("Error") ? "#ff5a7e" : "#a855f7",
              }}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleAddAwardEvent}>
            <div style={panelStyles.formGrid}>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Award Event Type <span style={panelStyles.required}>*</span>
                </label>
                <select
                  value={awardEventForm.type}
                  onChange={(e) => {
                    setAwardEventForm({ ...awardEventForm, type: e.target.value });
                    setMessage("");
                  }}
                  style={panelStyles.select}
                >
                  <option value="person">Person Award</option>
                  <option value="media">Media Award</option>
                </select>
              </div>
              {awardEventForm.type === "person" ? (
                <>
                  <div style={panelStyles.formGroup}>
                    <label style={panelStyles.label}>
                      Person ID <span style={panelStyles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={awardEventForm.person_id}
                      onChange={(e) =>
                        setAwardEventForm({
                          ...awardEventForm,
                          person_id: e.target.value,
                        })
                      }
                      placeholder="Enter person ID"
                      style={panelStyles.input}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={panelStyles.formGroup}>
                    <label style={panelStyles.label}>
                      Media ID <span style={panelStyles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={awardEventForm.media_id}
                      onChange={(e) =>
                        setAwardEventForm({
                          ...awardEventForm,
                          media_id: e.target.value,
                        })
                      }
                      placeholder="Enter media ID"
                      style={panelStyles.input}
                    />
                  </div>
                  <div style={panelStyles.formGroup}>
                    <label style={panelStyles.label}>
                      Result <span style={panelStyles.required}>*</span>
                    </label>
                    <select
                      value={awardEventForm.result}
                      onChange={(e) =>
                        setAwardEventForm({
                          ...awardEventForm,
                          result: e.target.value,
                        })
                      }
                      style={panelStyles.select}
                    >
                      <option value="win">Win</option>
                      <option value="nomination">Nomination</option>
                    </select>
                  </div>
                </>
              )}
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Award ID <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={awardEventForm.award_id}
                  onChange={(e) =>
                    setAwardEventForm({
                      ...awardEventForm,
                      award_id: e.target.value,
                    })
                  }
                  placeholder="Enter award ID"
                  style={panelStyles.input}
                />
              </div>
              <div style={panelStyles.formGroup}>
                <label style={panelStyles.label}>
                  Year <span style={panelStyles.required}>*</span>
                </label>
                <input
                  type="number"
                  value={awardEventForm.year}
                  onChange={(e) =>
                    setAwardEventForm({
                      ...awardEventForm,
                      year: e.target.value,
                    })
                  }
                  placeholder="Award year"
                  style={panelStyles.input}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={panelStyles.submitButton}
            >
              {loading ? "Adding..." : "Add Award Event"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminModePanel;
