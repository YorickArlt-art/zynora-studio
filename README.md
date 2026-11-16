# ZYNORA Studio

Public website: https://www.zynora-studio.com/

The browser sampler beta is public and requires no account. Song Studio and APK downloads remain locked.

The optional website account and community features remain authenticated. The existing `/beta-tester person:@member` Discord automation stays protected; its private Supabase `/grant` endpoint is not part of the public sampler flow.

The browser beta currently provides 16 parts, 20 patterns, up to 64 steps, local audio import, local project storage and backup, and WAV export. It is an initial web implementation, not a complete port of the native Android app. Projects are stored on the user's device; cloud sync is not active.

GitHub Pages publishes the public files from `main` at the repository root. The `CNAME` file preserves the existing custom domain. The manual Actions workflow is retained as a fallback; its artifact names distinguish repeated attempts.

Do not upload the Android APK, private backups, server secrets, backend-only source, or local QA fixtures. Client configuration contains only the public Supabase publishable key. The `zynora-beta/status` and `zynora-beta/bundle` Edge Function endpoints serve public sampler feature flags and client code without a login. The secret-protected `/grant` endpoint remains restricted. The published sampler bundle only reads and writes per-browser IndexedDB; no cloud project synchronization is active.

## Browser sampler 1.2

The homepage announces version 1.2 with an animated violet/pink/blue text gradient (static when reduced motion is enabled). The existing studio-opening flow remains in place.

**Add song** (top right in the sampler) imports a local MP3 or another browser-supported audio file into a dedicated backing track. Press Play to hear it alongside the pads, patterns and loops. Edit its volume, speed, low-pass filter, start/end range and loop; seek in its waveform lane, mute or remove it. Playback speed also changes pitch. The backing track passes through the existing master/XY effects and is included in live recording and the selected pattern/chain WAV export. This is not vocal isolation or independent pitch-preserving time stretching.

On phones, the project, transport and pattern bars are horizontally scrollable, with all controls available. Song editing folds away to leave room for pads. Desktop and tablet retain their wider arrangement.

Songs stay in IndexedDB on the device with their project and are included in project backup/restore. Limits: 24 MB per song, 10 minutes and 160 MiB decoded PCM; the existing 96 MB total imported-file limit, 64-file limit and four-minute WAV/recording limit still apply. Existing projects without a backing song remain supported.

Sampler source: `supabase/functions/zynora-beta/sampler-client.js`. Run `node tools/build-sampler.mjs` after edits to regenerate the deployed `sampler-source.mjs`. Deploy it with the existing `zynora-beta` handler and metadata, preserving the handler's private `/grant` authorization. No account, RLS, database or mail configuration is changed by this update.

### Mobile toolbar refinement

On phones the sampler now starts with compact controls: Add song, Play, Stop, Record and BPM remain visible. Use **More** beside Add song to expand project management, pad recording, swing, master level, export, pattern settings and help. These are the same controls with their existing audio handlers; expanding/collapsing does not stop playback. Desktop keeps its original full toolbars. The homepage's 1.2 gradient now has a stronger animated glow; reduced-motion preferences still disable animation.
