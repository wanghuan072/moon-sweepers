"""Restore the isolated equipment images listed in the reviewed Wikily manifest."""
from pathlib import Path
import concurrent.futures
import json
import urllib.request
root = Path(__file__).resolve().parents[2]
records = json.loads((root / 'src/data/machines/equipment-visuals.json').read_text(encoding='utf-8'))
folder = root / '.local-media'
folder.mkdir(exist_ok=True)
def download(record):
    url = record['originalUrl']
    if not url.startswith('https://media.wikily.gg/'):
        raise ValueError('Expected reviewed Wikily equipment asset URL')
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read(5 * 1024 * 1024)
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        raise ValueError('Expected original WebP asset')
    (folder / (record['id'] + '.webp')).write_bytes(data)
    return record['slug']
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for slug in pool.map(download, records):
        print(slug)
print('Restored 19 isolated equipment images; source manifest preserved.')
