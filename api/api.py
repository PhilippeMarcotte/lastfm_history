import time
from flask import Flask, Blueprint
from flask.cli import with_appcontext
import click
from .db import get_db
from . import builder
import json
import sqlite3

api = Blueprint("api", __name__)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@api.route('/albums/dateFrom=<dateFrom>&dateTo=<dateTo>&order=<order>&asc=<asc>&count=<count>&offset=<offset>')
def get_albums(dateFrom, dateTo, order="date", asc="false", count=50, offset=0):
  direction = "ASC" if asc.lower() == "true" else "DESC"
  if int(dateTo) >= 0:
    dateTo = f" AND date < {dateTo}"
  sql = f"""
          SELECT name, artist, date, lastfm_art, spotify_art 
          FROM albums
          WHERE name != '' AND date > {dateFrom}{dateTo}
          ORDER BY {order} {direction} 
          LIMIT {count} 
          OFFSET {offset}
          """
  conn = get_db()
  conn.row_factory = dict_factory
  cursor = conn.cursor()
  results = cursor.execute(sql).fetchall()
  return json.dumps(results)


@api.route('/albums/search/query=<query>&dateFrom=<dateFrom>&dateTo=<dateTo>&order=<order>&asc=<asc>&count=<count>&offset=<offset>')
def search_albums(query, dateFrom, dateTo, order, asc, count, offset):
  direction = "ASC" if asc.lower() == "true" else "DESC"
  query = query.replace("*", "%")
  if int(dateTo) >= 0:
    dateTo = f" AND date < {dateTo}"
  sql = f"""
          SELECT name, artist, date, lastfm_art, spotify_art 
          FROM albums
          WHERE (name LIKE '{query}') OR (artist LIKE '{query}') AND date > {dateFrom}{dateTo}
          ORDER BY {order} {direction} 
          LIMIT {count} 
          OFFSET {offset}
          """
  conn = get_db()
  conn.row_factory = dict_factory
  cursor = conn.cursor()
  results = cursor.execute(sql).fetchall()
  return json.dumps(results)
  

@api.route("/update")
def update_db():
  builder.update_db()
  return {"result": "done"}


@api.route("/songs/artist=<artist>&album=<album>")
def get_songs_from(artist, album):
  sql = f"""
         SELECT album_order, date, name, artist, album, (SELECT COUNT(*) FROM scrobbles as S WHERE S.song = name AND S.album = album AND S.artist = artist) as count
         FROM songs
         WHERE (artist='{artist}' AND album='{album}')
         GROUP BY name, artist, album
         ORDER BY album_order ASC
         """
  conn = get_db()
  conn.row_factory = dict_factory
  cursor = conn.cursor()
  results = cursor.execute(sql).fetchall()
  return json.dumps(results)
