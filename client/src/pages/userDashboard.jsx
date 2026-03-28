import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import MediaCard from "../components/MediaCard";
import CategoryRow from "../components/CategoryRow";

const UserDashboard = () => {
  const [allMedia, setAllMedia] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [criticallyAcclaimed, setCriticallyAcclaimed] = useState([]);
  const [watchlistMedia, setWatchlistMedia] = useState([]);
  const [awardWinners, setAwardWinners] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [starStudded, setStarStudded] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.id;

        const res = await fetch(`http://localhost:5000/api/home/${userId}`);
        const data = await res.json();

        if (data.success) {
          setAllMedia(data.allMedia);
          setHighlyRated(data.highlyRated);
          setCriticallyAcclaimed(data.criticallyAcclaimed);
          setWatchlistMedia(data.watchlistMedia);
          setAwardWinners(data.awardWinners);
          setTrending(data.trending);
          setRecommended(data.recommended);
          setStarStudded(data.starStudded);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHome();
  }, []);

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">
        {/* SORT + SEARCH */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary">Sort</button>

          <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search..."
            />
            <button className="btn btn-outline-success">Search</button>
          </form>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          <div
            className="d-flex flex-wrap justify-content-start"
            style={{ gap: "20px" }}
          >
            {allMedia.map((item) => (
              <MediaCard
                id={item.id}
                title={item.name}
                image={item.thumbnail}
              />
            ))}
          </div>
        </div>

        <hr className="my-4" />

        {/* CATEGORY ROWS */}
        <CategoryRow title="Highly Rated" list={highlyRated} />
        <CategoryRow title="Critically Acclaimed" list={criticallyAcclaimed} />
        <CategoryRow title="From Your Watchlist" list={watchlistMedia} />
        <CategoryRow title="Award Winners" list={awardWinners} />
        <CategoryRow title="Trending" list={trending} />
        <CategoryRow title="Recommended For You" list={recommended} />
        <CategoryRow title="Star Studded" list={starStudded} />
      </div>
    </>
  );
};

export default UserDashboard;