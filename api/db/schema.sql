DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;

CREATE TABLE IF NOT EXISTS scrobbles (
    date INTEGER PRIMARY KEY,
    song TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    source TEXT NOT NULL,
    lastfm_art TEXT,
    spotify_art TEXT
);

CREATE TABLE IF NOT EXISTS songs (
    date INTEGER PRIMARY KEY, 
    name TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist (id),
    FOREIGN KEY (album_id) REFERENCES album (id)
);

CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    lastfm_art TEXT,
    spotify_art TEXT,
    date INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist (id)
);

CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date INTEGER NOT NULL
);
