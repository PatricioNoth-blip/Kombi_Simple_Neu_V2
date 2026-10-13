// Kombi V2 – Oberfläche
//
// Lädt Katalog, Rezepte und Testbestand, hält den Vorrat im lokalen Speicher
// des Geräts und zeichnet die Bildschirme. Gerechnet wird ausschließlich in
// logik.js.

import {
  erstelleKatalog, bestandAbgleichen, setzeMenge, setzeGrundvorrat, leseZahl,
  formatMenge, vorratAnzeige, fertiggerichtSpeichern, fertiggerichtEntfernen,
} from './logik.js';

const SPEICHER_SCHLUESSEL = 'kombi-v2-bestand';

const app = {
  katalog: null,
  rezepte: [],
  testbestand: null,
  bestand: null,
  tab: 'vorrat',
  grundvorratOffen: false,
  sheet: null,
  speicherFehler: false,
};

const $ = (selektor) => document.querySelector(selektor);

const esc = (text) => String(text).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const zahlText = (x) => String(x).replace('.', ',');

const anzahlText = (n, einheit) => (n === 1 && einheit === 'Portionen' ? '1 Portion' : `${n} ${einheit}`);

// ---------------------------------------------------------------- Speicher

function ladeGespeichert() {
  try {
    const text = localStorage.getItem(SPEICHER_SCHLUESSEL);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function speichere() {
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(app.bestand));
    app.speicherFehler = false;
  } catch {
    app.speicherFehler = true;
  }
}

function aendereBestand(neu) {
  app.bestand = neu;
  speichere();
  render();
}

const vorratIstLeer = () =>
  Object.values(app.bestand.vorrat).every((m) => m === 0) && app.bestand.fertiggerichte.length === 0;

// ---------------------------------------------------------------- Ansichten

function render() {
  $('#inhalt').innerHTML = (app.speicherFehler ? speicherBanner() : '') +
    (app.tab === 'vorrat' ? vorratAnsicht() : kochenAnsicht());
  for (const tab of document.querySelectorAll('[data-tab]')) {
    tab.setAttribute('aria-current', tab.dataset.tab === app.tab ? 'page' : 'false');
  }
  renderSheet();
}

const speicherBanner = () =>
  '<p class="banner">Der Vorrat kann auf diesem Gerät gerade nicht gespeichert werden. Änderungen gehen beim Schließen verloren.</p>';

function kochenAnsicht() {
  return `
    <header class="kopf"><h1>Kochen</h1></header>
    <section class="karte hinweis-karte">
      <p><strong>Kommt im nächsten Schritt.</strong></p>
      <p>Hier erscheinen bald die Gerichte, die mit deinem Vorrat möglich sind.</p>
    </section>`;
}

function vorratAnsicht() {
  return `
    <header class="kopf"><h1>Vorrat</h1></header>
    ${vorratIstLeer() ? leerHinweis() : ''}
    ${app.katalog.kategorien.map(kategorieKarte).join('')}
    ${fertiggerichteKarte()}
    ${grundvorratKarte()}
    <section class="fuss">
      <button class="knopf knopf-zweit" data-aktion="testbestand">Testbestand laden</button>
      <p class="klein">Ersetzt den aktuellen Vorrat durch den Beispielbestand.</p>
    </section>`;
}

function leerHinweis() {
  return `
    <section class="karte hinweis-karte">
      <p><strong>Dein Vorrat ist noch leer.</strong></p>
      <p>Tippe eine Zutat an, um ihre Menge einzutragen – oder probiere Kombi mit dem Testbestand aus.</p>
      <button class="knopf" data-aktion="testbestand">Testbestand laden</button>
    </section>`;
}

function kategorieKarte(kategorie) {
  const zutaten = [...app.katalog.zutaten.values()].filter((z) => z.kategorie === kategorie.id);
  const zeilen = [];
  const gruppen = new Set();
  for (const z of zutaten) {
    if (!z.gruppe) {
      zeilen.push(zutatZeile(z));
    } else if (!gruppen.has(z.gruppe)) {
      gruppen.add(z.gruppe);
      zeilen.push(gruppenZeile(z.gruppe, zutaten.filter((x) => x.gruppe === z.gruppe)));
    }
  }
  return `
    <section class="karte kat-${kategorie.id}">
      <h2 class="karte-titel"><span class="punkt"></span>${esc(kategorie.name)}
        <span class="titel-zusatz">${esc(kategorie.rolle)}</span></h2>
      <ul class="liste">${zeilen.join('')}</ul>
    </section>`;
}

function zutatZeile(z) {
  const a = vorratAnzeige(app.bestand.vorrat[z.id], z);
  // Lagerform nur zeigen, wenn sie nicht schon im Namen steht („Braune Linsen, trocken“).
  const form = z.name.toLowerCase().includes(z.lagerform.toLowerCase()) ? '' : z.lagerform;
  return `
    <li><button class="zeile${a.leer ? ' ist-leer' : ''}" data-aktion="zutat" data-ids="${esc(z.id)}">
      <span class="zeile-text">
        <span class="zeile-name">${esc(z.name)}</span>
        ${form ? `<span class="zeile-info">${esc(form)}</span>` : ''}
      </span>
      <span class="zeile-menge">
        <span class="menge">${esc(a.menge)}</span>
        ${a.gebinde ? `<span class="zeile-info">${esc(a.gebinde)}</span>` : ''}
      </span>
    </button></li>`;
}

// Hülsenfrüchte mit mehreren Formen: eine Zeile, Formen im Bearbeiten-Fenster getrennt.
function gruppenZeile(name, formen) {
  const vorhanden = formen.filter((z) => app.bestand.vorrat[z.id] > 0)
    .map((z) => `${z.lagerform} ${vorratAnzeige(app.bestand.vorrat[z.id], z).menge}`);
  const info = vorhanden.length ? vorhanden.join(' · ') : formen.map((z) => z.lagerform).join(' · ');
  return `
    <li><button class="zeile${vorhanden.length ? '' : ' ist-leer'}" data-aktion="zutat"
        data-ids="${esc(formen.map((z) => z.id).join(','))}" data-titel="${esc(name)}">
      <span class="zeile-text">
        <span class="zeile-name">${esc(name)}</span>
        <span class="zeile-info">${esc(info)}</span>
      </span>
      ${vorhanden.length ? '' : '<span class="zeile-menge"><span class="menge">leer</span></span>'}
    </button></li>`;
}

function fertiggerichteKarte() {
  const zeilen = app.bestand.fertiggerichte.map((f) => `
    <li><button class="zeile${f.anzahl ? '' : ' ist-leer'}" data-aktion="fertiggericht" data-id="${esc(f.id)}">
      <span class="zeile-text"><span class="zeile-name">${esc(f.name)}</span></span>
      <span class="zeile-menge"><span class="menge">${esc(anzahlText(f.anzahl, f.einheit))}</span></span>
    </button></li>`);
  return `
    <section class="karte kat-fertig">
      <h2 class="karte-titel"><span class="punkt"></span>Fertiggerichte
        <span class="titel-zusatz">direkt essbar</span></h2>
      <ul class="liste">
        ${zeilen.join('')}
        <li><button class="zeile zeile-neu" data-aktion="fertiggericht-neu">+ Fertiggericht hinzufügen</button></li>
      </ul>
    </section>`;
}

function grundvorratKarte() {
  const eintraege = [...app.katalog.grundvorrat.values()];
  const da = eintraege.filter((g) => app.bestand.grundvorrat[g.id]).length;
  const liste = eintraege.map((g) => `
    <li><label class="zeile schalter-zeile">
      <span class="zeile-name">${esc(g.name)}</span>
      <input type="checkbox" class="schalter" data-aktion="grundvorrat" data-id="${esc(g.id)}"
        ${app.bestand.grundvorrat[g.id] ? 'checked' : ''}>
    </label></li>`);
  return `
    <section class="karte">
      <button class="karte-titel klappe" data-aktion="grundvorrat-klappe" aria-expanded="${app.grundvorratOffen}">
        Grundvorrat <span class="titel-zusatz">${da} von ${eintraege.length} vorhanden</span><span class="pfeil"></span>
      </button>
      ${app.grundvorratOffen ? `<ul class="liste">${liste.join('')}</ul>` : ''}
    </section>`;
}

// ------------------------------------------------------------------ Sheets

function renderSheet() {
  const s = app.sheet;
  document.body.classList.toggle('sheet-offen', Boolean(s));
  if (!s) {
    $('#sheet').innerHTML = '';
    return;
  }
  $('#sheet').innerHTML = s.art === 'zutaten' ? zutatenSheet(s) : fertiggerichtSheet(s);
}

function sheetRahmen(titel, untertitel, inhalt, knoepfe) {
  return `
    <div class="sheet-hintergrund" data-aktion="schliessen"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-titel">
      <div class="sheet-griff"></div>
      <h2 id="sheet-titel">${esc(titel)}</h2>
      ${untertitel ? `<p class="sheet-untertitel">${esc(untertitel)}</p>` : ''}
      <div class="sheet-inhalt">${inhalt}</div>
      <div class="sheet-knoepfe">${knoepfe}</div>
    </div>`;
}

function oeffneZutaten(ids, titel) {
  app.sheet = {
    art: 'zutaten',
    ids,
    titel: titel ?? app.katalog.zutaten.get(ids[0]).name,
    entwurf: Object.fromEntries(ids.map((id) => [id, app.bestand.vorrat[id]])),
  };
  renderSheet();
}

// Schritt der Schnellknöpfe: ein Gebinde, sonst 1 Stück oder 100 g/ml.
function schnellSchritt(z) {
  if (z.gebinde) return { menge: z.gebinde.menge, text: `1 ${z.gebinde.name}` };
  if (z.einheit === 'Stück') return { menge: 1, text: '1' };
  return { menge: 100, text: formatMenge(100, z.einheit) };
}

function zutatenSheet(s) {
  const mehrere = s.ids.length > 1;
  const felder = s.ids.map((id) => {
    const z = app.katalog.zutaten.get(id);
    const schritt = schnellSchritt(z);
    const hinweise = [
      z.gebinde ? `1 ${z.gebinde.name} = ${formatMenge(z.gebinde.menge, z.einheit)}` : '',
      z.hinweis ?? '',
    ].filter(Boolean).join(' · ');
    return `
      <div class="feld">
        ${mehrere ? `<span class="feld-titel">${esc(z.name)}</span>` : ''}
        ${hinweise ? `<p class="klein">${esc(hinweise)}</p>` : ''}
        <div class="eingabe-zeile">
          <input class="zahl" type="text" inputmode="${z.einheit === 'Stück' ? 'numeric' : 'decimal'}"
            autocomplete="off" data-feld="menge" data-id="${esc(id)}" value="${esc(zahlText(s.entwurf[id]))}"
            aria-label="Menge ${esc(z.name)} in ${esc(z.einheit)}">
          <span class="einheit">${esc(z.einheit)}</span>
          <span class="gebinde-info" data-info="${esc(id)}">${esc(vorratAnzeige(s.entwurf[id], z).gebinde ?? '')}</span>
        </div>
        <div class="schnell">
          <button data-aktion="aendern" data-id="${esc(id)}" data-delta="${-schritt.menge}">− ${esc(schritt.text)}</button>
          <button data-aktion="aendern" data-id="${esc(id)}" data-delta="${schritt.menge}">+ ${esc(schritt.text)}</button>
          <button data-aktion="leeren" data-id="${esc(id)}">Leer</button>
        </div>
      </div>`;
  });
  const erste = app.katalog.zutaten.get(s.ids[0]);
  const untertitel = mehrere ? 'Jede Form wird getrennt geführt.' : erste.lagerform;
  return sheetRahmen(s.titel, untertitel, felder.join(''), `
    <button class="knopf knopf-zweit" data-aktion="schliessen">Abbrechen</button>
    <button class="knopf" data-aktion="uebernehmen">Übernehmen</button>`);
}

function oeffneFertiggericht(id) {
  const vorhandenes = app.bestand.fertiggerichte.find((f) => f.id === id);
  const neu = { id: `fg-${Date.now().toString(36)}`, name: '', einheit: 'Portionen', anzahl: 1 };
  app.sheet = { art: 'fertiggericht', neu: !vorhandenes, entwurf: { ...(vorhandenes ?? neu) } };
  renderSheet();
}

function fertiggerichtSheet(s) {
  const f = s.entwurf;
  const einheiten = ['Portionen', 'Stück'].map((e) => `
    <button role="radio" aria-checked="${f.einheit === e}" data-aktion="fg-einheit" data-wert="${e}">${e}</button>`);
  const inhalt = `
    <label class="feld">
      <span class="feld-titel">Name</span>
      <input class="text" type="text" data-feld="name" value="${esc(f.name)}" maxlength="40"
        placeholder="z. B. Gemüsesuppe" autocomplete="off">
    </label>
    <div class="feld">
      <span class="feld-titel">Anzahl</span>
      <div class="stepper">
        <button data-aktion="fg-anzahl" data-delta="-1" aria-label="Eins weniger">−</button>
        <span class="stepper-wert" aria-live="polite">${f.anzahl}</span>
        <button data-aktion="fg-anzahl" data-delta="1" aria-label="Eins mehr">+</button>
      </div>
      <div class="segment" role="radiogroup" aria-label="Einheit">${einheiten.join('')}</div>
    </div>
    ${s.neu ? '' : '<button class="link-gefahr" data-aktion="fg-loeschen">Fertiggericht entfernen</button>'}`;
  return sheetRahmen(s.neu ? 'Neues Fertiggericht' : f.name, 'Direkt essbar, wird in Stück oder Portionen gezählt.', inhalt, `
    <button class="knopf knopf-zweit" data-aktion="schliessen">Abbrechen</button>
    <button class="knopf" data-aktion="uebernehmen" ${f.name.trim() ? '' : 'disabled'}>${s.neu ? 'Hinzufügen' : 'Übernehmen'}</button>`);
}

function uebernehmen() {
  const s = app.sheet;
  if (s.art === 'zutaten') {
    const ungueltig = document.querySelector('.sheet .ungueltig');
    if (ungueltig) {
      ungueltig.focus();
      return;
    }
    const neu = s.ids.reduce((b, id) => setzeMenge(b, id, s.entwurf[id]), app.bestand);
    app.sheet = null;
    aendereBestand(neu);
  } else {
    const name = s.entwurf.name.trim();
    if (!name) return;
    app.sheet = null;
    aendereBestand(fertiggerichtSpeichern(app.bestand, { ...s.entwurf, name }));
  }
}

// ---------------------------------------------------------------- Aktionen

function ladeTestbestand() {
  if (!vorratIstLeer() && !confirm('Den aktuellen Vorrat durch den Testbestand ersetzen?')) return;
  aendereBestand(bestandAbgleichen(structuredClone(app.testbestand), app.katalog));
}

document.addEventListener('click', (ereignis) => {
  const el = ereignis.target.closest('[data-aktion]');
  if (!el) return;
  const s = app.sheet;
  switch (el.dataset.aktion) {
    case 'tab':
      app.tab = el.dataset.tab;
      app.sheet = null;
      render();
      window.scrollTo(0, 0);
      break;
    case 'zutat':
      oeffneZutaten(el.dataset.ids.split(','), el.dataset.titel);
      break;
    case 'aendern': {
      const z = app.katalog.zutaten.get(el.dataset.id);
      const neu = s.entwurf[z.id] + Number(el.dataset.delta);
      s.entwurf[z.id] = Math.max(0, Math.round(neu * 100) / 100);
      renderSheet();
      break;
    }
    case 'leeren':
      s.entwurf[el.dataset.id] = 0;
      renderSheet();
      break;
    case 'uebernehmen':
      uebernehmen();
      break;
    case 'schliessen':
      app.sheet = null;
      renderSheet();
      break;
    case 'grundvorrat-klappe':
      app.grundvorratOffen = !app.grundvorratOffen;
      render();
      break;
    case 'fertiggericht':
      oeffneFertiggericht(el.dataset.id);
      break;
    case 'fertiggericht-neu':
      oeffneFertiggericht(null);
      break;
    case 'fg-anzahl':
      s.entwurf.anzahl = Math.max(0, s.entwurf.anzahl + Number(el.dataset.delta));
      renderSheet();
      break;
    case 'fg-einheit':
      s.entwurf.einheit = el.dataset.wert;
      renderSheet();
      break;
    case 'fg-loeschen':
      if (confirm(`„${s.entwurf.name}“ aus den Fertiggerichten entfernen?`)) {
        app.sheet = null;
        aendereBestand(fertiggerichtEntfernen(app.bestand, s.entwurf.id));
      }
      break;
    case 'testbestand':
      ladeTestbestand();
      break;
    default:
      break;
  }
});

document.addEventListener('change', (ereignis) => {
  const el = ereignis.target;
  if (el.dataset.aktion === 'grundvorrat') {
    aendereBestand(setzeGrundvorrat(app.bestand, el.dataset.id, el.checked));
  }
});

document.addEventListener('input', (ereignis) => {
  const el = ereignis.target;
  const s = app.sheet;
  if (!s) return;
  if (el.dataset.feld === 'menge') {
    const z = app.katalog.zutaten.get(el.dataset.id);
    const wert = leseZahl(el.value);
    el.classList.toggle('ungueltig', wert === null);
    if (wert === null) return;
    s.entwurf[z.id] = z.einheit === 'Stück' ? Math.round(wert) : wert;
    $(`[data-info="${z.id}"]`).textContent = vorratAnzeige(s.entwurf[z.id], z).gebinde ?? '';
  } else if (el.dataset.feld === 'name') {
    s.entwurf.name = el.value;
    $('.sheet [data-aktion="uebernehmen"]').disabled = !el.value.trim();
  }
});

document.addEventListener('keydown', (ereignis) => {
  if (ereignis.key === 'Escape' && app.sheet) {
    app.sheet = null;
    renderSheet();
  }
});

// ------------------------------------------------------------------- Start

async function start() {
  const lade = async (datei) => {
    const antwort = await fetch(`daten/${datei}`);
    if (!antwort.ok) throw new Error(`${datei}: ${antwort.status}`);
    return antwort.json();
  };
  try {
    const [zutaten, rezepte, testbestand] = await Promise.all(
      ['zutaten.json', 'rezepte.json', 'testbestand.json'].map(lade));
    app.katalog = erstelleKatalog(zutaten);
    app.rezepte = rezepte.rezepte;
    app.testbestand = testbestand;
  } catch (fehler) {
    $('#inhalt').innerHTML = `<p class="banner">Kombi konnte nicht geladen werden (${esc(fehler.message)}).</p>`;
    return;
  }
  app.bestand = bestandAbgleichen(ladeGespeichert(), app.katalog);
  render();
}

start();
