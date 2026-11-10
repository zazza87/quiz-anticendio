const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2], out = process.argv[3];
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/quiz-professionista-antincendio.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': f.endsWith('.pdf') ? 'application/pdf' : 'text/html; charset=utf-8' }); r.end(d); }); });
srv.listen(8767, async () => {
  const b = await chromium.launch();
  for (const scheme of ['light', 'dark']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
    await p.route(/fonts\.(googleapis|gstatic)|jsdelivr/, rt => rt.abort());
    await p.goto('http://localhost:8767/');
    // dati finti: 3 simulazioni e statistiche
    await p.evaluate(() => {
      const ids = DOMANDE.map(d => d.id), stats = {};
      ids.slice(0, 400).forEach((id, i) => stats[id] = { n: 1 + i % 3, ok: (i * 7) % 4 ? 1 : 0, last: (i * 7) % 4 ? 1 : 0 });
      const now = Date.now();
      const hist = [38, 33, 41].map((ok, i) => ({ t: now - i * 864e5, mode: 'esame', label: "Simulazione d'esame", ok, tot: 50, secs: 2900, items: null }));
      localStorage.setItem('qpa.v1', JSON.stringify({ stats, hist, sess: null }));
    });
    await p.reload();
    const shot = async n => p.screenshot({ path: `${out}/${scheme}-${n}.png` });
    await shot('1home');
    await p.click('[data-act="exam"]'); await p.click('[data-opt="1"]'); await shot('2esame');
    await p.click('.linkbtn[data-act="end"]'); await shot('3conferma');
    await p.click('[data-act="endno"]'); await p.click('[data-act="home"]'); await p.click('[data-act="discard"]');
    await p.click('[data-act="mix"]'); await p.click('[data-opt="0"]'); await shot('4correzione');
    await p.click('[data-act="home"]'); await p.click('[data-nav="risultati"]'); await shot('5risultati'); await p.click('.bar'); await shot('6argomento'); await p.evaluate(() => window.scrollTo(0, 99999)); await shot('7argomento-fondo');
    await p.close();
  }
  await b.close(); srv.close();
});
