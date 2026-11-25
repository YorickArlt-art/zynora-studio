# Three sampler styles and settings — 2026-11-25

The website sampler now provides an Appearance setting with three numbered preview cards:

1. Warm Studio — warm chalk and plum (default).
2. Clear Studio — white and teal.
3. Slate Studio — matte blue-grey and lavender.

The gear in the Studio header is accessible before and after selecting a project. The phone's existing Tools sheet also opens Settings. The selected style is applied immediately, stored only under `zynora-sampler-style-v1` in localStorage, and synchronized between tabs. When browser storage is unavailable the style still applies for the current session and the UI explains that it could not persist the choice. Project data and sounds remain in their existing per-owner IndexedDB stores.

All four phone sections remain: Pads, Sequencer, Loops, Tools. The 16 pads, 20 patterns, 4 mode buttons, expandable controls, recording, sound editing, mixer, XY effects, song import, custom loops, exports and backup/restore retain their original event handlers. The new settings modal is excluded from sampler keyboard shortcuts. Native focus and Escape behavior is preserved. The mockup with fewer navigation items was not used as a feature specification.

Desktop widths from 1280 px receive a project sidebar. It lists local saved projects, creates projects through the existing launcher, and routes project opening through the same saved-project loader. Current project highlighting and titles refresh after saves. A stale async sidebar action is discarded if the account changes or the editor is left. Titles use textContent, never HTML. Tablet and phone layouts retain their existing navigation and access to the project overview.

Style changes update CSS tokens and waveform colours. They do not recreate the audio graph, change gain/parameters, switch the active project or reset transport. New settings only affect the sampler and its own dialogs; the marketing site and Android APK are unchanged.

Validation:

- `node tests/appearance.cjs`: passed eight groups, including all three preview choices; 16 pads and original four phone sections; contrast checks for normal secondary text and primary controls; no horizontal app overflow at 320, 390, 768, 1024, 1280 and 1440 px; live switching preserves exact project data/object and audio graph while playback continues; keyboard isolation and focus return; every existing tool panel; sidebar create/rename/reopen with real saved step data; escaped user titles; reload persistence; cross-tab preference updates; graceful preference-storage failure. Screenshots are in the OS temp directory.
- `node tests/phone-ui.cjs`: passed existing phone modes, real step editing, sound selection/holding, compact/comfort grids, playback/disclosure, mixer/FX/song/project tools, custom fifth loop track, WAV download and resize restoration. Original 16 pads, 20 patterns and controls remain available at tablet/desktop widths. Old screenshot-equality assertions were replaced because the requested design intentionally changes pixels.
- `node tests/ios-audio.cjs`: all 12 modern/legacy iPhone-routing regression checks passed. These model Safari restrictions in Chromium; no physical iPhone claim is made.
- `node tests/project-launcher.cjs`: passed persistent browser restart, immediate-close saves, separate owners, imported samples, project rename/create and retry/cancellation flows.
- `ZYNORA_QA_ORIGINAL_UI=1 node tests/browser-v12.cjs`: existing real audio, long song import, live/offline playback, pause/reset, WAV, backup/restore and overflow regressions passed.
- `git diff --check`: passed.

The website's public read-only sampler routes and secret-protected grant handler are unchanged. Only its built browser-source module is replaced when deploying the existing function.
