// Kombi V2 – Rechenlogik
//
// Reine Funktionen ohne Bezug zur Oberfläche: Einheiten, Personenanpassung,
// Rezeptprüfung und Verbrauch. Der Bestand wird nie verändert, sondern
// immer als neues Objekt zurückgegeben.
//
// Ein Rezept besteht aus Plätzen (rot, braun, gruen, gelb, extra) mit einer
// oder mehreren erlaubten Optionen. Geprüft wird immer ein konkretes Gericht,
// also eine Option je Platz – egal, ob es aus einem festen Rezept stammt oder
// später aus einer Kombi-Vorlage.

export const KATEGORIE_REIHENFOLGE = ['rot', 'braun', 'gruen', 'gelb', 'extra'];

const UMRECHNUNG = { kg: ['g', 1000], l: ['ml', 1000] };
const ZAEHL_EINHEITEN = new Set(['Stück', 'Scheiben']);
const BRUCH_EINHEITEN = new Set([...ZAEHL_EINHEITEN, 'EL', 'TL', 'Prise', 'Zehe']);
const EINZAHL = { Scheiben: 'Scheibe' };
// Bei diesen Lagerformen zeigt der Vorrat volle Gebinde und Reste.
const GEZAEHLTE_GEBINDE = new Set(['Dose', 'Packung', 'TK-Block']);

/** Stück und Scheiben werden nur ganzzahlig verwendet und aufgerundet. */
export const istZaehlEinheit = (einheit) => ZAEHL_EINHEITEN.has(einheit);

const runde = (x) => Math.round(x * 100) / 100;

function heute() {
  const d = new Date();
  const zwei = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
}

// ---------------------------------------------------------------- Katalog

export function erstelleKatalog(zutatenDaten) {
  return {
    kategorien: zutatenDaten.kategorien,
    zutaten: new Map(zutatenDaten.zutaten.map((z) => [z.id, z])),
    grundvorrat: new Map(zutatenDaten.grundvorrat.map((g) => [g.id, g])),
  };
}

/** Leerer Bestand für den ersten Start: alle Mengen 0, Grundvorrat vorhanden. */
export function neuerBestand(katalog) {
  return {
    version: 1,
    vorrat: Object.fromEntries([...katalog.zutaten.keys()].map((id) => [id, 0])),
    grundvorrat: Object.fromEntries([...katalog.grundvorrat.keys()].map((id) => [id, true])),
    fertiggerichte: [],
    zuletztGekocht: {},
  };
}

/**
 * Bringt einen gespeicherten oder importierten Bestand auf den Stand des
 * Katalogs: fehlende Zutaten mit 0, unbekannte oder ungültige Werte verworfen.
 */
export function bestandAbgleichen(gespeichert, katalog) {
  const neu = neuerBestand(katalog);
  if (!gespeichert || typeof gespeichert !== 'object') return neu;
  for (const id of katalog.zutaten.keys()) {
    const m = gespeichert.vorrat?.[id];
    if (typeof m === 'number' && m >= 0) neu.vorrat[id] = m;
  }
  for (const id of katalog.grundvorrat.keys()) {
    const da = gespeichert.grundvorrat?.[id];
    if (typeof da === 'boolean') neu.grundvorrat[id] = da;
  }
  if (Array.isArray(gespeichert.fertiggerichte)) {
    neu.fertiggerichte = gespeichert.fertiggerichte
      .filter((f) => f && f.id && f.name)
      .map((f) => ({
        id: String(f.id),
        name: String(f.name),
        einheit: f.einheit === 'Portionen' ? 'Portionen' : 'Stück',
        anzahl: Number.isInteger(f.anzahl) && f.anzahl >= 0 ? f.anzahl : 0,
      }));
  }
  if (gespeichert.zuletztGekocht && typeof gespeichert.zuletztGekocht === 'object') {
    neu.zuletztGekocht = { ...gespeichert.zuletztGekocht };
  }
  return neu;
}

export const setzeMenge = (bestand, id, menge) =>
  ({ ...bestand, vorrat: { ...bestand.vorrat, [id]: runde(Math.max(0, menge)) } });

export const setzeGrundvorrat = (bestand, id, vorhanden) =>
  ({ ...bestand, grundvorrat: { ...bestand.grundvorrat, [id]: vorhanden } });

// --------------------------------------------------- Einheiten und Mengen

/** Liest eine Eingabe wie „480“ oder „1,5“. Ungültig oder negativ: null. */
export function leseZahl(text) {
  const t = String(text).trim().replace(',', '.');
  return /^(\d+(\.\d*)?|\.\d+)$/.test(t) ? Number(t) : null;
}

/** Rechnet nur g ↔ kg und ml ↔ l um. Alles andere ist unvereinbar: null. */
export function inEinheit(menge, von, nach) {
  if (von === nach) return menge;
  const [basisVon, faktorVon] = UMRECHNUNG[von] ?? [von, 1];
  const [basisNach, faktorNach] = UMRECHNUNG[nach] ?? [nach, 1];
  if (basisVon !== basisNach) return null;
  return (menge * faktorVon) / faktorNach;
}

/** Menge (Zahl oder Spanne [von, bis]) auf die gewählte Personenzahl umrechnen. */
export function skaliere(menge, personen, basisPersonen = 2) {
  const f = (m) => runde((m * personen) / basisPersonen);
  return Array.isArray(menge) ? menge.map(f) : f(menge);
}

/** Bedarf einer Rezeptoption in der Lagereinheit der Zutat. Stück wird aufgerundet. */
export function bedarf(option, zutat, personen, basisPersonen = 2) {
  const inLager = inEinheit(option.menge, option.einheit, zutat.einheit);
  if (inLager === null) {
    throw new Error(`Einheit ${option.einheit} passt nicht zu ${zutat.id} (${zutat.einheit})`);
  }
  const menge = skaliere(inLager, personen, basisPersonen);
  return istZaehlEinheit(zutat.einheit) ? Math.ceil(menge) : menge;
}

/** Teilt einen Bestand in volle Gebinde und Rest auf, z. B. 280 g → 1 Dose + 40 g. */
export function gebindeAufteilung(menge, zutat) {
  if (!zutat.gebinde) return null;
  const voll = Math.floor(runde(menge / zutat.gebinde.menge));
  return { voll, rest: Math.max(0, runde(menge - voll * zutat.gebinde.menge)) };
}

function halbe(x) {
  if (x <= 0) return '0';
  const h = Math.max(0.5, Math.round(x * 2) / 2);
  const ganz = Math.floor(h);
  return h % 1 ? `${ganz || ''}½` : String(ganz);
}

function anzeigeZahl(menge, einheit, runden) {
  if (BRUCH_EINHEITEN.has(einheit)) return halbe(menge);
  let m = runde(menge);
  if (runden && (einheit === 'g' || einheit === 'ml')) {
    m = m < 20 ? Math.round(m) : Math.round(m / 5) * 5;
  }
  return m;
}

const mitKomma = (x) => String(x).replace('.', ',');

/**
 * Lesbare Anzeige: 1250 g → „1,25 kg“, 1,5 EL → „1½ EL“, [350, 450] ml → „350–450 ml“.
 * Rezeptmengen werden auf 5 g bzw. ½ gerundet; Vorratsmengen mit { runden: false } exakt.
 */
export function formatMenge(menge, einheit, { runden = true } = {}) {
  if (Array.isArray(menge)) {
    const [a, b] = menge.map((m) => mitKomma(anzeigeZahl(m, einheit, runden)));
    return `${a}–${b} ${einheit}`;
  }
  const m = anzeigeZahl(menge, einheit, runden);
  if ((einheit === 'g' || einheit === 'ml') && m >= 1000) {
    return `${mitKomma(Math.round(m / 10) / 100)} ${einheit === 'g' ? 'kg' : 'l'}`;
  }
  return `${mitKomma(m)} ${m === '1' && EINZAHL[einheit] ? EINZAHL[einheit] : einheit}`;
}

/**
 * Anzeige einer Vorratsmenge: exakter Inhalt und – bei Dosen, Packungen und
 * TK-Blöcken – die Gebinde, z. B. „280 g“ + „1 Dose + 40 g“.
 */
export function vorratAnzeige(menge, zutat) {
  if (!(menge > 0)) return { leer: true, menge: 'leer', gebinde: null };
  const text = formatMenge(menge, zutat.einheit, { runden: false });
  if (!zutat.gebinde || !GEZAEHLTE_GEBINDE.has(zutat.lagerform)) {
    return { leer: false, menge: text, gebinde: null };
  }
  const { voll, rest } = gebindeAufteilung(menge, zutat);
  const g = zutat.gebinde;
  let gebinde = 'angebrochen';
  if (voll > 0) {
    gebinde = `${voll} ${voll === 1 ? g.name : g.mehrzahl}`;
    if (rest > 0) gebinde += ` + ${formatMenge(rest, zutat.einheit, { runden: false })}`;
  }
  return { leer: false, menge: text, gebinde };
}

// ---------------------------------------------------------- Rezeptprüfung

/** Leitet die Bausteinfarben aus den Plätzen ab, damit sie nie doppelt gepflegt werden. */
export function rezeptBausteine(rezept) {
  const sortiert = (liste) => KATEGORIE_REIHENFOLGE.filter((k) => liste.includes(k));
  const pflicht = rezept.plaetze.filter((p) => p.pflicht).map((p) => p.kategorie);
  const optional = rezept.plaetze.filter((p) => !p.pflicht).map((p) => p.kategorie)
    .filter((k) => !pflicht.includes(k));
  return { pflicht: sortiert(pflicht), optional: sortiert(optional) };
}

function pruefeOption(option, index, katalog, bestand, personen, basisPersonen) {
  const zutat = katalog.zutaten.get(option.zutat);
  const benoetigt = bedarf(option, zutat, personen, basisPersonen);
  const vorhanden = bestand.vorrat?.[option.zutat] ?? 0;
  return {
    option: index,
    zutat: option.zutat,
    einheit: zutat.einheit,
    bedarf: benoetigt,
    vorhanden,
    fehlt: runde(Math.max(0, benoetigt - vorhanden)),
    reicht: vorhanden >= benoetigt,
    vorbereitung: option.vorbereitung ?? null,
    hinweis: option.hinweis ?? null,
  };
}

// Eine ausdrückliche Auswahl gilt immer. Sonst: die erste Option, die ohne
// Vorbereitung reicht, dann die erste, die überhaupt reicht. Reicht keine,
// die mit dem kleinsten fehlenden Anteil.
function waehleOption(optionen, wunsch) {
  if (wunsch !== undefined && optionen[wunsch]) return optionen[wunsch];
  return optionen.find((o) => o.reicht && !o.vorbereitung)
    ?? optionen.find((o) => o.reicht)
    ?? optionen.reduce((beste, o) => (o.fehlt / o.bedarf < beste.fehlt / beste.bedarf ? o : beste));
}

/**
 * Prüft ein Gericht für die gewählte Personenzahl gegen den Bestand.
 * auswahl: { platzIndex: optionIndex } für ausdrücklich gewählte Optionen.
 * status: 'jetzt' | 'vorbereitung' | 'fehlt'
 */
export function pruefeGericht(rezept, bestand, katalog, personen, auswahl = {}) {
  const basis = rezept.personen;

  const plaetze = rezept.plaetze.map((platz, i) => {
    const optionen = platz.optionen.map((o, j) => pruefeOption(o, j, katalog, bestand, personen, basis));
    return {
      ...waehleOption(optionen, auswahl[i]),
      platz: i,
      kategorie: platz.kategorie,
      pflicht: platz.pflicht,
      platzHinweis: platz.hinweis ?? null,
      optionen,
    };
  });

  const grundvorrat = rezept.grundvorrat.map((g) => ({
    zutat: g.zutat,
    name: g.name ?? katalog.grundvorrat.get(g.zutat).name,
    menge: g.menge === undefined ? null : skaliere(g.menge, personen, basis),
    einheit: g.einheit ?? null,
    optional: g.optional === true,
    vorhanden: bestand.grundvorrat?.[g.zutat] ?? true,
  }));

  const fehlt = [
    ...plaetze.filter((p) => p.pflicht && !p.reicht).map((p) => ({
      art: 'zutat', platz: p.platz, zutat: p.zutat, einheit: p.einheit,
      bedarf: p.bedarf, vorhanden: p.vorhanden, fehlt: p.fehlt,
    })),
    ...grundvorrat.filter((g) => !g.optional && !g.vorhanden).map((g) => ({
      art: 'grundvorrat', zutat: g.zutat, name: katalog.grundvorrat.get(g.zutat).name,
    })),
  ];

  const vorbereitung = plaetze.filter((p) => p.pflicht && p.vorbereitung).map((p) => ({
    zutat: p.zutat, bedarf: p.bedarf, einheit: p.einheit, text: p.vorbereitung,
  }));

  let status = 'jetzt';
  if (fehlt.length > 0) status = 'fehlt';
  else if (vorbereitung.length > 0) status = 'vorbereitung';

  return {
    rezept: rezept.id,
    art: rezept.art,
    name: rezept.name,
    personen,
    status,
    bausteine: rezeptBausteine(rezept),
    plaetze,
    grundvorrat,
    weitere: rezept.weitere.map((w) => ({ ...w, menge: skaliere(w.menge, personen, basis) })),
    fehlt,
    vorbereitung,
  };
}

/** Prüft alle Gerichte. „Fehlt etwas“ ist nach Anzahl fehlender Zutaten sortiert. */
export function pruefeAlle(rezepte, bestand, katalog, personen) {
  const ergebnisse = rezepte.map((r) => pruefeGericht(r, bestand, katalog, personen));
  return {
    jetzt: ergebnisse.filter((e) => e.status === 'jetzt'),
    vorbereitung: ergebnisse.filter((e) => e.status === 'vorbereitung'),
    fehlt: ergebnisse.filter((e) => e.status === 'fehlt').sort((a, b) => a.fehlt.length - b.fehlt.length),
  };
}

// --------------------------------------------------------------- Verbrauch

/**
 * Vorschlag, was nach dem Kochen abgezogen wird – ändert nichts am Bestand.
 * Abgezogen wird die tatsächlich benötigte Menge; nur TK-Blöcke werden auf
 * ganze Blöcke aufgerundet. Nie mehr als vorhanden. Optionale Zutaten sind
 * nur dabei, wenn etwas da ist, und starten mit verwendet = false.
 */
export function verbrauchsVorschlag(ergebnis, katalog) {
  return ergebnis.plaetze
    .filter((p) => p.pflicht || p.vorhanden > 0)
    .map((p) => {
      const zutat = katalog.zutaten.get(p.zutat);
      let menge = p.bedarf;
      if (zutat.ganzeGebinde) menge = Math.ceil(menge / zutat.gebinde.menge) * zutat.gebinde.menge;
      menge = runde(Math.min(menge, p.vorhanden));
      return {
        platz: p.platz,
        zutat: p.zutat,
        einheit: p.einheit,
        pflicht: p.pflicht,
        menge,
        vorhanden: p.vorhanden,
        bleibt: runde(p.vorhanden - menge),
        verwendet: p.pflicht,
      };
    });
}

/** Zieht bestätigte Posten (verwendet = true) ab. Keine Menge fällt unter 0. */
export function zieheVerbrauchAb(bestand, posten) {
  const vorrat = { ...bestand.vorrat };
  for (const p of posten) {
    if (!p.verwendet || !(p.menge > 0)) continue;
    vorrat[p.zutat] = runde(Math.max(0, (vorrat[p.zutat] ?? 0) - p.menge));
  }
  return { ...bestand, vorrat };
}

/** Ändert die Stückzahl eines Fertiggerichts; legt es bei Zugang aus der Vorlage an. */
export function aendereFertiggericht(bestand, id, delta, vorlage) {
  const liste = bestand.fertiggerichte ?? [];
  if (!liste.some((f) => f.id === id)) {
    if (delta <= 0 || !vorlage) return bestand;
    return { ...bestand, fertiggerichte: [...liste, { ...vorlage, id, anzahl: delta }] };
  }
  return {
    ...bestand,
    fertiggerichte: liste.map((f) => (f.id === id ? { ...f, anzahl: Math.max(0, f.anzahl + delta) } : f)),
  };
}

export const fertiggerichtGegessen = (bestand, id) => aendereFertiggericht(bestand, id, -1);

/** Legt ein Fertiggericht an oder ersetzt es (gleiche id). */
export function fertiggerichtSpeichern(bestand, gericht) {
  const liste = bestand.fertiggerichte ?? [];
  const neu = liste.some((f) => f.id === gericht.id)
    ? liste.map((f) => (f.id === gericht.id ? { ...gericht } : f))
    : [...liste, { ...gericht }];
  return { ...bestand, fertiggerichte: neu };
}

export const fertiggerichtEntfernen = (bestand, id) =>
  ({ ...bestand, fertiggerichte: (bestand.fertiggerichte ?? []).filter((f) => f.id !== id) });

/** Anzahl, die beim Einfrieren als Fertiggericht dazukommt (z. B. Pizzen = verwendete Teiglinge). */
export function einfrierenAnzahl(rezept, posten) {
  if (!rezept.einfrieren) return 0;
  const p = posten.find((x) => x.zutat === rezept.einfrieren.stueckProZutat && x.verwendet);
  return p ? p.menge : 0;
}

/**
 * Bestätigtes Kochen: Verbrauch abziehen, Datum als „zuletzt gekocht“ merken
 * und bei „eingefroren“ das Ergebnis als Fertiggericht buchen.
 */
export function kochenBestaetigen(bestand, rezept, posten, { datum = heute(), eingefroren = false } = {}) {
  let neu = zieheVerbrauchAb(bestand, posten);
  neu = { ...neu, zuletztGekocht: { ...neu.zuletztGekocht, [rezept.id]: datum } };
  if (eingefroren && rezept.einfrieren) {
    const f = rezept.einfrieren.fertiggericht;
    neu = aendereFertiggericht(neu, f.id, einfrierenAnzahl(rezept, posten), f);
  }
  return neu;
}
