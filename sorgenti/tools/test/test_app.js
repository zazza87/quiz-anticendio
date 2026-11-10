// Test end-to-end dell'app: node tools/test/test_app.js <cartella quiz>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2], L = '/opt/npm-tools/node_modules/pdfjs-dist/build/';
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/quiz-professionista-antincendio.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': f.endsWith('.pdf') ? 'application/pdf' : 'text/html; charset=utf-8' }); r.end(d); }); });
const ok = (c, m) => console.log((c ? 'OK  ' : 'ERR ') + m);
srv.listen(8766, async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/cdn\.jsdelivr\.net\/npm\/pdfjs-dist.*\/(pdf(\.worker)?)\.min\.mjs/, (rt, req) => rt.fulfill({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(L + (req.url().includes('worker') ? 'pdf.worker.min.mjs' : 'pdf.min.mjs')) }));
  await p.route(/fonts\.(googleapis|gstatic)/, rt => rt.abort());
  const U = 'http://localhost:8766/';
  // 1) migrazione dati vecchi: solo sims e sessione senza etichetta
  await p.goto(U);
  await p.evaluate(() => localStorage.setItem('qpa.v1', JSON.stringify({ stats: {}, sims: [{ t: Date.now() - 1e7, ok: 30, tot: 50, secs: 3000 }], sess: { mode: 'esame', items: [], cur: 0, start: Date.now() - 4e6, end: Date.now() - 1e5, done: false } })));
  await p.reload();
  ok(await p.$('.mast') !== null, 'avvio con dati vecchi');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('qpa.v1')));
  ok(st.hist.length === 1 && st.sess === null, 'storico migrato e sessione vuota scartata (hist=' + st.hist.length + ')');
  // 1b) sessione con una domanda non più in archivio: viene tolta, la sessione resta utilizzabile
  await p.evaluate(() => { const id = DOMANDE[0].id; localStorage.setItem('qpa.v1', JSON.stringify({ stats: {}, hist: [], sess: { mode: 'pratica', label: 'X', items: [{ id: 'zz999', order: [0, 1, 2], ans: null, flag: false }, { id, order: [0, 1, 2], ans: null, flag: false }], cur: 1, start: Date.now(), end: null, done: false } })); });
  await p.reload(); await p.click('[data-act="resume"]');
  ok((await p.$eval('.qhead strong', e => e.textContent)) === 'Domanda 1 di 1', 'domanda rimossa tolta dalla sessione');
  // 1c) simulazione scaduta mentre era in pausa: «Riprendi» la consegna e i comandi della correzione funzionano
  await p.evaluate(() => { const ids = DOMANDE.slice(0, 3).map(d => d.id); localStorage.setItem('qpa.v1', JSON.stringify({ stats: {}, hist: [], sess: { mode: 'esame', label: 'S', items: ids.map(id => ({ id, order: [0, 1, 2], ans: 0, flag: false })), cur: 0, start: Date.now() - 1e5, end: Date.now() + 1500, done: false } })); });
  await p.reload(); await p.waitForTimeout(2000); await p.click('[data-act="resume"]');
  ok(await p.$('.score') !== null, 'riprendi a tempo scaduto consegna');
  await p.click('[data-f="all"]'); ok((await p.$$('.ritem')).length === 3, 'filtro della correzione funziona dopo consegna automatica');
  await p.click('[data-nav="home"]'); await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('qpa.v1')); s.sess = { mode: 'pratica', label: 'X', items: [{ id: DOMANDE[0].id, order: [0, 1, 2], ans: null, flag: false }], cur: 0, start: Date.now(), end: null, done: false }; localStorage.setItem('qpa.v1', JSON.stringify(s)); });
  await p.reload(); await p.click('[data-act="discard"]'); ok(await p.$('[data-act="discardyes"]') !== null, 'abbandona chiede conferma');
  await p.click('[data-act="discardno"]'); ok(await p.$('[data-act="resume"]') !== null, 'annulla abbandono');
  await p.evaluate(() => localStorage.clear()); await p.reload();
  // 2) home: argomenti
  ok((await p.$$('.trow')).length === 8 && await p.$('.hero-cta') !== null && await p.$('nav.nav') !== null, 'cruscotto: anello, 8 argomenti, barra in basso');
  await p.click('[data-act="alltopics"]'); ok((await p.$$('.trow')).length === 22, 'mostra tutti gli argomenti');
  await p.click('#multi summary'); await p.click('[data-act="none"]'); ok(await p.$eval('[data-act="practice"]', e => e.disabled), 'deseleziona tutti disabilita esercitazione');
  await p.click('.tbtn[data-topic="s4"]'); await p.click('[data-n="10"]');
  ok((await p.$eval('[data-act="practice"]', e => e.textContent)).includes('(10)'), 'esercitazione 10 domande su un argomento');
  await p.click('[data-act="practice"]');
  // 3) quiz pratica: risposte, correzione immediata, ripassa nel visore
  await p.keyboard.press('1');
  ok(await p.$('.sheet .vhead') !== null, 'tasto 1 risponde e apre il pannello di correzione');
  const rl = await p.$('.sheet a.matcard');
  if (rl) { await rl.click(); await p.waitForSelector('#pv-body canvas', { timeout: 15000 }).catch(() => {}); ok(await p.$('#pv-body canvas') !== null, 'visore apre il PDF: ' + await p.$eval('#pv-pg', e => e.textContent)); await p.keyboard.press('Escape'); ok(!(await p.$eval('#pv', e => e.classList.contains('open'))), 'Esc chiude il visore'); }
  for (let i = 0; i < 9; i++) { await p.click('[data-act="next"]'); await p.click('[data-opt="0"]'); }
  await p.click('.sheet [data-act="end"]'); await p.click('[data-act="endyes"]');
  ok((await p.$eval('.score b', e => e.textContent)).endsWith('/10'), 'correzione esercitazione: ' + await p.$eval('.score b', e => e.textContent));
  // 4) barra argomento -> scheda -> indietro
  await p.click('button.bar'); ok(await p.$eval('.eyebrow', e => e.textContent.startsWith('Argomento')), 'barra apre la scheda argomento');
  ok((await p.$$('.mitem')).length > 0, 'materiale di riferimento presente (' + (await p.$$('.mitem')).length + ')');
  await p.click('[data-tf="all"]'); await p.click('[data-act="back"]');
  ok(await p.$('.score') !== null, 'indietro torna alla correzione');
  // 5) risultati e dettaglio
  await p.click('[data-act="tores"]'); ok((await p.$$('.hrow')).length === 1, 'storico con 1 test');
  await p.click('[data-hf="esame"]'); ok((await p.$$('.hrow')).length === 0, 'filtro simulazioni');
  await p.click('[data-hf="all"]'); await p.click('.hrow'); ok(await p.$('.score') !== null, 'dettaglio dallo storico');
  await p.click('[data-nav="risultati"]'); await p.click('[data-act="reset"]'); await p.click('[data-act="resetno"]');
  ok((await p.$$('.hrow')).length === 1, 'annulla azzeramento');
  // 6) simulazione: griglia, segna, conferma
  await p.click('[data-nav="home"]'); await p.click('[data-act="exam"]');
  ok(await p.$('#timer') !== null, 'simulazione con timer ' + await p.$eval('#timer', e => e.textContent));
  await p.click('[data-opt="1"]'); await p.click('[data-opt="1"]');
  ok(!(await p.$('.opt.sel')), 'secondo tocco toglie la risposta');
  await p.click('[data-opt="2"]'); await p.click('[data-act="flag"]'); await p.click('[data-act="grid"]');
  ok((await p.$$('.qgrid button')).length === 50 && await p.$('.qgrid .flagged') !== null, 'griglia 50 domande con segnata');
  await p.click('[data-go="49"]'); ok((await p.$eval('.qhead strong', e => e.textContent)).includes('50 di 50'), 'salto alla 50');
  await p.click('.actbar [data-act="end"]'); ok((await p.$eval('.sheet', e => e.textContent)).includes('49 domande senza risposta'), 'conferma conta le vuote');
  await p.click('[data-act="endyes"]'); ok((await p.$eval('.score b', e => e.textContent)).endsWith('/50'), 'consegna simulazione');
  // 7) archivio: ricerca e per documento
  await p.click('[data-act="home"]'); await p.click('[data-nav="archivio"]');
  ok((await p.$$('details.topic')).length === 22, 'archivio per argomento: 22 gruppi');
  await p.fill('#cerca', 'ASET'); await p.waitForTimeout(400);
  ok((await p.$eval('.stack p.small', e => e.textContent)).includes('trovate'), 'ricerca: ' + await p.$eval('.stack p.small', e => e.textContent));
  await p.fill('#cerca', 'xx'); await p.click('[data-nav="home"]'); await p.waitForTimeout(400);
  ok(await p.$('.hero') !== null, 'ricerca in attesa non riporta all\'archivio'); await p.click('[data-nav="archivio"]');
  await p.fill('#cerca', ''); await p.waitForTimeout(400);
  await p.click('[data-ag="doc"]'); ok((await p.$$('details.topic')).length === 71, 'per documento: ' + (await p.$$('details.topic')).length);
  await p.click('details.topic summary'); await p.click('details.topic a.matlink');
  await p.waitForSelector('#pv-body canvas', { timeout: 15000 }).catch(() => {});
  ok(await p.$('#pv-body canvas') !== null, 'apri PDF dall\'archivio'); await p.click('#pv-next'); await p.waitForTimeout(800);
  ok((await p.$eval('#pv-pg', e => e.textContent)).startsWith('pag. 2'), 'pagina successiva nel visore'); await p.click('#pv-close');
  // 8) footer versione
  await p.click('[data-nav="home"]'); ok((await p.$eval('.footer', e => e.textContent)).includes('versione del'), 'versione in fondo alla pagina');
  ok(errs.length === 0, 'nessun errore JS ' + JSON.stringify(errs));
  await b.close(); srv.close();
});
