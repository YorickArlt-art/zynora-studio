# ZYNORA Studio

Public website: https://www.zynora-studio.com/

The sampler beta is restricted to invited Discord identities. Guests and other accounts continue to see the pre-launch notice. Song Studio and APK downloads remain locked.

Administrators can use `/beta-tester person:@member` in the ZYNORA Discord server. The bot stores the grant through the private Supabase integration and sends an English invitation DM. Members sign in through Discord to use their access. Permissions are checked again when the studio opens.

The browser beta currently provides 16 pads, four sequencer tracks, local audio import, local project storage and backup, and WAV export. It is an initial web implementation, not a complete port of the native Android app. Projects are stored on the user's device; cloud sync is not active.

GitHub Pages publishes the public files from `main` at the repository root. The `CNAME` file preserves the existing custom domain. The manual Actions workflow is retained as a fallback; its artifact names distinguish repeated attempts.

Do not upload the Android APK, backups, private beta source, server secrets, backend source, or local QA fixtures. Client configuration contains only the public Supabase key. The private sampler bundle is served by the authenticated `zynora-beta` Edge Function.
