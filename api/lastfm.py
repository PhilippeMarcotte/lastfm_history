from .db import get_db
from flask import current_app, g
from flask.cli import with_appcontext
import requests
import click
import json
import multiprocessing
import time

def fetch_scrobbles_page(queue, scrobbles, params, values):
        while True:
            page = queue.get()
            if page == -1:
                break
            tries = 1
            while True:
                try:
                    r = requests.get(current_app.config["LASTFM_ACCESS_POINT"], params=params)

                    response = json.loads(r.text)

                    values["total_pages"] = int(response["recenttracks"]["@attr"]["totalPages"])

                    for track in response["recenttracks"]["track"]:
                        scrobble = (track["date"]["uts"], track["name"], track["artist"]["#text"], track["album"]["#text"], track["image"][-1]["#text"])
                        scrobbles.append(scrobble)
                    if page >= values["total_pages"]:
                        values["end"] = True
                    values["page_count"] += 1
                    break  # success
                except Exception as e:
                    if tries >= 3:
                        raise e
                    # Wait and try again
                    time.sleep(1)
                    tries += 1

def fetch_scrobbles(user="Esiode", from=0, n_workers=3):
    from .db import create_scrobbles
    from tqdm import tqdm
    manager = multiprocessing.Manager()
    queue = manager.Queue()
    scrobbles = manager.list()
    values = manager.dict({"page_count": 0,
                           "total_pages": 0,
                           "end": 0})
    processes = []
    params = {"user": user, 
              "api_key": current_app.config["API_KEY"],
              "from": from,
              "format": "json",
              "method": "user.getrecenttracks"}
    for _ in range(n_workers):
        processes.append(multiprocessing.Process(target=fetch_scrobbles_page, args=(queue, scrobbles, params, values)))
        processes[-1].start()
    
    queue.put(1)
    with tqdm() as pbar:
        page = 2
        while not values["end"]:
            while page <= values["total_pages"]:
                queue.put(page)
                page += 1
            time.sleep(0.1)

            pbar.total = values["total_pages"]
            pbar.refresh()
            pbar.update(values["page_count"] - pbar.n)
    for process in processes:
        queue.put(-1)
    for process in processes:
        process.join()
        process.close()

    create_scrobbles(list(scrobbles))

@click.command("fetch-scrobbles")
@click.option("--user", default="Esiode")
@with_appcontext
def fetch_scrobbles_command(user):
    """Clear the existing data and create new tables."""
    fetch_scrobbles(user)
    click.echo('Fetched scrobbles.')

def init_app(app):
    app.cli.add_command(fetch_scrobbles_command)
