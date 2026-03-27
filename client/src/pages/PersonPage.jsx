import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const loadPersonInfo = async () => {
      try {
        const personRes = await fetch(`http://localhost:5000/person/${id}`);
        const personData = await personRes.json();
        setPerson(personData);

        const mpRes = await fetch("http://localhost:5000/media_personality");
        const mpData = await mpRes.json();

        const mediaIds = mpData
          .filter(m => m.person_id == id)
          .map(m => m.media_id);

        const mediaRes = await fetch("http://localhost:5000/media");
        const allMedia = await mediaRes.json();

        setMediaList(allMedia.filter(m => mediaIds.includes(m.id)));

      } catch (err) {
        console.error("Error loading person page:", err);
      }
    };

    loadPersonInfo();
  }, [id]);

  if (!person) return <p>Loading...</p>;

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">
        <div className="text-center">
        <img
        src={person.picture}
        onError={(e) => (e.target.src = "/images/placeholder.png")}
        alt={person.name}
        style={{
            width: "260px",
            height: "360px",
            borderRadius: "10px",
            objectFit: "cover"
        }}
        />
          <h2 className="mt-3">{person.name}</h2>
          <h5 className="text-muted">{person.occupation}</h5>
        </div>

        <div className="p-4 bg-light shadow-sm rounded my-4">
          <h4>Biography</h4>
          <p>{person.biography || "No biography available."}</p>
        </div>

        <h4>Appears In</h4>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingTop: "5px",
            paddingBottom: "10px",
            whiteSpace: "nowrap"
          }}
        >
          {mediaList.length > 0 ? (
            mediaList.map(media => (
              <MediaCard
                key={media.id}
                id={media.id}
                title={media.name}
              />
            ))
          ) : (
            <p className="text-muted">No media associated with this person.</p>
          )}
        </div>

      </div>
    </>
  );
};

export default PersonPage;