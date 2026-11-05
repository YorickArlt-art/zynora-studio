# ZYNORA Studio

Privates Website-Repository von YorickArlt-art. Die Website ist für GitHub Pages vorbereitet, aber noch nicht veröffentlicht.

- Website-Dateien liegen im Repository-Stamm; Einstieg ist `index.html`.
- `.github/workflows/pages.yml` startet ausschließlich manuell über `workflow_dispatch`. Es gibt keinen automatischen Deploy bei Push.
- Pages ist aktuell durch den GitHub-Tarif für dieses private Repository gesperrt. Später ist ein passender Tarif oder eine ausdrücklich freigegebene öffentliche Repository-Sichtbarkeit erforderlich. Ein privates Repository bedeutet nicht automatisch eine private Pages-Website.
- Domain: `zynora-studio.com`, registriert bei hosttech. DNS und Custom Domain wurden nicht geändert.
- Sampler und Kontoanbindung sind enthalten. Songstudio zeigt einen Entwicklungshinweis. Die Android-APK ist kein Teil dieses Repositorys.
- Supabase SMTP für `support@zynora-studio.com` ist noch nicht eingerichtet. Keine Zugangsdaten oder Server-Schlüssel in Website-Dateien eintragen.

Details zur späteren Freischaltung: [SETUP.md](SETUP.md).

Vor öffentlicher Freischaltung: SMTP und Auth-Callbacks, Download-CORS, Löschverfahren, Datenhinweise und letzte visuelle Tests abschließen. Anschließend Veröffentlichung gesondert freigeben und den Workflow manuell ausführen.
