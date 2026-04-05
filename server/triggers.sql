ALTER TABLE person 
ADD COLUMN IF NOT EXISTS fan_count INTEGER DEFAULT 0;


CREATE OR REPLACE FUNCTION update_person_fan_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE person SET fan_count = GREATEST(0, fan_count - 1) WHERE id = OLD.person_id;
  ELSE
    UPDATE person SET fan_count = fan_count + 1 WHERE id = NEW.person_id;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_person_fan_count ON fan;
CREATE TRIGGER trigger_update_person_fan_count
  AFTER INSERT OR DELETE ON fan
  FOR EACH ROW EXECUTE FUNCTION update_person_fan_count();

--

ALTER TABLE media 
ADD COLUMN IF NOT EXISTS watchlist_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION update_media_watchlist_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE media SET watchlist_count = GREATEST(0, watchlist_count - 1) WHERE id = OLD.media_id;
  ELSE
    UPDATE media SET watchlist_count = watchlist_count + 1 WHERE id = NEW.media_id;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_media_watchlist_count ON watchlist;
CREATE TRIGGER trigger_update_media_watchlist_count
  AFTER INSERT OR DELETE ON watchlist
  FOR EACH ROW EXECUTE FUNCTION update_media_watchlist_count();

--

CREATE OR REPLACE FUNCTION auto_remove_from_watchlist_on_review()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.media_id IS NOT NULL THEN
    DELETE FROM watchlist 
    WHERE user_id = NEW.user_id AND media_id = NEW.media_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_remove_from_watchlist_on_review ON review;
CREATE TRIGGER trigger_auto_remove_from_watchlist_on_review
  AFTER INSERT ON review
  FOR EACH ROW EXECUTE FUNCTION auto_remove_from_watchlist_on_review();

--

CREATE OR REPLACE FUNCTION recalculate_user_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_media_id INTEGER;
  v_season_id INTEGER;
  v_episode_id INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_media_id := OLD.media_id;
    v_season_id := OLD.season_id;
    v_episode_id := OLD.episode_id;
  ELSE
    v_media_id := NEW.media_id;
    v_season_id := NEW.season_id;
    v_episode_id := NEW.episode_id;
  END IF;

  IF v_media_id IS NOT NULL THEN
    UPDATE media 
    SET user_rating = (
      SELECT ROUND(AVG(star_point)::numeric, 1)
      FROM review
      WHERE media_id = v_media_id AND is_removed = false AND star_point IS NOT NULL
    )
    WHERE id = v_media_id;
  END IF;

  IF v_season_id IS NOT NULL THEN
    UPDATE season
    SET user_rating = (
      SELECT ROUND(AVG(star_point)::numeric, 1)
      FROM review
      WHERE season_id = v_season_id AND is_removed = false AND star_point IS NOT NULL
    )
    WHERE id = v_season_id;
  END IF;

  IF v_episode_id IS NOT NULL THEN
    UPDATE episode
    SET user_rating = (
      SELECT ROUND(AVG(star_point)::numeric, 1)
      FROM review
      WHERE episode_id = v_episode_id AND is_removed = false AND star_point IS NOT NULL
    )
    WHERE id = v_episode_id;
  END IF;

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_recalculate_user_rating ON review;
CREATE TRIGGER trigger_recalculate_user_rating
  AFTER INSERT OR UPDATE OR DELETE ON review
  FOR EACH ROW EXECUTE FUNCTION recalculate_user_rating();
