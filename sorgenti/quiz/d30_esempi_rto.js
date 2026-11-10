// Blocco 30 – Esempi di progettazione con la RTO: laboratorio di abbigliamento (att. 39.1.C), palestra, deposito.
const EAB = "Esempio – Laboratorio artigianale di abbigliamento con oltre 25 addetti (RTO)";
const EPA = "Esempio – Progettazione di una palestra non soggetta al CONI";
const EDE = "Esempio – Deposito di materiali combustibili e infiammabili (traccia)";

// --- Laboratorio abbigliamento
D("ab10","proc",[EAB],"Un laboratorio per la produzione e il confezionamento di abiti con 44 addetti rientra nell'attività del DPR 151/2011:",["39.1.C (oltre 25 addetti, tutti in categoria C).","39.1.A.","69.1.A."]);
D("ab11","codg",[EAB],"Nell'esempio del laboratorio di abbigliamento, con occupanti svegli che conoscono l'edificio e velocità di crescita media, il profilo Rvita è:",["A2.","B2.","A3."]);
D("ab12","codg",[EAB],"Nell'esempio, δα = 2 (media) perché la percentuale di tessuti e fibre sintetiche sul totale:",["Non supera il 25%, come dichiarato dal titolare.","Supera il 50%.","È nulla."]);
D("ab13","s2",[EAB],"Nell'esempio, il carico d'incendio specifico è qf = 598,97 MJ/m²; con δq1 = 1, δq2 = 1 e δn = 0,85 si ottiene qf,d pari a circa:",["509 MJ/m², a cui corrisponde una classe minima di resistenza al fuoco 45.","598 MJ/m², classe 60.","300 MJ/m², classe 15."]);
D("ab14","s1",[EAB],"Nell'esempio con Rvita A2, per vie d'esodo e altri locali la reazione al fuoco richiede il livello I, quindi è ammesso l'impiego di materiali:",["Del gruppo GM4 (non classificati).","Solo del gruppo GM1.","Solo del gruppo GM0."]);
D("ab15","s2",[EAB],"Nell'esempio, il livello di prestazione III di resistenza al fuoco è attribuito perché l'opera:",["Non rientra negli altri criteri di attribuzione (es. è adiacente ad altre opere con civile abitazione).","È un edificio vincolato.","Ha un carico d'incendio superiore a 1200 MJ/m²."]);
D("ab16","s3",[EAB],"Nell'esempio, la civile abitazione al piano primo è stata resa:",["Non comunicante con il laboratorio; il piano interrato è accessibile tramite porta e scala EI 120.","Comunicante tramite filtro a prova di fumo.","Comunicante senza requisiti."]);
D("ab17","s3",[EAB],"Nell'esempio, la distanza di separazione calcolata con d = αp + β (α = 3,9, β = 2,9, p = 0,351) è di circa:",["4,27 m, verificata rispetto alla larghezza della strada di 6,80 m.","12,6 m, non verificata.","2,5 m, verificata."]);
D("ab18","s4",[EAB],"Nell'esempio, per 50 occupanti con Rvita A2 (Lu = 3,80 mm/persona) la larghezza minima Lo dell'esodo orizzontale è:",["190 mm (ma la larghezza minima delle vie d'esodo resta ≥ 900 mm).","1200 mm.","50 mm."]);
D("ab19","s4",[EAB],"Nell'esempio del laboratorio, la soluzione conforme per l'esodo prevede:",["Due uscite (120 cm e 90 cm) e lunghezza d'esodo massima di 30 m, inferiore ai 60 m ammessi.","Una sola uscita da 80 cm.","Quattro uscite da 120 cm."]);
D("ab20","s6",[EAB],"Nell'esempio, la soluzione conforme per il controllo dell'incendio (livello II) prevede:",["2 estintori da 6 kg con capacità 13A 70B.","Un impianto sprinkler.","Un solo estintore a CO2."]);
D("ab21","s8",[EAB],"Nell'esempio, con qf ≤ 600 MJ/m² e superficie di 398,2 m², la superficie utile minima delle aperture di smaltimento SE1 è:",["A/40 ≈ 10 m².","A/25 ≈ 16 m².","A/100 ≈ 4 m²."]);
D("ab22","s8",[EAB],"Nell'esempio, le aperture di smaltimento coincidono con:",["Gli infissi presenti nel locale, in parte di tipo permanentemente aperto (SEa).","Lucernai motorizzati collegati all'IRAI.","Condotti di estrazione meccanica."]);
D("ab23","s9",[EAB],"Nella soluzione conforme per il livello II di operatività antincendio, la distanza dei mezzi di soccorso dagli accessi di norma non dovrebbe superare:",["50 m.","100 m.","20 m."]);
D("ab24","s10",[EAB],"Nell'esempio, illuminazione di sicurezza e IRAI dispongono di alimentazione di sicurezza con:",["Interruzione breve (≤ 0,5 s) e autonomia non inferiore a 30 minuti.","Interruzione media (≤ 15 s) e autonomia 120 minuti.","Nessuna autonomia."]);
D("ab25","s10",[EAB],"Sul dispositivo generale a protezione di ciascuna linea elettrica di sicurezza deve essere indicato il messaggio:",["«Non manovrare in caso d'incendio».","«Sganciare in caso d'incendio».","«Uso esclusivo VVF»."]);
D("ab26","s10",[EAB],"Secondo l'esempio, il quadro elettrico generale va ubicato:",["In posizione segnalata, in particolare nei pressi dell'ingresso principale.","Nel locale più interno dell'attività.","Al piano interrato."]);

// --- Palestra
D("pa10","rtv",[EPA],"Il DM 18 marzo 1996 sugli impianti sportivi si applica integralmente quando è prevista la presenza di spettatori:",["In numero superiore a 100.","In numero superiore a 50.","In qualsiasi numero."]);
D("pa11","rtv",[EPA],"Per gli impianti sportivi con spettatori non superiori a 100 o privi di spettatori, il DM 18/3/1996 rinvia:",["Alle disposizioni dell'art. 20.","Al DM 10 marzo 1998.","Al DM 3 agosto 2015 per intero."]);
D("pa12","lav",[EPA],"Secondo l'art. 3 del DM 3/9/2021, per i luoghi di lavoro non a basso rischio e non coperti da regole tecniche si applicano i criteri:",["Del DM 3 agosto 2015.","Del DM 10 marzo 1998.","Del DM 18 marzo 1996."]);
D("pa13","s2",[EPA],"Nell'esempio della palestra (qf = 250 MJ/m², δq2 = 0,80, δn = 0,90 × 0,85), il qf,d del piano interrato è maggiore di quello dei piani fuori terra perché:",["δq1 vale 1,20 per la maggiore superficie del compartimento interrato.","Il carico d'incendio è doppio.","Manca la rivelazione."]);
D("pa14","s2",[EPA],"Nel compartimento multipiano con scale aperte e solai con adeguata capacità di compartimentazione, il carico d'incendio:",["Può essere considerato separatamente sui singoli piani.","Va sommato su tutti i piani.","Va considerato solo all'ultimo piano."]);
D("pa15","s4",[EPA],"Nell'esempio della palestra, il responsabile dell'attività dichiara un affollamento inferiore a quello calcolato e:",["Si impegna a rispettarlo in ogni condizione d'esercizio.","Non ha alcun obbligo successivo.","Deve ottenere una deroga."]);
D("pa16","s8",[EPA],"Nell'esempio della palestra, per un piano di 280 m² la superficie utile minima delle aperture di smaltimento (SE1) risulta:",["7 m² (280/40).","11,2 m² (280/25).","2,8 m² (280/100)."]);

// --- Deposito
D("de10","s2",[EDE],"Nella traccia del deposito, pur bastando R 30 per le strutture, la parete di separazione tra deposito combustibili e deposito infiammabili deve essere REI 120 perché:",["Il deposito infiammabili ha qf,d di circa 1772 MJ/m².","L'edificio supera i 24 m.","Lo impone la RTV uffici."]);
D("de11","s8",[EDE],"Nella traccia del deposito di 4400 m², la superficie minima di smaltimento SE1 (A/40) risulta:",["110 m².","176 m².","44 m²."]);
D("de12","s8",[EDE],"Nel verificare la distribuzione delle aperture di smaltimento, la traccia ricorda il raggio di influenza roffset pari in genere a:",["20 m.","50 m.","5 m."]);
D("de13","s7",[EDE],"Nella traccia, nel deposito di infiammabili il SENFC è previsto collegato all'IRAI e conforme alla norma:",["UNI 9494.","UNI 9795.","UNI 10779."]);
D("de14","s3",[EDE],"Nella traccia del deposito, la distanza di separazione calcolata con α = 3,1, β = 6,1 e p = 0,31 risulta circa:",["7,1 m.","3,1 m.","12,6 m."]);
