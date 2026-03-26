-- ======================================================
-- SAMPLE DATA FOR IMDBtest2
-- ======================================================

\c imdbtest2;

BEGIN;

-- =========================
-- USERS
-- =========================
INSERT INTO users (id, username, name, email, password, profile_picture, is_banned) VALUES
  (1,'anindya','Anindya Nag Arghya','anindya@example.com','hashed_pw_1','https://img.example.com/u1.png',FALSE),
  (2,'sadia','Sadia Rahman','sadia@example.com','hashed_pw_2','https://img.example.com/u2.png',FALSE),
  (3,'arif','Arif Hossain','arif@example.com','hashed_pw_3','https://img.example.com/u3.png',FALSE),
  (4,'maria','Maria Ahmed','maria@example.com','hashed_pw_4','https://img.example.com/u4.png',FALSE),
  (5,'tanvir','Tanvir Islam','tanvir@example.com','hashed_pw_5','https://img.example.com/u5.png',FALSE),
  (6,'john','John Walker','john@example.com','hashed_pw_6','https://img.example.com/u6.png',FALSE),
  (7,'lisa','Lisa Monroe','lisa@example.com','hashed_pw_7','https://img.example.com/u7.png',FALSE),
  (8,'amir','Amir Siddiqui','amir@example.com','hashed_pw_8','https://img.example.com/u8.png',FALSE),
  (9,'helena','Helena Ross','helena@example.com','hashed_pw_9','https://img.example.com/u9.png',FALSE),
  (10,'sofia','Sofia Rahim','sofia@example.com','hashed_pw_10','https://img.example.com/u10.png',FALSE);

-- =========================
-- ADMINS
-- =========================
INSERT INTO admin (id, user_id, role, granted_by) VALUES
  (1, 1, 'super_admin', NULL),
  (2, 2, 'moderator', 1),
  (3, 3, 'moderator', 1);

-- =========================
-- GENRES
-- =========================
INSERT INTO genre (id, name) VALUES
  (1,'Action'), (2,'Drama'), (3,'Comedy'), (4,'Sci-Fi'),
  (5,'Thriller'), (6,'Romance'), (7,'Animation'), (8,'Documentary'),
  (9,'Adventure'), (10,'Crime');

-- =========================
-- PREFERENCES
-- =========================
INSERT INTO preference (user_id, genre_id) VALUES
  (1,1),(1,4),(1,5),(1,9),
  (2,2),(2,6),
  (3,1),(3,2),(3,5),(3,10),
  (4,3),(4,6),(4,7),
  (5,4),(5,7),
  (6,1),(6,9),
  (7,2),(7,10),
  (8,5),(8,8),
  (9,6),(9,3),
  (10,4),(10,1);

-- =========================
-- PERSON
-- =========================
INSERT INTO person (id, name, occupation, picture, biography) VALUES
  (1,'Christopher Nolan','director','https://img.example.com/p1.jpg','British-American film director.'),
  (2,'Cillian Murphy','actor','https://img.example.com/p2.jpg','Irish actor known worldwide.'),
  (3,'Greta Gerwig','director','https://img.example.com/p3.jpg','American actress, writer and director.'),
  (4,'Margot Robbie','actor','https://img.example.com/p4.jpg','Australian actress and producer.'),
  (5,'Pedro Pascal','actor','https://img.example.com/p5.jpg','Chilean-American actor.'),
  (6,'Jon Favreau','producer','https://img.example.com/p6.jpg','American filmmaker and actor.'),
  (7,'Hans Zimmer','composer','https://img.example.com/p7.jpg','German film score composer.'),
  (8,'Emma Stone','actor','https://img.example.com/p8.jpg','American actress and Oscar winner.'),
  (9,'Quentin Tarantino','director','https://img.example.com/p9.jpg','American filmmaker known for unique style.'),
  (10,'Zendaya','actor','https://img.example.com/p10.jpg','American actress and singer.');

-- =========================
-- FAN LINKS
-- =========================
INSERT INTO fan (user_id, person_id) VALUES
  (1,1),(1,2),(1,7),
  (2,3),(2,4),
  (3,5),(3,1),
  (4,4),(4,10),
  (5,1),(5,7),
  (6,2),(6,5),
  (7,8),(7,9),
  (8,9),(8,3),
  (9,4),(9,2),
  (10,1),(10,10);

-- =========================
-- AWARDS
-- =========================
INSERT INTO award (id, name, awarded_by, prize_money) VALUES
  (1,'Academy Award','AMPAS',0),
  (2,'Golden Globe','HFPA',0),
  (3,'BAFTA','BAFTA',0),
  (4,'Emmy','ATAS',0),
  (5,'MTV Movie Award','MTV',0);

-- =========================
-- PERSON_AWARD
-- =========================
INSERT INTO person_award (person_id, award_id, year) VALUES
  (2,1,2024),
  (1,3,2018),
  (4,2,2020),
  (7,1,2014),
  (5,4,2021),
  (8,5,2017);

-- =========================
-- MEDIA
-- =========================
INSERT INTO media (id, name, teaser_link, description, imdb_rating, user_rating, duration, added_by) VALUES
  (1,'Inception','https://youtu.be/8hP9D6kZseM','A thief steals secrets through dreams.',8.8,9.1,148,1),
  (2,'Barbie','https://youtu.be/pBk4NYhWNMM','Barbie questions her world.',7.0,8.2,114,2),
  (3,'The Mandalorian','https://youtu.be/aOC8E8z_ifw','A lone bounty hunter.',8.7,8.9,40,1),
  (4,'Oppenheimer','https://youtu.be/uYPbbksJxIg','Atomic bomb story.',8.6,9.0,180,1),
  (5,'Dune','https://youtu.be/n9xhJrPXop4','A duke’s son joins desert warriors.',8.2,8.7,155,1),
  (6,'La La Land','https://youtu.be/0pdqf4P9MB8','Musical about dreams.',8.0,8.5,128,2),
  (7,'Interstellar','https://youtu.be/zSWdZVtXT7E','A journey through space.',8.6,9.0,169,1),
  (8,'Joker','https://youtu.be/t433PEQGErc','Origins of Joker.',8.5,8.8,122,3),
  (9,'The Witcher','https://youtu.be/ndl1W4ltcmg','A monster hunter.',8.3,8.4,60,2),
  (10,'Frozen','https://youtu.be/TbQm5doF_Uc','The story of two sisters.',7.4,8.0,109,3);

INSERT INTO movie (media_id) VALUES
  (1),(2),(4),(5),(6),(7),(8),(10);

INSERT INTO series (media_id) VALUES
  (3),(9);

INSERT INTO season (id, series_id, number, imdb_rating, user_rating) VALUES
  (1,1,1,8.6,8.8),
  (2,1,2,8.7,8.9),
  (3,2,1,8.4,8.5),
  (4,2,2,8.5,8.6);

INSERT INTO episode (id, season_id, number, imdb_rating, user_rating) VALUES
  (1,1,1,8.5,8.7),
  (2,1,2,8.6,8.8),
  (3,2,1,8.7,8.9),
  (4,2,2,8.8,9.0),
  (5,3,1,8.2,8.3),
  (6,3,2,8.3,8.4),
  (7,4,1,8.5,8.6),
  (8,4,2,8.6,8.7);

-- =========================
-- MEDIA GENRES
-- =========================
INSERT INTO media_genre (media_id, genre_id) VALUES
  (1,1),(1,4),(1,5),
  (2,3),(2,6),
  (3,1),(3,4),
  (4,2),(4,5),
  (5,4),(5,9),
  (6,3),(6,6),
  (7,4),(7,1),
  (8,2),(8,10),
  (9,1),(9,9),
  (10,7),(10,6);

-- =========================
-- MEDIA_PERSONALITY
-- =========================
INSERT INTO media_personality (media_id, person_id, role) VALUES
  (1,1,'director'), 
  (1,2,'actor'), 
  (1,7,'producer'),        -- FIXED (composer → producer)

  (2,3,'director'), 
  (2,4,'actor'), 
  (2,6,'producer'),

  (3,5,'actor'), 
  (3,6,'producer'),

  (4,1,'director'), 
  (4,2,'actor'),

  (5,9,'director'), 
  (5,2,'actor'),

  (6,3,'director'), 
  (6,8,'actor'),

  (7,1,'director'), 
  (7,7,'producer'),        -- FIXED (composer → producer)

  (8,9,'director'), 
  (8,2,'actor'),

  (9,5,'actor'),
  (10,4,'actor');
-- =========================
-- MEDIA AWARD
-- =========================
INSERT INTO media_award (media_id, award_id, year) VALUES
  (4,1,2024),
  (1,3,2011),
  (7,1,2015),
  (8,2,2020),
  (5,3,2022),
  (6,5,2017);

-- =========================
-- REVIEWS
-- =========================
INSERT INTO review (id, user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote, created_at) VALUES
  (1,1,1,NULL,NULL,10,'Mind-bending and brilliant!',15,1, NOW() - INTERVAL '20 days'),
  (2,2,2,NULL,NULL,8,'Fun and heartfelt.',9,2, NOW() - INTERVAL '15 days'),

  -- FIXED: removed media_id
  (3,3,NULL,1,NULL,9,'Great start to the series.',12,0, NOW() - INTERVAL '10 days'),

  -- FIXED: keep only episode_id
  (4,4,NULL,NULL,3,9,'Season 2 premiere delivered!',7,1, NOW() - INTERVAL '7 days'),

  (5,5,4,NULL,NULL,10,'Masterful filmmaking.',20,0, NOW() - INTERVAL '3 days'),
  (6,6,7,NULL,NULL,10,'Absolute masterpiece.',25,2, NOW() - INTERVAL '12 days'),
  (7,7,8,NULL,NULL,9,'Disturbingly beautiful performance.',18,3, NOW() - INTERVAL '8 days'),
  (8,8,10,NULL,NULL,8,'Kids loved it!',10,1, NOW() - INTERVAL '5 days'),
  (9,9,5,NULL,NULL,9,'Epic sci-fi worldbuilding.',14,0, NOW() - INTERVAL '2 days'),

  -- FIXED: keep only episode_id
  (10,10,NULL,NULL,5,8,'Solid fantasy storytelling.',11,1, NOW() - INTERVAL '1 day');
  
-- =========================
-- REPLIES
-- =========================
INSERT INTO reply (id, user_id, parent_review_id, parent_reply_id, description, upvote, downvote, created_at) VALUES
  (1,2,1,NULL,'Totally agree!',3,0, NOW() - INTERVAL '19 days');

INSERT INTO reply (id, user_id, parent_review_id, parent_reply_id, description, upvote, downvote, created_at) VALUES
  (2,3,NULL,1,'And the soundtrack is amazing.',2,0, NOW() - INTERVAL '18 days'),
  (3,1,2,NULL,'Loved the production design.',1,0, NOW() - INTERVAL '14 days'),
  (4,4,3,NULL,'The pacing was great too.',2,0, NOW() - INTERVAL '9 days'),
  (5,6,7,NULL,'Phoenix was incredible.',5,1, NOW() - INTERVAL '7 days'),
  (6,10,9,NULL,'Dune is visually stunning!',4,0, NOW() - INTERVAL '1 day');

-- =========================
-- WATCHLIST
-- =========================
INSERT INTO watchlist (user_id, media_id) VALUES
  (1,3),(1,4),(1,7),
  (2,1),(2,6),
  (3,2),(3,5),(3,9),
  (4,4),(4,10),
  (5,1),(5,3),(5,7),
  (6,7),
  (7,8),(7,6),
  (8,9),(8,5),
  (9,10),
  (10,4),(10,1);

-- =========================
-- ATTACHMENTS
-- =========================
INSERT INTO post_attachments (post_id, attachment) VALUES
  (1,'https://img.example.com/rev1_1.jpg'),
  (1,'https://img.example.com/rev1_2.jpg'),
  (5,'https://img.example.com/rev5_1.jpg'),
  (9,'https://img.example.com/rev9_1.jpg');

INSERT INTO reply_attachments (reply_id, attachment) VALUES
  (1,'https://img.example.com/rep1_1.jpg'),
  (5,'https://img.example.com/rep5_1.jpg');

-- =========================
-- RESET SERIAL SEQUENCES
-- =========================
SELECT setval('users_id_seq',       (SELECT MAX(id) FROM users), true);
SELECT setval('admin_id_seq',       (SELECT MAX(id) FROM admin), true);
SELECT setval('genre_id_seq',       (SELECT MAX(id) FROM genre), true);
SELECT setval('person_id_seq',      (SELECT MAX(id) FROM person), true);
SELECT setval('award_id_seq',       (SELECT MAX(id) FROM award), true);
SELECT setval('media_id_seq',       (SELECT MAX(id) FROM media), true);
SELECT setval('season_id_seq',      (SELECT MAX(id) FROM season), true);
SELECT setval('episode_id_seq',     (SELECT MAX(id) FROM episode), true);
SELECT setval('review_id_seq',      (SELECT MAX(id) FROM review), true);
SELECT setval('reply_id_seq',       (SELECT MAX(id) FROM reply), true);

COMMIT;