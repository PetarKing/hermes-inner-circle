# Install and undo

Inner Circle is an opt-in personal preset for Hermes Desktop 0.22.5. Later
versions may change markup; the version floor is not a compatibility guarantee.
It uses the native profiles, folders, Bot Chats, gateway and history. It creates
no bots, sends no messages, changes no prompts and starts no external services.

## Standard package

1. Record your current theme and enabled chat/roster plugins. Disable overlapping
   reskins before enabling Inner Circle. In particular, it already includes
   selected Bubble Mode and Task Dock code. Keep their files/settings for undo.
2. Run `hermes plugins install PetarKing/hermes-inner-circle --enable`.
   A custom Hermes home must be selected using Hermes's normal configuration.
   Desktop plugins belong to the app, not to individual profile folders.
3. In Desktop, run **Reload desktop plugins** and enable **Inner Circle** under
   Capabilities → Plugins. `--enable` enables the package's backend; the Desktop
   toggle is separate. Select **Inner Circle Sage** in Appearance, or run
   **Inner Circle: apply sage theme** in the command palette.
4. Open an existing bot's native Bot Chat. Drag the native sidebar divider to
   switch between the gallery and compact rows. **Inner Circle: show or
   hide Sessions** restores the Sessions tab. No session is deleted.
5. **Bubble Mode: toggle work rows** restores thinking/tool rows. The bundled
   **Task Dock: toggle** controls the task dock; its first state is collapsed.
   **Inner Circle: reset custom bot order** restores native sorting.

The package contains `plugin.yaml`, the built `desktop/plugin.js` and an optional
read-only `dashboard/plugin_api.py`. There is no runtime npm dependency, build
step, downloader or self-updater. The sage skin file is retained for CLI users;
the Desktop theme is registered by the plugin and selected explicitly.

Only verified local canonical Bot Chats get conversation decoration. Remote or
ambiguous conversations retain stock conversation styling. The roster uses
native names, avatars and folders; sample artwork is not installed as bots.
Order stays local to the desktop. The age is last recorded activity, not online
presence; the plugin cannot make a disconnected backend fresh.

## Optional integration

Native structured routine records and worker/process completion metadata are
read through `session.history` for the selected Bot Chat, at most on focus,
completion events and a 30-second refresh. This read starts no turn. Ambiguous
visible text matches remain undecorated. Channel labels require the documented
evidence fields. The optional adapter inbox is **off by default** and never reads
anything until enabled; see [INTEGRATIONS.md](INTEGRATIONS.md).

## Update

Use `hermes plugins update inner-circle`. Back up your installed source before
updating local modifications and review the release changes. Adapter snapshots
live in the selected home outside the plugin source tree. The package never
fetches replacement code itself. Recheck the native UI after a Hermes upgrade.

## Undo

Choose your previous theme first. Disable **Inner Circle** in Desktop and run
`hermes plugins disable inner-circle` for its optional backend. Re-enable the
previous chat plugins if desired. The preset removes its injected decorations,
classes, listeners and timers; native conversations remain. To remove the source
entirely, use `hermes plugins remove inner-circle`. Personal adapter snapshots
are not automatically deleted. No whole configuration/database restore is needed.

The old manually installed `inner-circle-preview` is a separate plugin ID:
disable it before enabling this package; retain its folder as a recovery copy.
Existing private `inner-circle` installations should not be overwritten blindly:
this public package deliberately omits their private adapters and configuration.
