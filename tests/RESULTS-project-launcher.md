# Web project launcher – 2026-11-19

`Sampler öffnen` now prepares sounds behind an animated blue/purple/pink progress bar and opens a local project overview. Existing projects occupy their saved slots; the overview starts with at least ten entries. Empty entries create projects only when opened. The bottom plus adds a persistent empty slot. Saved project names are editable in the overview. Opening a card restores its original sampler model, imported sample bytes, patterns, song, loops and settings through the existing `apply()` path.

Projects continue to use the existing owner-scoped IndexedDB database and schema. Only slot positions use a small localStorage preference. Discrete edits begin saving immediately when playback is stopped; playback keeps its coalesced save behavior. Save status only reports success for the latest model revision. Page hiding/closing also flushes the current project. Storage failures can be retried without leaving a cached rejected database connection.

Validated locally:

- `node tests/project-launcher.cjs`: passed all sixteen areas, including imported sample bytes and patterns surviving full browser restart, a step saved directly before closing, no duplicate initial projects, rename safety, owner separation, loading cancellation, storage retry, reduced motion and four viewport widths.
- `ZYNORA_QA_ORIGINAL_UI=1 node tests/browser-v12.cjs`: passed real Web Audio playback, song and pad scheduling, song import, offline WAV audio, backup/restore, storage, original controls and browser errors.
- `ZYNORA_QA_ORIGINAL_UI=1 node tests/bars-loops.cjs`: passed flexible bars, loop presets, custom fifth track, repeated edits, audible offline rendering and persistence.
- `node tests/phone-ui.cjs`: passed mobile navigation, steps, disclosure, playback, sound library and comfort mode. The existing sampler workspace is pixel-identical to the reference at 600, 700, 768, 1024 and 1440 pixels across three editor views.

Screenshots and synthetic browser project data are in the OS temporary QA directory, outside the public website. The APK and the Supabase handler's authorization logic are outside this change.
