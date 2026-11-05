"""Download publisher screenshot sources for the user-authorized local development preview."""
import concurrent.futures
import hashlib
import json
import pathlib
import urllib.parse
import urllib.request

root = pathlib.Path(__file__).resolve().parents[2]
records = json.loads((root / 'src/data/wiki/official-media.json').read_text(encoding='utf-8'))
folder = root / '.local-media'
folder.mkdir(exist_ok=True)

def download(record):
    url = record['originalUrl']
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != 'https' or not parsed.hostname.endswith('.steamstatic.com'):
        raise ValueError('Only the recorded publisher Steam image host is allowed')
    target = folder / (record['id'] + '.jpg')
    if not target.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'MoonSweepersWiki-LocalMedia/1.0'})
        with urllib.request.urlopen(request, timeout=45) as response:
            data = response.read(15 * 1024 * 1024)
        if not data.startswith(b'\xff\xd8'):
            raise ValueError('Expected a JPEG screenshot')
        target.write_bytes(data)
    return {**record, 'originalSha256': hashlib.sha256(target.read_bytes()).hexdigest(),
            'localUse': 'User-authorized local development preview only, 2026-11-04. Publisher reuse rights require confirmation before publication.'}

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    downloaded = list(pool.map(download, records))
(folder / 'manifest.json').write_text(json.dumps(downloaded, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Downloaded {len(downloaded)} official source screenshots into ignored .local-media/.')
