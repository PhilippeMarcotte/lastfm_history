import json
import multiprocessing
from flask import current_app
from tqdm import tqdm
import requests
import time

def parse_response(response) -> dict:
  response = json.loads(response.text)
  if "error" in response:
      code = response["error"]
      message = response["message"]
      raise Exception(f"Error {code}: {message}")
  return response

def fetch_scrobbles_page(queue, scrobbles, params, values, limit):
  while True:
      page = queue.get()
      if page == -1:
          break
      tries = 1
      params["page"] = page
      while True:
          try:
              r = requests.get(current_app.config["LASTFM_ROOT"], params=params)
              response = parse_response(r)

              values["total_pages"] = int(response["recenttracks"]["@attr"]["totalPages"])

              if response["recenttracks"]["track"]:
                  # check if first track is now playing
                  if "@attr" in response["recenttracks"]["track"][0]:
                      tracks = response["recenttracks"]["track"][1:]
                  else:
                      tracks = response["recenttracks"]["track"]

                  if limit:
                      tracks = tracks[:limit]

                  for track in tracks:
                      scrobble = (track["date"]["uts"], 
                                  track["name"], 
                                  track["artist"]["#text"], 
                                  track["album"]["#text"], 
                                  "lastfm",
                                  track["image"][-1]["#text"],
                                  None
                                  )
                      scrobbles.append(scrobble)
              if page >= values["total_pages"] or (len(scrobbles) >= limit if limit else False):
                  values["end"] = True
              values["page_count"] += 1
              break  # success
          except Exception as e:
              if tries >= 3:
                  raise e
              # Wait and try again
              time.sleep(1)
              tries += 1

def fetch_scrobbles(user="Esiode", from_uts=0, limit=None, n_workers=3):
  manager = multiprocessing.Manager()
  queue = manager.Queue()
  scrobbles = manager.list()
  values = manager.dict({"page_count": 0,
                          "total_pages": 0,
                          "end": 0})
  processes = []
  params = {"user": user, 
            "api_key": current_app.config["API_KEY"],
            "from": from_uts,
            "limit": 200,
            "format": "json",
            "method": "user.getrecenttracks"}
  for _ in range(n_workers):
      processes.append(multiprocessing.Process(target=fetch_scrobbles_page, args=(queue, scrobbles, params, values, limit)))
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
      pbar.update(values["page_count"]+1 - pbar.n)
  for process in processes:
      queue.put(-1)
  for process in processes:
      process.join()
      process.close()
  
  return list(scrobbles)

def fetch_album(args):
  albums, params = args
  params["album"] = albums[0]
  params["artist"] = albums[1]

  r = requests.get(current_app.config["LASTFM_ROOT"], params=params)

  tries = 1
  while True:
    try:
      response = parse_response(r)
      songs = []
      for track in response["album"]["tracks"]["track"]:
        songs.append((int(track["@attr"]["rank"]), track["name"], params["album"], params["artist"]))
      
      return songs
    except Exception as e:
      if tries >= 3:
          return None
      # Wait and try again
      time.sleep(1)
      tries += 1

def fetch_songs_album_order(db, albums):
  params = {"api_key": current_app.config["API_KEY"],
            "format": "json",
            "method": "album.getinfo"}

  pool = multiprocessing.Pool()
  for songs in tqdm(pool.imap_unordered(fetch_album, zip(albums, [params] * len(albums))), total=len(albums)):
    if songs:
      query = f"UPDATE songs SET album_order=? WHERE name = ? AND album = ? AND artist = ?"
      db.get_db().cursor().executemany(query, songs)
      query = f"UPDATE albums SET order_fetched=1 WHERE name = ? AND artist = ?"
      db.get_db().cursor().execute(query, (songs[0][2], songs[0][3]))