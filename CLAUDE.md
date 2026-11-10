# Quiz Professionista Antincendio

App di domande casuali per l'esame del corso base 120 ore per professionista antincendio (D.M. 5/8/2011).
Sito: https://quiz-anticendio.web.app (Firebase, progetto `quiz-anticendio`, piano gratuito Spark).
Versione di prova su Claude: https://claude.ai/artifact/STYXQGvszpSuCrFaPJA8Tg

## Regole del progetto (indicate dall'utente)
- Le domande si creano SOLO dal materiale che fornisce l'utente (lezioni, slide, dispense, test). Niente ricerche su internet.
- Esame: 50 domande in 60 minuti (`ESAME_N`, `ESAME_MIN` in `sorgenti/quiz/app.html`).
- Gli argomenti esistenti non vanno ristrutturati (niente divisioni o accorpamenti); se ne possono aggiungere di nuovi man mano che il corso va avanti.
- Domande con risposta incerta: `dubbia:true` e nota `n`; ricordarle all'utente (ancora aperte: g02, e01, g07).

## Struttura
- `public/` → ciò che va online: `index.html` (generato) e `materiale/<id>.pdf` (PDF compressi, max 15 MB l'uno).
- `sorgenti/quiz/app.html` → interfaccia (HTML/CSS/JS in un file, dati salvati in localStorage `qpa.v1`).
- `sorgenti/quiz/domande.js` → `ARGOMENTI` (chiave → nome) e helper `D(id, argomento, [fonti], domanda, [opzioni], extra)`: la PRIMA opzione è la corretta, le opzioni vengono mescolate.
- `sorgenti/quiz/dNN_*.js` → un file per blocco di materiale. Id unici; costanti con nomi unici fra i file.
- `sorgenti/tools/fonti.json` → nome fonte → id dei PDF in `public/materiale`; `sorgenti/mat/manifest.txt` → id|pagine|dimensione|nome originale.
- `sorgenti/tools/pagine.py` → pagina «Ripassa sulla scheda» per ogni domanda (override in `pagine_manuali.json`).
- `sorgenti/tools/shrink.py <src> <dst> maxpx quality` → comprime un PDF prima di metterlo in `public/materiale`.
- `sorgenti/mat/txt/` → testo estratto dal materiale già usato.

## Aggiungere materiale o argomenti
1. Comprimi il PDF in `public/materiale/<id>.pdf` (id = 8 caratteri esadecimali), aggiungi la riga in `manifest.txt` e la fonte in `fonti.json`.
2. Nuovo argomento: aggiungilo in `ARGOMENTI` (domande.js), senza toccare gli altri.
3. Scrivi le domande in un nuovo `sorgenti/quiz/dNN_nome.js`.
4. `bash sorgenti/tools/pubblica.sh` (build + controlli; si ferma se trova errori) e poi `node sorgenti/tools/test/test_app.js $PWD/sorgenti/quiz` (test e2e con Playwright).
5. Pubblica la versione di prova su Claude (artifact sopra, file `sorgenti/quiz/quiz-professionista-antincendio.html` con i PDF in `materiale/`).
6. `git push` su `main` → GitHub Actions pubblica su Firebase (segreto `FIREBASE_SERVICE_ACCOUNT`).
