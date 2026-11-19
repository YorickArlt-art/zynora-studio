# iPhone / Safari audio fix — 2026-11-19

The released engine requested `AudioContext.resume()` from pad `pointerdown`, without a later touch activation retry. Safari can require a trusted `touchend`/click gesture, leaving that resume pending while the pad handler waits forever. It also left the iOS audio-session category implicit, so Web Audio could use the ambient/ringer channel and remain inaudible with the phone's silent switch enabled even at full media volume.

Changes:

- Select `navigator.audioSession.type = 'playback'` before creating the live context and on foreground playback gestures. Feature-detect and tolerate unavailable/throwing implementations.
- On Apple devices without that API, prepare a small looping HTML audio route using our generated all-zero stereo 44.1-kHz MP3. Start it only from playback gestures, unmuted; pause it on Stop, returning to projects, closing Studio, hiding the page or navigation. It does not change sample gain, audio processing, recordings, or offline renders.
- Defer the first still-locked touch-pad trigger to `touchend`; preserve immediate pointer-down response once the route is ready. Cancel deferred triggers on movement/cancellation; held-pad sound selection still works.
- Resume suspended/interrupted contexts from trusted foreground gestures. A closed context is rebuilt without dropping decoded imports, the master level or XY settings. A blocked resume times out with a visible retry message instead of silently waiting forever. Do not automatically restart the sequencer after backgrounding.

Validation:

- `ZYNORA_IOS_BEFORE=1 node tests/ios-audio.cjs`: both modeled iPhone paths reproduce a suspended context and zero PCM on first tap using the exact previous production bundle.
- `node tests/ios-audio.cjs`: 12 checks passed across modern AudioSession and legacy media routing: real first-pad PCM; interrupted-context recovery; closed-context recreation preserving imports/master; blocked-resume retry message; Play/Stop and unchanged project ID; route release on closing Studio. No page JavaScript errors.
- `ZYNORA_QA_ORIGINAL_UI=1 node tests/browser-v12.cjs`: existing playback, >60-second song import, shared clock, offline render, resume/reset, backup/restore and mobile overflow checks passed; no page errors.
- `node tests/project-launcher.cjs`: project creation/rename/imports, persistence across full browser restart and immediate close, owner isolation, responsive layouts, reduced motion and retry/cancellation checks passed.
- `ZYNORA_QA_ORIGINAL_UI=1 node tests/bars-loops.cjs`: existing bar/loop, PCM and export regressions passed.
- Silence asset generated from FFmpeg `anullsrc` at stereo 44100 Hz / 320 kbit MP3; no external sound/library code copied. The zero-sample source is used only as an iOS media-route fallback.

Limits: these are Chromium browser tests with explicitly modeled iOS gesture/session restrictions, not a physical iPhone, Safari binary, hardware silent-switch or Bluetooth routing test. A real iPhone smoke test remains useful. The website, project storage, authorization policy and Android APK are otherwise unchanged.

References consulted:

- MDN, AudioSession.type: https://developer.mozilla.org/en-US/docs/Web/API/AudioSession/type
- WebKit, trusted iOS media gesture policy: https://webkit.org/blog/6784/new-video-policies-for-ios/
- Background on the pre-AudioSession iOS media/ringer distinction (reference only; not copied): https://github.com/swevans/unmute
