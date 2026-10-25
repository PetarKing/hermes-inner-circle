# Development and compatibility

This personal preset leaves profiles, history, permissions and delivery with
Hermes. It changes no core files, prompts or personalities.

## Sources and checks

- `plugin.js`: roster and selected-chat appearance. Install the built package,
  not this source file alone.
- `src/timeline.js`: generic activity and evidence renderer.
- `vendor/`: attributed Bubble Mode and Task Dock sources; see
  [provenance and adaptations](../vendor/README.md).
- `scripts/build.mjs`: deterministic build to `desktop/plugin.js`, importing
  only `@hermes/plugin-sdk` at runtime.
- `dashboard/plugin_api.py`: optional read-only inbox; no agent tools, model
  hooks, credentials or background service.

```sh
npm install
npm run build
npm test
```

Tests cover canonical/source matching, focus races, avatars, cleanup, ordering,
ages, unread cues, inert labels, duplicate evidence, closed activity cards,
protected controls, bundle namespaces and the bounded read-only inbox. Native
validation also checks manifest/loadability, dependencies and security scanning.

Public checks use synthetic metadata and browser fixtures. The original private
Mac setup has native visual acceptance. Neither that nor a fresh-home package
install smoke test establishes stock-Desktop GUI or Windows/Linux visual
acceptance for this extraction. Native markup/SDK exports can change. Remote or
ambiguous conversations keep stock chat styling. Reorder uses CSS `reading-flow`;
unsupported renderers keep native ordering.

## Browser showcase

Run `python3 -m http.server 8766`, then open `http://127.0.0.1:8766/demo/`.
It imports the actual built plugin with a browser-only SDK stub and synthetic
conversations. There is no Hermes connection, credential access or sending.
Gallery/compact controls use the real styling. Captures use 1280 × 1000, 185px
portraits and 20px chat text. The GIF shows rendered transition states; the MP4
is an illustrated browser tour, not a live-model recording. [Artwork credits](../demo/ASSETS.md).

## Catalog status

**Not catalog-ready.** [Hermes's submission rules](https://hermes-agent.nousresearch.com/docs/developer-guide/plugins/catalog-submission)
prohibit querying/modifying native app markup. This preset uses DOM selectors
and observers for the gallery, quiet work and inline activity. Its `desktop
surface` validation therefore fails; security scanning is a separate check.
We do not evade the rule or claim listing/endorsement.

[SDK request #144372](https://github.com/NousResearch/hermes-agent/issues/144372)
describes the concrete roster and scoped-message consumers needed to replace
the DOM dependencies. A future website
listing would be **community**, subject to maintainer review. Only Nous-maintained
plugins have the official tier. Catalog support needs those hooks and clean
native acceptance, not a differently named bundle.
