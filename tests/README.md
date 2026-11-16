# Browser 1.2 regression test

Requirements: Node.js, Playwright, Chromium at `/usr/bin/chromium`, and FFmpeg (or set `ZYNORA_TEST_MP3` to an existing MP3 longer than 60 seconds).

Run from the repository root:

```sh
node tools/build-sampler.mjs
node tests/browser-v12.cjs
```

The test starts an ephemeral HTTP server on `127.0.0.1` only. Supabase status/bundle responses are intercepted in the test browser; no user accounts, database records or production projects are changed. Factory audio comes from the checked-out assets. A generated 75-second tone is used as the backing-song fixture. Screenshots, a WAV export and a portable backup go to the OS temp directory, outside the published site.

Checks cover the animated version heading, shared mobile control bars, a song longer than the old sample limit, real Web Audio scheduling, editable loop start/end and gain, non-silent backing-only offline rendering, pause/reset, local project reload, portable backup/restore, existing pad and step editing, the WAV download, mobile widths from 320 to 1024 pixels, rejection of oversized files without replacing the current song, reduced motion, and browser runtime errors.
