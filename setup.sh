export DB_PATH=/usr/data/history.db
if [[ ! -f $DB_PATH ]]; then
  flask init-db
  flask build-db
fi

flask run --no-debugger --host=0.0.0.0 --port=5000