CREATE DATABASE IMDBtest;

\c imdbtest;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(500),
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- ADMIN SYSTEM
-- ─────────────────────────────────────────────

-- Admin accounts are always linked to an existing user account.
-- role: 'super_admin' has unrestricted access; 'moderator' handles
-- content/user moderation but cannot manage other admins.
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'moderator'
        CHECK (role IN ('super_admin', 'moderator')),
    granted_by INT REFERENCES admin(id) ON DELETE SET NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log: every significant admin action is recorded here.
-- target_type + target_id identify the affected row (e.g. 'user' + 42,
-- 'media' + 7, 'review' + 99) without requiring individual FK columns
-- for every possible target table.
CREATE TABLE admin_log (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES admin(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,        -- e.g. 'ban_user', 'add_movie', 'delete_review'
    target_type VARCHAR(50),             -- e.g. 'user', 'media', 'review', 'reply'
    target_id INT,                       -- PK of the affected row
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks banned / kicked users.
-- Soft bans (is_temp = TRUE with an expiry) or permanent bans are both supported.
CREATE TABLE user_ban (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    banned_by INT REFERENCES admin(id) ON DELETE SET NULL,
    reason TEXT,
    is_permanent BOOLEAN DEFAULT FALSE,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,               -- NULL means permanent / until lifted
    lifted_at TIMESTAMP,               -- set when ban is manually revoked
    lifted_by INT REFERENCES admin(id) ON DELETE SET NULL,

    CHECK (is_permanent = TRUE OR expires_at IS NOT NULL)
);

-- ─────────────────────────────────────────────
-- GENRE
-- ─────────────────────────────────────────────

CREATE TABLE genre (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE preference (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genre(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, genre_id)
);

-- ─────────────────────────────────────────────
-- PERSON / CELEBRITY
-- ─────────────────────────────────────────────

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    occupation VARCHAR(50),
    picture VARCHAR(500),
    biography TEXT
);

CREATE TABLE fan (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, person_id)
);

-- ─────────────────────────────────────────────
-- AWARDS
-- ─────────────────────────────────────────────

CREATE TABLE award (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    awarded_by VARCHAR(100),
    prize_money NUMERIC
);

CREATE TABLE person_award (
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    award_id INT REFERENCES award(id) ON DELETE CASCADE,
    year INT,
    PRIMARY KEY (person_id, award_id, year)
);

-- ─────────────────────────────────────────────
-- MEDIA (movies, series, etc.)
-- ─────────────────────────────────────────────

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teaser_link VARCHAR(500),
    description TEXT,
    imdb_rating NUMERIC(3,1),
    user_rating NUMERIC(3,1),
    duration INT,
    -- tracks which admin added this entry and whether it has been published
    added_by INT REFERENCES admin(id) ON DELETE SET NULL,
    last_updated_by INT REFERENCES admin(id) ON DELETE SET NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE
);

CREATE TABLE movie (
    id SERIAL PRIMARY KEY,
    media_id INT REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    media_id INT REFERENCES media(id) ON DELETE CASCADE
);

CREATE TABLE season (
    id SERIAL PRIMARY KEY,
    series_id INT REFERENCES series(id) ON DELETE CASCADE,
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

CREATE TABLE media_personality (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    person_id INT REFERENCES person(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('actor', 'director', 'writer', 'producer')),
    PRIMARY KEY (media_id, person_id, role)
);

CREATE TABLE media_award (
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    award_id INT REFERENCES award(id) ON DELETE CASCADE,
    year INT,
    PRIMARY KEY (media_id, award_id, year)
);

-- ─────────────────────────────────────────────
-- REVIEWS & REPLIES
-- ─────────────────────────────────────────────

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    media_id INT REFERENCES media(id),
    season_id INT REFERENCES season(id),
    episode_id INT REFERENCES episode(id),
    star_point INT CHECK (star_point BETWEEN 1 AND 10),
    description VARCHAR(1000),
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    is_removed BOOLEAN DEFAULT FALSE,        -- soft-delete by admin
    removed_by INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (num_nonnulls(media_id, season_id, episode_id) <= 1)
);

CREATE TABLE reply (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    parent_review_id INT REFERENCES review(id) ON DELETE CASCADE,
    parent_reply_id INT REFERENCES reply(id) ON DELETE CASCADE,
    description VARCHAR(1000),
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    is_removed BOOLEAN DEFAULT FALSE,        -- soft-delete by admin
    removed_by INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        (parent_review_id IS NOT NULL AND parent_reply_id IS NULL)
        OR (parent_review_id IS NULL AND parent_reply_id IS NOT NULL)
    )
);

-- Users (or admins) can flag reviews and replies for admin review.
CREATE TABLE report (
    id SERIAL PRIMARY KEY,
    reporter_id INT REFERENCES users(id) ON DELETE SET NULL,
    review_id INT REFERENCES review(id) ON DELETE CASCADE,
    reply_id INT REFERENCES reply(id) ON DELETE CASCADE,
    reason VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'resolved', 'dismissed')),
    actioned_by INT REFERENCES admin(id) ON DELETE SET NULL,
    actioned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- A report must target exactly one thing
    CHECK (num_nonnulls(review_id, reply_id) = 1)
);

-- ─────────────────────────────────────────────
-- WATCHLIST & ATTACHMENTS
-- ─────────────────────────────────────────────

CREATE TABLE watchlist (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    media_id INT REFERENCES media(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, media_id)
);

CREATE TABLE post_attachments (
    post_id INT REFERENCES review(id) ON DELETE CASCADE,
    attachment VARCHAR(500) NOT NULL,
    PRIMARY KEY (post_id, attachment)
);

CREATE TABLE reply_attachments (
    reply_id INT REFERENCES reply(id) ON DELETE CASCADE,
    attachment VARCHAR(500) NOT NULL,
    PRIMARY KEY (reply_id, attachment)
);

CREATE TABLE review_vote (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    review_id INT REFERENCES review(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    UNIQUE (user_id, review_id)
);