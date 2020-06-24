DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS scrobbles;

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
    date INTEGER, 
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    FOREIGN KEY (artist) REFERENCES artists (name),
    FOREIGN KEY (album) REFERENCES albums (name),
    PRIMARY KEY (name, artist, album)
);

CREATE TABLE IF NOT EXISTS albums (
    name TEXT NOT NULL,
    artist INTEGER NOT NULL,
    lastfm_art TEXT,
    spotify_art TEXT,
    date INTEGER NOT NULL,
    FOREIGN KEY (artist) REFERENCES artists (name),
    PRIMARY KEY (name, artist)
);

CREATE TABLE IF NOT EXISTS artists (
    name TEXT NOT NULL PRIMARY KEY,
    date INTEGER NOT NULL
);
