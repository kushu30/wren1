import json
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_FILE = BASE_DIR / "logs.json"

def log_event(event: dict):
    event["timestamp"] = datetime.utcnow().isoformat()

    if not LOG_FILE.exists() or LOG_FILE.stat().st_size == 0:
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

    with open(LOG_FILE, "r+") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []

        data.append(event)
        f.seek(0)
        json.dump(data, f, indent=2)
        f.truncate()