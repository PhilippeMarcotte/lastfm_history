import os

from flask import Flask

def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        API_KEY = "4e96380beb079c7d09fc47e878e8ed39",
        API_SECRET = "f76b47d1543048e59293ec66217b8642",
        DATABASE='api/db/history.db'
    )

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    from . import lastfm
    lastfm.init_app(app)

    return app