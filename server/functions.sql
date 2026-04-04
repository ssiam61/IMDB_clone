
CREATE OR REPLACE FUNCTION get_media_user_rating(p_media_id INTEGER)
RETURNS NUMERIC(3,1) AS $$
DECLARE
  avg_rating NUMERIC(3,1);
BEGIN
  SELECT ROUND(AVG(star_point)::numeric, 1)
  INTO avg_rating
  FROM review
  WHERE media_id = p_media_id 
    AND is_removed = false 
    AND star_point IS NOT NULL;
  RETURN COALESCE(avg_rating, 0.0);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_review_count(
  p_media_id INTEGER DEFAULT NULL,
  p_season_id INTEGER DEFAULT NULL,
  p_episode_id INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM review
  WHERE is_removed = false
    AND (
      (p_media_id IS NOT NULL AND media_id = p_media_id) OR
      (p_season_id IS NOT NULL AND season_id = p_season_id) OR
      (p_episode_id IS NOT NULL AND episode_id = p_episode_id)
    );
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_person_fan_count(p_person_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM fan
  WHERE person_id = p_person_id;
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_media_watchlist_count(p_media_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM watchlist
  WHERE media_id = p_media_id;
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_top_rated_media(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  id INTEGER,
  name VARCHAR,
  media_type VARCHAR,
  thumbnail VARCHAR,
  user_rating NUMERIC,
  imdb_rating NUMERIC,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.media_type,
    m.thumbnail,
    m.user_rating,
    m.imdb_rating,
    COUNT(r.id) as review_count
  FROM media m
  LEFT JOIN review r ON r.media_id = m.id AND r.is_removed = false
  GROUP BY m.id, m.name, m.media_type, m.thumbnail, 
           m.user_rating, m.imdb_rating
  ORDER BY m.user_rating DESC NULLS LAST
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
