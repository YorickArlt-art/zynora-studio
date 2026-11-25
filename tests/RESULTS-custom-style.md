# Own styles and home update — 2026-11-25

The home page announces “Dein Studio. Dein Style.” and adds a six-icon, responsive sampler preview with four demo choices. Demo buttons only change the illustration. “Eigenen Style gestalten” explicitly opens the actual custom editor; the other CTA opens the existing appearance settings. Hero/navigation/other website routes remain available. The browser page uses the current language.

The original three templates remain. A plus card below them adds one personal style. Its editor provides:

- 15 colour pickers with matching hex fields: three background colours, panels, inactive steps, text, secondary text, borders, accent and its text, selected pads and their text, playhead, warnings, and pattern colour.
- Solid, linear and radial backgrounds; two or three stops; angle, radial centre and middle-stop position.
- Optional dots or a fine grid with colour, spacing and intensity; slow background motion (12–60 seconds); selected-pad glow, panel opacity, corner radius, shadow and soft UI transitions.
- Three custom starting palettes, a name, immediate preview, a contrast hint/readability action, reset, and JSON export/import up to 32 KB.

All controls are grouped into Background, Colours & surfaces, Effects, and Finishing touches. Settings itself keeps a safe neutral palette while editing; the gear stays legible even with poorly chosen user colours. Reduced-motion preferences disable background animation. A previous generic form rule that enlarged visually hidden radio inputs was corrected to eliminate horizontal overflow on 320 px screens.

Custom preferences are stored only in `zynora-custom-style-v1` (versioned data) and the existing selected-style key, never inside project audio/model data. The style also synchronizes between tabs. Template switching clears custom inline variables and retains the saved personal settings for later. Storage failure is explained while editing remains usable for the current session. The style schema accepts known enums, finite bounded numeric values and six-digit hex colours; it does not accept arbitrary CSS, remote images or executable content. Invalid/oversized imports do not replace the current style.

Rendering uses CSS colour tokens and a coalesced preview update. Expensive waveform refreshes are deferred while changing controls. Existing audio graphs, sample gains, project data, navigation and exports remain authoritative. The existing iPhone audio unlock/recovery remains present.

Validation:

- `node tests/custom-style.cjs`: 12 groups covering home icons/demo/CTA; fourth personal choice; 2/3-stop linear/radial gradients and positions; patterns, surface opacity, radius, shadows/glow; JSON round trip and malicious/oversized import rejection; safe editing and contrast hint; real ongoing playback with unchanged graph/project data; reload and template persistence; no editor overflow at 320/390/768/1440 px; cross-tab changes; malformed preference recovery; genuinely moving opt-in backgrounds; reduced motion; blocked preference storage. No page errors.
- `node tests/appearance.cjs`: all original template/navigation/project-sidebar/preferences checks continue to pass with four total choices.
- `node tests/phone-ui.cjs`: all existing mobile tools, modes, step/loop editing, sound selection/holding, WAV export and desktop/tablet control restoration passed.
- `node tests/desktop-layout.cjs`: German and English navigation/hero layout across phone, tablet and desktop sizes passed with the new home section.
- `node tests/ios-audio.cjs`: all 12 modeled iPhone audio checks passed. This is browser simulation, not a physical-device test.
- `git diff --check`: passed.

This release changes the website and the sampler's browser-source module. The Android APK, authorization rules, database schema and stored project format are unchanged.
