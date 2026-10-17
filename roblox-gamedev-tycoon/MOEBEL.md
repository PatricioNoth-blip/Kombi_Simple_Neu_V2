# Möbel und Wände: Game-Dev-Tycoon

Entwurf, noch nicht im Spiel umgesetzt. Alles ist von Anfang an kaufbar, es gibt keine Freischalt-Stufen. Gebremst wird nur durch den Preis.

**Preisklassen:** `$` günstig, `$$$$$` Endgame. Die genauen Zahlen berechnet später eine Formel aus den Vorteilen.
**Größe:** Breite × Tiefe in Grid-Zellen. Wände stehen auf den Zellkanten.

## Möbel

### Arbeitsplätze

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Klapptisch | 2×1 | 1 Platz | $ |
| Holz-Schreibtisch | 2×1 | 1 Platz, kleines Tempo | $ |
| Steh-Schreibtisch | 2×1 | 1 Platz, Tempo, Moral | $$ |
| Dual-Monitor-Platz | 2×1 | 1 Platz, Technologie, Grafik | $$$ |
| Workstation Pro | 2×2 | 1 Platz, Technologie, Design und Sound stark | $$$$$ |

### Stühle

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Klappstuhl | 1×1 | Moral klein | $ |
| Bürostuhl | 1×1 | Tempo, Moral | $$ |
| Ergonomischer Stuhl | 1×1 | Tempo, Moral, weniger Stress (weniger Bugs) | $$$ |
| Gaming-Stuhl | 1×1 | Moral stark, Grafik, Ruhm | $$$ |

### Technik und Design

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Server-Rack | 1×2 | Technologie, Tempo | $$$ |
| Grafiktablett-Ecke | 1×1 | Grafik | $$ |
| Moodboard-Tafel | 1×1 | Welt und Atmosphäre | $$$ |
| Storyboard-Tisch | 2×1 | Story und Dialoge | $$$ |
| Gameplay-Prototyp-Tisch | 2×1 | Spielmechanik und Level | $$$ |

### Sound

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Mikrofon-Ecke | 2×1 | Sound | $$ |
| Synthesizer-Setup | 2×1 | Sound stark, Ruhm | $$$$ |
| Aufnahmekabine | 2×2 | Sound sehr stark | $$$$$ |

### Qualität (Bugs früher sehen)

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Alter Test-Laptop | 1×1 | grobe Schätzung der Bugs vor dem Release | $ |
| Testgeräte-Wand | 2×1 | genauere Schätzung | $$$ |
| QA-Tisch | 2×1 | genaue Bug-Zahl | $$$ |

### Forschung

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Bücherregal | 1×1 | Forschung | $ |
| Lernplatz | 2×1 | Mitarbeiter lernen schneller | $$ |
| Forschungs-Labortisch | 2×1 | Forschung stark | $$$$ |
| Hardware-Lab-Werkbank | 2×2 | schaltet Konsolen-Entwicklung frei | $$$$$ |

### Stimmung der Mitarbeiter

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Zimmerpflanze | 1×1 | Moral | $ |
| Mini-Kühlschrank | 1×1 | Moral | $ |
| Kaffeemaschine | 1×1 | Moral, Tempo | $$ |
| Sofa | 2×1 | Moral stark | $$ |
| Kickertisch | 2×1 | Moral sehr stark, Ruhm | $$$ |
| Klimaanlage | 1×1 | Moral, Tempo | $$$ |
| Ruheraum-Kapsel | 1×2 | Moral sehr stark, baut Erschöpfung ab | $$$$ |

### Ruhm und Hype

| Möbel | Größe | Vorteil | Preis |
|---|---|---|---|
| Retro-Poster | 1×1 | Ruhm klein | $ |
| Pokal-Vitrine | 1×1 | Ruhm | $$$ |
| Marketing-Tisch | 2×1 | Hype | $$$$ |
| Award-Regal | 1×1 | Ruhm stark, wächst mit gewonnenen Preisen | $$$$$ |

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
