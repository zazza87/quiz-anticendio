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
- `sorgenti/quiz/app.html` → interfaccia (HTML/CSS/JS in un file).
- Accesso con il solo nome (niente password, scelta dell'utente): lo storico di ogni nome sta in Firestore, collezione `utenti`, documento = nome normalizzato (`slug`), campi `nome`, `dati` (JSON), `agg`; chiamate REST senza SDK. Copia locale in localStorage `qpa.u.<id>`, utente attivo in `qpa.utente`; le due copie si uniscono con `merge()` (storico unito, statistiche della copia più aggiornata; `azz` = data dell'ultimo azzeramento, che vale anche per le altre copie). I dati di prima del login (`qpa.v1`) passano nel primo account. Regole Firestore: solo get/create/update su `utenti/{id}`, niente list/delete.
- `sorgenti/quiz/domande.js` → `ARGOMENTI` (chiave → nome) e helper `D(id, argomento, [fonti], domanda, [opzioni], extra)`: la PRIMA opzione è la corretta, le opzioni vengono mescolate.
- `sorgenti/quiz/dNN_*.js` → un file per blocco di materiale. Id unici; costanti con nomi unici fra i file.
- `sorgenti/quiz/doppie.js` → gruppi di domande «doppie» (stesso concetto da fonti diverse, controllati a mano): negli errori da ripassare ogni gruppo conta una volta, secondo la risposta più recente. Quando si aggiungono domande, controllare se ripetono concetti già presenti e aggiungere il gruppo.
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
