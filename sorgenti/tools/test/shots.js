// Schermate a misura di telefono: node sorgenti/tools/test/shots.js <cartella quiz> <cartella uscita>
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2], out = process.argv[3];
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/quiz-professionista-antincendio.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': f.endsWith('.pdf') ? 'application/pdf' : 'text/html; charset=utf-8' }); r.end(d); }); });
srv.listen(8767, async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.route(/fonts\.(googleapis|gstatic)|jsdelivr/, rt => rt.abort());
  const store = {};
  const h = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, PATCH', 'access-control-allow-headers': 'content-type' };
  await p.route(/firestore/, (rt, req) => { const id = req.url().split('/utenti/')[1];
    if (req.method() === 'PATCH') { store[id] = JSON.parse(req.postData()).fields; return rt.fulfill({ status: 200, headers: h, body: '{}' }); }
    return store[id] ? rt.fulfill({ status: 200, headers: h, contentType: 'application/json', body: JSON.stringify({ fields: store[id] }) }) : rt.fulfill({ status: 404, headers: h, contentType: 'application/json', body: '{"error":{"message":"Document not found."}}' }); });
  await p.goto('http://localhost:8767/');
  await p.evaluate(() => {
    const ids = DOMANDE.map(d => d.id), stats = {};
    ids.slice(0, 400).forEach((id, i) => stats[id] = { n: 1 + i % 3, ok: (i * 7) % 4 ? 1 : 0, last: (i * 7) % 4 ? 1 : 0 });
    const now = Date.now();
    const hist = [38, 33, 41].map((ok, i) => ({ t: now - i * 864e5, mode: 'esame', label: "Simulazione d'esame", ok, tot: 50, secs: 2900, items: null }));
    localStorage.setItem('qpa.v1', JSON.stringify({ stats, hist, sess: null }));
  });
  await p.reload();
  const shot = async n => { await p.waitForTimeout(300); await p.screenshot({ path: `${out}/${n}.png` }); };
  await shot('0accesso');
  await p.fill('#nome', 'Salvatore Vigliotti'); await p.click('#entra'); await p.waitForSelector('.userbar'); await p.waitForTimeout(1800);
  await shot('1home');
  await p.click('[data-act="exam"]'); await p.click('[data-opt="1"]'); await shot('2simulazione');
  await p.click('[data-act="exit"]'); await shot('3esci');
  await p.click('[data-act="home"]'); await p.click('[data-act="discard"]'); await p.click('[data-act="discardyes"]');
  await p.click('[data-act="mix"]'); await p.click('[data-opt="0"]'); await shot('4correzione');
  await p.click('[data-act="exit"]'); await p.click('[data-act="endyes"]'); await shot('5risultato');
  await p.click('[data-nav="risultati"]'); await shot('6risultati');
  await p.click('.bar'); await shot('7argomento');
  await p.click('[data-nav="archivio"]'); await shot('8archivio');
  await b.close(); srv.close();
});
