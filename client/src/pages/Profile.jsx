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
    const loadProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setWatchlist(data.watchlist);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, [userId]);

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        <div className="d-flex justify-content-center mb-3">
          <img
            src={user?.profile_picture || "/images/placeholder.png"}
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

        <div className="p-4 bg-light shadow-sm rounded mb-3">
          {user ? (
            <>
              <h4>{user.name}</h4>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Joined:</strong> {new Date(user.created_at).toDateString()}</p>

              <button className="btn btn-outline-primary mt-2">
                Edit Your Info
              </button>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

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
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.name}
                image={item.thumbnail}
              />

            ))
          ) : (
            <p className="text-muted">No items in watchlist</p>
          )}
        </div>

        <hr />

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

        <div className="p-4 bg-light shadow-sm rounded" style={{ minHeight: "200px" }}>
          <p className="text-muted text-center mt-5">
            No content yet — coming soon.
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;