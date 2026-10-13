// Tests der Rechenlogik mit dem echten Katalog, den zehn Rezepten und dem
// Testbestand. Die Fälle entsprechen den abgestimmten erwarteten Ergebnissen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  erstelleKatalog, neuerBestand, bestandAbgleichen, setzeMenge, setzeGrundvorrat,
  leseZahl, inEinheit, formatMenge, gebindeAufteilung, vorratAnzeige,
  rezeptBausteine, pruefeGericht, pruefeAlle, verbrauchsVorschlag,
  zieheVerbrauchAb, kochenBestaetigen, fertiggerichtGegessen, aendereFertiggericht,
  fertiggerichtSpeichern, fertiggerichtEntfernen, tageSeit,
} from '../js/logik.js';

const lade = (datei) =>
  JSON.parse(readFileSync(new URL(`../daten/${datei}`, import.meta.url), 'utf8'));

const katalog = erstelleKatalog(lade('zutaten.json'));
const { rezepte } = lade('rezepte.json');
const testbestand = lade('testbestand.json');

// Rezepte über ihre Nummer im Dokument (1–10) ansprechen.
const nr = (...nummern) => nummern.map((n) => rezepte[n - 1].id);
const rezept = (n) => rezepte[n - 1];
const ids = (ergebnisse) => ergebnisse.map((e) => e.rezept);
const mit = (aenderungen, basis = testbestand) => ({ ...basis, vorrat: { ...basis.vorrat, ...aenderungen } });
const fehlmengen = (ergebnis) => ergebnis.fehlt.map((f) => [f.zutat, f.fehlt, f.vorhanden, f.bedarf]);
const platzFuer = (ergebnis, zutat) => ergebnis.plaetze.find((p) => p.zutat === zutat);

// Kochen mit Standardvorschlag; optional genutzte Zutaten werden als verwendet markiert.
function koche(bestand, n, { personen = 2, optional = [], eingefroren = false } = {}) {
  const ergebnis = pruefeGericht(rezept(n), bestand, katalog, personen);
  const posten = verbrauchsVorschlag(ergebnis, katalog)
    .map((p) => (optional.includes(p.zutat) ? { ...p, verwendet: true } : p));
  return kochenBestaetigen(bestand, rezept(n), posten, { datum: '2026-10-12', eingefroren });
}

test('Testbestand, 2 Personen: 8 jetzt möglich, 2 nach Vorbereitung, nichts fehlt', () => {
  const e = pruefeAlle(rezepte, testbestand, katalog, 2);
  assert.deepEqual(ids(e.jetzt), nr(1, 3, 4, 5, 6, 7, 8, 9));
  assert.deepEqual(ids(e.vorbereitung), nr(2, 10));
  assert.deepEqual(e.fehlt, []);
  assert.deepEqual(e.vorbereitung.map((x) => x.vorbereitung.map((v) => [v.zutat, v.bedarf, v.text])), [
    [['kichererbsen-trocken', 150, '12–18 Std. einweichen']],
    [['pizzateiglinge', 2, 'auftauen lassen (Packungsangabe)']],
  ]);
});

test('Testbestand, 4 Personen: Chili und Falafel-Couscous zeigen genaue Fehlmengen', () => {
  const e = pruefeAlle(rezepte, testbestand, katalog, 4);
  assert.deepEqual(ids(e.jetzt), nr(1, 3, 4, 5, 6, 8));
  assert.deepEqual(ids(e.vorbereitung), nr(2, 10));
  assert.deepEqual(ids(e.fehlt), nr(7, 9));
  assert.deepEqual(fehlmengen(e.fehlt[0]), [['kidneybohnen-dose', 160, 240, 400]]);
  assert.deepEqual(fehlmengen(e.fehlt[1]), [['falafel', 4, 8, 12]]);
});

test('Restmengen: angebrochene Dosen bleiben im Vorrat', () => {
  let b = koche(testbestand, 3);
  assert.equal(b.vorrat['kichererbsen-dose'], 280);
  assert.deepEqual(gebindeAufteilung(280, katalog.zutaten.get('kichererbsen-dose')), { voll: 1, rest: 40 });
  assert.equal(b.zuletztGekocht['kichererbsen-tomaten-pasta'], '2026-10-12');

  b = koche(b, 6);
  assert.equal(b.vorrat['kichererbsen-dose'], 80);

  const e = pruefeGericht(rezept(3), b, katalog, 2);
  assert.equal(e.status, 'fehlt');
  assert.deepEqual(fehlmengen(e), [['kichererbsen-dose', 120, 80, 200]]);
});

test('Kokosmilch: aus einer 400-ml-Dose bleiben nach 100 ml genau 300 ml', () => {
  const b = koche(testbestand, 6, { optional: ['kokosmilch'] });
  assert.equal(b.vorrat.kokosmilch, 300);
  assert.equal(b.vorrat.brokkoli, 400, 'nicht verwendeter optionaler Brokkoli bleibt');
});

test('TK-Blöcke: geprüft wird die echte Menge, vorgeschlagen werden ganze Blöcke', () => {
  const e = pruefeGericht(rezept(4), testbestand, katalog, 3);
  assert.equal(platzFuer(e, 'tomatenbasis').bedarf, 300);
  const vorschlag = Object.fromEntries(verbrauchsVorschlag(e, katalog).map((p) => [p.zutat, p.menge]));
  assert.deepEqual(vorschlag, { tomatenbasis: 400, spinat: 300, nudeln: 270 });

  // 1 Block + 100 g Rest reichen für 300 g; vorgeschlagen wird nie mehr als vorhanden.
  const knapp = pruefeGericht(rezept(4), mit({ tomatenbasis: 300 }), katalog, 3);
  assert.equal(knapp.status, 'jetzt');
  assert.equal(verbrauchsVorschlag(knapp, katalog)[0].menge, 300);
});

test('Personenzahl: Spinat-Tomaten-Pasta für 4 Personen', () => {
  const e = pruefeGericht(rezept(4), testbestand, katalog, 4);
  assert.deepEqual(e.plaetze.map((p) => [p.zutat, p.bedarf]),
    [['tomatenbasis', 400], ['spinat', 400], ['nudeln', 360]]);
});

test('Nur 100 g Tomatenbasis: Rezept zeigt 100 g fehlende Basis', () => {
  const e = pruefeGericht(rezept(3), mit({ tomatenbasis: 100, 'passierte-tomaten': 0 }), katalog, 2);
  assert.equal(e.status, 'fehlt');
  assert.deepEqual(fehlmengen(e), [['tomatenbasis', 100, 100, 200]]);
});

test('Alternative Basis: eine der erlaubten Basen genügt', () => {
  const e = pruefeGericht(rezept(3), mit({ tomatenbasis: 0 }), katalog, 2);
  assert.equal(e.status, 'jetzt');
  assert.equal(e.plaetze[0].zutat, 'passierte-tomaten');
  assert.equal(e.plaetze[0].bedarf, 250);
  assert.match(e.plaetze[0].hinweis, /Zwiebel/);
});

test('Optionale Zutaten blockieren nie: Dal ohne Spinat ist möglich', () => {
  const e = pruefeGericht(rezept(5), mit({ spinat: 0 }), katalog, 2);
  assert.equal(e.status, 'jetzt');
});

test('Hülsenfrüchte: keine Form, die das Rezept nicht nennt', () => {
  // Nur trockene Kichererbsen da – die Pasta erlaubt aber nur Dose oder gekocht.
  const nurTrocken = mit({ 'kichererbsen-dose': 0, 'kichererbsen-gekocht': 0 });
  const e = pruefeGericht(rezept(3), nurTrocken, katalog, 2);
  assert.equal(e.status, 'fehlt');
  assert.ok(e.plaetze.every((p) => p.zutat !== 'kichererbsen-trocken'));

  const gekocht = pruefeGericht(rezept(3), mit({ 'kichererbsen-dose': 0, 'kichererbsen-gekocht': 300 }), katalog, 2);
  assert.equal(gekocht.status, 'jetzt');
  assert.equal(gekocht.plaetze[1].zutat, 'kichererbsen-gekocht');
});

test('Ausdrücklich gewählte Option wird respektiert', () => {
  // Gekocht gewählt (Platz 2, Option 2), obwohl Dosen da wären.
  const e = pruefeGericht(rezept(3), testbestand, katalog, 2, { 1: 1 });
  assert.equal(e.plaetze[1].zutat, 'kichererbsen-gekocht');
  assert.equal(e.status, 'fehlt');
});

test('Grundvorrat: ausgeschaltet blockiert, optional nicht', () => {
  const ohne = { ...testbestand, grundvorrat: { ...testbestand.grundvorrat, zwiebeln: false, knoblauch: false } };
  const falafel = pruefeGericht(rezept(2), ohne, katalog, 2);
  assert.equal(falafel.status, 'fehlt');
  assert.deepEqual(falafel.fehlt.map((f) => [f.art, f.name]),
    [['grundvorrat', 'Zwiebeln'], ['grundvorrat', 'Knoblauch']]);
  assert.equal(pruefeGericht(rezept(4), ohne, katalog, 2).status, 'jetzt');
});

test('Stück und Scheiben werden auf ganze Stück aufgerundet', () => {
  assert.equal(pruefeGericht(rezept(9), testbestand, katalog, 3).plaetze[0].bedarf, 9);
  assert.equal(pruefeGericht(rezept(9), testbestand, katalog, 1).plaetze[0].bedarf, 3);
  assert.equal(pruefeGericht(rezept(10), testbestand, katalog, 3).plaetze[0].bedarf, 3);
  assert.equal(pruefeGericht(rezept(10), testbestand, katalog, 1).plaetze[0].bedarf, 1);
});

test('Pizza: eingefroren wird zum Fertiggericht, gegessen zählt herunter', () => {
  const b = koche(testbestand, 10, { eingefroren: true });
  assert.equal(b.vorrat.pizzateiglinge, 2);
  assert.equal(b.vorrat.tomatenbasis, 1400);
  assert.equal(b.fertiggerichte.find((f) => f.id === 'tk-pizza').anzahl, 4);

  const ohnePizza = { ...testbestand, fertiggerichte: [] };
  const neu = koche(ohnePizza, 10, { eingefroren: true });
  assert.deepEqual(neu.fertiggerichte, [{ id: 'tk-pizza', name: 'Selbstgemachte TK-Pizza', einheit: 'Stück', anzahl: 2 }]);

  assert.equal(fertiggerichtGegessen(testbestand, 'tk-pizza').fertiggerichte[0].anzahl, 1);
  const leer = aendereFertiggericht(testbestand, 'tk-pizza', -5);
  assert.equal(leer.fertiggerichte[0].anzahl, 0, 'nie unter 0');
});

test('Ohne Bestätigung wird nichts abgezogen', () => {
  const vorher = structuredClone(testbestand);
  const e = pruefeAlle(rezepte, testbestand, katalog, 3);
  for (const ergebnis of [...e.jetzt, ...e.vorbereitung, ...e.fehlt]) verbrauchsVorschlag(ergebnis, katalog);
  koche(testbestand, 1);
  assert.deepEqual(testbestand, vorher);
});

test('Bestand fällt nie unter 0', () => {
  const b = zieheVerbrauchAb(testbestand, [{ zutat: 'nudeln', menge: 5000, verwendet: true }]);
  assert.equal(b.vorrat.nudeln, 0);
  const nichtVerwendet = zieheVerbrauchAb(testbestand, [{ zutat: 'spinat', menge: 200, verwendet: false }]);
  assert.equal(nichtVerwendet.vorrat.spinat, 600);
});

test('„Fehlt etwas“ ist nach Anzahl fehlender Zutaten sortiert', () => {
  const b = mit({ reis: 0, brot: 0, broetchen: 0, falafel: 0, 'kidneybohnen-dose': 0 });
  const e = pruefeAlle(rezepte, b, katalog, 2);
  assert.deepEqual(ids(e.fehlt), nr(5, 6, 9, 7));
  assert.equal(e.fehlt[3].fehlt.length, 2);
});

test('Bausteine werden aus den Plätzen abgeleitet', () => {
  assert.deepEqual(rezeptBausteine(rezept(1)), { pflicht: ['rot', 'braun', 'gelb'], optional: ['gruen'] });
  assert.deepEqual(rezeptBausteine(rezept(8)), { pflicht: ['rot', 'gruen', 'gelb'], optional: [] });
});

test('Einheiten: nur g ↔ kg und ml ↔ l werden umgerechnet', () => {
  assert.equal(inEinheit(1, 'kg', 'g'), 1000);
  assert.equal(inEinheit(400, 'ml', 'l'), 0.4);
  assert.equal(inEinheit(200, 'g', 'g'), 200);
  assert.equal(inEinheit(200, 'g', 'ml'), null);
  assert.equal(inEinheit(1, 'Stück', 'g'), null);
});

test('Anzeige von Mengen', () => {
  assert.equal(formatMenge(1250, 'g'), '1,25 kg');
  assert.equal(formatMenge(1000, 'g'), '1 kg');
  assert.equal(formatMenge(280, 'g'), '280 g');
  assert.equal(formatMenge(112.5, 'g'), '115 g');
  assert.equal(formatMenge(283, 'g', { runden: false }), '283 g');
  assert.equal(formatMenge(1500, 'ml'), '1,5 l');
  assert.equal(formatMenge([525, 675], 'ml'), '525–675 ml');
  assert.equal(formatMenge(1.5, 'EL'), '1½ EL');
  assert.equal(formatMenge(0.5, 'TL'), '½ TL');
  assert.equal(formatMenge(6, 'Stück'), '6 Stück');
});

test('Neuer Bestand: alle Mengen 0, Grundvorrat vorhanden', () => {
  const b = neuerBestand(katalog);
  assert.deepEqual(Object.keys(b.vorrat).sort(), Object.keys(testbestand.vorrat).sort());
  assert.ok(Object.values(b.vorrat).every((m) => m === 0));
  assert.ok(Object.values(b.grundvorrat).every((v) => v === true));
  assert.deepEqual(b.fertiggerichte, []);
});

test('Vorratsanzeige: Inhalt und Gebinde getrennt', () => {
  const z = (id) => katalog.zutaten.get(id);
  assert.deepEqual(vorratAnzeige(480, z('kichererbsen-dose')), { leer: false, menge: '480 g', gebinde: '2 Dosen' });
  assert.deepEqual(vorratAnzeige(280, z('kichererbsen-dose')), { leer: false, menge: '280 g', gebinde: '1 Dose + 40 g' });
  assert.equal(vorratAnzeige(40, z('kichererbsen-dose')).gebinde, 'angebrochen');
  assert.equal(vorratAnzeige(300, z('kokosmilch')).gebinde, 'angebrochen');
  assert.equal(vorratAnzeige(800, z('tomatenbasis')).gebinde, '4 Blöcke');
  assert.equal(vorratAnzeige(200, z('tomatenbasis')).gebinde, '1 Block');
  assert.equal(vorratAnzeige(500, z('passierte-tomaten')).gebinde, '1 Packung');
  assert.equal(vorratAnzeige(250, z('passierte-tomaten')).gebinde, 'angebrochen');
  assert.equal(vorratAnzeige(8, z('brot')).menge, '8 Scheiben');
  assert.equal(vorratAnzeige(1, z('brot')).menge, '1 Scheibe');
  assert.deepEqual(vorratAnzeige(1000, z('reis')), { leer: false, menge: '1 kg', gebinde: null });
  assert.equal(vorratAnzeige(8, z('falafel')).menge, '8 Stück');
  assert.equal(vorratAnzeige(0, z('spinat')).leer, true);
});

test('Eingaben: Zahlen mit Komma, ungültige Eingaben werden erkannt', () => {
  assert.equal(leseZahl('480'), 480);
  assert.equal(leseZahl(' 1,5 '), 1.5);
  assert.equal(leseZahl('1.'), 1);
  assert.equal(leseZahl(''), null);
  assert.equal(leseZahl('-3'), null);
  assert.equal(leseZahl('abc'), null);
});

test('Gespeicherter Bestand wird mit dem Katalog abgeglichen', () => {
  const alt = {
    vorrat: { reis: 750, nudeln: -5, 'gibt-es-nicht': 3 },
    grundvorrat: { salz: false, oel: 'ja' },
    fertiggerichte: [{ id: 'x', name: 'Suppe', einheit: 'Portionen', anzahl: 2 }, { name: 'ohne id' }],
    zuletztGekocht: { 'chili-sin-carne': '2026-10-01' },
  };
  const b = bestandAbgleichen(alt, katalog);
  assert.equal(b.vorrat.reis, 750);
  assert.equal(b.vorrat.nudeln, 0, 'ungültige Menge wird 0');
  assert.equal(b.vorrat.spinat, 0, 'neue Katalogzutat wird ergänzt');
  assert.ok(!('gibt-es-nicht' in b.vorrat));
  assert.equal(b.grundvorrat.salz, false);
  assert.equal(b.grundvorrat.oel, true, 'ungültiger Schalter bleibt vorhanden');
  assert.deepEqual(b.fertiggerichte, [{ id: 'x', name: 'Suppe', einheit: 'Portionen', anzahl: 2 }]);
  assert.equal(b.zuletztGekocht['chili-sin-carne'], '2026-10-01');
  assert.deepEqual(bestandAbgleichen(null, katalog), neuerBestand(katalog));
  assert.deepEqual(bestandAbgleichen(testbestand, katalog), testbestand, 'Testbestand bleibt unverändert');
});

test('Vorrat und Fertiggerichte bearbeiten, ohne das Original zu verändern', () => {
  const vorher = structuredClone(testbestand);
  assert.equal(setzeMenge(testbestand, 'reis', 1240).vorrat.reis, 1240);
  assert.equal(setzeMenge(testbestand, 'reis', -10).vorrat.reis, 0);
  assert.equal(setzeGrundvorrat(testbestand, 'mehl', false).grundvorrat.mehl, false);

  const suppe = { id: 'fg-1', name: 'Gemüsesuppe', einheit: 'Portionen', anzahl: 3 };
  let b = fertiggerichtSpeichern(testbestand, suppe);
  assert.equal(b.fertiggerichte.length, 4);
  b = fertiggerichtSpeichern(b, { ...suppe, anzahl: 1 });
  assert.equal(b.fertiggerichte.find((f) => f.id === 'fg-1').anzahl, 1);
  b = fertiggerichtEntfernen(b, 'fg-1');
  assert.deepEqual(b.fertiggerichte, testbestand.fertiggerichte);
  assert.deepEqual(testbestand, vorher);
});

test('Brot und Brötchen als Alternative zu Reis', () => {
  const ohneReis = mit({ reis: 0 });
  const dal = pruefeGericht(rezept(5), ohneReis, katalog, 3);
  assert.equal(dal.status, 'jetzt');
  assert.deepEqual([platzFuer(dal, 'brot').bedarf, platzFuer(dal, 'brot').einheit], [6, 'Scheiben']);
  const chili = pruefeGericht(rezept(7), ohneReis, katalog, 2);
  assert.equal(platzFuer(chili, 'broetchen').bedarf, 4);
  // Mit Reis im Vorrat bleibt Reis die erste Wahl.
  assert.equal(pruefeGericht(rezept(5), testbestand, katalog, 2).plaetze[2].zutat, 'reis');
});

test('Trockene Kidneybohnen nur als ausdrücklich erlaubte Option mit Vorbereitung', () => {
  const nurTrocken = mit({ 'kidneybohnen-dose': 0, 'kidneybohnen-trocken': 500 });
  const e = pruefeGericht(rezept(7), nurTrocken, katalog, 2);
  assert.equal(e.status, 'vorbereitung');
  assert.deepEqual(e.vorbereitung.map((v) => [v.zutat, v.bedarf]), [['kidneybohnen-trocken', 80]]);
});

test('Gewürze: ausgeschaltetes Pflichtgewürz blockiert, optionales nicht', () => {
  const ohneCurry = { ...testbestand, grundvorrat: { ...testbestand.grundvorrat, currypulver: false, chili: false } };
  const dal = pruefeGericht(rezept(5), ohneCurry, katalog, 2);
  assert.deepEqual(dal.fehlt.map((f) => f.name), ['Currypulver']);
  assert.equal(pruefeGericht(rezept(4), ohneCurry, katalog, 2).status, 'jetzt', 'Chili ist bei der Spinat-Pasta optional');
});

test('Platz-Hinweis und Options-Hinweis bleiben getrennt', () => {
  const e = pruefeGericht(rezept(2), mit({ tomatenbasis: 0 }), katalog, 2);
  const dip = e.plaetze.find((p) => p.kategorie === 'rot');
  assert.equal(dip.platzHinweis, 'als Dip');
  assert.equal(dip.zutat, 'passierte-tomaten');
  assert.match(dip.hinweis, /einköcheln/);
});

test('Auswahl aus der Detailansicht wirkt auch in der Übersicht', () => {
  // Brot statt Reis beim Dal, aber kein Brot da → das Dal fehlt.
  const auswahl = { 'rotes-linsen-dal': { 2: 1 } };
  const e = pruefeAlle(rezepte, mit({ brot: 0 }), katalog, 2, auswahl);
  assert.deepEqual(ids(e.fehlt), nr(5));
  assert.deepEqual(fehlmengen(e.fehlt[0]), [['brot', 4, 0, 4]]);
});

test('Tage seit dem letzten Kochen', () => {
  assert.equal(tageSeit('2026-10-12', '2026-10-12'), 0);
  assert.equal(tageSeit('2026-10-11', '2026-10-12'), 1);
  assert.equal(tageSeit('2026-09-28', '2026-10-12'), 14);
  assert.equal(tageSeit('2026-03-28', '2026-03-30'), 2, 'Zeitumstellung zählt nicht');
});
