# Kombi V2

Einfache Vorrats- und Rezept-App für den eigenen Haushalt: Aus wenigen Bausteinen
(🔴 Basis · 🟤 Protein · 🟢 Gemüse · 🟡 Sattmacher) zeigt Kombi, welche Gerichte
mit dem tatsächlichen Vorrat möglich sind.

Web-App für den iPhone-Home-Bildschirm, nur HTML, CSS und JavaScript, ohne Server
und ohne Konten. Der Vorrat bleibt lokal auf dem Gerät.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `daten/zutaten.json` | Zutatenkatalog: Kategorie, Lagerform, Einheit, Gebindegröße, Grundvorrat |
| `daten/rezepte.json` | Die festen Rezepte für 2 Personen, gegliedert in farbige Plätze mit erlaubten Optionen |
| `daten/testbestand.json` | Realistischer Beispielvorrat zum Testen (gleiches Format wie der gespeicherte Vorrat) |
| `js/logik.js` | Rechenlogik ohne Oberfläche: Einheiten, Personenanpassung, Rezeptprüfung, Verbrauch |
| `tests/` | Automatische Prüfungen der Daten und der Rechenlogik |

## Rezeptformat

Ein Rezept besteht aus **Plätzen** (Rot, Braun, Grün, Gelb, Extra). Jeder Platz ist
Pflicht oder optional und nennt eine oder mehrere erlaubte Zutaten mit fester Menge.
Mehrere Optionen bedeuten „eine davon genügt“, z. B. Kichererbsen aus der Dose
**oder** gekocht. Eine Form, die nicht genannt ist, setzt die App nie voraus.

Spätere Kombi-Vorlagen nutzen dasselbe Format, nur mit mehr Auswahl je Platz.

## Tests

```sh
npm test
```

Die Datenprüfung stellt u. a. sicher, dass jede Rezeptzutat im Katalog existiert,
dieselbe Einheit wie der Vorrat verwendet und jede Katalogzutat in einem Rezept
vorkommt.
