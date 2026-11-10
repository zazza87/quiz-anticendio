// Blocco 28 – Modulistica di prevenzione incendi (moduli PIN 2018/2023).
const PIN1 = "Modulo PIN 1-2023 – Valutazione progetto";
const PIN2 = "Modulo PIN 2-2023 – SCIA";
const PIN21 = "Modulo PIN 2.1-2018 – Asseverazione";
const PIN23 = "Modulo PIN 2.3-2018 – Dichiarazione prodotti";
const PIN26 = "Modulo PIN 2.6-2018 – Dichiarazione di non aggravio del rischio";
const PIN27 = "Modulo PIN 2.7 GPL – Dichiarazione di installazione";
const PIN4 = "Modulo PIN 4-2023 – Deroga";
const PIN5 = "Modulo PIN 5-2023 – Richiesta NOF";
const PIN6 = "Modulo PIN 6-2018 – Verifica in corso d'opera";
const PIN7 = "Modulo PIN 7-2018 – Voltura";

D("pn10","proc",[PIN1],"Il modello PIN 1 si usa per:",["L'istanza di valutazione del progetto.","La SCIA.","La voltura."]);
D("pn11","proc",[PIN2],"Il modello PIN 2 è:",["La segnalazione certificata di inizio attività ai fini della sicurezza antincendio (art. 4 DPR 151/2011).","L'istanza di deroga.","La richiesta di nulla osta di fattibilità."]);
D("pn12","proc",[PIN21],"Il modello PIN 2.1 è:",["L'asseverazione ai fini della sicurezza antincendio (art. 4 DM 7/8/2012), a firma di tecnico abilitato.","La certificazione di resistenza al fuoco.","La dichiarazione di voltura."]);
D("pn13","proc",[PIN21,PIN26],"Nei modelli PIN 2.1 e 2.6, il tecnico dichiara di essere consapevole delle sanzioni penali per dichiarazioni mendaci previste, tra l'altro, da:",["Art. 19, c. 6 L. 241/90, art. 20, c. 2 D.Lgs. 139/06 e artt. 359 e 481 c.p.","Solo dal DM 37/2008.","Solo dal codice civile."]);
D("pn14","proc",[PIN23],"Il modello PIN 2.3 (DICH. PROD.) riguarda:",["I prodotti impiegati ai fini della reazione e della resistenza al fuoco e i dispositivi di apertura delle porte.","Gli impianti elettrici.","Le attrezzature mobili di estinzione."]);
D("pn16","proc",[PIN26],"Il modello PIN 2.6 è:",["La dichiarazione di non aggravio del rischio incendio (art. 4, c. 7 DM 7/8/2012).","La richiesta di verifica in corso d'opera.","La dichiarazione di installazione del GPL."]);
D("pn17","proc",[PIN27],"Il modello PIN 2.7 GPL è la dichiarazione di installazione di un serbatoio GPL:",["In depositi fino a 5 m³ non a servizio di attività soggette (DM 37/08, D.Lgs. 32/98).","Di qualsiasi capacità.","Solo a servizio di attività di categoria C."]);
D("pn18","proc",[PIN4],"Il modello PIN 4 è utilizzato per:",["L'istanza di deroga.","La SCIA.","La richiesta di rinnovo periodico."]);
D("pn19","proc",[PIN5],"Il modello PIN 5 è utilizzato per:",["La richiesta di nulla osta di fattibilità (NOF).","La voltura.","L'asseverazione."]);
D("pn20","proc",[PIN6],"Il modello PIN 6 è utilizzato per:",["La richiesta di verifica in corso d'opera.","La deroga.","La dichiarazione di prodotto."]);
D("pn21","proc",[PIN7],"Il modello PIN 7 (voltura) è una dichiarazione resa ai sensi:",["Degli artt. 46 e 47 del DPR 445/2000 (dichiarazioni sostitutive).","Dell'art. 10-bis della L. 241/90.","Del DM 37/2008."]);
D("pn22","proc",[PIN1,PIN4,PIN5,PIN6],"Tra i modelli PIN, riportano lo spazio per la marca da bollo (sull'originale) le istanze di:",["Valutazione progetto, deroga, NOF e verifica in corso d'opera.","Sola SCIA.","Solo voltura e asseverazione."]);

// --- Nota DCPREV 5307 del 19/04/2013 sull'imposta di bollo
const BOL = "Nota DCPREV prot. 5307 del 19/04/2013 – Imposta di bollo";
D("pn30","proc",[BOL],"Secondo la nota DCPREV 5307/2013, alla SCIA di prevenzione incendi (categorie A, B e C) l'imposta di bollo:",["Non si applica, perché è un atto privato che non contiene alcuna istanza.","Si applica sempre.","Si applica solo per la categoria C."]);
D("pn31","proc",[BOL],"Secondo la nota 5307/2013, la richiesta e la copia del verbale di visita tecnica sono:",["Esenti dal bollo; se però la copia è richiesta conforme all'originale, il bollo si applica a istanza e copia.","Sempre soggette a bollo.","Soggette a bollo solo per la categoria A."]);
D("pn32","proc",[BOL],"Il CPI rilasciato dopo il sopralluogo positivo sulle attività di categoria C, secondo la nota 5307/2013:",["È esente dal bollo, perché rilasciato obbligatoriamente e non su istanza del cittadino.","È soggetto a bollo.","È soggetto a doppio bollo."]);
D("pn33","proc",[BOL],"L'attestazione di rinnovo periodico di conformità antincendio, secondo la nota 5307/2013:",["È esente dal bollo, come la SCIA.","È soggetta a bollo.","È soggetta a bollo solo se tardiva."]);
D("pn34","proc",[BOL],"Le istanze di NOF e di verifica in corso d'opera, secondo la nota 5307/2013:",["Sono soggette all'imposta di bollo, come gli atti emanati in riscontro.","Sono esenti dal bollo.","Sono soggette a bollo solo per la categoria C."]);
