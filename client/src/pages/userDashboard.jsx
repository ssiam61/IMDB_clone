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
    const fetchEverything = async () => {
      try {
        const mediaRes = await fetch("http://localhost:5000/media");
        const mediaData = await mediaRes.json();
        setAllMedia(mediaData);

        setHighlyRated([...mediaData].sort((a, b) => b.user_rating - a.user_rating));

        setCriticallyAcclaimed([...mediaData].sort((a, b) => b.imdb_rating - a.imdb_rating));

        const wlRes = await fetch("http://localhost:5000/watchlist");
        const wlData = await wlRes.json();
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.id;
        const filteredWL = wlData.filter(w => w.user_id === userId).map(w => w.media_id);
        setWatchlistMedia(mediaData.filter(m => filteredWL.includes(m.id)));

        const awardRes = await fetch("http://localhost:5000/media_award");
        const awardData = await awardRes.json();
        const awardMediaIds = [...new Set(awardData.map(a => a.media_id))];
        setAwardWinners(mediaData.filter(m => awardMediaIds.includes(m.id)));

        const reviewRes = await fetch("http://localhost:5000/review");
        const reviewData = await reviewRes.json();

        const reviewCount = {};
        reviewData.forEach(r => {
          if (!reviewCount[r.media_id]) reviewCount[r.media_id] = 0;
          reviewCount[r.media_id]++;
        });

        setTrending(
          [...mediaData].sort(
            (a, b) => (reviewCount[b.id] || 0) - (reviewCount[a.id] || 0)
          )
        );

        const prefRes = await fetch("http://localhost:5000/preference");
        const prefData = await prefRes.json();
        const userPrefGenres = prefData.filter(p => p.user_id === userId).map(p => p.genre_id);

        const mgRes = await fetch("http://localhost:5000/media_genre");
        const mgData = await mgRes.json();

        const recommendedIds = mgData
          .filter(mg => userPrefGenres.includes(mg.genre_id))
          .map(mg => mg.media_id);

        setRecommended(mediaData.filter(m => recommendedIds.includes(m.id)));

        const fanRes = await fetch("http://localhost:5000/fan");
        const fanData = await fanRes.json();
        const userFanActors = fanData.filter(f => f.user_id === userId).map(f => f.person_id);

        const mpRes = await fetch("http://localhost:5000/media_personality");
        const mpData = await mpRes.json();

        const starredMedia = [...new Set(
          mpData
            .filter(mp => userFanActors.includes(mp.person_id))
            .map(mp => mp.media_id)
        )];

        setStarStudded(mediaData.filter(m => starredMedia.includes(m.id)));

      } catch (err) {
        console.error(err);
      }
    };

    fetchEverything();
  }, []);

  return (
    <>
      <UserNavbar />

      <div className="container mt-4">

        {}
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

        {}
        <div 
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px"
          }}
        >
          <div
            className="d-flex flex-wrap justify-content-start"
            style={{ gap: "20px" }}
          >
            {allMedia.map((item) => (
              <MediaCard key={item.id} id={item.id} title={item.name} />
            ))}
          </div>
        </div>

        <hr className="my-4" />

        {}
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
