import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";

const PersonPage = () => {
  const { id } = useParams();

  const [person, setPerson] = useState(null);
  const [mediaList, setMediaList] = useState([]);

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

  if (!person) return <p>Loading...</p>;

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        <div className="text-center">
          <img
            src={person.profile_image || "/images/placeholder.png"}
            alt={person.name}
            onError={(e) => (e.target.src = "/images/placeholder.png")}
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
            whiteSpace: "nowrap",
          }}
        >
          {mediaList.length > 0 ? (
            mediaList.map((media) => (
              <MediaCard
                id={media.id}
                title={media.name}
                image={media.thumbnail}
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