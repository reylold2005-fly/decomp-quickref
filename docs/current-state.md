# Current state

Status date: 2026-09-22. Current release: v0.6 PWA.

## Delivery

- Primary entry: `https://decomp.reylold2005.com/`, served from the HP host through Cloudflare Tunnel.
- HP service: `decomp-quickref`, bound to `127.0.0.1:8082` using `compose.yaml`.
- GitHub Pages fallback: `https://reylold2005-fly.github.io/decomp-quickref/`
- The repository root contains the currently deployed offline PWA.
- `src/index.html` is the editable application/data source.
- `archify/gen-dg.mjs` and `archify/spec-*.json` preserve the decision-diagram source.
- `build.mjs` produces the standalone file and `dist/site` deployment directory.

The web application makes no external requests after installation and can be added to the iPad home screen. Embedded decision diagrams use `DecompressionStream`, requiring iOS 16.4 or a recent desktop browser. The HP and Pages copies are two delivery paths for the same static artifact; they are not separate data sources.

## Data verification boundary

- D574-1 program text and distances were recorded as user-verified on 2026-09-15.
- D501 and D574-2 still contain items marked for verification.
- D527-1 contains four segments; oxygen-system applicability remains explicitly pending.
- D527 page 2 has not been entered.
- D501 and D527-1 RVSM text uses the user-supplied Russian procedure, translated into Chinese on 2026-09-22. D574-1/2 retain the pending-verification ICAO placeholder.
- D527-1: user confirmed SUKOR → LONKA → MIKET on A91, joining A817 after MIKET on 2026-09-22. Segment 3 option 2 and the same path in segment 2 option 3 now pass LONKA; other pending labels remain.
- The route map has a replay control for the selected option; replay preserves scroll position and chart/segment changes clear playback selection.

These statuses must remain visible. A newer effective company document supersedes this tool even if the PWA still loads correctly.

## Safe update procedure

1. Verify the source document and effective date outside Git.
2. Change only the relevant data in `src/index.html`.
3. Regenerate diagram specifications and rendered diagrams when decision logic changes.
4. Run `node build.mjs`.
5. Compare `dist/site` with the repository-root Pages artifact and review the standalone file.
6. Test lookup, warnings, dark/light mode, installability, and offline reload before release.
