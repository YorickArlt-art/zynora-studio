# Phone-only sampler UI – 16 November 2026

The live sampler core is unchanged, SHA256 a26ee0b9acc9698ac41cffdd4ba1028f6963b5c6590fa2ad64430f22c66b9aef. `sampler-phone.js` adds a presentation layer at widths below 600 CSS pixels. It is included by `tools/build-sampler.mjs` in the existing Supabase-delivered bundle. No HTML entrypoints, desktop styles, authentication or database behavior are changed.

Phone additions: sticky Play/Stop/Song/disclosure controls; bottom Pads/Sequencer/Loops/Tools navigation; projects, backing song and XY tool views; searchable sound dialog and pad hold; grouped sound controls; compact mixer; 8-step compact and 4-step comfort groups; loop-editor groups; existing project/recording/export handlers.

Verified in real Chromium with Web Audio:

- Byte-identical rendered PNGs before/after at widths 600, 700, 768, 1024 and 1440, for Pads, Sequencer and Sound (15 comparisons).
- Actual phone navigation to every workspace; 16 pads and four modes; existing sample assignment; hold-pad sound library.
- Steps set/remove actual project cells; second group reaches Step 16; comfort mode exposes four larger targets without deleting notes.
- Play uses the existing engine/graph; collapse does not restart playback.
- Create a step loop, add a fifth sound, edit a step, switch loop step groups, name/save, and see five loop lanes in the sequencer.
- Real WAV download via the new project export action, with a valid RIFF file.
- No horizontal overflow at 320, 390, 430 and 599; resizing restores the original controls and all 16 columns.
- Existing bars/loops regression: exact bar deletion, minimum one bar, factory/custom loops, actual offline audio and persistence.
- Existing Web Audio regression: shared backing/song scheduling, imports, trim/loop/level, backup/restore, WAV export and no browser errors.
- Existing homepage navigation/hero test: 20 language/viewport combinations pass.

Commands:

```
node tools/build-sampler.mjs
node tests/phone-ui.cjs
ZYNORA_QA_ORIGINAL_UI=1 node tests/bars-loops.cjs
ZYNORA_QA_ORIGINAL_UI=1 node tests/browser-v12.cjs
node tests/desktop-layout.cjs
```

The ORIGINAL_UI switch tests the unchanged pre-enhancement controls, since the old test locators intentionally refer to desktop toolbar elements hidden in the new phone interface. The complete new bundle is separately exercised by phone-ui.cjs, including live playback and actual export. All tests use intercepted read-only backend responses and local projects; they do not create accounts or production data. Physical mobile browser/device testing is still advisable.
