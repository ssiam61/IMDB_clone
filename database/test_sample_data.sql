\c imdbtest;

-- ─────────────────────────────────────────────
-- USERS (10 regular users, passwords are plaintext for demo purposes)
-- ─────────────────────────────────────────────

INSERT INTO users (username, name, email, password, profile_picture, is_banned) VALUES
('john_doe',      'John Doe',       'john@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=john',    FALSE),
('jane_smith',    'Jane Smith',     'jane@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=jane',    FALSE),
('mike_jones',    'Mike Jones',     'mike@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=mike',    FALSE),
('sara_connor',   'Sara Connor',    'sara@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=sara',    FALSE),
('alex_wright',   'Alex Wright',    'alex@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=alex',    FALSE),
('nina_patel',    'Nina Patel',     'nina@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=nina',    FALSE),
('tom_hardy_fan', 'Tom Hardy Fan',  'tomfan@example.com',  'pass1234', 'https://i.pravatar.cc/150?u=tom',     FALSE),
('lucy_liu_fan',  'Lucy Liu Fan',   'lucyfan@example.com', 'pass1234', 'https://i.pravatar.cc/150?u=lucy',    FALSE),
('bad_actor',     'Bad Actor',      'bad@example.com',     'pass1234', NULL,                                  TRUE),  -- banned user
('cinephile99',   'Cine Phile',     'cine@example.com',    'pass1234', 'https://i.pravatar.cc/150?u=cine',    FALSE);

-- ─────────────────────────────────────────────
-- ADMINS
-- (user_id 1 = super_admin, user_id 2 = moderator)
-- ─────────────────────────────────────────────

INSERT INTO admin (user_id, role, granted_by) VALUES
(1, 'super_admin', NULL),   -- John Doe is the founding super admin
(2, 'moderator',   1);      -- Jane Smith is a moderator, granted by John

-- ─────────────────────────────────────────────
-- USER BAN (bad_actor is banned)
-- ─────────────────────────────────────────────

INSERT INTO user_ban (user_id, banned_by, reason, is_permanent, expires_at) VALUES
(9, 1, 'Repeated spam and abusive comments in review sections.', TRUE, NULL);

-- ─────────────────────────────────────────────
-- GENRES
-- ─────────────────────────────────────────────

INSERT INTO genre (name) VALUES
('Action'),
('Drama'),
('Comedy'),
('Thriller'),
('Sci-Fi'),
('Horror'),
('Romance'),
('Animation'),
('Documentary'),
('Fantasy');

-- ─────────────────────────────────────────────
-- USER GENRE PREFERENCES
-- ─────────────────────────────────────────────

INSERT INTO preference (user_id, genre_id) VALUES
(1, 1), (1, 4), (1, 5),   -- John: Action, Thriller, Sci-Fi
(2, 2), (2, 7),            -- Jane: Drama, Romance
(3, 3), (3, 8),            -- Mike: Comedy, Animation
(4, 6), (4, 4),            -- Sara: Horror, Thriller
(5, 5), (5, 9),            -- Alex: Sci-Fi, Documentary
(6, 2), (6, 10),           -- Nina: Drama, Fantasy
(7, 1), (7, 2),            -- Tom fan: Action, Drama
(8, 3), (8, 7),            -- Lucy fan: Comedy, Romance
(10, 1),(10, 5),(10, 2);   -- Cinephile: Action, Sci-Fi, Drama

-- ─────────────────────────────────────────────
-- PERSONS (actors, directors, writers)
-- ─────────────────────────────────────────────

INSERT INTO person (name, occupation, picture, biography) VALUES
('Christopher Nolan',  'Director', 'https://example.com/pics/nolan.jpg',      'British-American filmmaker known for mind-bending narratives and practical effects.'),
('Leonardo DiCaprio',  'Actor',    'https://example.com/pics/leo.jpg',        'Oscar-winning American actor known for intense and transformative roles.'),
('Meryl Streep',       'Actress',  'https://example.com/pics/meryl.jpg',      'Three-time Academy Award winner and widely regarded as one of the greatest actresses.'),
('Quentin Tarantino',  'Director', 'https://example.com/pics/tarantino.jpg',  'Known for non-linear storytelling, sharp dialogue, and stylized violence.'),
('Scarlett Johansson', 'Actress',  'https://example.com/pics/scarlett.jpg',   'One of the highest-paid actresses, known for action and dramatic roles.'),
('Morgan Freeman',     'Actor',    'https://example.com/pics/morgan.jpg',     'Iconic American actor known for his distinctive voice and versatile performances.'),
('Vince Gilligan',     'Writer',   'https://example.com/pics/gilligan.jpg',   'Creator and writer of Breaking Bad, one of the most acclaimed TV series.'),
('Bryan Cranston',     'Actor',    'https://example.com/pics/cranston.jpg',   'Acclaimed actor best known for his role as Walter White in Breaking Bad.'),
('David Fincher',      'Director', 'https://example.com/pics/fincher.jpg',    'Hollywood director known for dark, psychological thrillers with meticulous detail.'),
('Cate Blanchett',     'Actress',  'https://example.com/pics/blanchett.jpg',  'Australian actress and two-time Academy Award winner known for diverse roles.');

-- ─────────────────────────────────────────────
-- FANS (users following persons)
-- ─────────────────────────────────────────────

INSERT INTO fan (user_id, person_id) VALUES
(1, 1), (1, 2),   -- John fans: Nolan, DiCaprio
(2, 3), (2, 5),   -- Jane fans: Streep, Johansson
(3, 4),            -- Mike fans: Tarantino
(4, 9),            -- Sara fans: Fincher
(5, 1), (5, 7),   -- Alex fans: Nolan, Gilligan
(7, 8),            -- Tom fan fans: Cranston
(8, 10),           -- Lucy fan fans: Blanchett
(10,1),(10,2),(10,9); -- Cinephile fans: Nolan, DiCaprio, Fincher

-- ─────────────────────────────────────────────
-- AWARDS
-- ─────────────────────────────────────────────

INSERT INTO award (name, awarded_by, prize_money) VALUES
('Best Picture',            'Academy Awards',   NULL),
('Best Director',           'Academy Awards',   NULL),
('Best Actor',              'Academy Awards',   NULL),
('Best Actress',            'Academy Awards',   NULL),
('Best Screenplay',         'Academy Awards',   NULL),
('Golden Globe Best Film',  'Hollywood HFPA',   NULL),
('Palme d''Or',             'Cannes',           NULL),
('BAFTA Best Film',         'BAFTA',            NULL),
('Emmy Outstanding Drama',  'Television Academy', 50000),
('Emmy Outstanding Actor',  'Television Academy', 50000);

-- ─────────────────────────────────────────────
-- PERSON AWARDS
-- ─────────────────────────────────────────────

INSERT INTO person_award (person_id, award_id, year) VALUES
(2,  3, 2016),   -- DiCaprio: Best Actor (The Revenant)
(3,  4, 2012),   -- Streep: Best Actress (The Iron Lady)
(1,  2, 2024),   -- Nolan: Best Director (Oppenheimer)
(8, 10, 2014),   -- Cranston: Emmy Outstanding Actor
(7,  9, 2013),   -- Gilligan: Emmy Outstanding Drama
(10, 4, 2005);   -- Blanchett: Best Actress (The Aviator)

-- ─────────────────────────────────────────────
-- MEDIA (movies + series base entries)
-- added_by admin id 1 (John), some by admin 2 (Jane)
-- ─────────────────────────────────────────────

INSERT INTO media (name, teaser_link, description, imdb_rating, user_rating, duration, added_by, last_updated_by, is_published) VALUES
-- Movies
('Inception',
 'https://youtube.com/inception-trailer',
 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
 8.8, 8.5, 148, 1, 1, TRUE),

('The Dark Knight',
 'https://youtube.com/dark-knight-trailer',
 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into anarchy.',
 9.0, 9.1, 152, 1, 1, TRUE),

('Pulp Fiction',
 'https://youtube.com/pulp-fiction-trailer',
 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
 8.9, 8.7, 154, 1, 1, TRUE),

('The Shawshank Redemption',
 'https://youtube.com/shawshank-trailer',
 'Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency.',
 9.3, 9.2, 142, 2, 2, TRUE),

('Gone Girl',
 'https://youtube.com/gone-girl-trailer',
 'With his wife''s disappearance having become a sensational news story, a man sees the spotlight turned on him.',
 8.1, 7.9, 149, 2, 2, TRUE),

-- Series
('Breaking Bad',
 'https://youtube.com/breaking-bad-trailer',
 'A chemistry teacher diagnosed with cancer turns to manufacturing meth with a former student to secure his family''s future.',
 9.5, 9.4, NULL, 1, 1, TRUE),

('Stranger Things',
 'https://youtube.com/stranger-things-trailer',
 'When a boy disappears, his friends and family confront terrifying supernatural forces in their small town.',
 8.7, 8.5, NULL, 2, 2, TRUE),

('The Crown',
 'https://youtube.com/the-crown-trailer',
 'Follows the political rivalries and romance of Queen Elizabeth II''s reign and the events that shaped the second half of the 20th century.',
 8.6, 8.3, NULL, 2, 2, TRUE),

-- Unpublished / draft entry
('Untitled Sci-Fi Project',
 NULL,
 'An upcoming science fiction film currently in post-production.',
 NULL, NULL, NULL, 1, 1, FALSE);

-- ─────────────────────────────────────────────
-- MOVIES
-- ─────────────────────────────────────────────

INSERT INTO movie (media_id) VALUES
(1),  -- Inception
(2),  -- The Dark Knight
(3),  -- Pulp Fiction
(4),  -- The Shawshank Redemption
(5);  -- Gone Girl

-- ─────────────────────────────────────────────
-- SERIES
-- ─────────────────────────────────────────────

INSERT INTO series (media_id) VALUES
(6),  -- Breaking Bad
(7),  -- Stranger Things
(8);  -- The Crown

-- ─────────────────────────────────────────────
-- SEASONS
-- ─────────────────────────────────────────────

INSERT INTO season (series_id, number, imdb_rating, user_rating) VALUES
-- Breaking Bad (series id 1)
(1, 1, 8.9, 8.7),
(1, 2, 9.2, 9.0),
(1, 3, 9.4, 9.3),
(1, 4, 9.7, 9.6),
(1, 5, 9.9, 9.8),
-- Stranger Things (series id 2)
(2, 1, 8.8, 8.6),
(2, 2, 8.6, 8.4),
(2, 3, 8.7, 8.8),
(2, 4, 9.0, 9.1),
-- The Crown (series id 3)
(3, 1, 8.7, 8.5),
(3, 2, 8.8, 8.6),
(3, 3, 8.5, 8.3);

-- ─────────────────────────────────────────────
-- EPISODES (sample for Breaking Bad S1 and Stranger Things S1)
-- ─────────────────────────────────────────────

INSERT INTO episode (season_id, number, imdb_rating, user_rating) VALUES
-- Breaking Bad Season 1 (season_id = 1)
(1, 1, 9.0, 8.9),
(1, 2, 8.6, 8.4),
(1, 3, 8.5, 8.3),
(1, 4, 8.7, 8.5),
(1, 5, 8.9, 8.8),
(1, 6, 9.1, 9.0),
-- Stranger Things Season 1 (season_id = 6)
(6, 1, 8.7, 8.6),
(6, 2, 8.5, 8.3),
(6, 3, 8.6, 8.4),
(6, 4, 8.8, 8.7),
(6, 5, 9.0, 8.9),
(6, 6, 9.2, 9.1),
(6, 7, 9.3, 9.2),
(6, 8, 9.5, 9.4);

-- ─────────────────────────────────────────────
-- MEDIA GENRES
-- ─────────────────────────────────────────────

INSERT INTO media_genre (media_id, genre_id) VALUES
(1, 1), (1, 4), (1, 5),    -- Inception: Action, Thriller, Sci-Fi
(2, 1), (2, 4),             -- The Dark Knight: Action, Thriller
(3, 2), (3, 4),             -- Pulp Fiction: Drama, Thriller
(4, 2),                     -- Shawshank: Drama
(5, 2), (5, 4),             -- Gone Girl: Drama, Thriller
(6, 2), (6, 4),             -- Breaking Bad: Drama, Thriller
(7, 5), (7, 6),             -- Stranger Things: Sci-Fi, Horror
(8, 2);                     -- The Crown: Drama

-- ─────────────────────────────────────────────
-- MEDIA PERSONALITIES
-- ─────────────────────────────────────────────

INSERT INTO media_personality (media_id, person_id, role) VALUES
-- Inception
(1, 1, 'director'),
(1, 2, 'actor'),
(1, 5, 'actor'),
-- The Dark Knight
(2, 1, 'director'),
-- Pulp Fiction
(3, 4, 'director'),
(3, 4, 'writer'),
-- Shawshank Redemption
(4, 6, 'actor'),
-- Gone Girl
(5, 9, 'director'),
-- Breaking Bad
(6, 7, 'writer'),
(6, 8, 'actor'),
-- Stranger Things (using Fincher as placeholder producer)
(7, 9, 'producer');

-- ─────────────────────────────────────────────
-- MEDIA AWARDS
-- ─────────────────────────────────────────────

INSERT INTO media_award (media_id, award_id, year) VALUES
(2, 1, 2009),   -- The Dark Knight: Best Picture nom (didn't win but adding for demo)
(3, 5, 1995),   -- Pulp Fiction: Best Screenplay
(4, 1, 1995),   -- Shawshank: Best Picture nom
(5, 8, 2015),   -- Gone Girl: BAFTA Best Film
(6, 9, 2013),   -- Breaking Bad: Emmy Outstanding Drama
(1, 6, 2011);   -- Inception: Golden Globe Best Film

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────

INSERT INTO review (user_id, media_id, season_id, episode_id, star_point, description, upvote, downvote) VALUES
-- Movie reviews
(3,  1,    NULL, NULL, 10, 'Inception is a masterpiece. The dream-within-a-dream concept is mind-blowing and executed flawlessly.', 45, 2),
(4,  1,    NULL, NULL,  8, 'Great film but I found the ending a bit ambiguous. Still one of the best of the decade.', 30, 5),
(5,  2,    NULL, NULL, 10, 'The Dark Knight is the greatest superhero movie ever made. Heath Ledger''s Joker is iconic.', 78, 1),
(6,  3,    NULL, NULL,  9, 'Pulp Fiction changed cinema forever. Tarantino at his absolute best.', 55, 3),
(10, 4,    NULL, NULL, 10, 'The Shawshank Redemption is the most uplifting film I have ever seen. A timeless classic.', 99, 0),
(1,  5,    NULL, NULL,  7, 'Gone Girl is a tense and gripping thriller. Rosamund Pike is phenomenal.', 22, 4),
-- Series-level reviews
(7,  6,    NULL, NULL, 10, 'Breaking Bad is unmatched in television history. Every episode is better than the last.', 88, 2),
(8,  7,    NULL, NULL,  9, 'Stranger Things captures the magic of 80s nostalgia perfectly. Incredible world-building.', 60, 3),
(2,  8,    NULL, NULL,  8, 'The Crown is beautifully produced. A fascinating look at the British monarchy.', 40, 6),
-- Season review
(1,  NULL, 5,    NULL,  9, 'Breaking Bad Season 4 is peak television. Giancarlo Esposito as Gus Fring is terrifying.', 77, 1),
(10, NULL, 6,    NULL, 10, 'Stranger Things Season 1 is a perfect debut. The chemistry between the kids is amazing.', 66, 0),
-- Episode review
(3,  NULL, NULL, 6,    10, 'Crazy Handful of Nothin'' is when Breaking Bad truly became something special.', 50, 1),
(5,  NULL, NULL, 14,   10, 'The finale of Stranger Things Season 1 gave me chills. An absolute rollercoaster.', 48, 2);

-- ─────────────────────────────────────────────
-- REPLIES TO REVIEWS
-- ─────────────────────────────────────────────

INSERT INTO reply (user_id, parent_review_id, parent_reply_id, description, upvote, downvote) VALUES
-- Replies to review 1 (Inception review by mike_jones)
(1,  1, NULL, 'Totally agree! The spinning top at the end still gets me every time I think about it.', 12, 0),
(2,  1, NULL, 'I think the ambiguity is the whole point. Nolan wants you to question reality.', 9,  1),
-- Reply to a reply (reply_id 2)
(3,  NULL, 2, 'That''s a great interpretation. It makes rewatches even more rewarding.', 5, 0),
-- Replies to review 3 (Dark Knight review)
(6,  3, NULL, 'Agree 100%. No MCU film has come close to this level of storytelling.', 20, 3),
(10, 3, NULL, 'Heath Ledger deserved every award he received. Truly tragic we lost him so soon.', 33, 0),
-- Reply to review 7 (Breaking Bad review)
(5,  7, NULL, 'Breaking Bad ruined every other show for me. Nothing compares.', 15, 1),
(1,  7, NULL, 'Have you watched Better Call Saul? It''s almost as good.', 18, 2),
-- Reply to a reply (reply_id 7)
(7,  NULL, 7, 'Better Call Saul is incredible in its own right. The Mike episodes are exceptional.', 10, 0);

-- ─────────────────────────────────────────────
-- REPORTS (flagged content for admin review)
-- ─────────────────────────────────────────────

INSERT INTO report (reporter_id, review_id, reply_id, reason, status, actioned_by, actioned_at) VALUES
(5, 4, NULL, 'This review contains spoilers without any warning.', 'resolved', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, NULL, 4, 'Reply is unnecessarily hostile and dismissive.', 'pending', NULL, NULL),
(1, 7, NULL, 'Suspected spam account — very generic praise with suspicious upvote count.', 'dismissed', 1, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ─────────────────────────────────────────────
-- ADMIN LOGS
-- ─────────────────────────────────────────────

INSERT INTO admin_log (admin_id, action, target_type, target_id, notes) VALUES
(1, 'add_media',      'media',  1,  'Added Inception to the database.'),
(1, 'add_media',      'media',  2,  'Added The Dark Knight to the database.'),
(1, 'add_media',      'media',  3,  'Added Pulp Fiction to the database.'),
(2, 'add_media',      'media',  4,  'Added The Shawshank Redemption.'),
(2, 'add_media',      'media',  5,  'Added Gone Girl.'),
(1, 'add_media',      'media',  6,  'Added Breaking Bad series.'),
(2, 'add_media',      'media',  7,  'Added Stranger Things series.'),
(2, 'add_media',      'media',  8,  'Added The Crown series.'),
(1, 'ban_user',       'user',   9,  'Permanent ban issued for repeated spam and abuse.'),
(2, 'resolve_report', 'report', 1,  'Marked spoiler report as resolved; added spoiler tag note to review.'),
(1, 'dismiss_report', 'report', 3,  'Investigated upvote count — determined organic. Report dismissed.'),
(1, 'grant_admin',    'admin',  2,  'Promoted Jane Smith to moderator role.');

-- ─────────────────────────────────────────────
-- WATCHLISTS
-- ─────────────────────────────────────────────

INSERT INTO watchlist (user_id, media_id) VALUES
(1, 3), (1, 6),
(2, 1), (2, 7),
(3, 2), (3, 8),
(4, 1), (4, 5),
(5, 6), (5, 7),
(6, 4), (6, 8),
(7, 6),
(8, 3), (8, 7),
(10,1), (10,2),(10,3),(10,4),(10,6);

-- ─────────────────────────────────────────────
-- POST & REPLY ATTACHMENTS
-- ─────────────────────────────────────────────

INSERT INTO post_attachments (post_id, attachment) VALUES
(1, 'https://example.com/attachments/inception-screenshot.jpg'),
(5, 'https://example.com/attachments/shawshank-poster.jpg'),
(7, 'https://example.com/attachments/breaking-bad-chart.png');

INSERT INTO reply_attachments (reply_id, attachment) VALUES
(5, 'https://example.com/attachments/ledger-tribute.jpg'),
(7, 'https://example.com/attachments/bcs-comparison.jpg');
