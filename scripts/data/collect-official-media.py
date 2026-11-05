"""Collect public Steam metadata and source URLs. Does not download image bytes."""
import json
import pathlib
import urllib.request

project = pathlib.Path(__file__).resolve().parents[2]
api = "https://store.steampowered.com/api/appdetails?appids=5335510"
with urllib.request.urlopen(api, timeout=30) as response:
    payload = json.load(response)
game = payload["5335510"]["data"]
records = [{
    "id": f"steam-screenshot-{s['id']}",
    "title": f"Official Steam screenshot {s['id'] + 1}",
    "originalUrl": s["path_full"],
    "thumbnailUrl": s["path_thumbnail"],
    "sourcePage": "https://store.steampowered.com/app/5335510/Moon_Sweepers/",
    "copyright": "© DragDrop Games. All rights reserved.",
    "rightsStatus": "Publisher source identified; explicit reuse permission not located. Not rehosted.",
    "reviewedAt": "2026-11-03",
} for s in game.get("screenshots", [])]
target = project / "src/data/wiki/official-media.json"
target.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Recorded {len(records)} official screenshot sources without downloading image files.")
