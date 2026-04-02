import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";

const PersonPage = () => {
  const { id } = useParams();

  const [person, setPerson] = useState(null);
  const [mediaList, setMediaList] = useState([]);

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
          {/* Header Section */}
          <div style={pageStyles.header}>
            <img
              src={person.profile_image || "/images/placeholder.png"}
              alt={person.name}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
              style={pageStyles.profileImage}
            />
            <h2 style={pageStyles.name}>{person.name}</h2>
            <p style={pageStyles.occupation}>{person.occupation}</p>
          </div>

          {/* Biography Section */}
          {person.biography && (
            <div style={pageStyles.bioCard}>
              <h4 style={pageStyles.bioLabel}>Biography</h4>
              <p style={pageStyles.bioText}>{person.biography}</p>
            </div>
          )}

          {/* Media Appearances Section */}
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

          {/* Empty State */}
          {mediaList.length === 0 && (
            <div style={pageStyles.emptyState}>
              <p style={pageStyles.emptyStateText}>
                No media associated with this person yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonPage;