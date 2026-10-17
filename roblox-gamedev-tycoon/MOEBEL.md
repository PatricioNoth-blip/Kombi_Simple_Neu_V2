# Möbel und Wände: Game-Dev-Tycoon

Entwurf, noch nicht im Spiel umgesetzt. Alles ist von Anfang an kaufbar, es gibt keine Freischalt-Stufen. Gebremst wird nur durch den Preis.

**Preisklassen:** `$` günstig, `$$$$$` Endgame. Die genauen Zahlen berechnet später eine Formel aus den Vorteilen.
**Größe:** noch nicht festgelegt, kommt später. Wände stehen auf den Zellkanten im Grid.

## Möbel

### Arbeitsplätze

| Möbel | Vorteil | Preis |
|---|---|---|
| Klapptisch | 1 Platz | $ |
| Holz-Schreibtisch | 1 Platz, kleines Tempo | $ |
| Steh-Schreibtisch | 1 Platz, Tempo, Moral | $$ |
| Dual-Monitor-Platz | 1 Platz, Technologie, Grafik | $$$ |
| Workstation Pro | 1 Platz, Technologie, Design und Sound stark | $$$$$ |

### Stühle

| Möbel | Vorteil | Preis |
|---|---|---|
| Klappstuhl | Moral klein | $ |
| Bürostuhl | Tempo, Moral | $$ |
| Ergonomischer Stuhl | Tempo, Moral, weniger Stress (weniger Bugs) | $$$ |
| Gaming-Stuhl | Moral stark, Grafik, Ruhm | $$$ |

### Technik und Design

| Möbel | Vorteil | Preis |
|---|---|---|
| Server-Rack | Technologie, Tempo | $$$ |
| Grafiktablett-Ecke | Grafik | $$ |
| Moodboard-Tafel | Welt und Atmosphäre | $$$ |
| Storyboard-Tisch | Story und Dialoge | $$$ |
| Gameplay-Prototyp-Tisch | Spielmechanik und Level | $$$ |

### Sound

| Möbel | Vorteil | Preis |
|---|---|---|
| Mikrofon-Ecke | Sound | $$ |
| Synthesizer-Setup | Sound stark, Ruhm | $$$$ |
| Aufnahmekabine | Sound sehr stark | $$$$$ |

### Qualität (Bugs früher sehen)

| Möbel | Vorteil | Preis |
|---|---|---|
| Alter Test-Laptop | grobe Schätzung der Bugs vor dem Release | $ |
| Testgeräte-Wand | genauere Schätzung | $$$ |
| QA-Tisch | genaue Bug-Zahl | $$$ |

### Forschung

| Möbel | Vorteil | Preis |
|---|---|---|
| Bücherregal | Forschung | $ |
| Lernplatz | Mitarbeiter lernen schneller | $$ |
| Forschungs-Labortisch | Forschung stark | $$$$ |
| Hardware-Lab-Werkbank | schaltet Konsolen-Entwicklung frei | $$$$$ |

### Stimmung der Mitarbeiter

| Möbel | Vorteil | Preis |
|---|---|---|
| Zimmerpflanze | Moral | $ |
| Mini-Kühlschrank | Moral | $ |
| Kaffeemaschine | Moral, Tempo | $$ |
| Sofa | Moral stark | $$ |
| Kickertisch | Moral sehr stark, Ruhm | $$$ |
| Klimaanlage | Moral, Tempo | $$$ |
| Ruheraum-Kapsel | Moral sehr stark, baut Erschöpfung ab | $$$$ |

### Ruhm und Hype

| Möbel | Vorteil | Preis |
|---|---|---|
| Retro-Poster | Ruhm klein | $ |
| Pokal-Vitrine | Ruhm | $$$ |
| Marketing-Tisch | Hype | $$$$ |
| Award-Regal | Ruhm stark, wächst mit gewonnenen Preisen | $$$$$ |

## Wände (auf den Zellkanten)

| Wand | Vorteil | Preis |
|---|---|---|
| Betonwand | Standard, kein Bonus | gratis |
| Wandfarbe / Tapete | Moral | $ |
| Backsteinwand (Retro) | Ruhm, Stil | $$ |
| Akustikpaneele | Sound, weniger Störungen | $$ |
| Whiteboard-Wand | Planung, Tempo | $$ |
| Regalwand | Forschung | $$ |
| Fenster | Moral, Tageslicht | $$ |
| Bug-Board (Kanban-Pinnwand) | zeigt Bugs genauer an, wirkt zusammen mit dem QA-Tisch | $$$ |
| Fan-Wand | Hype beim Start | $$$ |
| Glas-Trennwand | teilt Räume ab, Boni zählen pro Raum | $$$ |
| Schalldichte Trennwand | wie Glas, dazu Sound | $$$$ |

## Vorteile im Überblick

| Vorteil | Möbel | Wände |
|---|---|---|
| Arbeitsplätze | Klapptisch, Holz-Schreibtisch, Steh-Schreibtisch, Dual-Monitor-Platz, Workstation Pro | – |
| Tempo | Holz-Schreibtisch, Steh-Schreibtisch, Bürostuhl, Ergonomischer Stuhl, Server-Rack, Kaffeemaschine, Klimaanlage | Whiteboard-Wand |
| Technologie | Dual-Monitor-Platz, Workstation Pro, Server-Rack | – |
| Grafik | Grafiktablett-Ecke, Dual-Monitor-Platz, Gaming-Stuhl, Workstation Pro | – |
| Welt und Atmosphäre | Moodboard-Tafel | – |
| Story und Dialoge | Storyboard-Tisch | – |
| Spielmechanik und Level | Gameplay-Prototyp-Tisch | – |
| Sound | Mikrofon-Ecke, Synthesizer-Setup, Aufnahmekabine, Workstation Pro | Akustikpaneele, Schalldichte Trennwand |
| Bugs früher sehen | Alter Test-Laptop, Testgeräte-Wand, QA-Tisch | Bug-Board |
| Weniger Stress (weniger Bugs) | Ergonomischer Stuhl, Ruheraum-Kapsel | Fenster |
| Forschung | Bücherregal, Forschungs-Labortisch, Hardware-Lab-Werkbank | Regalwand |
| Mitarbeiter lernen schneller | Lernplatz | – |
| Moral | Klappstuhl, Bürostuhl, Ergonomischer Stuhl, Gaming-Stuhl, Steh-Schreibtisch, Zimmerpflanze, Mini-Kühlschrank, Kaffeemaschine, Sofa, Kickertisch, Klimaanlage, Ruheraum-Kapsel | Wandfarbe / Tapete, Fenster |
| Ruhm | Gaming-Stuhl, Synthesizer-Setup, Kickertisch, Retro-Poster, Pokal-Vitrine, Award-Regal | Backsteinwand |
| Hype | Marketing-Tisch | Fan-Wand |
| Räume abteilen | – | Glas-Trennwand, Schalldichte Trennwand |

## Raumboni (Idee)

Wenn passende Möbel im selben abgetrennten Raum stehen, gibt es einen Zusatzbonus.

| Raum | Dazu gehört | Bonus |
|---|---|---|
| Technik-Ecke | Server-Rack, Dual-Monitor-Platz, Kaffeemaschine | Technologie +10 % |
| Kreativ-Ecke | Grafiktablett-Ecke, Moodboard-Tafel, Sofa | Design +10 % |
| Sound-Studio | Mikrofon-Ecke, Aufnahmekabine, Akustikpaneele | Sound +10 % |
| QA-Abteilung | Testgeräte-Wand, QA-Tisch, Bug-Board | Bugs werden genauer angezeigt |
| Gemütliche Ecke | Sofa, Zimmerpflanze, Kickertisch | Moral +10 % |

## Offen

- Genaue Preisformel und Zahlenwerte (Richtung: überproportional teurer bei stärkerem Vorteil).
- Wie viele gleiche Möbel sich lohnen (mögliche Regel: jedes weitere bringt weniger).
- Wie ein Raum erkannt wird, wenn Wände nur teilweise geschlossen sind.
- Der frühere Entwurf `FURNITURE.md` samt `FurnitureCatalog.lua` stammt von einer älteren Liste und ist durch dieses Dokument überholt.
