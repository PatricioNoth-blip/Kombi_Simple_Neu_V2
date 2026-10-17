# Katalog: Möbel, Studios und Pokale (Game-Dev-Tycoon)

Arbeitsdokument, noch nicht im Spiel umgesetzt. Hier steht, welche Objekte es gibt und was sie leisten sollen. Preise, Größen und Zahlenwerte kommen später.

## So änderst du den Katalog

- Jede Tabelle ist eine Zeile pro Objekt. Neue Objekte als neue Zeile ergänzen, gestrichene Zeilen löschen.
- Die Spalte **Funktion** beschreibt, was das Objekt im Spiel können soll. In **Notizen** stehen Ideen, offene Fragen oder Änderungswünsche.
- Wenn du ein Objekt änderst, passe unten die **Zählung** an und trag die Änderung im **Änderungsprotokoll** ein.

## Grundregeln

1. Alles ist von Anfang an kaufbar. Es gibt keine Freischalt-Stufen, nur Preise.
2. Mitarbeiter haben vier Spezialisierungen: **Programmieren, Bugs, Sound, Design**.
3. **Schreibtische** helfen allen Mitarbeitern gleich. Sie werden ersetzt, nicht aufgewertet.
4. Die Spezialisierung verbessert sich nur über die **Studios** (Ecke, später Studio). Das Studio ersetzt die Ecke, der Bonus gilt für den ganzen Bereich.
5. Kleine Bonus-Objekte (Gummiente, Bücherregal) kann man nur wenige Male aufstellen.
6. **Technik-Objekte** schalten Systeme frei oder liefern Kapazität. Racks lassen sich stapeln.
7. **Pokale** kann man nicht kaufen. Man schaltet sie durch Erfolge frei, sie landen im Inventar.
8. Die Reihenfolge in den Tabs ergibt sich aus dem Preis (aufsteigend).

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

| Objekt | Funktion | Notizen |
|---|---|---|
| Klapptisch | Start, Grundtempo | |
| Holz-Schreibtisch | etwas mehr Tempo | |
| Büro-Schreibtisch | mehr Tempo, Dual-Monitor | |
| Steh-Schreibtisch | gutes Tempo, hebt die Stimmung | |
| Profi-Arbeitsplatz | hohes Tempo, ergonomischer Stuhl | |
| Premium-Arbeitsplatz | höchstes Tempo, beste Stimmung | |

## Tab 2: Studios

Verstärken eine Spezialisierung. Die Liste wird nach Preis sortiert und in drei Gruppen zu je vier geteilt (Starter, Erweiterung, Profi). Die Gruppen unten sind nur eine Schätzung, der Preis entscheidet.

| Gruppe (erwartet) | Objekt | Bereich | Funktion | Notizen |
|---|---|---|---|---|
| Starter | Gummiente | Bugs | kleiner Bonus gegen Bugs | wenige Male aufstellbar |
| Starter | Bücherregal | Forschung | etwas mehr RP | wenige Male aufstellbar |
| Starter | Entwickler-Ecke | Programmieren | mittlerer Bonus auf Programmieren | |
| Starter | Mikrofonecke | Sound | mittlerer Bonus auf Sound | |
| Erweiterung | Testgeräte-Regal | Bugs | mittlerer Bonus gegen Bugs | |
| Erweiterung | Grafiktablett-Ecke | Design | mittlerer Bonus auf Design | |
| Erweiterung | Forschungsecke | Forschung | mittlerer RP-Bonus | |
| Erweiterung | QA-Labor | Bugs | großer Bonus gegen Bugs | ersetzt das Testgeräte-Regal |
| Profi | Entwicklungslabor | Programmieren | großer Bonus auf Programmieren | ersetzt die Entwickler-Ecke |
| Profi | Soundstudio | Sound | großer Bonus auf Sound | ersetzt die Mikrofonecke |
| Profi | VFX-Studio | Design | großer Bonus auf Design | ersetzt die Grafiktablett-Ecke |
| Profi | Forschungslabor | Forschung | großer RP-Bonus | ersetzt die Forschungsecke |

**Preisregel:** In jedem Bereich muss das Studio mehr kosten als die Ecke, damit die Kette sichtbar bleibt.

## Tab 3: Technik

Schalten Systeme frei oder liefern Kapazität. Kein Bonus-Objekt.

| Objekt | Funktion | Notizen |
|---|---|---|
| Serverrack | schaltet Onlinespiele frei, liefert Grundkapazität | stapelbar |
| Hardware-Werkbank | schaltet die Konsolen-Funktion frei | nur einmal |
| Doppel-Rack | viel Kapazität auf wenig Platz | stapelbar, besser als zwei Einzel-Racks |

**Kapazität:** Ein Onlinespiel braucht Kapazität, je nachdem, wie viele Spieler es unterstützen soll. Zu wenig Kapazität hat Folgen wie Lags, Ausfälle oder schlechtere Wertungen. Die Kapazität gilt dauerhaft für alle laufenden Onlinespiele zusammen.

**Idee, noch nicht aufgenommen:** Notstrom-Akku, der Onlinespiele vor Ausfällen schützt.

## Tab 4: Wände

Nur Optik.

| Objekt | Funktion | Notizen |
|---|---|---|
| Betonwand | Standard der Garage | |
| Tapete / Wandfarbe | kleine Stimmung | |
| Backsteinwand | Retro-Stil | |
| Fenster | Tageslicht, kleine Stimmung | |

## Tab 5: Dekoration

Hier gibt es den Ruhm. Der Tab ist nur für Optik und Ruhm gedacht.

| Objekt | Funktion | Notizen |
|---|---|---|
| Pflanze | Optik, kleine Stimmung | |
| Teppich | Optik | |
| Poster | Optik, etwas Ruhm | |
| Trophäenregal | zeigt Pokale, etwas Ruhm | Pokale lassen sich auch ohne Regal aufstellen |
| Lichterkette | Gemütlichkeit | |
| Lavalampe | Optik | |
| Gemälde | Optik | |
| Neon-Schild mit Studioname | Optik, etwas Ruhm | |
| Aquarium | Optik, kleine Stimmung | |
| Retro-Konsolen-Vitrine | zeigt Konsolen, etwas Ruhm | passt zur Hardware-Werkbank |
| Pflanzenwand | Optik, kleine Stimmung | |

## Tab 6: Komfort

Nur Stimmung und Erholung, kein Ruhm.

| Objekt | Funktion | Notizen |
|---|---|---|
| Kaffeemaschine | Stimmung, etwas Erholung | |
| Sofa | Stimmung | |
| Mini-Kühlschrank | Stimmung | |
| Arcade-Automat | Stimmung | |
| Snackautomat | Stimmung | |
| Kickertisch | starke Stimmung für das Team | |
| Massagesessel | baut Erschöpfung ab | |
| Schlafnische | Erholung zwischendurch | |
| Wasserspender | kleine Stimmung | |
| Klimaanlage | Stimmung bei langer Arbeit | |

## Tab 7: Inventar

Zeigt alles, was der Spieler besitzt und noch nicht aufgestellt hat. Pokale erscheinen hier automatisch mit einer kurzen Meldung, sobald das Ziel erreicht ist. Nicht freigeschaltete Pokale sind ausgegraut und zeigen ihre Bedingung.

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
- Größen der Objekte im Grid.
- Wie oft sich die kleinen Bonus-Objekte aufstellen lassen.
- Ob es einen Notstrom-Akku im Tab Technik geben soll.
- Ob im Inventar weitere Dinge außer Pokalen freigeschaltet werden sollen.

## Änderungsprotokoll

| Datum | Änderung |
|---|---|
| 2026-10-17 | Erste Fassung des gemeinsamen Katalogs |
