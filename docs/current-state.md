# Current state

Status date: 2026-09-22. Current release: v0.6 PWA.

## Delivery

- GitHub Pages: `https://reylold2005-fly.github.io/decomp-quickref/`
- The repository root contains the currently deployed offline PWA.
- `src/index.html` is the editable application/data source.
- `archify/gen-dg.mjs` and `archify/spec-*.json` preserve the decision-diagram source.
- `build.mjs` produces the standalone file and `dist/site` deployment directory.

The web application makes no external requests after installation and can be added to the iPad home screen. Embedded decision diagrams use `DecompressionStream`, requiring iOS 16.4 or a recent desktop browser.

## Data verification boundary

- D574-1 program text and distances were recorded as user-verified on 2026-09-15.
- D501 and D574-2 still contain items marked for verification.
- D527-1 contains four segments; oxygen-system applicability remains explicitly pending.
- D527 page 2 has not been entered.
- The RVSM contingency text remains a public ICAO Doc 4444 placeholder by user decision.

These statuses must remain visible. A newer effective company document supersedes this tool even if the PWA still loads correctly.

## Safe update procedure

1. Verify the source document and effective date outside Git.
2. Change only the relevant data in `src/index.html`.
3. Regenerate diagram specifications and rendered diagrams when decision logic changes.
4. Run `node build.mjs`.
5. Compare `dist/site` with the repository-root Pages artifact and review the standalone file.
6. Test lookup, warnings, dark/light mode, installability, and offline reload before release.
