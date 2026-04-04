
CREATE OR REPLACE PROCEDURE submit_review(
  p_user_id INTEGER,
  p_media_id INTEGER DEFAULT NULL,
  p_season_id INTEGER DEFAULT NULL,
  p_episode_id INTEGER DEFAULT NULL,
  p_star_point INTEGER DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO review (
    user_id, media_id, season_id, episode_id, 
    star_point, description, is_removed, created_at
  ) VALUES (
    p_user_id, p_media_id, p_season_id, p_episode_id,
    p_star_point, p_description, false, NOW()
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;


CREATE OR REPLACE PROCEDURE add_to_watchlist(
  p_user_id INTEGER,
  p_media_id INTEGER
)
LANGUAGE plpgsql AS $$
DECLARE
  already_exists INTEGER;
BEGIN
  SELECT COUNT(*) INTO already_exists
  FROM watchlist
  WHERE user_id = p_user_id AND media_id = p_media_id;

  IF already_exists = 0 THEN
    INSERT INTO watchlist (user_id, media_id, added_at)
    VALUES (p_user_id, p_media_id, NOW());
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;


CREATE OR REPLACE PROCEDURE add_fan(
  p_user_id INTEGER,
  p_person_id INTEGER
)
LANGUAGE plpgsql AS $$
DECLARE
  already_fan INTEGER;
BEGIN
  SELECT COUNT(*) INTO already_fan
  FROM fan
  WHERE user_id = p_user_id AND person_id = p_person_id;

  IF already_fan = 0 THEN
    INSERT INTO fan (user_id, person_id)
    VALUES (p_user_id, p_person_id);
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;
