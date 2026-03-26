import React, { Fragment, useEffect, useState } from "react";
import MovieCard from "./moviecard";

const Movies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
    const fetchMovies = async () => {
        try {
            const response = await fetch("http://localhost:5000/media");
            const data = await response.json();
            console.log("DATA FROM BACKEND:", data);
            setMovies(data);
        } catch (err) {
            console.error("Error fetching movies:", err);
        }
    };

    fetchMovies();
    }, []);

    return (
        <Fragment>
            <h1 className="text-center mt-5">Movies</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
                {movies.map(movie => (
                    <div className="col" key={movie.id}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default Movies;