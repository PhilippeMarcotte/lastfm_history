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
      return scrobbles
  return None

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

def update_scrobbles(user="Esiode", source=Source.lastfm):
  if source == Source.lastfm:
      source_str = "lastfm"
  # elif source == Source.listenbrainz:
  #     source_str = "listenbrainz"

  most_recent = db.get_db().cursor().execute(f"SELECT MAX(date) FROM scrobbles WHERE source LIKE '{source_str}'").fetchone()[0]
  fetch_scrobbles(user, most_recent)
  return most_recent

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

def build_artists(from_uts=""):
  if from_uts:
    from_uts = f"WHERE date > {from_uts} "
  query = f"SELECT artist, MAX(date) as date FROM scrobbles {from_uts}GROUP BY artist"
  cur = db.get_db().cursor()
  cur.execute(query)
  artists = cur.fetchall()
  artists.sort()
  db.create_artists(artists)

def build_albums(from_uts=""):
  if from_uts:
    from_uts = f"WHERE date > {from_uts} "
  query = f"SELECT album, artist, lastfm_art, spotify_art, MAX(date) as date FROM scrobbles {from_uts}GROUP BY album, artist"
  cur = db.get_db().cursor()
  cur.execute(query)
  albums = cur.fetchall()
  albums.sort(key=lambda album: album[0])
  db.create_albums(albums)
  return albums

@click.command("build-albums")
@with_appcontext
def build_albums_command():
  build_albums()

def build_songs(from_uts=""):
  if from_uts:
    from_uts = f"WHERE date > {from_uts} "
  query = f"SELECT MAX(date) as date, song, album, artist FROM scrobbles {from_uts}GROUP BY song, album, artist"
  cur = db.get_db().cursor()
  cur.execute(query)
  songs = cur.fetchall()
  songs.sort(key=lambda album: album[0])
  db.create_songs(songs)

def update_spotify_art(from_uts=""):
  import spotipy
  from spotipy.oauth2 import SpotifyClientCredentials
  import tqdm

  if from_uts:
    from_uts = f"AND date > {from_uts}"
  cur = db.get_db().cursor()
  nbr_albums = cur.execute(f"SELECT COUNT(*) FROM ALBUMS WHERE (name != '' AND artist != '') AND spotify_art IS NULL {from_uts}").fetchone()[0]
  query = f"SELECT name, artist FROM albums WHERE (name != '' AND artist != '') AND spotify_art IS NULL {from_uts}"
  cur.execute(query)

  sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials())
  for album in tqdm.tqdm(cur, total=nbr_albums):
    res = sp.search(f"album:{album[0]} artist:{album[1]}", type='album', limit=1)
    if res["albums"]["total"] > 0:
      images = res["albums"]["items"][0]['images']
      spotify_art = images[1]["url"]
      query = f"UPDATE albums SET spotify_art=? WHERE name = ? AND artist = ?"
      db.get_db().cursor().execute(query, (spotify_art, album[0], album[1]))

@click.command("update-spotify-art")
@with_appcontext
def update_spotify_art_command():
  update_spotify_art()

def update_songs_album_order(from_uts=""):
  cur = db.get_db().cursor()
  if from_uts:
    from_uts = f"AND date > {from_uts}"
  query = f"SELECT name, artist FROM albums WHERE name != '' AND artist != '' AND order_fetched = 0 {from_uts}"
  cur.execute(query)
  albums = cur.fetchall()

  lastfm.fetch_songs_album_order(db, albums)

@click.command("update-songs-order")
@with_appcontext
def update_songs_order_command():
  update_songs_album_order()

def build_db_from_scrobbles(from_uts=""):
  build_artists(from_uts)
  build_songs(from_uts)
  build_albums(from_uts)
  update_spotify_art(from_uts)
  update_songs_album_order(from_uts)

def build_db(user="Esiode", source=Source.lastfm):
  fetch_scrobbles(user, source)
  build_db_from_scrobbles()

@click.command("build-db")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def build_db_command(user, source):
  build_db(user, Source[source])

def update_db(user="Esiode", source=Source.lastfm):
  most_recent = update_scrobbles(user, source)
  build_db_from_scrobbles(most_recent)

@click.command("update-db")
@click.option("--user", default="Esiode")
@click.option("--source", type=click.Choice(['lastfm', 'listenbrainz', "all"], case_sensitive=False), default="lastfm", show_default=True)
@with_appcontext
def update_db_command(user, source):
  update_db(user, Source[source])

def init_app(app):
  app.cli.add_command(fetch_scrobbles_command)
  app.cli.add_command(fetch_all_scrobbles_command)
  app.cli.add_command(update_scrobbles_command)
  app.cli.add_command(update_all_scrobbles_command)
  app.cli.add_command(build_db_command)
  app.cli.add_command(update_db_command)
  app.cli.add_command(update_spotify_art_command)
  app.cli.add_command(update_songs_order_command)
  app.cli.add_command(build_albums_command)
