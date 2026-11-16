# Version 1.2 verification — 16 November 2026

Passed the Chromium end-to-end test against the complete local website and the proposed sampler bundle.

- Homepage release 1.2; animated gradient; animation disabled with reduced motion.
- Project, transport and pattern controls remain reachable on phones.
- 75-second MP3 import (exceeding the former 60-second sample restriction).
- Real Web Audio backing playback while the sequencer runs.
- Edited 2–6 second loop uses the matching AudioBufferSourceNode loop bounds.
- Song gain changed to 0.4 and applied to its audio GainNode.
- Backing-only offline render: 330120 frames, nonzero energy (1761.91).
- Pause preserves position; Stop returns to the selected range start.
- Local reload restores both song parameters and decoded audio.
- Portable backup and restore retain the embedded MP3.
- Existing step toggling and pad triggering work.
- WAV download has a valid RIFF header.
- No page-wide overflow at 320, 360, 390, 430, 768 and 1024 pixels.
- A 25 MB file is rejected without replacing the current song.
- Zero browser page errors.

These are desktop Chromium tests with responsive viewports, not physical Samsung or iOS device tests. Speed changes also change pitch. The existing WAV export still renders the selected pattern/chain, and existing capture/export time limits remain in effect. No accounts, email settings, community services, project formats or permissions were replaced.
