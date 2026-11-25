# Browser 1.2 regression test

Requirements: Node.js, Playwright, Chromium at `/usr/bin/chromium`, and FFmpeg (or set `ZYNORA_TEST_MP3` to an existing MP3 longer than 60 seconds).

Run from the repository root:

```sh
node tools/build-sampler.mjs
node tests/appearance.cjs
node tests/project-launcher.cjs
ZYNORA_QA_ORIGINAL_UI=1 node tests/browser-v12.cjs
ZYNORA_QA_ORIGINAL_UI=1 node tests/bars-loops.cjs
node tests/phone-ui.cjs
```

The test starts an ephemeral HTTP server on `127.0.0.1` only. Supabase status/bundle responses are intercepted in the test browser; no user accounts, database records or production projects are changed. Factory audio comes from the checked-out assets. A generated 75-second tone is used as the backing-song fixture. Screenshots, a WAV export and a portable backup go to the OS temp directory, outside the published site.

Checks cover the animated version heading, shared mobile control bars, a song longer than the old sample limit, real Web Audio scheduling, editable loop start/end and gain, non-silent backing-only offline rendering, pause/reset, local project reload, portable backup/restore, existing pad and step editing, the WAV download, mobile widths from 320 to 1024 pixels, rejection of oversized files without replacing the current song, reduced motion, and browser runtime errors.

The mobile follow-up also checks collapsed defaults, essentials visibility, expanding the original controls, uninterrupted song playback when collapsing, and restoration of the original desktop transport. `phone-compact.png` and `phone-expanded.png` are saved alongside the other screenshots.

The shared-playback regression uses normal browser autoplay restrictions and touch input. It checks exact song/pattern start timestamps, both sources in the live output spectrum, live pad overlap, pattern-boundary continuity, audio-buffer recovery, and a file-picker background transition followed by resuming both sources.

The audio and bars suites use their original control layout, because their selectors predate the phone navigation. The full production source, including the new project launcher, is exercised by `project-launcher.cjs` and `phone-ui.cjs`. Editor fixtures enter through the project overview; reload checks reopen the same saved project ID.

The project-launcher suite checks ten lazy project slots, animated progress, creating and renaming projects, safe rendering of user names, additional slots, imported sample bytes and patterns across a full persistent Chromium restart, immediate-close autosave, separate owners, 320/390/768/1440px layouts, storage failure/retry, reduced motion, and closing/reopening while loading. All data belongs to isolated local test browser profiles. No production account or database content is changed.

The appearance update deliberately changes editor pixels on all sizes. The phone suite now verifies the original controls, 16 pads, 20 patterns and workspace accessibility at tablet/desktop sizes rather than requiring byte-identical old-theme screenshots. `appearance.cjs` additionally covers the three preview choices, local persistence, cross-tab changes, storage failures, keyboard isolation, text contrast, six responsive widths, and actual project switching from the desktop sidebar.
