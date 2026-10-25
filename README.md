# Inner Circle

My personal, bot-centric setup for **Hermes Desktop**, heavily inspired by
[Grok Bot](https://x.ai/news/designing-grok-bot). It puts your bots and conversations
first, keeps sessions out of the way, and makes the everyday interface calmer
and more visually pleasing. Shared because it might be useful to someone else.

![Inner Circle: portrait sidebar and readable sample conversation](demo/gallery.jpg)

[Before / after](docs/WHY.md) · [Video](demo/showcase.mp4) · [Folders](demo/folders.jpg) · [Compact sidebar](demo/compact-current.jpg) · [Interactive demo](docs/DEVELOPMENT.md#browser-showcase)

## What you get

- Large, edge-to-edge bot portraits; narrow the sidebar for icon-and-name rows.
- Sage chat styling, compact headers, readable messages and a narrower composer.
- Clear unread envelopes and current-bot selection, without shifting the cards.
- Native folders, local ordering and advancing activity ages. Sessions is hidden
  while the preset is enabled, with a command to bring it back.
- Quiet thinking/tool display, a typing indicator and a task dock that starts
  collapsed. Approvals remain visible; work detail can be restored.
- Folded routine/worker results and optional channel labels when structured
  evidence is available. Existing messages and history are never rewritten.

## Install

Requires Hermes Desktop **0.22.5+**. This is a personal setup, still experimental.

```sh
hermes plugins install PetarKing/hermes-inner-circle --enable
```

Reload desktop plugins, enable **Inner Circle** in Capabilities → Plugins, then
run **Inner Circle: apply sage theme** from the command palette. Use your own
bots and avatars. Disable other roster/chat reskins, including standalone Bubble
Mode and Task Dock; this package includes the selected components.

[Install, update and undo](docs/INSTALL.md) · [Compatibility and checks](docs/DEVELOPMENT.md)

## Included or connected separately?

| Included in the preset | Your coding agent can connect/configure |
|---|---|
| Portrait roster, chat styling, quiet work display, folded task dock | Your bot names, artwork, roles, folders and preferred chat text size |
| Folded activity renderer; reads supported native routine/completion metadata | Your scheduler's records if it uses a different format |
| Generic origin/delivery labels and an optional read-only adapter inbox | Telegram or another channel's actual admission/delivery receipts |
| Hermes's existing conversations | Telegram sync and Conduit call/transcript handling; see [personal integrations](docs/INTEGRATIONS.md) |

My extra integrations keep app and Telegram conversations connected, distinguish
where messages came from and which replies were delivered, and make call
transcripts available for continuity. They depend on my routing and external
services, so this package doesn't install them, connect accounts or copy private
configuration. The generic display hooks are included. **Open an issue if you'd
like help adapting these pieces to your setup**; I'll help when I can.

<details>
<summary>Prompt for your coding agent</summary>

> Read this repository's README, docs/INSTALL.md and docs/INTEGRATIONS.md.
> Help adapt Inner Circle to my existing Hermes setup. Inspect my Hermes version,
> bots, folders, avatars, channels, routines and any call/transcript integration.
> Identify what already works and what can be wired together for a coherent
> bot-first experience. Preserve my profile IDs, history, personalities, auth and
> schedules. Back up affected presentation settings; install the preset and
> verify enable/disable and gallery/compact layouts. Use native metadata and
> documented adapter fields for routine cards and channel labels; never infer
> delivery from message text. Keep credentials and private transcripts out of
> the repository. Explain missing services and get my approval before connecting
> accounts, enabling syncing/call ingestion or changing external delivery. Report
> what you actually verified and give me an undo path.

</details>

## Ideas welcome

Issues, ideas and suggested improvements are welcome. This is my personal setup,
not a supported product: I may adopt suggestions, but can't promise replies,
fixes or timelines. I retain merge control. See [contributing](CONTRIBUTING.md).

Built on [Hermes](https://github.com/NousResearch/hermes-agent) and selected
MIT-licensed [Hermes Bot Kit](https://github.com/thomasbek3/hermes-bot-kit)
components. Independent community work, not affiliated with Nous Research or xAI.
The demo uses sample conversations and [AI-generated character artwork](demo/ASSETS.md).
This DOM-based preset is **not currently eligible for Hermes's plugin catalog**;
the SDK integration work needed is described in [development notes](docs/DEVELOPMENT.md#catalog-status).
