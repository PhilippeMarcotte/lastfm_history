from . import db
from flask import current_app, g
from flask.cli import with_appcontext
import click
from enum import Enum
from .web_api import lastfm
from .web_api import listenbrainz

class Source(Enum):
    lastfm = 1
    listenbrainz = 2
    all = 3

def fetch_scrobbles(user="Esiode", from_uts=0, source=Source.lastfm, limit=None, n_workers=3):
    scrobbles = []
    if source == Source.all or source == Source.lastfm:
        scrobbles.extend(lastfm.fetch_scrobbles(user, from_uts, limit, n_workers)) 
    # elif source == Source.all or source == Source.listenbrainz:
    #     scrobbles.extend(listenbrainz.fetch_scrobbles(user, from_uts, n_workers))
    
    if scrobbles:
        scrobbles.sort(reverse=True, key=lambda track: track[0])

        if limit:
            scrobbles = scrobbles[:limit]
        db.create_scrobbles(scrobbles)

def update_scrobbles(user="Esiode", source=Source.lastfm):
    if source == Source.lastfm:
        source_str = "lastfm"
    # elif source == Source.listenbrainz:
    #     source_str = "listenbrainz"

    most_recent = db.get_db().cursor().execute(f"SELECT MAX(date) FROM scrobbles WHERE source LIKE '{source_str}'").fetchone()[0]
    fetch_scrobbles(user, most_recent)

def build_artists():
    query = "SELECT artist, MAX(date) FROM scrobbles GROUP BY artist"
    cur = db.get_db().cursor()
    cur.execute(query)
    artists = cur.fetchall()
    artists.sort()
    db.create_artists(artists)

def build_albums():
    query = "SELECT album, A.name, lastfm_art, spotify_art, MAX(S.date) FROM scrobbles S INNER JOIN artists A ON S.artist = A.name GROUP BY album"
    cur = db.get_db().cursor()
    cur.execute(query)
    albums = cur.fetchall()
    albums.sort(key=lambda album: album[0])
    db.create_albums(albums)

def build_songs():
    query = "SELECT MAX(Sc.date) as date, song, A.name, Ar.name from scrobbles Sc INNER JOIN artists A ON Sc.artist = A.name INNER JOIN albums Ar ON Sc.album = Ar.name GROUP BY song"
    cur = db.get_db().cursor()
    cur.execute(query)
    songs = cur.fetchall()
    songs.sort(key=lambda album: album[0])
    db.create_songs(songs)

def update_spotify_art():
    import spotipy
    from spotipy.oauth2 import SpotifyClientCredentials
    import tqdm

    cur = db.get_db().cursor()
    nbr_albums = cur.execute("SELECT COUNT(*) FROM ALBUMS WHERE (name != '' OR artist != '') AND spotify_art IS NULL").fetchone()[0]
    query = "SELECT name, artist FROM albums WHERE (name != '' OR artist != '') AND spotify_art IS NULL"
    cur.execute(query)

    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())
    for album in tqdm.tqdm(cur, total=nbr_albums):
      res = sp.search(f"album:{album[0]} artist:{album[1]}", type='album', limit=1)
      if res["albums"]["total"] > 0:
        images = res["albums"]["items"][0]['images']
        spotify_art = images[1]["url"]
        query = f"UPDATE albums SET spotify_art=? WHERE name = ? AND artist = ?"
        db.get_db().cursor().execute(query, (spotify_art, album[0], album[1]))

def build_db_from_scrobbles():
    build_artists()
    build_albums()
    build_songs()

def build_db(user="Esiode", source=Source.lastfm):
    fetch_scrobbles(user, source)
    build_db_from_scrobbles()

def update_db(user="Esiode", source=Source.lastfm):
    update_scrobbles(user, source)
    build_db_from_scrobbles()

@click.command("update-spotify-art")
@with_appcontext
def update_spotify_art_command():
  update_spotify_art()

@click.command("update-db")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def update_db_command(user, source):
    update_db(user, Source[source])

@click.command("build-db")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def build_db_command(user, source):
    build_db(user, Source[source])

@click.command("fetch-scrobbles")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def fetch_scrobbles_command(user, source):
    """Fetches all the scrobbles from the specified source"""
    fetch_scrobbles(user=user, source=Source[source])
    click.echo('Fetched scrobbles.')

@click.command("fetch-all-scrobbles")
@click.option("--user", default="Esiode")
@with_appcontext
def fetch_all_scrobbles_command(user):
    """Fetches all the scrobbles from all the sources"""
    fetch_scrobbles(user=user, source=Source.all)
    click.echo('Fetched scrobbles.')

@click.command("update-scrobbles")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def update_scrobbles_command(user, source):
    """Updates the scrobbles from the specified source"""
    update_scrobbles(user, Source[source])
    click.echo('Updated scrobbles.')

@click.command("update-all-scrobbles")
@click.option("--user", default="Esiode")
@with_appcontext
def update_all_scrobbles_command(user):
    """Updates the scrobbles from all the sources"""
    update_scrobbles(user, Source.all)
    click.echo('Updated scrobbles.')

def init_app(app):
    app.cli.add_command(fetch_scrobbles_command)
    app.cli.add_command(fetch_all_scrobbles_command)
    app.cli.add_command(update_scrobbles_command)
    app.cli.add_command(update_all_scrobbles_command)
    app.cli.add_command(build_db_command)
    app.cli.add_command(update_db_command)
    app.cli.add_command(update_spotify_art_command)
