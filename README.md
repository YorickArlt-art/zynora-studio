# ZYNORA Studio

Public website: https://www.zynora-studio.com/

The browser sampler beta is public and requires no account. Song Studio and APK downloads remain locked.

The optional website account and community features remain authenticated. The existing `/beta-tester person:@member` Discord automation stays protected; its private Supabase `/grant` endpoint is not part of the public sampler flow.

The browser beta currently provides 16 parts, 20 patterns, up to 64 steps, local audio import, local project storage and backup, and WAV export. It is an initial web implementation, not a complete port of the native Android app. Projects are stored on the user's device; cloud sync is not active.

GitHub Pages publishes the public files from `main` at the repository root. The `CNAME` file preserves the existing custom domain. The manual Actions workflow is retained as a fallback; its artifact names distinguish repeated attempts.

Do not upload the Android APK, private backups, server secrets, backend-only source, or local QA fixtures. Client configuration contains only the public Supabase publishable key. The `zynora-beta/status` and `zynora-beta/bundle` Edge Function endpoints serve public sampler feature flags and client code without a login. The secret-protected `/grant` endpoint remains restricted. The published sampler bundle only reads and writes per-browser IndexedDB; no cloud project synchronization is active.
