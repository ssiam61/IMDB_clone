CREATE   OR REPLACE FUNCTION   validate_episode_data()
RETURNS trigger AS $$
BEGIN
   IF  NEW.number   <=0 THEN
     RAISE EXCEPTION 'Episode number must be positive.';
   END IF;
IF   NEW.release_date >   CURRENT_DATE THEN
  RAISE EXCEPTION 'Episode release date cannot be in the future.';
     END IF;

 RETURN NEW;
END; $$ LANGUAGE plpgsql;

   CREATE TRIGGER trg_validate_episode
BEFORE INSERT OR UPDATE
   ON episode
 FOR EACH ROW   EXECUTE FUNCTION
validate_episode_data();



CREATE OR REPLACE FUNCTION validate_season_data()
RETURNS trigger AS   $$
BEGIN
 IF NEW.number<=0
 THEN
  RAISE EXCEPTION 'Season number must be positive.'; END IF;

     IF NEW.release_date > CURRENT_DATE
    THEN
RAISE EXCEPTION 'Season release date cannot be in the future.';
     END IF;

 RETURN   NEW;
END;
$$ LANGUAGE  plpgsql;

  CREATE TRIGGER   trg_validate_season
BEFORE INSERT OR UPDATE ON
 season FOR EACH ROW
EXECUTE FUNCTION   validate_season_data();



CREATE OR REPLACE FUNCTION validate_media_data()
RETURNS trigger AS $$ BEGIN
 IF NEW.release_date   > CURRENT_DATE
     THEN RAISE EXCEPTION 'Media release date cannot be in the future.';
 END IF;
RETURN NEW;  END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_validate_media
  BEFORE INSERT OR UPDATE
     ON media
FOR EACH ROW EXECUTE FUNCTION
 validate_media_data();



CREATE OR REPLACE FUNCTION  recalc_ratings()
RETURNS trigger AS $$
BEGIN

  IF NEW.media_id IS NOT NULL THEN
 UPDATE media SET user_rating = (
   SELECT AVG(star_point)
   FROM review WHERE media_id = NEW.media_id)
 WHERE id = NEW.media_id;
  END IF;

 IF NEW.season_id   IS NOT NULL THEN
   UPDATE season SET user_rating =(
     SELECT AVG(star_point) FROM review
     WHERE season_id = NEW.season_id)
  WHERE id=NEW.season_id;
 END IF;

   IF NEW.episode_id IS NOT NULL THEN
UPDATE episode SET user_rating = (
   SELECT AVG(star_point)
 FROM review WHERE episode_id=NEW.episode_id)
 WHERE id = NEW.episode_id;
 END IF;

 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

  CREATE TRIGGER trg_recalc_ratings
AFTER INSERT OR UPDATE ON review
   FOR EACH ROW
EXECUTE FUNCTION recalc_ratings();



CREATE OR REPLACE FUNCTION anonymize_deleted_user_reviews()
RETURNS trigger AS $$ BEGIN
 UPDATE review
 SET user_id=NULL, description='[deleted]'
      WHERE user_id = OLD.id;

 RETURN OLD;
END; $$ LANGUAGE plpgsql;

   CREATE TRIGGER trg_anon_reviews
AFTER DELETE ON users
 FOR EACH ROW EXECUTE FUNCTION
anonymize_deleted_user_reviews();



CREATE OR REPLACE FUNCTION remove_from_watchlist_after_review()
RETURNS trigger AS $$
BEGIN
 IF NEW.media_id IS NOT NULL
   THEN
 DELETE FROM watchlist
   WHERE user_id = NEW.user_id
     AND media_id = NEW.media_id;
 END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_remove_watchlist_item
 AFTER INSERT ON review
FOR EACH ROW
  EXECUTE FUNCTION remove_from_watchlist_after_review();



CREATE OR REPLACE FUNCTION enforce_watchlist_limit()
RETURNS trigger AS $$
DECLARE watch_count INT;
BEGIN
  SELECT COUNT(*) INTO watch_count
   FROM watchlist WHERE user_id = NEW.user_id;

 IF watch_count >= 100
 THEN RAISE EXCEPTION 'Watchlist limit exceeded (max 100).';
 END IF;

 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

 CREATE TRIGGER trg_watchlist_limit
BEFORE INSERT ON   watchlist
 FOR EACH ROW
EXECUTE FUNCTION enforce_watchlist_limit();