// Automatische Datenprüfung: Katalog, Rezepte und Testbestand müssen
// zueinander passen, bevor eine Version auf das iPhone kommt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lade = (datei) =>
  JSON.parse(readFileSync(new URL(`../daten/${datei}`, import.meta.url), 'utf8'));

const katalog = lade('zutaten.json');
const { rezepte } = lade('rezepte.json');
const testbestand = lade('testbestand.json');

const KATEGORIEN = new Set(katalog.kategorien.map((k) => k.id));
const EINHEITEN = new Set(['g', 'ml', 'Stück', 'Scheiben']);
const ZAEHL_EINHEITEN = new Set(['Stück', 'Scheiben']);
const GRUNDVORRAT_GRUPPEN = new Set(['Grundzutaten', 'Gewürze', 'Würzhelfer']);
const GRUNDVORRAT_EINHEITEN = new Set(['EL', 'TL', 'Prise', 'Stück', 'Zehe', 'g', 'ml']);
const zutaten = new Map(katalog.zutaten.map((z) => [z.id, z]));
const grundvorrat = new Map(katalog.grundvorrat.map((g) => [g.id, g]));

// Eine Menge ist eine positive Zahl oder eine Spanne [von, bis].
function istMenge(menge) {
  if (typeof menge === 'number') return menge > 0;
  return Array.isArray(menge) && menge.length === 2 &&
    menge.every((m) => typeof m === 'number' && m > 0) && menge[0] < menge[1];
}

function eindeutig(ids, was) {
  const doppelt = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(doppelt, [], `${was}: doppelte IDs`);
}

test('Zutatenkatalog: IDs eindeutig, Kategorien und Einheiten gültig', () => {
  eindeutig([...katalog.zutaten, ...katalog.grundvorrat].map((z) => z.id), 'Katalog');
  for (const z of katalog.zutaten) {
    const ort = `Zutat ${z.id}`;
    assert.ok(z.name, `${ort}: Name fehlt`);
    assert.ok(z.lagerform, `${ort}: Lagerform fehlt`);
    assert.ok(KATEGORIEN.has(z.kategorie), `${ort}: unbekannte Kategorie ${z.kategorie}`);
    assert.ok(EINHEITEN.has(z.einheit), `${ort}: unbekannte Einheit ${z.einheit}`);
    if (z.gebinde) {
      assert.ok(z.gebinde.name && z.gebinde.mehrzahl, `${ort}: Gebinde braucht Name und Mehrzahl`);
      assert.ok(z.gebinde.menge > 0, `${ort}: Gebindegröße muss positiv sein`);
    }
    if (z.ganzeGebinde) assert.ok(z.gebinde, `${ort}: ganze Gebinde ohne Gebindegröße`);
  }
  for (const g of katalog.grundvorrat) {
    assert.ok(g.name, `Grundvorrat ${g.id}: Name fehlt`);
    assert.ok(GRUNDVORRAT_GRUPPEN.has(g.gruppe), `Grundvorrat ${g.id}: unbekannte Gruppe`);
  }
});

test('Rezepte: Aufbau, Zutaten und Einheiten passen zum Katalog', () => {
  eindeutig(rezepte.map((r) => r.id), 'Rezepte');
  for (const r of rezepte) {
    const ort = `Rezept ${r.id}`;
    assert.equal(r.art, 'rezept', `${ort}: art muss "rezept" sein`);
    assert.ok(r.name && r.zeit, `${ort}: Name oder Zeit fehlt`);
    assert.equal(r.personen, 2, `${ort}: Grundmenge muss für 2 Personen sein`);
    assert.ok(r.plaetze.some((p) => p.pflicht), `${ort}: mindestens ein Pflichtplatz nötig`);
    assert.ok(r.schritte.length > 0 && r.schritte.every((s) => typeof s === 'string' && s),
      `${ort}: Zubereitungsschritte fehlen`);

    r.plaetze.forEach((platz, i) => {
      const pOrt = `${ort}, Platz ${i + 1}`;
      assert.ok(KATEGORIEN.has(platz.kategorie), `${pOrt}: unbekannte Kategorie`);
      assert.equal(typeof platz.pflicht, 'boolean', `${pOrt}: pflicht muss true/false sein`);
      assert.ok(platz.optionen.length > 0, `${pOrt}: keine Optionen`);
      eindeutig(platz.optionen.map((o) => o.zutat), pOrt);
      for (const o of platz.optionen) {
        const z = zutaten.get(o.zutat);
        assert.ok(z, `${pOrt}: unbekannte Zutat ${o.zutat}`);
        assert.equal(z.kategorie, platz.kategorie, `${pOrt}: ${o.zutat} gehört nicht zu ${platz.kategorie}`);
        assert.equal(o.einheit, z.einheit, `${pOrt}: ${o.zutat} muss in ${z.einheit} angegeben sein`);
        assert.ok(typeof o.menge === 'number' && o.menge > 0, `${pOrt}: ${o.zutat} braucht eine feste Menge`);
        if (ZAEHL_EINHEITEN.has(z.einheit)) assert.ok(Number.isInteger(o.menge), `${pOrt}: ${z.einheit} nur ganzzahlig`);
        if (z.ganzeGebinde) {
          assert.equal(o.menge % z.gebinde.menge, 0, `${pOrt}: ${o.zutat} nur in ganzen ${z.gebinde.mehrzahl}`);
        }
        if ('vorbereitung' in o) assert.ok(o.vorbereitung, `${pOrt}: leere Vorbereitung`);
        if ('hinweis' in o) assert.ok(o.hinweis, `${pOrt}: leerer Hinweis`);
      }
    });

    for (const g of r.grundvorrat) {
      assert.ok(grundvorrat.has(g.zutat), `${ort}: unbekannter Grundvorrat ${g.zutat}`);
      if ('menge' in g) {
        assert.ok(istMenge(g.menge), `${ort}: ungültige Menge bei ${g.zutat}`);
        assert.ok(GRUNDVORRAT_EINHEITEN.has(g.einheit), `${ort}: ungültige Einheit bei ${g.zutat}`);
      }
    }
    for (const w of r.weitere) {
      assert.ok(w.name && w.einheit && istMenge(w.menge), `${ort}: unvollständige Angabe "${w.name}"`);
    }

    if (r.einfrieren) {
      const quelle = r.plaetze.filter((p) => p.pflicht).flatMap((p) => p.optionen)
        .find((o) => o.zutat === r.einfrieren.stueckProZutat);
      assert.ok(quelle && quelle.einheit === 'Stück', `${ort}: Einfrieren braucht eine Stück-Pflichtzutat`);
      const f = r.einfrieren.fertiggericht;
      assert.ok(f.id && f.name && f.einheit, `${ort}: Fertiggericht zum Einfrieren unvollständig`);
    }
  }
});

test('Jede Zutat des Katalogs wird in mindestens einem Rezept verwendet', () => {
  const verwendet = new Set(rezepte.flatMap((r) => r.plaetze.flatMap((p) => p.optionen.map((o) => o.zutat))));
  const ungenutzt = katalog.zutaten.map((z) => z.id).filter((id) => !verwendet.has(id));
  assert.deepEqual(ungenutzt, []);
});

test('Testbestand passt zum Katalog', () => {
  assert.deepEqual(Object.keys(testbestand.vorrat).sort(), [...zutaten.keys()].sort(),
    'Testbestand muss genau die Katalogzutaten enthalten');
  for (const [id, menge] of Object.entries(testbestand.vorrat)) {
    assert.ok(typeof menge === 'number' && menge >= 0, `${id}: ungültige Menge`);
    if (ZAEHL_EINHEITEN.has(zutaten.get(id).einheit)) assert.ok(Number.isInteger(menge), `${id}: nur ganzzahlig`);
  }
  assert.deepEqual(Object.keys(testbestand.grundvorrat).sort(), [...grundvorrat.keys()].sort());
  assert.ok(Object.values(testbestand.grundvorrat).every((v) => typeof v === 'boolean'));

  eindeutig(testbestand.fertiggerichte.map((f) => f.id), 'Fertiggerichte');
  for (const f of testbestand.fertiggerichte) {
    assert.ok(f.name && f.einheit, `Fertiggericht ${f.id}: Name oder Einheit fehlt`);
    assert.ok(Number.isInteger(f.anzahl) && f.anzahl >= 0, `Fertiggericht ${f.id}: ungültige Anzahl`);
  }
  assert.equal(typeof testbestand.zuletztGekocht, 'object');
});
