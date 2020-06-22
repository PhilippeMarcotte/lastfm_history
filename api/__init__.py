import os

from flask import Flask

def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        API_KEY = "4e96380beb079c7d09fc47e878e8ed39",
        API_SECRET = "f76b47d1543048e59293ec66217b8642",
        DATABASE='api/db/history.db',
        LASTFM_ROOT='http://ws.audioscrobbler.com/2.0/',
        LISTENBRAINZ_ROOT="https://api.listenbrainz.org/1/user"
    )

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    from . import builder
    builder.init_app(app)

    from . import api
    app.register_blueprint(api.api, url_prefix="/api")

    return app