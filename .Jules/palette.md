## 2026-02-23 - [Svelte A11y Strictness]
**Learning:** Svelte (especially with vite-plugin-svelte) can treat accessibility warnings as build-blocking errors. Using `<label>` for group headings without a single associated control triggers these warnings; using `<span>` or `<div>` with `aria-labelledby` is a valid alternative for groups.
**Action:** Prefer `aria-labelledby` on group containers with a non-label heading element when the "label" applies to multiple controls (like a button group).
