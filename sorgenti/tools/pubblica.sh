#!/bin/bash
# Ricostruisce l'app e prepara public/index.html per Firebase Hosting.
#   bash sorgenti/tools/pubblica.sh
# I PDF stanno in public/materiale (sorgenti/quiz/materiale è un collegamento).
# Dopo: git commit + push sul ramo main -> GitHub Actions pubblica su https://quiz-anticendio.web.app
set -e
cd "$(dirname "$0")/../.."
bash sorgenti/quiz/build.sh
{
  printf '<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<meta name="theme-color" content="#1a2124">\n<meta name="description" content="Quiz per l%sesame da professionista antincendio (corso base 120 ore, D.M. 5/8/2011)">\n' "'"
  printf '<link rel="icon" href="data:image/svg+xml,%%3Csvg xmlns=%%27http://www.w3.org/2000/svg%%27 viewBox=%%270 0 24 24%%27%%3E%%3Cpath fill=%%27%%23c4161c%%27 d=%%27M12 2c2.5 3.5 6 6 6 11a6 6 0 0 1-12 0c0-2.5 1.2-4.3 2.4-5.4 0 2.4 1.2 3.6 2.4 3.6 0-3.6 0-6 1.2-9.2z%%27/%%3E%%3C/svg%%3E">\n'
  python3 - sorgenti/quiz/quiz-professionista-antincendio.html <<'PY'
import sys
s = open(sys.argv[1]).read()
i = s.index('</style>') + len('</style>')
print(s[:i].replace('<meta name="claude:viewport-fit-sides" content="cover">\n', ''))
print('<style>body{margin:0}</style>\n</head>\n<body>')
print(s[i:])
print('</body>\n</html>')
PY
} > public/index.html
echo "public/index.html pronto ($(ls public/materiale | wc -l) PDF in public/materiale)"
