import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resUser = await fetch(`http://localhost:5000/users/${userId}`);
        const userData = await resUser.json();
        setUser(userData);


        const wlRes = await fetch("http://localhost:5000/watchlist");
        const wlData = await wlRes.json();

        const mediaIds = wlData
          .filter((w) => w.user_id === userId)
          .map((w) => w.media_id);


        const mediaRes = await fetch("http://localhost:5000/media");
        const mediaData = await mediaRes.json();

        setWatchlist(mediaData.filter((m) => mediaIds.includes(m.id)));
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        {}
        <div className="d-flex justify-content-center mb-3">
          <img
            src="/images/placeholder.png"
            alt="profile"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #ccc"
            }}
          />
        </div>

        {}
        <div className="p-4 bg-light shadow-sm rounded mb-3">
          {user ? (
            <>
              <h4>{user.name}</h4>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Banned:</strong> {user.is_banned ? "Yes" : "No"}</p>

              <button className="btn btn-outline-primary mt-2">
                Edit Your Info
              </button>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {}
        <h5 className="mt-4">Your Watchlist</h5>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px",
            paddingTop: "5px",
            whiteSpace: "nowrap",
          }}
        >
          {watchlist.length > 0 ? (
            watchlist.map((item) => (
              <MediaCard key={item.id} title={item.name} />
            ))
          ) : (
            <p className="text-muted">No items in watchlist</p>
          )}
        </div>

        <hr />

        {}
        <div className="d-flex justify-content-center mb-3">
          <button
            className={
              "btn mx-2 " +
              (activeTab === "posts" ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>

          <button
            className={
              "btn mx-2 " +
              (activeTab === "reviews" ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={
              "btn mx-2 " +
              (activeTab === "replies" ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => setActiveTab("replies")}
          >
            Replies
          </button>
        </div>

        {}
        <div className="p-4 bg-light shadow-sm rounded" style={{ minHeight: "200px" }}>
          {}
          <p className="text-muted text-center mt-5">
            No content yet — coming soon.
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;