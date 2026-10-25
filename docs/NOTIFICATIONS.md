# Sidebar notification policy

Inner Circle styles Hermes's existing unread state. The plugin does not decide
which turns are unread. Folding a routine card does not suppress a native badge.

## Native fix: internal activity stays quiet

The companion [source patch](../native-fixes/human-reply-unread.patch) changes
Hermes core so canonical Bot Chat notifications follow new visible assistant
replies to human turns. Bot-to-bot messages, internal replies, routine records,
legacy scheduler prompts and heartbeat/activity timestamps do not raise the
sidebar unread marker. Opening a chat clears its marker; subsequent internal
activity does not re-arm it. A later human-facing reply can notify normally.

Previously the roster used general activity timestamps, including a newer
unrelated worker session, while generic busy-to-idle events could also mark a
Bot Chat unread. The patch adds a separate reply timestamp and preview to the
canonical-session contract, uses that timestamp for roster notification
watermarks, and lets that evidence own unread state for those chats. General
activity still refreshes an open transcript. Existing stored messages are not
rewritten.

## Scope and application

This is a source-maintenance artifact, **not installed by Inner Circle**. A plugin
update alone does not provide the fix. It changes both the Hermes gateway and
Desktop renderer, with generated contracts and regression tests. It does not
change delivery policy, scheduler configuration or the plugin bundle.

The patch applies cleanly to Hermes revision
[`bf0203a794a07aac3ff764972ab9087baa4e4f4e`](https://github.com/NousResearch/hermes-agent/commit/bf0203a794a07aac3ff764972ab9087baa4e4f4e).
That is an apply check, not a claim that the whole stock revision was built and
tested. Review current upstream before adopting it: a later version may already
fix this or require a different implementation. No upstream merge is claimed.

For source maintainers: use an isolated checkout, inspect the patch, run
`git apply --check /path/to/human-reply-unread.patch`, then apply and run the
relevant native tests/build. Follow the checkout's contribution instructions.
Gateway and renderer must be deployed together; activate only when idle. Keep
a recovery copy of the affected source and renderer, and undo only this change
if required. Do not restore an entire configuration or conversation database.
This is not an automatic installer or a compatibility promise for other builds.

## Evidence, 26 October 2026

On the maintained macOS installation, an isolated source snapshot and temporary
Hermes home passed 60 focused frontend tests and 44 Python tests, including
human replies, peer turns, routine context, hidden bots, unrelated sessions,
clear-then-refresh and generic completion events. Type checking, generated
contract checks, native lint gates and the renderer build passed. Two regression
checks failed against the pre-fix implementation for the intended reasons.

The matching gateway and renderer were installed. Authenticated read-only roster
checks returned the new notification fields. A real sidebar marker was cleared
by opening its chat and stayed cleared through subsequent roster refreshes.
No production peer/routine turn was injected: those classifications were tested
synthetically. Stock GUI and other-platform acceptance are not established.

The patch contains code and synthetic tests only; no configuration, credentials,
conversation history, private adapters or local recovery receipts are included.
