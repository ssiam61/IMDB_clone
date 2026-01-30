BEGIN;

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT
);

-- GENRE
CREATE TABLE genre (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_genre_preference (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genre(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, genre_id)
);

-- PERSON
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    occupation TEXT,
    picture TEXT,
    biography TEXT
);

CREATE TABLE user_fan (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, person_id)
);

-- AWARD
CREATE TABLE award (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    awarded_by TEXT,
    prize_money NUMERIC
);

CREATE TABLE person_award (
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    award_id INT REFERENCES award(id) ON DELETE CASCADE,
    year INT,
    PRIMARY KEY (person_id, award_id, year)
);

-- MEDIA
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    media_type TEXT CHECK (media_type IN ('movie', 'series')) NOT NULL,
    name TEXT NOT NULL,
    teaser_link TEXT,
    description TEXT,
    imdb_rating NUMERIC(3,1),
    user_rating NUMERIC(3,1),
    duration INT
);

CREATE TABLE movie (
    media_id INT PRIMARY KEY REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE series (
    media_id INT PRIMARY KEY REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE season (
    id SERIAL PRIMARY KEY,
    series_id INT REFERENCES series(media_id) ON DELETE CASCADE,
    number INT NOT NULL,
    imdb_rating NUMERIC(3,1),
    user_rating NUMERIC(3,1),
    UNIQUE (series_id, number)
);

CREATE TABLE episode (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES season(id) ON DELETE CASCADE,
    number INT NOT NULL,
    imdb_rating NUMERIC(3,1),
    user_rating NUMERIC(3,1),
    UNIQUE (season_id, number)
);

CREATE TABLE media_genre (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genre(id) ON DELETE CASCADE,
    PRIMARY KEY (media_id, genre_id)
);

CREATE TABLE media_person_role (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('actor', 'director', 'writer', 'producer')),
    PRIMARY KEY (media_id, person_id, role)
);

CREATE TABLE media_award (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    award_id INT REFERENCES award(id) ON DELETE CASCADE,
    year INT,
    PRIMARY KEY (media_id, award_id, year)
);

-- REVIEW / POST
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    media_id INT REFERENCES media(id),
    season_id INT REFERENCES season(id),
    episode_id INT REFERENCES episode(id),
    star_point INT CHECK (star_point BETWEEN 1 AND 5),
    description TEXT,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        media_id IS NOT NULL
        OR season_id IS NOT NULL
        OR episode_id IS NOT NULL
    )
);

-- REPLY
CREATE TABLE reply (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    parent_review_id INT REFERENCES review(id) ON DELETE CASCADE,
    parent_reply_id INT REFERENCES reply(id) ON DELETE CASCADE,
    description TEXT,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CHECK(
    		(parent_review_id IS NOT NULL AND parent_reply_id IS NULL)
 			OR (parent_review_id IS NULL AND parent_reply_id IS NOT NULL)
	)
);

-- WATCHLIST
CREATE TABLE watchlist (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, media_id)
);

COMMIT;
