import React, { Fragment, useEffect, useState } from "react";

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
            <h1 className="text-center mt-5">Movie er namsomuho</h1>

            <ul className="mt-4">
                {movies.map(movie => (
                    <li key={movie.id}>{movie.name}</li>
                ))}
            </ul>
        </Fragment>
    );
};

export default Movies;