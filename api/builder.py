from .db import get_db, create_scrobbles, create_artists, create_albums, create_songs
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

@with_appcontext
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
        create_scrobbles(scrobbles)

@with_appcontext
def update_scrobbles(user="Esiode", source=Source.lastfm):
    if source == Source.lastfm:
        source_str = "lastfm"
    # elif source == Source.listenbrainz:
    #     source_str = "listenbrainz"

    most_recent = get_db().cursor().execute(f"SELECT MAX(date) FROM scrobbles WHERE source LIKE {source_str}").fetchone()[0]

@click.command()
@with_appcontext
def build_artists():
    query = "SELECT artist, MAX(date) FROM scrobbles GROUP BY artist"
    cur = get_db().cursor()
    cur.execute(query)
    artists = cur.fetchall()
    artists.sort()
    create_artists(artists)

@click.command()
@with_appcontext
def build_albums():
    query = "SELECT album, A.id, lastfm_art, spotify_art, MAX(S.date) FROM scrobbles S INNER JOIN artists A ON S.artist = A.name GROUP BY album"
    cur = get_db().cursor()
    cur.execute(query)
    albums = cur.fetchall()
    albums.sort(key=lambda album: album[0])
    create_albums(albums)

@click.command()
@with_appcontext
def build_songs():
    query = "SELECT MAX(date) as date, song, A.id, Ar.id from scrobbles Sc INNER JOIN artists A ON Sc.artist = A.name INNER JOIN albums Ar ON Sc.album = Ar.name GROUP BY song"
    cur = get_db().cursor()
    cur.execute(query)
    songs = cur.fetchall()
    songs.sort(key=lambda album: album[0])
    create_songs(songs)

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
    app.cli.add_command(build_artists)
    app.cli.add_command(build_albums)
    app.cli.add_command(update_scrobbles_command)
    app.cli.add_command(update_all_scrobbles_command)
