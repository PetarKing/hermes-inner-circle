# Selected Hermes Bot Kit components

`bubble-mode.js` and `task-dock.js` derive from Thomas Bekkers' MIT-licensed
[Hermes Bot Kit](https://github.com/thomasbek3/hermes-bot-kit), upstream commit
`4bfdd1bf3c7ad20458e4793666550af760b76d97`. The copyright and permission notice
is retained in [LICENSE](../LICENSE).

These reviewed source copies include the personal setup's canonical-chat
compatibility marker; Task Dock starts collapsed. `scripts/build.mjs` packages
them into the one Desktop entrypoint, namespaces their settings and commands,
requires the verified current local Bot Chat and confines their chat selectors
to that surface. No remote imports or runtime code download occur.

Bot Sections is omitted because the target Hermes already has native folders.
Computer viewer and texting-style are optional upstream products; neither is
required for this preset or bundled. Inner Circle does not change bot prompts.
