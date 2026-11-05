"""Import reviewed, item-specific Wikily assets discovered in rendered pages."""
from pathlib import Path
import base64, concurrent.futures, hashlib, json, urllib.request
root=Path(__file__).resolve().parents[2]
snapshot=root/'.cache/research/other-wikily-pages.json'
manifest=root/'src/data/wiki/content-visuals.json'
pages=json.loads(snapshot.read_text(encoding='utf-8')) if snapshot.exists() else []
records={r['slug']:r for r in json.loads(manifest.read_text(encoding='utf-8'))} if manifest.exists() else {}
for page in pages:
    for image in page['images']:
        parts=image['href'].rstrip('/').split('/')
        category={'cleaning-tools':'tools','suit-gear':'upgrades','upgrade-matrix':'upgrades'}.get(parts[-2])
        if not category or not image['image'].startswith('https://img.wikily.gg/'):continue
        slug={'night-vision-goggles':'night-vision'}.get(parts[-1],parts[-1])
        encoded=image['image'].split('/')[-1]
        original=base64.urlsafe_b64decode(encoded+'='*((-len(encoded))%4)).decode()
        if not original.startswith('https://media.wikily.gg/'):raise ValueError('Unexpected asset host')
        records[slug]={'id':'reference-content-'+slug,'slug':slug,'category':category,'originalUrl':original,'sourcePage':image['href'],'imageRole':'icon' if 'glyph-' in original else 'equipment','alt':f'Moon Sweepers {slug.replace("-"," ")} equipment or upgrade icon','caption':'Item-specific image via Wikily · © respective rights holders','useScope':'Local development preview; public reuse clearance pending','reviewedAt':'2026-11-04'}
folder=root/'.local-media';folder.mkdir(exist_ok=True)
def download(record):
    path=folder/(record['id']+'.webp')
    if not path.exists():
        request=urllib.request.Request(record['originalUrl'],headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(request,timeout=30) as response:data=response.read(5*1024*1024)
        if data[:4]!=b'RIFF' or data[8:12]!=b'WEBP':raise ValueError('Expected WebP')
        path.write_bytes(data)
    record['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
    return record
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    result=list(pool.map(download,records.values()))
(root/'src/data/wiki/content-visuals.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Imported {len(result)} tool, suit and upgrade-node images.')
