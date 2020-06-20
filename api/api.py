import time
from flask import Flask


@app.route('/time')
def get_current_time():
    return {'time': int(round(time.time() * 1000))}