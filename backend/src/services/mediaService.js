import pool from "../config/db.js";

export const getAllMedia = async () => {
  const query = `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.imdb_rating,
      m.user_rating,
      m.duration,
      m.teaser_link,
      CASE 
        WHEN mo.id IS NOT NULL THEN 'movie'
        WHEN s.id IS NOT NULL THEN 'series'
      END as type,
      STRING_AGG(DISTINCT g.name, ', ') as genres_str,
      STRING_AGG(DISTINCT CASE WHEN mp.role = 'actor' THEN p.name END, ', ') as cast_str,
      MAX(CASE WHEN mp.role = 'director' THEN p.name END) as director,
      COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN season.id END) as season_count
    FROM media m
    LEFT JOIN movie mo ON m.id = mo.media_id
    LEFT JOIN series s ON m.id = s.media_id
    LEFT JOIN season ON s.id = season.series_id
    LEFT JOIN media_genre mg ON m.id = mg.media_id
    LEFT JOIN genre g ON mg.genre_id = g.id
    LEFT JOIN media_personality mp ON m.id = mp.media_id
    LEFT JOIN person p ON mp.person_id = p.id
    WHERE m.is_published = TRUE
    GROUP BY m.id, m.name, m.description, m.imdb_rating, m.user_rating, 
             m.duration, m.teaser_link, mo.id, s.id
    ORDER BY m.id DESC
  `;
  try {
    const { rows } = await pool.query(query);
    
    // Transform the results to proper structure
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imdbRating: parseFloat(row.imdb_rating),
      userRating: parseFloat(row.user_rating),
      duration: row.duration,
      teaserLink: row.teaser_link,
      type: row.type,
      genres: row.genres_str ? row.genres_str.split(', ').filter(g => g) : [],
      cast: row.cast_str ? row.cast_str.split(', ').filter(c => c) : [],
      director: row.director || null,
      seasonCount: row.type === 'series' ? parseInt(row.season_count) || 0 : null
    }));
  } catch (error) {
    throw new Error("Failed to fetch media: " + error.message);
  }
};

export const getMediaById = async (id) => {
  const query = `
    SELECT 
      m.id,
      m.name,
      m.description,
      m.imdb_rating,
      m.user_rating,
      m.duration,
      m.teaser_link,
      CASE 
        WHEN mo.id IS NOT NULL THEN 'movie'
        WHEN s.id IS NOT NULL THEN 'series'
      END as type,
      STRING_AGG(DISTINCT g.name, ', ') as genres_str,
      STRING_AGG(DISTINCT CASE WHEN mp.role = 'actor' THEN p.name END, ', ') as cast_str,
      MAX(CASE WHEN mp.role = 'director' THEN p.name END) as director,
      COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN season.id END) as season_count
    FROM media m
    LEFT JOIN movie mo ON m.id = mo.media_id
    LEFT JOIN series s ON m.id = s.media_id
    LEFT JOIN season ON s.id = season.series_id
    LEFT JOIN media_genre mg ON m.id = mg.media_id
    LEFT JOIN genre g ON mg.genre_id = g.id
    LEFT JOIN media_personality mp ON m.id = mp.media_id
    LEFT JOIN person p ON mp.person_id = p.id
    WHERE m.id = $1
    GROUP BY m.id, m.name, m.description, m.imdb_rating, m.user_rating, 
             m.duration, m.teaser_link, mo.id, s.id
  `;
  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      imdbRating: parseFloat(row.imdb_rating),
      userRating: parseFloat(row.user_rating),
      duration: row.duration,
      teaserLink: row.teaser_link,
      type: row.type,
      genres: row.genres_str ? row.genres_str.split(', ').filter(g => g) : [],
      cast: row.cast_str ? row.cast_str.split(', ').filter(c => c) : [],
      director: row.director || null,
      seasonCount: row.type === 'series' ? parseInt(row.season_count) || 0 : null
    };
  } catch (error) {
    throw new Error("Failed to fetch media by id: " + error.message);
  }
};


export const getFullMediaById = async (id) => {
  try {
    // 1. Get media basic info
    const mediaQuery = `SELECT * FROM media WHERE id = $1`;
    const mediaResult = await pool.query(mediaQuery, [id]);
    if (mediaResult.rows.length === 0) {
      return null;
    }
    const media = mediaResult.rows[0];

    // 2. Get genres
    const genresQuery = `
      SELECT g.name
      FROM genre g
      JOIN media_genre mg ON mg.genre_id = g.id
      WHERE mg.media_id = $1
    `;
    const genresResult = await pool.query(genresQuery, [id]);
    const genres = genresResult.rows.map(row => row.name);

    // 3. Get cast (people and their roles)
    const castQuery = `
      SELECT p.name, mp.role
      FROM person p
      JOIN media_personality mp ON mp.person_id = p.id
      WHERE mp.media_id = $1
    `;
    const castResult = await pool.query(castQuery, [id]);
    const cast = castResult.rows;

    // 4. Determine type (movie or series)
    const typeQuery = `
      SELECT 'movie' AS type FROM movie WHERE media_id = $1
      UNION ALL
      SELECT 'series' AS type FROM series WHERE media_id = $1
    `;
    const typeResult = await pool.query(typeQuery, [id]);
    let type = null;
    if (typeResult.rows.length > 0) {
      type = typeResult.rows[0].type;
    }

    return {
      media,
      genres,
      cast,
      type,
    };
  } catch (error) {
    throw new Error("Failed to fetch full media details: " + error.message);
  }
};
