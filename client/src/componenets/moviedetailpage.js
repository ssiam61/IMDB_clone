import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetail from "./moviedetail";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/media/${id}`);
        if (!response.ok) throw new Error("Movie not found");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return <MovieDetail movie={movie} />;
};

export default MovieDetailPage;
