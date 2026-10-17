# Katalog: Möbel, Studios, Büros und Pokale (Game-Dev-Tycoon)

Arbeitsdokument, noch nicht im Spiel umgesetzt. Hier steht, welche Objekte es gibt, was sie leisten sollen, wie groß sie sind und was in welches Büro passt. Preise und Bonuswerte kommen später.

> **Markierung:** Alles mit **(nicht festgelegt)** ist ein Vorschlag vom 17.10.2026. Es ist abgesprochen, aber noch nicht endgültig und darf sich ändern. Alles ohne Markierung gilt als vereinbart.

## So änderst du den Katalog

- Jede Tabelle ist eine Zeile pro Objekt. Neue Objekte als neue Zeile ergänzen, gestrichene Zeilen löschen.
- Die Spalte **Funktion** beschreibt, was das Objekt im Spiel können soll. In **Notizen** stehen Ideen, offene Fragen oder Änderungswünsche.
- Wenn etwas endgültig ist, entferne die Markierung **(nicht festgelegt)**.
- Wenn du ein Objekt änderst, passe unten die **Zählung** an und trag die Änderung im **Änderungsprotokoll** ein.

## Grundregeln

1. Alles ist kaufbar, **außer Technik**: Serverrack, Doppel-Rack und Hardware-Werkbank müssen erst erforscht werden und brauchen ein bestimmtes Büro. **(nicht festgelegt)**
2. Mitarbeiter haben vier Spezialisierungen: **Programmieren, Bugs, Sound, Design**.
3. **Schreibtische** helfen allen Mitarbeitern gleich. Sie werden ersetzt, nicht aufgewertet.
4. Die Spezialisierung verbessert sich nur über die **Studios** (Ecke, später Studio). Das Studio ersetzt die Ecke, der Bonus gilt für den ganzen Bereich.
5. Kleine Bonus-Objekte (Gummiente, Bücherregal) haben eine Obergrenze pro Büro (siehe Büros). **(nicht festgelegt)**
6. **Technik-Objekte** schalten Systeme frei oder liefern Kapazität. Racks lassen sich bis zur Zahl der Rack-Plätze stapeln.
7. **Pokale** kann man nicht kaufen. Man schaltet sie durch Erfolge frei, sie landen im Inventar.
8. Die Reihenfolge in den Tabs ergibt sich aus dem Preis (aufsteigend).
9. **Boni gelten im ganzen Büro**, egal wo ein Objekt steht. Die Position ist reine Gestaltung. **(nicht festgelegt)**
10. **Komfort und Deko:** keine Stückgrenze, aber der Bonus zählt **pro Sorte nur einmal pro Büro**. Weitere Exemplare sind reine Optik. **(nicht festgelegt)**

## Grid und Größen (nicht festgelegt)

- **1 Kachel = 4×4 Studs.** Hat das Grid im MVP eine andere Kachelgröße, werden alle Größen umgerechnet.
- **Nur vier Größen:** 1×1, 2×1, 2×2 und 3×3. Alles ist in 90°-Schritten drehbar.
- **Gleiche Größe pro Gruppe:** alle Schreibtische 2×2, alle Ecken 2×1, alle Studios 3×3. So lässt sich ein Schreibtisch am selben Platz ersetzen.
- **Drei Ebenen:**
  - **Boden:** belegt Kacheln.
  - **Wand:** belegt Wandplätze an der Außenwand, keine Kacheln. Ein Poster kann über einem Sofa hängen.
  - **Stil:** gilt für das ganze Büro (Wandfarbe, Tapete, Backstein, Beton).
- **Ausnahme Teppich:** liegt unter den Möbeln und blockiert keine Kachel.

| Größe / Platz | Objekte |
|---|---|
| 3×3 | Entwicklungslabor, QA-Labor, Soundstudio, VFX-Studio, Forschungslabor |
| 2×2 | alle 6 Schreibtische (Stuhl gehört dazu) |
| 2×1 | 5 Ecken, Hardware-Werkbank, Doppel-Rack, Sofa, Kickertisch, Schlafnische, Aquarium, Trophäenregal |
| 1×1 | Gummiente (als große Figur), Bücherregal, Serverrack, Kaffeemaschine, Mini-Kühlschrank, Arcade-Automat, Snackautomat, Massagesessel, Wasserspender, Pflanze, Retro-Konsolen-Vitrine, Lavalampe (auf Beistelltisch), einzelner Pokal |
| Wand, 1 Platz | Poster, Gemälde, Klimaanlage |
| Wand, 2 Plätze | Fenster, Neon-Schild, Pflanzenwand, Lichterkette |
| Stil (ganzes Büro) | Betonwand, Tapete / Wandfarbe, Backsteinwand |
| unter Möbeln | Teppich |

## Büros (nicht festgelegt)

Sechs Büros von der Garage bis zur Firmenzentrale. Die Namen sind Arbeitstitel.

| Büro | Kacheln | Fläche | Studs | Wandplätze (ca.) | Schreibtische (= Mitarbeiter) | Extras gesamt | davon Studios | Rack-Plätze | Bücherregal | Gummiente | Hardware-Werkbank | Belegt bei voller Einrichtung |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Garage | 6×5 | 30 | 24×20 | 18 | 2 | 1 | 0 | 0 | 1 | 1 | 0 | 40 % |
| 2 Hinterhofbüro | 8×6 | 48 | 32×24 | 27 | 4 | 2 | 0 | 0 | 2 | 1 | 0 | 48 % |
| 3 Kleines Büro | 12×8 | 96 | 48×32 | 39 | 8 | 3 | 1 | 2 | 2 | 2 | 0 | 55 % |
| 4 Büroetage | 14×10 | 140 | 56×40 | 46 | 12 | 4 | 2 | 4 | 3 | 2 | 1 | 61 % |
| 5 Studio-Loft | 16×14 | 224 | 64×56 | 58 | 20 | 5 | 3 | 6 | 3 | 3 | 1 | 58 % |
| 6 Firmenzentrale | 20×16 | 320 | 80×64 | 70 | 28 | 5 | 5 | 8 | 4 | 3 | 1 | 57 % |

- **Extras** sind Ecken und Studios. Jeder der fünf Bereiche hat höchstens ein Extra (Ecke oder Studio).
- **Belegt** heißt: So viel Fläche brauchen Schreibtische, Extras, Racks, Werkbank und Kleinobjekte, wenn alles bis zur Grenze aufgestellt ist (Racks als Doppel-Racks gerechnet). Der Rest bleibt für Komfort, Deko und Wege.
- **Was jede Stufe bringt:** In Garage und Hinterhofbüro gibt es nur Ecken. Büro 3 bringt das erste Studio und die ersten Racks, Büro 4 die Werkbank, Büro 6 alle fünf Studios.

### Regeln zu den Büros (nicht festgelegt)

- **Mitarbeiter-Grenze:** Jedes Büro hat eine feste Obergrenze für Mitarbeiter. Über die Kacheln allein ginge das nicht, weil man Tische dicht packen könnte. Die Kacheln entscheiden nur, was **zusätzlich** hineinpasst.
- **Ein Schreibtisch pro Mitarbeiter.** Deshalb ist die Grenze für beide dieselbe.
- **Umzug:** Jedes Büro ist in Breite **und** Tiefe größer als das davor. Alle Möbel behalten ihre Position relativ zu einer Ecke und passen garantiert hinein. Danach räumt der Spieler um, wie er will.
- **Studio ersetzt Ecke:** Das Studio (3×3) wird frei aufgestellt, die Ecke desselben Bereichs verschwindet, und man bekommt einen Teil des Preises zurück. Dafür braucht es einen freien Studio-Platz.
- **Rack-Plätze:** Einzel- und Doppel-Rack belegen je einen Platz. Das Doppel-Rack bringt pro Platz mehr Kapazität.
- **Kein freier Platz im Büro:** Das Objekt bleibt im Shop sichtbar und kaufbar, der Shop zeigt "Platz ab Büro X" an.
- **Laufwege werden nicht geprüft.** Mitarbeiter sitzen an ihrem Tisch, es gibt keine Wegfindung.
- **Leistung:** Bei bis zu 28 Mitarbeitern pro Spieler sitzen die Mitarbeiter mit einer kurzen Animation am Tisch. Sie laufen nicht herum, und fremde Grundstücke werden aus der Ferne vereinfacht dargestellt.

## Tabs im Überblick

| Nr. | Tab | Anzahl |
|---|---|---|
| 1 | Arbeitsplätze | 6 |
| 2 | Studios | 12 |
| 3 | Technik | 3 |
| 4 | Wände | 4 |
| 5 | Dekoration | 11 |
| 6 | Komfort | 10 |
| 7 | Inventar (Pokale) | 8 |

**Zählung:** 46 kaufbare Objekte und 8 Pokale.

## Tab 1: Arbeitsplätze

Allgemeine Schreibtische für alle. Stuhl und Bildschirm sind fest dabei. Man ersetzt sie durch bessere.

| Objekt | Größe (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|
| Klapptisch | 2×2 | Start, Grundtempo | |
| Holz-Schreibtisch | 2×2 | etwas mehr Tempo | |
| Büro-Schreibtisch | 2×2 | mehr Tempo, Dual-Monitor | |
| Steh-Schreibtisch | 2×2 | gutes Tempo, hebt die Stimmung | |
| Profi-Arbeitsplatz | 2×2 | hohes Tempo, ergonomischer Stuhl | |
| Premium-Arbeitsplatz | 2×2 | höchstes Tempo, beste Stimmung | |

## Tab 2: Studios

Verstärken eine Spezialisierung. Die Liste wird nach Preis sortiert und in drei Gruppen zu je vier geteilt (Starter, Erweiterung, Profi). Die Gruppen unten sind nur eine Schätzung, der Preis entscheidet.

| Gruppe (erwartet) | Objekt | Bereich | Größe (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|---|---|
| Starter | Gummiente | Bugs | 1×1 | kleiner Bonus gegen Bugs | Obergrenze pro Büro |
| Starter | Bücherregal | Forschung | 1×1 | etwas mehr RP | Obergrenze pro Büro |
| Starter | Entwickler-Ecke | Programmieren | 2×1 | mittlerer Bonus auf Programmieren | |
| Starter | Mikrofonecke | Sound | 2×1 | mittlerer Bonus auf Sound | |
| Erweiterung | Testgeräte-Regal | Bugs | 2×1 | mittlerer Bonus gegen Bugs | |
| Erweiterung | Grafiktablett-Ecke | Design | 2×1 | mittlerer Bonus auf Design | |
| Erweiterung | Forschungsecke | Forschung | 2×1 | mittlerer RP-Bonus | |
| Erweiterung | QA-Labor | Bugs | 3×3 | großer Bonus gegen Bugs | ersetzt das Testgeräte-Regal |
| Profi | Entwicklungslabor | Programmieren | 3×3 | großer Bonus auf Programmieren | ersetzt die Entwickler-Ecke |
| Profi | Soundstudio | Sound | 3×3 | großer Bonus auf Sound | ersetzt die Mikrofonecke |
| Profi | VFX-Studio | Design | 3×3 | großer Bonus auf Design | ersetzt die Grafiktablett-Ecke |
| Profi | Forschungslabor | Forschung | 3×3 | großer RP-Bonus | ersetzt die Forschungsecke |

**Preisregel:** In jedem Bereich muss das Studio mehr kosten als die Ecke, damit die Kette sichtbar bleibt.

## Tab 3: Technik

Schalten Systeme frei oder liefern Kapazität. Kein Bonus-Objekt. Technik muss erst erforscht werden. **(nicht festgelegt)**

| Objekt | Größe (nicht festgelegt) | Freischaltung (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|---|
| Serverrack | 1×1 | Forschung "Onlinespiele", ab Büro 3 | schaltet Onlinespiele frei, liefert Grundkapazität | stapelbar bis zu den Rack-Plätzen |
| Hardware-Werkbank | 2×1 | Forschung "Hardware", ab Büro 4 | schaltet die Konsolen-Funktion frei | nur einmal |
| Doppel-Rack | 2×1 | Forschung "Rechenzentrum", ab Büro 5 | mehr Kapazität pro Rack-Platz | stapelbar bis zu den Rack-Plätzen |

**Kapazität:** Ein Onlinespiel braucht Kapazität, je nachdem, wie viele Spieler es unterstützen soll. Zu wenig Kapazität hat Folgen wie Lags, Ausfälle oder schlechtere Wertungen. Die Kapazität gilt dauerhaft für alle laufenden Onlinespiele zusammen.

**Forschung:** Die RP aus Bücherregal, Forschungsecke und Forschungslabor werden gebraucht, um die Technik freizuschalten.

**Idee, noch nicht aufgenommen:** Notstrom-Akku, der Onlinespiele vor Ausfällen schützt.

## Tab 4: Wände

Nur Optik. Wandstile gelten für das ganze Büro.

| Objekt | Größe / Platz (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|
| Betonwand | Stil | Standard der Garage | |
| Tapete / Wandfarbe | Stil | kleine Stimmung | |
| Backsteinwand | Stil | Retro-Stil | |
| Fenster | Wand, 2 Plätze | Tageslicht, kleine Stimmung | |

## Tab 5: Dekoration

Hier gibt es den Ruhm. Der Tab ist nur für Optik und Ruhm gedacht.

| Objekt | Größe / Platz (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|
| Pflanze | 1×1 | Optik, kleine Stimmung | |
| Teppich | unter Möbeln | Optik | blockiert keine Kachel |
| Poster | Wand, 1 Platz | Optik, etwas Ruhm | |
| Trophäenregal | 2×1 | zeigt Pokale, etwas Ruhm | fasst 4 Pokale; Pokale lassen sich auch einzeln aufstellen |
| Lichterkette | Wand, 2 Plätze | Gemütlichkeit | |
| Lavalampe | 1×1 | Optik | steht auf einem Beistelltisch |
| Gemälde | Wand, 1 Platz | Optik | |
| Neon-Schild mit Studioname | Wand, 2 Plätze | Optik, etwas Ruhm | |
| Aquarium | 2×1 | Optik, kleine Stimmung | |
| Retro-Konsolen-Vitrine | 1×1 | zeigt Konsolen, etwas Ruhm | passt zur Hardware-Werkbank |
| Pflanzenwand | Wand, 2 Plätze | Optik, kleine Stimmung | |

## Tab 6: Komfort

Nur Stimmung und Erholung, kein Ruhm.

| Objekt | Größe / Platz (nicht festgelegt) | Funktion | Notizen |
|---|---|---|---|
| Kaffeemaschine | 1×1 | Stimmung, etwas Erholung | |
| Sofa | 2×1 | Stimmung | |
| Mini-Kühlschrank | 1×1 | Stimmung | |
| Arcade-Automat | 1×1 | Stimmung | |
| Snackautomat | 1×1 | Stimmung | |
| Kickertisch | 2×1 | starke Stimmung für das Team | |
| Massagesessel | 1×1 | baut Erschöpfung ab | |
| Schlafnische | 2×1 | Erholung zwischendurch | |
| Wasserspender | 1×1 | kleine Stimmung | |
| Klimaanlage | Wand, 1 Platz | Stimmung bei langer Arbeit | Wandgerät |

## Tab 7: Inventar

Zeigt alles, was der Spieler besitzt und noch nicht aufgestellt hat. Pokale erscheinen hier automatisch mit einer kurzen Meldung, sobald das Ziel erreicht ist. Nicht freigeschaltete Pokale sind ausgegraut und zeigen ihre Bedingung. Ein einzeln aufgestellter Pokal belegt 1×1, im Trophäenregal belegt er keine eigene Kachel. **(nicht festgelegt)**

| Pokal | Freigeschaltet, wenn … | Notizen |
|---|---|---|
| Erstes-Spiel-Pokal | das erste Spiel veröffentlicht ist | |
| Game of the Year | ein Spiel zum Spiel des Jahres gewählt wird | |
| Verkaufs-Pokal | ein Spiel besonders viele Verkäufe erreicht | |
| Qualitäts-Pokal | ein Spiel eine sehr hohe Wertung bekommt | |
| Bug-frei-Pokal | ein Spiel ohne Bugs erscheint | |
| Sound-Pokal | ein Spiel herausragenden Sound hat | |
| Design-Pokal | ein Spiel herausragendes Design hat | |
| Konsolen-Pokal | die erste eigene Konsole erscheint | |

Alle Pokale geben etwas Ruhm.

## Noch offen

- Preise und Zahlenwerte der Boni.
- Kachelgröße im MVP-Grid prüfen (Vorschlag: 4×4 Studs).
- Kauf ohne freien Platz: "Platz ab Büro X" anzeigen (Vorschlag) oder das Objekt ins Inventar legen.
- Ob die Stimmung bei vielen Mitarbeitern sinken soll, damit große Teams mehr Komfort brauchen.
- Ob 8 Rack-Plätze in der Firmenzentrale reichen oder 10 nötig sind.
- Ob es einen Notstrom-Akku im Tab Technik geben soll.
- Ob im Inventar weitere Dinge außer Pokalen freigeschaltet werden sollen.

## Änderungsprotokoll

| Datum | Änderung |
|---|---|
| 2026-10-17 | Erste Fassung des gemeinsamen Katalogs |
| 2026-10-17 | Grid und Größen, sechs Büros mit Obergrenzen (bis 28 Mitarbeiter), Technik per Forschung, Ebenen Boden/Wand/Stil, Regel "Bonus pro Sorte einmal"; alles als nicht festgelegt markiert |
