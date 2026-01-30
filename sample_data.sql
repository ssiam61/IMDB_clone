
-- sample_data.sql
-- Populate the IMDBtest database with sample data
-- Assumes the schema from database.sql has already been created in PostgreSQL

-- Switch to DB (psql-only directive)
\c imdbtest

BEGIN;

-- =========================
-- Users
-- =========================
INSERT INTO users (id, username, name, email, password, profile_picture) VALUES
  (1,'anindya','Anindya Nag Arghya','anindya@example.com','hashed_pw_1','https://img.example.com/u1.png'),
  (2,'sadia','Sadia Rahman','sadia@example.com','hashed_pw_2','https://img.example.com/u2.png'),
  (3,'arif','Arif Hossain','arif@example.com','hashed_pw_3','https://img.example.com/u3.png'),
  (4,'maria','Maria Ahmed','maria@example.com','hashed_pw_4','https://img.example.com/u4.png'),
  (5,'tanvir','Tanvir Islam','tanvir@example.com','hashed_pw_5','https://img.example.com/u5.png');

-- =========================
-- Genres
-- =========================
INSERT INTO genre (id, name) VALUES
  (1,'Action'), (2,'Drama'), (3,'Comedy'), (4,'Sci-Fi'),
  (5,'Thriller'), (6,'Romance'), (7,'Animation'), (8,'Documentary');

-- =========================
-- Preferences (user <-> genre)
-- =========================
INSERT INTO preference (user_id, genre_id) VALUES
  (1,1),(1,4),(1,5),
  (2,2),(2,6),
  (3,1),(3,2),(3,5),
  (4,3),(4,6),
  (5,4),(5,7);

-- =========================
-- Persons (actors, directors, etc.)
-- =========================
INSERT INTO person (id, name, occupation, picture, biography) VALUES
  (1,'Christopher Nolan','director','https://img.example.com/p1.jpg','British-American film director, producer and screenwriter.'),
  (2,'Cillian Murphy','actor','https://img.example.com/p2.jpg','Irish actor known for intense performances.'),
  (3,'Greta Gerwig','director','https://img.example.com/p3.jpg','American actress, writer and director.'),
  (4,'Margot Robbie','actor','https://img.example.com/p4.jpg','Australian actress and producer.'),
  (5,'Pedro Pascal','actor','https://img.example.com/p5.jpg','Chilean-American actor.'),
  (6,'Jon Favreau','producer','https://img.example.com/p6.jpg','American filmmaker and actor.');

-- =========================
-- Fans (user <-> person)
-- =========================
INSERT INTO fan (user_id, person_id) VALUES
  (1,1),(1,2),(2,3),(2,4),(3,5),(4,4),(5,1);

-- =========================
-- Awards
-- =========================
INSERT INTO award (id, name, awarded_by, prize_money) VALUES
  (1,'Academy Award','AMPAS',0),
  (2,'Golden Globe','HFPA',0),
  (3,'BAFTA','BAFTA',0);

-- =========================
-- Person Awards
-- =========================
INSERT INTO person_award (person_id, award_id, year) VALUES
  (2,1,2024), -- Example
  (1,3,2018),
  (4,2,2020);

-- =========================
-- Media (common fields)
-- =========================
INSERT INTO media (id, name, teaser_link, description, imdb_rating, user_rating, duration) VALUES
  (1,'Inception','https://youtu.be/8hP9D6kZseM','A thief who steals corporate secrets through dream-sharing technology.',8.8,9.1,148),
  (2,'Barbie','https://youtu.be/pBk4NYhWNMM','Barbie suffers a crisis that leads her to question her world.',7.0,8.2,114),
  (3,'The Mandalorian','https://youtu.be/aOC8E8z_ifw','A lone bounty hunter in the outer reaches of the galaxy.',8.7,8.9,40),
  (4,'Oppenheimer','https://youtu.be/uYPbbksJxIg','The story of J. Robert Oppenheimer and the atomic bomb.',8.6,9.0,180);

-- Movies
INSERT INTO movie (media_id) VALUES (1),(2),(4);

-- Series
INSERT INTO series (media_id) VALUES (3);

-- Seasons for The Mandalorian (media_id=3)
INSERT INTO season (id, series_id, number, imdb_rating, user_rating) VALUES
  (1,3,1,8.6,8.8),
  (2,3,2,8.7,8.9);

-- Episodes for Season 1 and 2
INSERT INTO episode (id, season_id, number, imdb_rating, user_rating) VALUES
  (1,1,1,8.5,8.7),
  (2,1,2,8.6,8.8),
  (3,2,1,8.7,8.9),
  (4,2,2,8.8,9.0);

-- Media Genres
INSERT INTO media_genre (media_id, genre_id) VALUES
  (1,1),(1,4),(1,5),
  (2,3),(2,6),
  (3,1),(3,4),
  (4,2),(4,5);

-- Media Personalities
INSERT INTO media_personality (media_id, person_id, role) VALUES
  (1,1,'director'), (1,2,'actor'),
  (2,3,'director'), (2,4,'actor'), (2,6,'producer'),
  (3,5,'actor'), (3,6,'producer'),
  (4,1,'director'), (4,2,'actor');

-- Media Awards
INSERT INTO media_award (media_id, award_id, year) VALUES
  (4,1,2024),
  (1,3,2011);

-- =========================
-- Reviews
-- =========================
INSERT INTO review (id, user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote, created_at) VALUES
  (1,1,1,NULL,NULL,10,'Mind-bending and brilliant!',15,1, NOW() - INTERVAL '20 days'),
  (2,2,2,NULL,NULL,8,'Fun and heartfelt.',9,2, NOW() - INTERVAL '15 days'),
  (3,3,3,1,NULL,9,'Great start to the series.',12,0, NOW() - INTERVAL '10 days'),
  (4,4,3,2,3,9,'Season 2 premiere delivered!',7,1, NOW() - INTERVAL '7 days'),
  (5,5,4,NULL,NULL,10,'Masterful filmmaking.',20,0, NOW() - INTERVAL '3 days');

-- =========================
-- Replies (threaded)
-- Insert a top-level reply first, then a nested reply that references it.
INSERT INTO reply (id, user_id, parent_review_id, parent_reply_id, description, upvote, downvote, created_at) VALUES
  (1,2,1,NULL,'Totally agree!',3,0, NOW() - INTERVAL '19 days');

INSERT INTO reply (id, user_id, parent_review_id, parent_reply_id, description, upvote, downvote, created_at) VALUES
  (2,3,NULL,1,'And the soundtrack is amazing.',2,0, NOW() - INTERVAL '18 days'),
  (3,1,2,NULL,'Loved the production design.',1,0, NOW() - INTERVAL '14 days');

-- =========================
-- Watchlist
-- =========================
INSERT INTO watchlist (user_id, media_id) VALUES
  (1,3),(1,4),(2,1),(3,2),(4,4),(5,1),(5,3);

-- Attachments for reviews and replies
INSERT INTO post_attachments (post_id, attachment) VALUES
  (1,'https://img.example.com/rev1_1.jpg'),
  (1,'https://img.example.com/rev1_2.jpg'),
  (5,'https://img.example.com/rev5_1.jpg');

INSERT INTO reply_attachments (reply_id, attachment) VALUES
  (1,'https://img.example.com/rep1_1.jpg');

-- =========================
-- Reset sequences to max(id) to keep SERIALs in sync
-- =========================
SELECT setval('users_id_seq',       (SELECT COALESCE(MAX(id),1) FROM users), true);
SELECT setval('genre_id_seq',       (SELECT COALESCE(MAX(id),1) FROM genre), true);
SELECT setval('person_id_seq',      (SELECT COALESCE(MAX(id),1) FROM person), true);
SELECT setval('award_id_seq',       (SELECT COALESCE(MAX(id),1) FROM award), true);
SELECT setval('media_id_seq',       (SELECT COALESCE(MAX(id),1) FROM media), true);
SELECT setval('season_id_seq',      (SELECT COALESCE(MAX(id),1) FROM season), true);
SELECT setval('episode_id_seq',     (SELECT COALESCE(MAX(id),1) FROM episode), true);
SELECT setval('review_id_seq',      (SELECT COALESCE(MAX(id),1) FROM review), true);
SELECT setval('reply_id_seq',       (SELECT COALESCE(MAX(id),1) FROM reply), true);

COMMIT;
