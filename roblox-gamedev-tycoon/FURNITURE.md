# Möbelkatalog

`src/ReplicatedStorage/Shared/FurnitureCatalog.lua` enthält alle Möbel mit Größe, Freischalt-Stufe, Maximalanzahl und Vorteilen.

## So entsteht der Preis

`Wert = Summe(Gewicht × Bonus)`, `Preis = 3 × Wert^1,2`, gerundet auf zwei gültige Stellen.
Der Exponent 1,2 macht starke Möbel überproportional teurer. Gewichte, Obergrenzen und Exponent stehen oben im Modul.

- Weitere gleiche Möbel bringen nur noch 60 % des vorherigen. Arbeitsplätze zählen immer voll.
- Die Summe jedes Vorteils hat eine Obergrenze (`STAT_CAPS`).
- `FurnitureCatalog.totalEffects({ wood_desk = 3, plant = 2 })` rechnet den Gesamtbonus eines Raums aus.

## Vorteile

| Wert | Bedeutung |
|---|---|
| seats | Arbeitsplätze (ein Mitarbeiter pro Platz) |
| codeSpeed / designSpeed / soundSpeed | % schnellere Entwicklung im jeweiligen Bereich |
| allSpeed | % auf alle drei Bereiche |
| bugReduction | % weniger Bugs im fertigen Spiel |
| morale | Moral-Punkte |
| research | % mehr Forschungspunkte |
| fame | Ruhm pro Tag |

Die Namen sind Platzhalter. Heißen sie in deinem MVP anders, ändere sie nur in `STAT_WEIGHTS`, `STAT_CAPS` und in den Möbel-Einträgen.

## Aktuelle Preise (Stand der Formel)

| Stufe | Kategorie | Möbel | Größe | Max | Vorteile | Preis |
|---|---|---|---|---|---|---|
| Garage | Stuhl | Klappstuhl | 1x1 | 6 | morale+1 | $26 |
| Garage | Komfort | Zimmerpflanze | 1x1 | 6 | morale+2 | $59 |
| Garage | Arbeitsplatz | Klapptisch | 2x1 | 6 | seats+1 | $77 |
| Garage | Ruhm | Retro-Poster | 1x1 | 8 | fame+1 morale+1 | $96 |
| Garage | Technik | Gebrauchter Test-Laptop | 1x1 | 3 | bugReduction+5 | $140 |
| Garage | Komfort | Mini-Kühlschrank | 1x1 | 2 | morale+4 | $140 |
| Garage | Wissen | Bücherregal | 1x1 | 4 | research+5 | $140 |
| Garage | Arbeitsplatz | Holz-Schreibtisch | 2x1 | 8 | seats+1 allSpeed+2 | $210 |
| Garage | Komfort | Kaffeemaschine | 1x1 | 3 | morale+5 allSpeed+2 | $330 |
| Keller | Stuhl | Bürostuhl | 1x1 | 12 | allSpeed+1 morale+3 | $160 |
| Keller | Komfort | Sofa | 2x1 | 3 | morale+7 | $270 |
| Keller | Wissen | Whiteboard | 2x1 | 3 | allSpeed+3 bugReduction+3 | $290 |
| Keller | Technik | Grafiktablett-Ecke | 1x1 | 4 | designSpeed+12 | $310 |
| Keller | Technik | Mikrofon-Ecke | 2x1 | 3 | soundSpeed+15 | $410 |
| Keller | Arbeitsplatz | Höhenverstellbarer Tisch | 2x1 | 10 | seats+1 allSpeed+5 morale+3 | $600 |
| Büro | Ruhm | Pokal-Vitrine | 1x1 | 3 | fame+4 | $310 |
| Büro | Komfort | Klimaanlage | 1x1 | 2 | morale+6 allSpeed+2 | $380 |
| Büro | Technik | Server-Rack | 1x2 | 3 | codeSpeed+8 allSpeed+3 | $420 |
| Büro | Komfort | Kickertisch | 2x1 | 2 | morale+10 fame+1 | $510 |
| Büro | Technik | Testgeräte-Wand | 2x1 | 2 | bugReduction+15 | $530 |
| Büro | Stuhl | Ergonomischer Stuhl | 1x1 | 12 | allSpeed+3 morale+6 bugReduction+2 | $540 |
| Büro | Arbeitsplatz | Dual-Monitor-Arbeitsplatz | 2x1 | 12 | seats+1 codeSpeed+12 designSpeed+6 | $640 |
| Großraumbüro | Wissen | Forschungs-Labortisch | 2x1 | 3 | research+15 | $530 |
| Großraumbüro | Stuhl | Gaming-Stuhl | 1x1 | 12 | morale+8 designSpeed+4 fame+1 | $540 |
| Großraumbüro | Technik | Synthesizer-Setup | 2x1 | 3 | soundSpeed+25 fame+2 | $980 |
| Großraumbüro | Arbeitsplatz | Workstation Pro | 2x2 | 12 | seats+1 codeSpeed+20 designSpeed+20 soundSpeed+10 | $1.900 |
