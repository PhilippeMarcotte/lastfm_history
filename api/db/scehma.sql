DROP TABLE IF EXISTS song;
DROP TABLE IF EXISTS album;
DROP TABLE IF EXISTS artist;

CREATE TABLE song (
    id INTEGER PRIMARY KEY,
    date INTEGER NOT NULL, 
    name TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    album_id INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist (id),
    FOREIGN KEY (album_id) REFERENCES album (id)
)

CREATE TABLE album (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    artist_id INTEGER NOT NULL,
    album_art_url TEXT NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist (id)
)

CREATE TABLE artist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)