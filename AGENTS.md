# AI working guide

Read `docs/current-state.md` before changing route data or presentation.

Rules:

- This is a study/reference aid, not an operational checklist. Keep the visible warning that current company material is authoritative.
- Route segments, altitudes, diversion choices, oxygen-system applicability, effective dates, and distances are safety-sensitive facts. Do not infer or silently normalize them.
- Change source data in `src/index.html`; regenerate decision specifications and the deployable site after a reviewed data change.
- Preserve all `⚠`/pending-verification labels until the user verifies the corresponding source.
- Do not commit company source documents, crew data, credentials, or private distribution records.
- The repository root is the GitHub Pages artifact; source and generators are retained alongside it for reproducibility.

After a source change, run `node build.mjs`, compare the generated `dist/site` with the repository root, and test offline loading and route lookup on a narrow mobile viewport.
