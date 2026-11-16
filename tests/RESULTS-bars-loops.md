# Bars und Loops – 16.11.2026

Automatisch in echtem Headless Chromium mit Web Audio, lokalem Website-Server und dem tatsächlich generierten Sampler-Bundle geprüft:

- Smartphone: neue Patterns mit 2 Bars; Desktop und Tablet: 4 Bars. Größenwechsel erhält gespeicherte Baranzahl.
- Hinzufügen über 4 Bars hinaus, gezieltes Entfernen einer mittleren Bar mit nachgewiesenem Verschieben ihrer Nachbarn; mindestens eine Bar, danach Löschen deaktiviert.
- Drei auswählbare Audio-Vorlagen; Auswahl erzeugt sichtbare Wellenform-Spur im normalen Sequencer.
- Eigenen Loop erstellen, Länge ändern, Steps setzen, fünfte Soundspur ergänzen, mit Namen speichern.
- Wiederholte Loop-Steps auf Bar 2 bearbeiten und Änderung auf Bar 1 überprüfen; zusätzliche Bars benötigen keine Kopien.
- Scheduling: ein Hit pro Loop-Zyklus, keine doppelte Planung durch die Sequencer-Darstellung.
- Tatsächlicher Offline-Audioexport mit hörbarer fünfter Loop-Spur; globale Live-Wiedergabe startet.
- Speichern und Neuladen erhält Namen, aktivierten Status und alle fünf Soundspuren.
- Projektvalidierung für 96 Steps und ältere Projekte mit 64 gespeicherten Zellen trotz kürzerer aktiver Länge.
- Bestehender Browser-v1.2-Test: gleichzeitiger Hintergrundsong und Samples am realen Master, Wiederherstellung gelöschter Audiopuffer, Dateiauswahl während Wiedergabe, Song-Trim/Loop/Level, Backup/Restore, WAV-Audio und Smartphone-Überlauf ohne Fehler.
- Bestehende Desktop-Layouttests: alle 20 Kombinationen aus Sprache und Bildschirmgröße bestanden.

Befehle: `node tests/bars-loops.cjs`, `node tests/browser-v12.cjs`, `node tests/desktop-layout.cjs`.

Keine Hardwaretests auf einem physischen Android-Gerät oder iPad durchgeführt. Höchstzahl 128 Bars und 24 Loops pro Projekt; sehr große Projekte hängen von Speicher und Leistung des Geräts ab.
