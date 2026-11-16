# Desktop website correction — 16 November 2026

## Reproduced

The legacy final header rules forced the compact navigation menu at every viewport, including desktop. The oversized decorative 16-pad homepage card made the hero roughly 770–902 pixels high before the header, putting part of the start screen below typical laptop displays. The wide storage notice could cover the studio-opening action.

## Corrected

- Desktop links are directly visible at >=1024 CSS pixels.
- At 1024–1365 pixels they use an explicit, balanced four-column/two-row layout.
- Larger screens use inline navigation without the mobile dropdown.
- Homepage copy, spacing and decorative card adapt to desktop height.
- Desktop storage notice uses a compact card on the right.
- Phones/tablets retain the compact menu; Escape and outside click close it.
- Header mode resets correctly when resizing across the desktop breakpoint.

## Verification

`desktop-layout.cjs` passed in Chromium for German and English, at 320×740, 390×844, 768×1024, 900×700, 1024×768, 1093×614, 1280×720, 1366×768, 1536×864 and 1920×1080. This includes a representative 125% Windows-scaling viewport. All desktop links fit the header, no horizontal page overflow occurs, and Studio opening stays above the fold on all tested desktop sizes. No browser runtime errors.

`browser-v12.cjs` also passed: MP3 and samples audible together, shared start clock, file-picker recovery, live pads, loop editing, project save/reload, backup/restore, WAV export and compact sampler controls.

These are Chromium responsive-browser tests, not a test on the user's physical Opera GX installation.
