#!/bin/bash
# Build dell'app «Quiz Professionista Antincendio».
#   1. tools/pagine.py   -> pagine.js (materiale PDF, pagina di ripasso per domanda, data versione)
#   2. app.html + domande.js + d??_*.js + pagine.js -> quiz-professionista-antincendio.html
#   3. controlli: id duplicati, argomenti, risposte, fonti, nomi di costanti, sintassi JS
# Esce con codice 1 se trova problemi, così non si pubblica una versione rotta.
set -e
cd "$(dirname "$0")"
python3 ../tools/pagine.py
python3 - <<'PY'
import glob, re, subprocess, sys, json, os, tempfile

parts = ["domande.js"] + sorted(glob.glob("d[0-9][0-9]_*.js")) + ["pagine.js"]
problemi = []

# nomi di costanti dichiarati due volte in file diversi rompono tutto lo script
seen = {}
for f in parts:
    for name in re.findall(r"^const\s+([A-Za-z_$][\w$]*)", open(f).read(), re.M):
        if name in seen: problemi.append(f"costante {name} in {seen[name]} e {f}")
        seen[name] = f

data = "\n".join(open(f).read() for f in parts)
html = open("app.html").read().replace("/*__DOMANDE__*/", data)
open("quiz-professionista-antincendio.html", "w").write(html)

# sintassi di tutti gli script della pagina
js = "\n".join(re.findall(r"<script>(.*?)</script>", html, re.S))
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t: t.write(js)
r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True); os.unlink(t.name)
if r.returncode: problemi.append("sintassi: " + r.stderr.strip()[:300])

# controlli sulle domande
check = r'''
global.DOMANDE = []; const fs = require("fs");
eval(fs.readFileSync(0, "utf8").replace(/^const /gm, "var "));
const out = { n: DOMANDE.length, per: {}, bad: [], warn: [] }, ids = new Set(), testi = {};
for (const d of DOMANDE) {
  if (ids.has(d.id)) out.bad.push("id duplicato " + d.id); ids.add(d.id);
  if (!ARGOMENTI[d.s]) out.bad.push("argomento sconosciuto " + d.id);
  if (!(d.c >= 0 && d.c < d.o.length)) out.bad.push("risposta fuori elenco " + d.id);
  if (!d.f || !d.f.length || d.f.some(x => !x)) out.bad.push("fonte mancante " + d.id);
  if (new Set(d.o.map(x => x.trim())).size !== d.o.length) out.bad.push("opzioni ripetute " + d.id);
  const k = d.q.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (testi[k]) out.warn.push("stesso testo " + testi[k] + " / " + d.id); testi[k] = d.id;
  out.per[d.s] = (out.per[d.s] || 0) + 1;
}
console.log(JSON.stringify(out));
'''
if not problemi:
    r = subprocess.run(["node", "-e", check], input=data, capture_output=True, text=True)
    if r.returncode: problemi.append("caricamento domande: " + r.stderr.strip()[:300])
    else:
        o = json.loads(r.stdout)
        problemi += o["bad"]
        print(f"domande: {o['n']}")
        print("per argomento:", ", ".join(f"{k} {v}" for k, v in o["per"].items()))
        for w in o["warn"]: print("attenzione:", w)

if problemi:
    print("PROBLEMI:"); [print(" -", p) for p in problemi]; sys.exit(1)
print("build OK -> quiz-professionista-antincendio.html")
PY
