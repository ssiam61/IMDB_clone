-- ======================================================
-- CLEAN SAMPLE DATA FOR imdbtest3 (FINAL VERSION)
-- ======================================================

\c imdbtest3;

BEGIN;

-- =========================
-- USERS
-- =========================
INSERT INTO users (id, username, name, email, password, profile_picture, bio)
VALUES
  (1,'anindya','Anindya Nag Arghya','anindya@example.com','hashed_pw_1',
    'https://i.redd.it/mdvmefeejg331.jpg','Frontend developer and movie geek.'),
  (2,'sadia','Sadia Rahman','sadia@example.com','hashed_pw_2',
    'https://i.redd.it/mdvmefeejg331.jpg','Loves drama and romance.'),
  (3,'arif','Arif Hossain','arif@example.com','hashed_pw_3',
    'https://i.redd.it/mdvmefeejg331.jpg','Sci-fi and thriller enthusiast.'),
  (4,'maria','Maria Ahmed','maria@example.com','hashed_pw_4',
    'https://i.redd.it/mdvmefeejg331.jpg','Enjoys documentaries.'),
  (5,'tanvir','Tanvir Islam','tanvir@example.com','hashed_pw_5',
    'https://i.redd.it/mdvmefeejg331.jpg','Hardcore gamer and anime fan.');

-- =========================
-- ADMINS
-- =========================
INSERT INTO admin (id, user_id, role)
VALUES
  (1, 1, 'moderator'),
  (2, 2, 'moderator');

-- =========================
-- GENRES
-- =========================
INSERT INTO genre (id, name)
VALUES
  (1,'Action'), (2,'Drama'), (3,'Comedy'), (4,'Sci-Fi'),
  (5,'Thriller'), (6,'Romance'), (7,'Animation'), (8,'Fantasy');

-- =========================
-- USER PREFERENCES
-- =========================
INSERT INTO preference (user_id, genre_id)
VALUES
  (1,1),(1,4),(1,5),
  (2,2),(2,6),
  (3,4),(3,5),
  (4,8),
  (5,7),(5,4);

-- =========================
-- PERSON
-- =========================
INSERT INTO person (id, name, occupation, profile_image, biography)
VALUES
  (1,'Christopher Nolan','director','https://i.redd.it/mdvmefeejg331.jpg','British-American film director.'),
  (2,'Cillian Murphy','actor','https://i.redd.it/mdvmefeejg331.jpg','Irish actor known worldwide.'),
  (3,'Pedro Pascal','actor','https://i.redd.it/mdvmefeejg331.jpg','Chilean-American actor.'),
  (4,'Emma Stone','actor','https://i.redd.it/mdvmefeejg331.jpg','American actress and Oscar winner.'),
  (5,'Greta Gerwig','director','https://i.redd.it/mdvmefeejg331.jpg','American actress, writer and director.');

-- =========================
-- FANS
-- =========================
INSERT INTO fan (user_id, person_id)
VALUES
  (1,1),(1,2),
  (2,4),
  (3,3),
  (4,5),
  (5,1);

-- =========================
-- AWARDS
-- =========================
INSERT INTO award (id, name, awarded_by, prize_money)
VALUES
  (1,'Academy Award','AMPAS',0),
  (2,'Golden Globe','HFPA',0),
  (3,'BAFTA','BAFTA',0);

-- =========================
-- PERSON AWARDS
-- =========================
INSERT INTO person_award (person_id, award_id, year)
VALUES
  (2,1,2024),
  (1,3,2018),
  (4,2,2020);

-- =========================
-- MEDIA
-- =========================
INSERT INTO media
(id, name, media_type, teaser_link, thumbnail, description, imdb_rating, user_rating, duration, release_date)
VALUES
  (1,'Inception','movie',
    'https://www.youtube.com/watch?v=djV11Xbc914&list=RDN2ANAqO1TLs&index=5ha',
    'https://i.redd.it/mdvmefeejg331.jpg',
    'A thief steals secrets through dreams.',8.8,9.1,148,'2010-07-16'),

  (2,'The Mandalorian','series',
    'https://www.youtube.com/watch?v=djV11Xbc914&list=RDN2ANAqO1TLs&index=5ha',
    'https://i.redd.it/mdvmefeejg331.jpg',
    'A lone bounty hunter travels the galaxy.',8.7,8.9,40,'2019-11-12'),

  (3,'La La Land','movie',
    'https://www.youtube.com/watch?v=djV11Xbc914&list=RDN2ANAqO1TLs&index=5ha',
    'https://i.redd.it/mdvmefeejg331.jpg',
    'A jazz pianist and an aspiring actress fall in love.',8.0,8.5,128,'2016-12-09'),

  (4,'The Witcher','series',
    'https://www.youtube.com/watch?v=djV11Xbc914&list=RDN2ANAqO1TLs&index=5ha',
    'https://i.redd.it/mdvmefeejg331.jpg',
    'A monster hunter struggles with destiny.',8.3,8.4,60,'2019-12-20');

-- =========================
-- MOVIES
-- =========================
INSERT INTO movie (media_id) VALUES (1),(3);

-- =========================
-- SERIES
-- =========================
INSERT INTO series (id, media_id)
VALUES
  (1,2),
  (2,4);

-- =========================
-- SEASONS
-- =========================
INSERT INTO season
(id, series_id, number, title, description, thumbnail, imdb_rating, user_rating, release_date, duration)
VALUES
  (1,1,1,'Season 1','The beginning of the Mandalorian journey.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.6,8.8,'2019-11-12',300),

  (2,1,2,'Season 2','The adventure continues.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.7,8.9,'2020-10-30',320),

  (3,2,1,'Season 1','Geralts first adventures.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.4,8.5,'2019-12-20',300),

  (4,2,2,'Season 2','War and destiny collide.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.5,8.6,'2021-12-17',310);

-- =========================
-- EPISODES
-- =========================
INSERT INTO episode
(id, season_id, number, title, description, thumbnail, imdb_rating, user_rating, release_date, duration)
VALUES
  (1,1,1,'Chapter 1','Introduction to Mando.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.5,8.7,'2019-11-12',40),

  (2,1,2,'Chapter 2','The Child appears.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.6,8.8,'2019-11-15',38),

  (3,2,1,'Chapter 9','New allies emerge.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.7,8.9,'2020-10-30',43),

  (4,2,2,'Chapter 10','The passenger mission begins.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.8,9.0,'2020-11-06',41),

  (5,3,1,'The Ends Beginning','Geralt takes his first contract.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.2,8.3,'2019-12-20',61),

  (6,3,2,'Four Marks','Cirilla''s journey begins.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.3,8.4,'2019-12-20',67),

  (7,4,1,'A Grain of Truth','New monsters arise.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.5,8.6,'2021-12-17',59),

  (8,4,2,'Kaer Morhen','Training at the witcher fortress.',
    'https://i.redd.it/mdvmefeejg331.jpg',8.6,8.7,'2021-12-17',62);

-- =========================
-- MEDIA GENRES
-- =========================
INSERT INTO media_genre (media_id, genre_id)
VALUES
  (1,1),(1,4),(1,5),
  (2,1),(2,4),
  (3,6),(3,3),
  (4,1),(4,8);

-- =========================
-- MEDIA_PERSONALITY
-- =========================
INSERT INTO media_personality (media_id, person_id, role)
VALUES
  (1,1,'director'),
  (1,2,'actor'),

  (2,3,'actor'),

  (3,5,'director'),
  (3,4,'actor'),

  (4,3,'actor'),
  (4,1,'director');

-- =========================
-- MEDIA AWARDS
-- =========================
INSERT INTO media_award (media_id, award_id, year, result)
VALUES
  (1,1,2011,'win'),
  (3,2,2017,'nomination'),
  (4,3,2020,'win');

-- =========================
-- WATCHLIST
-- =========================
INSERT INTO watchlist (user_id, media_id)
VALUES
  (1,1),(1,2),
  (2,3),
  (3,4),
  (5,1),(5,4);

-- =========================
-- RESET SERIALS
-- =========================
SELECT setval('users_id_seq',   (SELECT MAX(id) FROM users), true);
SELECT setval('admin_id_seq',   (SELECT MAX(id) FROM admin), true);
SELECT setval('genre_id_seq',   (SELECT MAX(id) FROM genre), true);
SELECT setval('person_id_seq',  (SELECT MAX(id) FROM person), true);
SELECT setval('award_id_seq',   (SELECT MAX(id) FROM award), true);
SELECT setval('media_id_seq',   (SELECT MAX(id) FROM media), true);
SELECT setval('series_id_seq',  (SELECT MAX(id) FROM series), true);
SELECT setval('season_id_seq',  (SELECT MAX(id) FROM season), true);
SELECT setval('episode_id_seq', (SELECT MAX(id) FROM episode), true);

COMMIT;

--https://i.redd.it/mdvmefeejg331.jpg
--https://www.youtube.com/watch?v=djV11Xbc914&list=RDN2ANAqO1TLs&index=5