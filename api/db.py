import sqlite3
from flask import current_app, g
from flask.cli import with_appcontext
import click

def get_db() -> sqlite3.Connection:
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
    return db

def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.commit()
        db.close()

def create_scrobble(date, song, artist, album):
    db = get_db()

    sql = '''INSERT OR IGNORE INTO 
           scrobbles(date, song, artist, album, lastfm_art, spotify_art)
           VALUES(?,?,?,?,?,?)'''
    cur = db.cursor()
    cur.execute(sql, (date, song, artist, album))

def create_scrobbles(scrobbles):
    db = get_db()
    sql = '''
          INSERT OR IGNORE INTO 
          scrobbles(date, song, artist, album, source, lastfm_art, spotify_art)
          VALUES(?,?,?,?,?,?,?)
          '''

    cur = db.cursor()
    cur.executemany(sql, scrobbles)

def create_artists(artists):
    db = get_db()
    sql = '''
          INSERT INTO 
          artists(name, date)
          VALUES(?,?)
          ON CONFLICT (name)
          DO UPDATE SET date = excluded.date
          '''

    cur = db.cursor()
    cur.executemany(sql, artists)

def create_albums(albums):
    db = get_db()
    sql = '''
          INSERT INTO
          albums(name, artist, lastfm_art, spotify_art, date)
          VALUES(?,?,?,?,?)
          ON CONFLICT (name, artist)
          DO UPDATE SET date = excluded.date
          '''

    cur = db.cursor()
    cur.executemany(sql, albums)

def create_songs(songs):
    db = get_db()
    sql = '''
          INSERT INTO 
          songs(date, name, album, artist)
          VALUES(?,?,?,?)
          ON CONFLICT (name, album, artist)
          DO UPDATE SET date = excluded.date
          '''

    cur = db.cursor()
    cur.executemany(sql, songs)

def init_db():
    db = get_db()

    with current_app.open_resource('db/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_connection)
    app.cli.add_command(init_db_command)