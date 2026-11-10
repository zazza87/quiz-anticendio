# Calcola, per ogni domanda, la pagina del PDF sorgente più pertinente. Output: quiz/pagine.js
import json, re, subprocess, math, os, sys, unicodedata
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)) + '/..'
fonti = json.load(open(D + '/tools/fonti.json'))
dom = json.loads(subprocess.run(['node', '-e', '''
global.DOMANDE=[];global.ARGOMENTI={};const fs=require("fs");process.chdir(process.argv[1]);
let src=fs.readFileSync("domande.js","utf8");
for(const f of fs.readdirSync(".").filter(f=>/^d\\d\\d_.*\\.js$/.test(f)).sort())src+="\\n"+fs.readFileSync(f,"utf8");
eval(src.replace(/\\bconst\\b/g,"var").replace(/\\blet\\b/g,"var"));
console.log(JSON.stringify(DOMANDE.map(d=>({id:d.id,f:d.f,t:d.q+" "+d.o[d.c]}))));''', D + '/quiz'], capture_output=True, text=True).stdout)
STOP = set("il lo la i gli le un una uno di a da in con su per tra fra e o ed che non è del della dei delle degli al alla ai alle allo nel nella nei nelle sul sulla come se più sono essere deve devono può possono anche quale quali secondo ogni tutti tutte solo sempre mai cui sia viene vengono ha hanno hai dal dalla dai l un' all dell nell sull ciascun ciascuna alcuni".split())
def toks(s):
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return [w for w in re.findall(r"[a-z0-9]+(?:[.,][0-9]+)*", s) if (len(w) > 2 or w[0].isdigit()) and w not in STOP]
pages = {}
for fid in sorted({i for v in fonti.values() for i in v}):
    txt = subprocess.run(['pdftotext', '-layout', D + '/quiz/materiale/' + fid + '.pdf', '-'], capture_output=True, text=True).stdout
    pages[fid] = [Counter(toks(p)) for p in txt.split('\f')]
out = {}
for q in dom:
    ids = [i for f in q['f'] for i in fonti.get(f, [])]
    if not ids: continue
    qt = set(toks(q['t']))
    best = (0, ids[0], 1)
    for fid in ids:
        P = pages[fid]; n = len(P)
        df = Counter(w for p in P for w in set(p))
        for k, p in enumerate(P):
            if not p: continue
            sc = sum(math.log(1 + n / df[w]) for w in qt if w in p)
            if sc > best[0]: best = (sc, fid, k + 1)
    out[q['id']] = [best[1], best[2] if best[0] >= 6 else 0]
out.update(json.load(open(D + '/tools/pagine_manuali.json')))
tit = {}
for line in open(D + '/mat/manifest.txt'):
    parts = line.strip().split('|')
    if len(parts) >= 4: tit[parts[0]] = re.sub(r'\s+', ' ', re.sub(r'\.(pdf|PDF)$', '', parts[3]).replace('_', ' ')).strip()
used = sorted({i for v in fonti.values() for i in v})
import datetime, zoneinfo
stamp = datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Rome')).strftime('%d/%m/%Y %H:%M')
open(D + '/quiz/pagine.js', 'w').write('const AGGIORNATO = "' + stamp + '";\nconst MATERIALE = ' + json.dumps(fonti, ensure_ascii=False) + ';\nconst FILE_TIT = ' + json.dumps({i: tit.get(i, i) for i in used}, ensure_ascii=False) + ';\nconst PAGINE = ' + json.dumps(out, separators=(',', ':')) + ';\n')
z = sum(1 for v in out.values() if v[1] == 0)
print('domande con fonte PDF', len(out), 'senza pagina', z)
