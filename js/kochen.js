// Kombi V2 – Kochen-Bildschirm und Rezeptdetail (nur Darstellung)
//
// Beide Ansichten rechnen nicht selbst, sondern zeigen die Ergebnisse von
// pruefeAlle bzw. pruefeGericht aus logik.js.

import { pruefeAlle, pruefeGericht, formatMenge, tageSeit } from './logik.js';
import { esc, anzahlText, personenRegler } from './html.js';

const zutatName = (app, id) => app.katalog.zutaten.get(id).name;
const rolle = (app, kategorie) => app.katalog.kategorien.find((k) => k.id === kategorie).rolle;

// Fehlende Mengen nie kleiner anzeigen, als sie sind.
const fehlMenge = (f) => formatMenge(Math.ceil(f.fehlt), f.einheit, { runden: false });

function zuletztText(app, rezeptId) {
  const datum = app.bestand.zuletztGekocht[rezeptId];
  if (!datum) return '';
  const tage = tageSeit(datum);
  if (tage <= 0) return 'heute gekocht';
  if (tage === 1) return 'gestern gekocht';
  return `vor ${tage} Tagen gekocht`;
}

function fehltListe(app, ergebnis) {
  return ergebnis.fehlt.map((f) => (f.art === 'zutat'
    ? `${fehlMenge(f)} ${zutatName(app, f.zutat)}`
    : f.name));
}

function vorbereitungListe(app, ergebnis) {
  return ergebnis.vorbereitung.map((v) =>
    `${formatMenge(v.bedarf, v.einheit)} ${zutatName(app, v.zutat)} – ${v.text}`);
}

// ------------------------------------------------------------- Übersicht

export function kochenAnsicht(app) {
  const e = pruefeAlle(app.rezepte, app.bestand, app.katalog, app.personen, app.auswahl);
  const leer = Object.values(app.bestand.vorrat).every((m) => m === 0);
  return `
    <header class="kopf"><h1>Kochen</h1></header>
    ${personenRegler(app.personen)}
    ${leer ? leerHinweis() : ''}
    ${ohneKochen(app)}
    ${gruppe(app, 'Jetzt möglich', e.jetzt, 'jetzt')}
    ${gruppe(app, 'Nach Vorbereitung möglich', e.vorbereitung, 'vorbereitung')}
    ${gruppe(app, 'Fehlt etwas', e.fehlt, 'fehlt')}`;
}

function leerHinweis() {
  return `
    <section class="karte hinweis-karte">
      <p><strong>Noch kein Vorrat eingetragen.</strong></p>
      <p>Trage deinen Vorrat ein – oder probiere Kombi mit dem Testbestand aus.</p>
      <button class="knopf" data-aktion="testbestand">Testbestand laden</button>
    </section>`;
}

function ohneKochen(app) {
  const da = app.bestand.fertiggerichte.filter((f) => f.anzahl > 0);
  if (!da.length) return '';
  const chips = da.map((f) =>
    `<span class="fertig-chip">${esc(f.name)}<span>${esc(anzahlText(f.anzahl, f.einheit))}</span></span>`);
  return `
    <section class="karte kat-fertig ohne-kochen">
      <h2 class="karte-titel"><span class="punkt"></span>Ohne Kochen</h2>
      <div class="fertig-liste">${chips.join('')}</div>
    </section>`;
}

function gruppe(app, titel, ergebnisse, art) {
  if (!ergebnisse.length) return '';
  return `
    <h2 class="gruppe-titel gruppe-${art}">${titel} <span class="anzahl">${ergebnisse.length}</span></h2>
    <section class="karte"><ul class="liste">${ergebnisse.map((e) => rezeptZeile(app, e, art)).join('')}</ul></section>`;
}

function punkte(bausteine) {
  const punkt = (k, optional) => `<i class="kat-${k}${optional ? ' optional' : ''}"></i>`;
  return `<span class="punkte" aria-hidden="true">${[
    ...bausteine.pflicht.map((k) => punkt(k, false)),
    ...bausteine.optional.map((k) => punkt(k, true)),
  ].join('')}</span>`;
}

function rezeptZeile(app, e, art) {
  const rezept = app.rezepte.find((r) => r.id === e.rezept);
  const info = [rezept.zeit, zuletztText(app, e.rezept)].filter(Boolean).join(' · ');
  let zusatz = '';
  if (art === 'vorbereitung') {
    zusatz = `<span class="zeile-info info-vorbereitung">Vorher: ${esc(vorbereitungListe(app, e).join(' · '))}</span>`;
  } else if (art === 'fehlt') {
    zusatz = `<span class="zeile-info info-fehlt">Fehlt: ${esc(fehltListe(app, e).join(' · '))}</span>`;
  }
  return `
    <li><button class="zeile rezept-zeile" data-aktion="rezept" data-id="${esc(e.rezept)}">
      <span class="zeile-text">
        <span class="zeile-name">${esc(e.name)}</span>
        <span class="zeile-info">${punkte(e.bausteine)}${esc(info)}</span>
        ${zusatz}
      </span>
    </button></li>`;
}

// ------------------------------------------------------------ Rezeptdetail

export function rezeptAnsicht(app, rezeptId) {
  const rezept = app.rezepte.find((r) => r.id === rezeptId);
  const e = pruefeGericht(rezept, app.bestand, app.katalog, app.personen, app.auswahl[rezeptId]);
  const info = [rezept.zeit, zuletztText(app, rezeptId)].filter(Boolean).join(' · ');
  return `
    <button class="zurueck" data-aktion="zurueck">Kochen</button>
    <header class="rezept-kopf">
      <h1>${esc(rezept.name)}</h1>
      <p class="rezept-info">${esc(info)}</p>
    </header>
    ${bausteinChips(app, e)}
    ${statusKarte(app, e)}
    ${personenRegler(app.personen)}
    ${zutatenKarte(app, rezept, e)}
    <h2 class="gruppe-titel">Zubereitung</h2>
    <section class="karte"><ol class="schritte">${rezept.schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>
    ${rezept.hinweise.length ? `<section class="hinweise">${rezept.hinweise.map((h) => `<p>${esc(h)}</p>`).join('')}</section>` : ''}`;
}

function bausteinChips(app, e) {
  const chip = (k, optional) => `
    <span class="baustein kat-${k}${optional ? ' optional' : ''}"><span class="punkt"></span>${esc(rolle(app, k))}${optional ? ' (optional)' : ''}</span>`;
  return `<div class="bausteine">${[
    ...e.bausteine.pflicht.map((k) => chip(k, false)),
    ...e.bausteine.optional.map((k) => chip(k, true)),
  ].join('')}</div>`;
}

function statusKarte(app, e) {
  const personen = `${e.personen} ${e.personen === 1 ? 'Person' : 'Personen'}`;
  if (e.status === 'jetzt') {
    return `<section class="status status-jetzt"><strong>Jetzt möglich</strong>Alles da für ${personen}.</section>`;
  }
  if (e.status === 'vorbereitung') {
    return `<section class="status status-vorbereitung"><strong>Nach Vorbereitung möglich</strong>
      Alles da für ${personen}, vorher:<ul>${vorbereitungListe(app, e).map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`;
  }
  const zeilen = e.fehlt.map((f) => (f.art === 'zutat'
    ? `${fehlMenge(f)} ${zutatName(app, f.zutat)} (${formatMenge(f.vorhanden, f.einheit, { runden: false })} da, ${formatMenge(f.bedarf, f.einheit, { runden: false })} nötig)`
    : `${f.name} (im Grundvorrat ausgeschaltet)`));
  return `<section class="status status-fehlt"><strong>Fehlt etwas</strong>
    Für ${personen} fehlt:<ul>${zeilen.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`;
}

function zutatStatus(p) {
  const da = formatMenge(p.vorhanden, p.einheit, { runden: false });
  if (!p.pflicht) {
    return p.reicht ? { klasse: '', text: `optional · vorhanden (${da})` } : { klasse: '', text: 'optional · nicht genug da' };
  }
  if (p.reicht) return { klasse: 'ok', text: `vorhanden (${da})` };
  return { klasse: 'fehlt', text: `fehlt ${formatMenge(Math.ceil(p.fehlt), p.einheit, { runden: false })} (${da} da)` };
}

function zutatZeile(app, rezept, p) {
  const s = zutatStatus(p);
  const chips = p.optionen.length > 1 ? `
    <div class="chips" role="group" aria-label="Auswahl">
      ${p.optionen.map((o) => `
        <button class="chip${o.reicht ? '' : ' knapp'}" data-aktion="wahl" data-rezept="${esc(rezept.id)}"
          data-platz="${p.platz}" data-option="${o.option}" aria-pressed="${o.option === p.option}">
          ${esc(zutatName(app, o.zutat))}${o.reicht ? '' : ' · zu wenig'}</button>`).join('')}
    </div>` : '';
  return `
    <li class="zutat">
      <div class="zutat-kopf">
        <span class="punkt kat-${p.kategorie}${p.pflicht ? '' : ' optional'}"></span>
        <span class="zutat-name">${esc(zutatName(app, p.zutat))}${p.platzHinweis ? ` <span class="zeile-info">${esc(p.platzHinweis)}</span>` : ''}</span>
        <span class="zutat-menge">${esc(formatMenge(p.bedarf, p.einheit))}</span>
      </div>
      <div class="zutat-status ${s.klasse}">${esc(s.text)}</div>
      ${chips}
      ${p.vorbereitung ? `<p class="zutat-hinweis">Vorbereitung: ${esc(p.vorbereitung)}</p>` : ''}
      ${p.hinweis ? `<p class="zutat-hinweis">${esc(p.hinweis)}</p>` : ''}
    </li>`;
}

function grundvorratZeile(g) {
  const status = g.vorhanden
    ? { klasse: g.optional ? '' : 'ok', text: g.optional ? 'optional · vorhanden' : 'vorhanden' }
    : { klasse: g.optional ? '' : 'fehlt', text: g.optional ? 'optional · ausgeschaltet' : 'fehlt (im Grundvorrat ausgeschaltet)' };
  return `
    <li class="zutat ohne-punkt">
      <div class="zutat-kopf">
        <span class="zutat-name">${esc(g.name)}</span>
        <span class="zutat-menge">${g.menge === null ? '' : esc(formatMenge(g.menge, g.einheit))}</span>
      </div>
      <div class="zutat-status ${status.klasse}">${esc(status.text)}</div>
    </li>`;
}

function weitereZeile(w) {
  return `
    <li class="zutat ohne-punkt">
      <div class="zutat-kopf">
        <span class="zutat-name">${esc(w.name)}</span>
        <span class="zutat-menge">${esc(formatMenge(w.menge, w.einheit))}</span>
      </div>
      <div class="zutat-status">${w.optional ? 'optional · ' : ''}nicht im Vorrat geführt</div>
    </li>`;
}

function zutatenKarte(app, rezept, e) {
  const plaetze = [...e.plaetze.filter((p) => p.pflicht), ...e.plaetze.filter((p) => !p.pflicht)];
  return `
    <h2 class="gruppe-titel">Zutaten</h2>
    <section class="karte zutaten">
      <ul class="liste">
        ${plaetze.map((p) => zutatZeile(app, rezept, p)).join('')}
        ${e.grundvorrat.length ? `<li class="untertitel">Aus dem Grundvorrat</li>${e.grundvorrat.map(grundvorratZeile).join('')}` : ''}
        ${e.weitere.length ? `<li class="untertitel">Außerdem</li>${e.weitere.map(weitereZeile).join('')}` : ''}
      </ul>
    </section>`;
}
