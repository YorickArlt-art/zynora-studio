# ZYNORA Studio: nur vorbereitet

Das private Repository YorickArlt-art/zynora-studio wurde erstellt und mit den vorbereiteten Website-Dateien befüllt. Es wurden weder eine öffentliche Pages-Veröffentlichung noch DNS-Einträge aktiviert. GitHub zeigt für Pages im derzeitigen privaten Repository eine Tarifsperre an. Der Workflow startet ausschließlich manuell über `workflow_dispatch`, nicht bei einem Push. Das Paket enthält keine Zugangsdaten; der vorhandene Supabase-Publishable-Key ist für Browser bestimmt. Geheimschlüssel gehören ausschließlich auf den Server.

## Dateien hochladen, sobald die Veröffentlichung freigegeben ist

1. Das private Repository https://github.com/YorickArlt-art/zynora-studio verwenden. Den Inhalt von `outputs/github-pages` einschließlich `.github` und `.nojekyll` in dessen Stammverzeichnis übernehmen. `NICHT-HOCHLADEN`, QA-Dateien und lokale Backups niemals hochladen.
2. Unter Settings → Pages als Quelle GitHub Actions wählen. Der enthaltene Workflow wird erst nach bewusster manueller Ausführung öffentlich deployen. Eine kostenlose Pages-Veröffentlichung kann ein öffentliches Repository erfordern; Tarif und Sichtbarkeit vorher prüfen.
3. Der Betreiber hat den Kauf von zynora-studio.com bestätigt. Anbieter ist hosttech (myhosttech.eu). Die bevorzugte Hauptadresse (mit oder ohne www) bei der Einrichtung bestätigen. Erst danach die Custom Domain in Pages setzen, deren bereitgestellte DNS-Werte beim Domainanbieter übernehmen, Domainbesitz verifizieren und HTTPS aktivieren. Es wurde noch keine CNAME-Datei aktiviert, da Veröffentlichung und DNS-Einrichtung noch ausstehen. Eine später bestehende CNAME-Datei erhalten.
4. In Supabase die endgültige HTTPS-Site-URL und exakte Callback-URL erlauben. Die Webseite verwendet ihre eigene Verzeichnis-URL als Callback und unterstützt damit auch Pages-Projektpfade. Die Download-Function benötigt die endgültigen erlaubten Origins in ihrer CORS-Liste. Bestehende Origins erst entfernen, wenn sie nicht mehr gebraucht werden.
5. Auth-E-Mails einrichten und mit einem entbehrlichen Testkonto Registrierung, Bestätigung, Anmeldung, Passwort-Reset und geschützten Download prüfen. Der gewünschte Absender support@zynora-studio.com ist noch nicht als Versandweg angebunden. SMTP und die vom Mailanbieter vorgegebenen DNS-Einträge fehlen noch. Bestätigung bleibt aktiviert.

## Speicherung und Sprache

Der Browser öffnet das Studio-Menü. Der Web-Sampler ist verfügbar; Songstudio zeigt ein Schloss und einen Entwicklungshinweis. Die vollständige native Android-Timeline ist nicht Teil dieser Browser-Beta. Benannte Projekte einschließlich eigener Audiodateien liegen in IndexedDB pro Account, Browser und Origin. Sie sind nicht in der Cloud synchronisiert. Vor dem Domainwechsel Projekt-Sicherungen exportieren und unter der neuen Domain importieren. WAV ist ein Audioexport; die JSON-Projekt-Sicherung enthält das editierbare Pattern und importierte Samples. Browser-Speicher kann gelöscht oder vom Browser freigegeben werden.

GitHub Pages stellt statische Dateien bereit und führt den Cloudflare-Worker nicht aus. Deshalb nutzt dieses Paket für den Deutschvorschlag Browsersprache de-DE plus Zeitzone Europe/Berlin. Es behauptet dabei keine echte Standortbestimmung. Englische Standardsprache und manuelle Sprachwahl bleiben erhalten. Eine echte Ländererkennung erfordert einen separat eingerichteten, datenschutzrechtlich beschriebenen Server-Endpunkt.

## Vor dem öffentlichen Start

- Anschrift prüfen: Yorick Arlt, Erlenhag 1c, 65388 Schlangenbad. 65388 wurde aus den öffentlichen Kontaktdaten der Gemeinde ergänzt; die vollständige persönliche Anschrift muss der Betreiber bestätigen. Öffentlich freigegebene E-Mail: zynora-studio@outlook.de.
- Datenhinweise mit tatsächlichem Hoster, Versanddienst, Verträgen, Drittlandgarantien, Aufbewahrungsfristen und geprüftem Kontolöschverfahren vervollständigen. Der Text ist ein Entwurf und keine Garantie gegen rechtliche Ansprüche.
- Kein Tracking eingebaut. Speicherhinweis erklärt notwendige Konto-/Sampler-Speicherung; Abbrechen lässt öffentliche Seiten zugänglich. Kein pauschales Tracking-Einwilligungsbanner.
- Mobile/Tablet/Desktop, englische und deutsche Ansicht, Projektwechsel, Audioimport, Wiederherstellung nach Neuladen, Sicherung/Import und endgültige HTTPS-Callbacks prüfen.

Quellen: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [Supabase Redirects](https://supabase.com/docs/guides/auth/redirect-urls), [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html), [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html), [Gemeinde Schlangenbad](https://www.schlangenbad.de/).
