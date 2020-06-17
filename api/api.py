import time
from flask import Flask
import pylast

network = pylast.LastFMNetwork(api_key=API_KEY, api_secret=API_SECRET,
                               username="Esiode")

@app.route('/time')
def get_current_time():
    return {'time': int(round(time.time() * 1000))}