BEGIN;

-- =========================================================
-- SAMPLE DATA FOR MOVIE/SERIES REVIEW PLATFORM
-- =========================================================
-- Assumes tables already exist and are empty.
-- Uses explicit IDs for deterministic FK references.
-- =========================================================


-- =========================
-- USERS
-- =========================
INSERT INTO users (id, username, name, email, password, profile_picture) VALUES
(1, 'moviebuff',     'John Carter',     'john.carter@example.com',     'hashed_pw_1', 'john.png'),
(2, 'seriesqueen',   'Emma Stone',      'emma.stone@example.com',      'hashed_pw_2', 'emma.png'),
(3, 'critic007',     'Amit Kumar',      'amit.kumar@example.com',      'hashed_pw_3', NULL),
(4, 'binge_runner',  'Nusrat Jahan',    'nusrat.jahan@example.com',    'hashed_pw_4', 'nusrat.jpg'),
(5, 'cinephilebd',   'Sabir Siam',      'sabir.siam@example.com',      'hashed_pw_5', 'sabir.png'),
(6, 'storyseeker',   'Lina Rahman',     'lina.rahman@example.com',     'hashed_pw_6', NULL);


-- =========================
-- GENRE
-- =========================
INSERT INTO genre (id, name) VALUES
(1, 'Action'),
(2, 'Drama'),
(3, 'Comedy'),
(4, 'Sci-Fi'),
(5, 'Thriller'),
(6, 'Mystery'),
(7, 'Crime'),
(8, 'Adventure');


-- =========================
-- USER GENRE PREFERENCES
-- =========================
INSERT INTO user_genre_preference (user_id, genre_id) VALUES
(1, 1), (1, 4), (1, 5),
(2, 2), (2, 3), (2, 6),
(3, 5), (3, 7),
(4, 4), (4, 8),
(5, 2), (5, 7), (5, 5),
(6, 6), (6, 2);


-- =========================
-- PERSON
-- =========================
INSERT INTO person (id, name, occupation, picture, biography) VALUES
(1,  'Christopher Nolan',     'Director',  'nolan.jpg',        'Known for high-concept films and practical spectacle.'),
(2,  'Leonardo DiCaprio',     'Actor',     'leo.jpg',          'Known for intense performances and diverse roles.'),
(3,  'Christian Bale',        'Actor',     'bale.jpg',         'Known for transformative acting and dramatic roles.'),
(4,  'Vince Gilligan',        'Writer',    'gilligan.jpg',     'Television writer and producer known for crime dramas.'),
(5,  'Bryan Cranston',        'Actor',     'cranston.jpg',     'Known for leading roles in television and film.'),
(6,  'Benedict Cumberbatch',  'Actor',     'benedict.jpg',     'Known for mystery and drama performances.'),
(7,  'Steven Moffat',         'Writer',    'moffat.jpg',       'Known for writing and producing mystery series.'),
(8,  'Millie Bobby Brown',    'Actor',     'millie.jpg',       'Known for modern sci-fi series roles.'),
(9,  'Bong Joon-ho',          'Director',  'bong.jpg',         'Known for socially driven thriller dramas.'),
(10, 'Song Kang-ho',          'Actor',     'song.jpg',         'Known for major roles in acclaimed Korean cinema.'),
(11, 'Steve Carell',          'Actor',     'carell.jpg',       'Known for comedy roles and workplace sitcoms.'),
(12, 'Greg Daniels',          'Writer',    'daniels.jpg',      'Known for creating and adapting comedy series.'),
(13, 'Jonathan Nolan',        'Writer',    'jon_nolan.jpg',    'Known for screenwriting in sci-fi and thriller projects.'),
(14, 'Emma Thomas',           'Producer',  'emma_thomas.jpg',  'Film producer known for major blockbusters.');


-- =========================
-- USER FAN (users following favorite people)
-- =========================
INSERT INTO user_fan (user_id, person_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 8), (2, 6),
(3, 4), (3, 9),
(4, 5), (4, 11),
(5, 1), (5, 9), (5, 10),
(6, 7), (6, 12);


-- =========================
-- AWARD
-- =========================
INSERT INTO award (id, name, awarded_by, prize_money) VALUES
(1, 'Academy Award',     'Academy of Motion Picture Arts and Sciences', 50000),
(2, 'Golden Globe',      'Hollywood Foreign Press Association',         30000),
(3, 'Emmy Award',        'Television Academy',                          20000),
(4, 'BAFTA',             'British Academy of Film and Television Arts',  25000),
(5, 'Palme d''Or',       'Cannes Film Festival',                         40000),
(6, 'SAG Award',         'Screen Actors Guild',                          15000);


-- =========================
-- PERSON AWARD
-- =========================
INSERT INTO person_award (person_id, award_id, year) VALUES
(2,  1, 2016),  -- DiCaprio Oscar
(1,  4, 2011),  -- Nolan BAFTA (sample)
(4,  3, 2014),  -- Gilligan Emmy (sample)
(5,  6, 2015),  -- Cranston SAG (sample)
(9,  5, 2019),  -- Bong Palme d'Or (sample)
(11, 2, 2006);  -- Carell Golden Globe (sample)


-- =========================
-- MEDIA
-- =========================
INSERT INTO media (id, media_type, name, teaser_link, description, imdb_rating, user_rating, duration) VALUES
(1, 'movie',  'Inception',         'https://youtube.com/watch?v=YoHD9XEInc0', 'A thief enters dreams to steal secrets and plant ideas.', 8.8, 9.0, 148),
(2, 'movie',  'The Dark Knight',   'https://youtube.com/watch?v=EXeTwQWrcwY', 'Batman faces a chaotic criminal mastermind in Gotham.',   9.0, 9.2, 152),
(3, 'series', 'Stranger Things',   'https://youtube.com/watch?v=b9EkMc79ZSU', 'Kids uncover supernatural mysteries in a small town.',     8.7, 8.9, NULL),
(4, 'series', 'Breaking Bad',      'https://youtube.com/watch?v=HhesaQXLuRY', 'A chemistry teacher turns to crime after a diagnosis.',     9.5, 9.6, NULL),
(5, 'movie',  'Interstellar',      'https://youtube.com/watch?v=zSWdZVtXT7E', 'Explorers travel through a wormhole to save humanity.',     8.7, 8.8, 169),
(6, 'series', 'Sherlock',          'https://youtube.com/watch?v=IrBKwzL3K7s', 'A modern detective solves mysteries in London.',            9.1, 9.0, NULL),
(7, 'movie',  'Parasite',          'https://youtube.com/watch?v=5xH0HfJHsaY', 'A poor family infiltrates a wealthy household.',            8.5, 8.7, 132),
(8, 'series', 'The Office',        'https://youtube.com/watch?v=tNcDHWpselE', 'A workplace comedy following office employees.',            9.0, 8.8, NULL);


-- =========================
-- MOVIE / SERIES (subtypes)
-- =========================
INSERT INTO movie (media_id) VALUES
(1), (2), (5), (7);

INSERT INTO series (media_id) VALUES
(3), (4), (6), (8);


-- =========================
-- SEASONS
-- =========================
INSERT INTO season (id, series_id, number, imdb_rating, user_rating) VALUES
-- Stranger Things
(1, 3, 1, 8.5, 8.8),
(2, 3, 2, 8.9, 9.1),

-- Breaking Bad
(3, 4, 1, 8.9, 9.0),
(4, 4, 2, 9.2, 9.4),

-- Sherlock
(5, 6, 1, 9.1, 9.0),

-- The Office
(6, 8, 1, 8.6, 8.4);


-- =========================
-- EPISODES
-- =========================
INSERT INTO episode (id, season_id, number, imdb_rating, user_rating) VALUES
-- Stranger Things S1
(1, 1, 1, 8.3, 8.6),
(2, 1, 2, 8.6, 8.9),
(3, 1, 3, 8.4, 8.7),

-- Stranger Things S2
(4, 2, 1, 8.9, 9.0),
(5, 2, 2, 8.7, 8.8),

-- Breaking Bad S1
(6, 3, 1, 9.0, 9.2),
(7, 3, 2, 8.7, 8.9),

-- Breaking Bad S2
(8, 4, 1, 9.1, 9.3),
(9, 4, 2, 9.4, 9.6),

-- Sherlock S1
(10, 5, 1, 9.2, 9.1),
(11, 5, 2, 9.0, 8.9),

-- The Office S1
(12, 6, 1, 7.9, 7.8),
(13, 6, 2, 8.2, 8.0);


-- =========================
-- MEDIA GENRE
-- =========================
INSERT INTO media_genre (media_id, genre_id) VALUES
-- Inception
(1, 1), (1, 4), (1, 5),

-- The Dark Knight
(2, 1), (2, 5), (2, 7),

-- Stranger Things
(3, 4), (3, 5), (3, 2), (3, 6),

-- Breaking Bad
(4, 2), (4, 5), (4, 7),

-- Interstellar
(5, 4), (5, 2), (5, 8),

-- Sherlock
(6, 6), (6, 5), (6, 2),

-- Parasite
(7, 2), (7, 5), (7, 3),

-- The Office
(8, 3);


-- =========================
-- MEDIA PERSON ROLE
-- role must be in ('actor','director','writer','producer')
-- =========================
INSERT INTO media_person_role (media_id, person_id, role) VALUES
-- Inception
(1, 1, 'director'),
(1, 13, 'writer'),
(1, 14, 'producer'),
(1, 2, 'actor'),

-- The Dark Knight
(2, 1, 'director'),
(2, 13, 'writer'),
(2, 14, 'producer'),
(2, 3, 'actor'),

-- Stranger Things
(3, 8,  'actor'),
(3, 14, 'producer'),

-- Breaking Bad
(4, 4, 'writer'),
(4, 4, 'producer'),
(4, 5, 'actor'),

-- Interstellar
(5, 1,  'director'),
(5, 13, 'writer'),
(5, 14, 'producer'),

-- Sherlock
(6, 7, 'writer'),
(6, 6, 'actor'),

-- Parasite
(7, 9,  'director'),
(7, 9,  'writer'),
(7, 10, 'actor'),

-- The Office
(8, 12, 'writer'),
(8, 12, 'producer'),
(8, 11, 'actor');


-- =========================
-- MEDIA AWARD
-- =========================
INSERT INTO media_award (media_id, award_id, year) VALUES
(1, 2, 2011),  -- Inception Golden Globe (sample)
(2, 4, 2009),  -- Dark Knight BAFTA (sample)
(3, 3, 2017),  -- Stranger Things Emmy (sample)
(4, 3, 2014),  -- Breaking Bad Emmy (sample)
(7, 1, 2020),  -- Parasite Oscar (sample)
(7, 5, 2019);  -- Parasite Palme d'Or (sample)


-- =========================
-- REVIEWS
-- Must reference at least ONE of (media_id, season_id, episode_id)
-- =========================
INSERT INTO review (id, user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote, created_at) VALUES
-- Media reviews
(1, 1, 1, NULL, NULL, 5, 'Mind-blowing concept and execution. Rewatch value is huge.', 18, 1, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(2, 5, 7, NULL, NULL, 5, 'Sharp social commentary with thriller pacing. Brilliant.',     22, 2, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(3, 3, 2, NULL, NULL, 4, 'Great performances and tension, slightly long but worth it.', 12, 0, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 6, 5, NULL, NULL, 5, 'Epic scale and emotional payoff. One of the best sci-fi films.', 15, 1, CURRENT_TIMESTAMP - INTERVAL '6 days'),

-- Season reviews
(5, 2, NULL, 1, NULL, 4, 'Season 1 sets the tone perfectly; mystery hooks you fast.',   9,  0, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(6, 4, NULL, 4, NULL, 5, 'Season 2 raises the stakes; character arcs are incredible.', 14, 1, CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- Episode reviews
(7, 3, NULL, NULL, 6, 5, 'Pilot episode is strong—setup and tension are top-tier.',    11, 0, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(8, 2, NULL, NULL, 10, 5, 'A near-perfect episode: mystery, pacing, and deduction.',  10, 0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(9, 1, NULL, NULL, 12, 3, 'First episode is okay; the show gets better later.',        3,  2, CURRENT_TIMESTAMP - INTERVAL '1 day');


-- =========================
-- REPLIES
-- Must have EITHER parent_review_id OR parent_reply_id (exclusive)
-- =========================
INSERT INTO reply (id, user_id, parent_review_id, parent_reply_id, description, upvote, downvote, created_at) VALUES
-- Replies to review #1 (Inception)
(1, 2, 1, NULL, 'Totally agree—this is a movie you discover more each time.', 6, 0, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(2, 3, 1, NULL, 'The concept is great; I especially liked the layered action scenes.', 4, 1, CURRENT_TIMESTAMP - INTERVAL '9 days'),

-- Nested reply to reply #1
(3, 5, NULL, 1, 'Yes! And the soundtrack adds so much tension to every scene.', 3, 0, CURRENT_TIMESTAMP - INTERVAL '9 days'),

-- Replies to season review #6 (Breaking Bad S2)
(4, 1, 6, NULL, 'Season 2 really locks you in—character decisions feel so real.', 5, 0, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(5, 6, NULL, 4, 'Exactly. The moral decline is written so carefully.', 2, 0, CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- Reply to episode review #9 (The Office S1E1)
(6, 4, 9, NULL, 'Fair take—later episodes have stronger rhythm and character chemistry.', 2, 0, CURRENT_TIMESTAMP - INTERVAL '22 hours');


-- =========================
-- WATCHLIST
-- =========================
INSERT INTO watchlist (user_id, media_id) VALUES
(1, 3), (1, 7),
(2, 1), (2, 4),
(3, 6),
(4, 2), (4, 5),
(5, 4), (5, 6), (5, 8),
(6, 2), (6, 3);


-- =========================
-- RESET SEQUENCES (important when inserting explicit IDs)
-- =========================
SELECT setval(pg_get_serial_sequence('users','id'),   (SELECT COALESCE(MAX(id),1) FROM users),   true);
SELECT setval(pg_get_serial_sequence('genre','id'),   (SELECT COALESCE(MAX(id),1) FROM genre),   true);
SELECT setval(pg_get_serial_sequence('person','id'),  (SELECT COALESCE(MAX(id),1) FROM person),  true);
SELECT setval(pg_get_serial_sequence('award','id'),   (SELECT COALESCE(MAX(id),1) FROM award),   true);
SELECT setval(pg_get_serial_sequence('media','id'),   (SELECT COALESCE(MAX(id),1) FROM media),   true);
SELECT setval(pg_get_serial_sequence('season','id'),  (SELECT COALESCE(MAX(id),1) FROM season),  true);
SELECT setval(pg_get_serial_sequence('episode','id'), (SELECT COALESCE(MAX(id),1) FROM episode), true);
SELECT setval(pg_get_serial_sequence('review','id'),  (SELECT COALESCE(MAX(id),1) FROM review),  true);
SELECT setval(pg_get_serial_sequence('reply','id'),   (SELECT COALESCE(MAX(id),1) FROM reply),   true);

COMMIT;