BEGIN;

-- USERS
CREATE TABLE users (
    username TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT
);

-- GENRE
CREATE TABLE genre (
    name TEXT PRIMARY KEY
);

CREATE TABLE user_genre_preference (
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    genre_name TEXT REFERENCES genre(name) ON DELETE CASCADE,
    PRIMARY KEY (username, genre_name)
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
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    PRIMARY KEY (username, person_id)
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
    media_type TEXT CHECK (media_type IN ('movie', 'series')),
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
    user_rating NUMERIC(3,1)
);

CREATE TABLE episode (
    id SERIAL PRIMARY KEY,
    season_id INT REFERENCES season(id) ON DELETE CASCADE,
    number INT NOT NULL,
    imdb_rating NUMERIC(3,1),
    user_rating NUMERIC(3,1)
);

CREATE TABLE media_genre (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    genre_name TEXT REFERENCES genre(name) ON DELETE CASCADE,
    PRIMARY KEY (media_id, genre_name)
);

CREATE TABLE media_person_role (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('actor', 'director')),
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
    user_id TEXT REFERENCES users(username) ON DELETE CASCADE,
    media_id INT REFERENCES media(id),
    season_id INT REFERENCES season(id),
    episode_id INT REFERENCES episode(id),
    star_point INT CHECK (star_point BETWEEN 1 AND 5),
    description TEXT,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPLY
CREATE TABLE reply (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(username) ON DELETE CASCADE,
    parent_review_id INT REFERENCES review(id) ON DELETE CASCADE,
    parent_reply_id INT REFERENCES reply(id) ON DELETE CASCADE,
    description TEXT,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WATCHLIST
CREATE TABLE watchlist (
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    PRIMARY KEY (username, media_id)
);

COMMIT;
