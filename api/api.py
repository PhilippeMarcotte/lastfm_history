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

@api.route('/albums', defaults={"order":"date", "asc":False, "offset":0, "count":50})
@api.route('/albums/order=<order>&asc=<asc>&offset=<offset>&count=<count>')
def get_albums(order="date", asc=False, offset=0, count=50):
  direction = "ASC" if asc else "DESC"
  sql = f"""
          SELECT name, artist, date, lastfm_art, spotify_art 
          FROM albums
          WHERE name != ''
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
  return ''