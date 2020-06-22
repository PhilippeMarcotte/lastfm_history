
import time
from flask import Flask, Blueprint
from flask.cli import with_appcontext
import click
from .db import get_db
import json
import sqlite3

api = Blueprint("api", __name__)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@api.route('/time')
def get_current_time():
    return {'time': int(round(time.time() * 1000))}

@api.route('/albums', defaults={"order":"date", "asc":False, "offset":0, "count":50})
@api.route('/albums/order=<order>&asc=<asc>&offset=<offset>&count=<count>')
def get_albums(order="date", asc=False, offset=0, count=50):
    direction = "ASC" if asc else "DESC"
    sql = f"""
           SELECT A.name, Ar.name as artist, A.date, lastfm_art, spotify_art 
           FROM albums A
           INNER JOIN artists Ar ON A.artist_id = Ar.id
           WHERE A.name != '' AND Ar.name != ''
           ORDER BY A.{order} {direction} 
           LIMIT {count} 
           OFFSET {offset}
           """
    conn = get_db()
    conn.row_factory = dict_factory
    cursor = conn.cursor()
    results = cursor.execute(sql).fetchall()
    return json.dumps(results)
