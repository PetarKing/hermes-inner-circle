import { PALETTE_AREA, host, queryClient, coarseElapsed, translateNow } from '@hermes/plugin-sdk'

export const CSS_TEXT = `
body.inner-circle-preview { --ic-sage: #b5cfb5; --ic-stroke: color-mix(in srgb, var(--ui-text-primary) 12%, transparent); }
body.inner-circle-preview.ic-hide-sessions [data-tree-tab="sessions"] { display: none !important; }
body.inner-circle-preview [data-tree-tab="hermes-bots:pane"] { color: var(--ic-sage); }
body.inner-circle-preview [data-tree-tab="hermes-bots:pane"][aria-selected="true"] { border-bottom-color: var(--ic-sage); }
body.inner-circle-preview.ic-hide-sessions [data-panel-header]:has([data-tree-tab="hermes-bots:pane"]):not(:has([data-tree-tab]:not([data-tree-tab="hermes-bots:pane"],[data-tree-tab="sessions"]))) { height: 32px !important; }
body.inner-circle-preview.ic-hide-sessions [data-zone-tabstrip]:has([data-tree-tab="hermes-bots:pane"]):not(:has([data-tree-tab]:not([data-tree-tab="hermes-bots:pane"],[data-tree-tab="sessions"]))) { display: none; }
body.inner-circle-preview [data-slot="bots-roster"] { container-type: inline-size; scrollbar-width: thin; scrollbar-color: var(--ic-stroke) transparent; }
body.inner-circle-preview [data-slot="bots-roster"] div:has(> [data-roster-key]) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .4rem; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] {
  position: relative; flex-direction: column; justify-content: start; padding: 0; gap: 0; border-radius: 12px;
  border: 0; background: transparent; box-shadow: none;
}
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:hover,
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][class*="ui-row-active-background"] { background: transparent; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:focus-visible { outline: 2px solid var(--ic-sage); outline-offset: -2px; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child { display: flex; justify-content: center; width: 100%; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > img,
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > svg,
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > span {
  width: 100% !important; height: auto !important; aspect-ratio: 1; max-width: 100%; border-radius: 0 !important;
  box-shadow: none;
}
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) { width: 100%; flex: 0 0 auto; padding: .55rem .2rem; background: #20382d; border-bottom: 2px solid transparent; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:hover > div:nth-child(2) { background: #2a4536; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][class*="ui-row-active-background"] > div:nth-child(2) { border-bottom-color: var(--ic-sage); background: #2a4536; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child { justify-content: center; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child > div:first-child { justify-content: center; gap: .2rem; }
/* Native status, warnings and timestamps stay; transcript snippets yield room to portraits. */
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:nth-child(2) { display: none; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child > span:last-child { position: absolute; top: .4rem; right: .4rem; padding: .1rem .25rem; border-radius: 5px; background: #172d25d9; color: #c4d3c1; font-size: .58rem; opacity: 0; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:is(:hover,:focus-visible) > div:nth-child(2) > div:first-child > span:last-child { opacity: 1; }
body.inner-circle-preview [data-inner-circle-preview="profile-header"] {
  flex: 0 0 auto; display: flex; align-items: center; gap: .75rem; padding: .5rem 1.25rem;
  border-bottom: 1px solid var(--ic-stroke); background: linear-gradient(110deg, #1e382c, #192e26);
}
body.inner-circle-preview [data-inner-circle-preview="profile-header"] img { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; }
body.inner-circle-preview [data-inner-circle-preview="profile-header"] > div { display: flex; align-items: baseline; gap: .8rem; min-width: 0; }
body.inner-circle-preview .ic-profile-name { font-size: 1rem; font-weight: 550; line-height: 1.3; }
body.inner-circle-preview .ic-profile-role { font-size: .72rem; color: var(--ui-text-secondary); }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] { --conversation-turn-gap: .55rem; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_user-message-root"] { position: relative !important; top: auto !important; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_assistant-message-content"] > .aui-md { line-height: 1.65; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_user-message-root"] .composer-human-message:not(:has(textarea, [contenteditable="true"], input)) {
  padding: .85rem 1.1rem; border-radius: 20px 20px 6px 20px;
  background: linear-gradient(135deg, #3c5b46, #355440); color: #edf0e6;
  border: 1px solid #b5cfb52b; box-shadow: 0 4px 18px #00000014;
  line-height: 1.6;
}
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_assistant-message-content"] > .aui-md:not(:has(pre,table,audio,video)) {
  padding: .9rem 1.15rem; border-radius: 20px 20px 20px 6px;
  background: linear-gradient(145deg, #294638, #213b30);
  border: 1px solid color-mix(in srgb, var(--ic-sage) 12%, transparent);
  box-shadow: 0 6px 24px #00000014, inset 0 1px 0 color-mix(in srgb, var(--ic-sage) 5%, transparent);
}
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_user-bubble-actions"] { width: 100%; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_response-loading"] { color: var(--ic-sage); }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="composer-dock"]:not([data-popped-out]) { --composer-width: 52rem; width: min(calc(100% - 3rem), 52rem); }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-testid="reasoning-pill"]:has([role="status"]) [role="status"] { display: none; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-testid="reasoning-pill"]:has([role="status"])::before { content: 'Effort'; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [aria-label="Switch model"]:has([role="status"]) [role="status"] { display: none; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [aria-label="Switch model"]:has([role="status"])::before { content: 'Model'; }
/* Lower the native 237px floor only for a bot-only zone; the sash reads this
   computed clamp and still owns width, persistence and restore-on-double-click. */
body.inner-circle-preview [data-tree-split] > div:has(> [data-tree-group] [data-slot="bots-roster"]):not(:has([data-chat-surface])) { min-width: 180px !important; }
/* The native pane divider owns width and persistence; only presentation changes. */
@container (max-width: 220px) {
  body.inner-circle-preview [data-slot="bots-roster"] div:has(> [data-roster-key]) { grid-template-columns: minmax(0, 1fr); gap: 3px; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] { flex-direction: row; align-items: center; gap: 8px; padding: 6px; border-radius: 9px; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:hover,
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][class*="ui-row-active-background"] { background: #2a4536; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child { width: 36px; flex: 0 0 36px; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > img,
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > svg,
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > span { width: 36px !important; height: 36px !important; border-radius: 8px !important; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) { flex: 1; min-width: 0; width: auto; padding: 0; background: transparent; border: 0; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:is(:hover,[class*="ui-row-active-background"]) > div:nth-child(2) { background: transparent; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child,
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child > div:first-child { justify-content: flex-start; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child > span:last-child { display: none; }
}
@media (max-width: 720px) {
  body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_assistant-message-content"] > .aui-md,
  body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_user-message-root"] .composer-human-message { max-width: 94%; }
  body.inner-circle-preview .ic-card-state { max-width: 7rem; text-align: right; }
}
@media (prefers-reduced-motion: reduce) { body.inner-circle-preview .ic-card-caret, body.inner-circle-preview [data-roster-key] { transition: none; } }

body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_user-message-root"] { align-items: flex-end; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] .composer-human-message { width: fit-content; max-width: 72%; margin-left: auto; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] .composer-human-message :is([data-slot="aui_user-message-text"],[data-slot="aui_user-inline-text"]) { color: inherit; }
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_assistant-message-content"] > .aui-md:not(:has(pre,table,audio,video)) { width: fit-content; max-width: 72%; }/* One selection edge around the existing portrait, with no inner card. */
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"] { outline: 1.5px solid #b5cfb580; outline-offset: -1.5px; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"] > div:nth-child(2) { background: #354f3d; }
body.inner-circle-preview [data-inner-circle-preview="profile-header"] { padding: 6px 18px; gap: 10px; background: linear-gradient(105deg, #203b2e, #1b3029 65%); }
body.inner-circle-preview [data-inner-circle-preview="profile-header"] > div { flex-direction: column; align-items: flex-start; gap: 1px; }
body.inner-circle-preview .ic-profile-name { font-weight: 600; font-size: 1rem; line-height: 1.25; }
body.inner-circle-preview .ic-profile-role { font-size: .7rem; line-height: 1.25; color: #b4c6b3; }
/* The native tab had a 12rem cap even when its strip was mostly empty. */
body.inner-circle-preview [data-panel-header] [data-tree-tab][aria-selected="true"]:not([data-vertical="true"]) { max-width: 100%; flex: 0 1 auto; }
body.inner-circle-preview [data-panel-header] [data-tree-tab][aria-selected="true"]:not([data-vertical="true"]) .pane-tab-content > :last-child { flex: 1; }
body.inner-circle-preview [data-panel-header] [data-tree-tab][aria-selected="true"]:not([data-vertical="true"]) .pane-tab-content > :last-child > span { text-transform: none; letter-spacing: .015em; text-overflow: ellipsis; }
body.inner-circle-preview [data-ic-drop-edge]::after { content: ''; position: absolute; z-index: 4; background: var(--ic-sage); border-radius: 2px; pointer-events: none; }
body.inner-circle-preview [data-ic-drop-edge="left"]::after { left: 0; top: 4px; bottom: 4px; width: 3px; }
body.inner-circle-preview [data-ic-drop-edge="right"]::after { right: 0; top: 4px; bottom: 4px; width: 3px; }
body.inner-circle-preview [data-ic-drop-edge="top"]::after { top: 0; left: 4px; right: 4px; height: 3px; }
body.inner-circle-preview [data-ic-drop-edge="bottom"]::after { bottom: 0; left: 4px; right: 4px; height: 3px; }
@container (max-width: 220px) {
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"] > div:nth-child(2) { background: transparent; }
  body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"] { background: #354f3d; }
}
/* Unread is a native finished-reply state. Only opacity changes on read/open. */
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child { position: relative; overflow: hidden; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2),
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:is(:hover,[data-ic-selected="true"],[class*="ui-row-active-background"]) > div:nth-child(2) { background: #29433d; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"] { outline: none; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]::before { content: ''; position: absolute; inset: 0; border: 1.5px solid #b5cfb599; border-radius: inherit; opacity: 0; pointer-events: none; z-index: 3; transition: opacity 480ms cubic-bezier(.22,1,.36,1); }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-selected="true"]::before { opacity: 1; }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > [data-inner-circle-preview="unread"] { position: absolute; inset: 0; display: block; width: 100% !important; height: 100% !important; aspect-ratio: auto; opacity: 0; pointer-events: none; transition: opacity 480ms cubic-bezier(.22,1,.36,1); }
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key][data-ic-unread="true"]:not([data-ic-selected="true"]) [data-inner-circle-preview="unread"] { opacity: 1; }
body.inner-circle-preview .ic-unread-wash { position: absolute; top: 0; right: 0; width: 48%; height: 48%; background: radial-gradient(ellipse at 100% 0%, #123a30ee 0%, #173e32c9 30%, #214b3d66 58%, #214b3d00 80%); }
body.inner-circle-preview .ic-unread-icon { position: absolute; top: 5%; right: 5%; width: clamp(24px,7cqw,42px); height: clamp(24px,7cqw,42px); color: #d9eee4; filter: drop-shadow(0 2px 3px #0d241fcc); }
body.inner-circle-preview .ic-unread-icon svg { display: block; width: 100%; height: 100%; }
/* Retain the native accessible unread label, replacing only its visible dot. */
body.inner-circle-preview [data-ic-notice-ready="true"] [data-ic-native-dot="unread"] { position: absolute; width: 1px !important; height: 1px !important; overflow: hidden; clip-path: inset(50%); }
body.inner-circle-preview [data-ic-notice-ready="true"] [data-ic-native-dot="quiet"] { display: none; }
body.inner-circle-preview [data-ic-notice-ready="true"] > div:nth-child(2) > div:first-child > div:first-child > span:has([data-ic-native-dot="unread"]),
body.inner-circle-preview [data-ic-notice-ready="true"] > div:nth-child(2) > div:first-child > div:first-child > span:has([data-ic-native-dot="quiet"]) { width: 0; flex: 0 0 0; }
/* Age hints yield the notification corner and keep a fixed anchor below it. */
body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2) > div:first-child > span:last-child { top: auto; bottom: 2.5rem; }
@container (max-width: 220px) {
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key],
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:is(:hover,[data-ic-selected="true"],[class*="ui-row-active-background"]) { background: transparent; }
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child { position: static; overflow: visible; }
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:first-child > [data-inner-circle-preview="unread"] { inset: 50% 8px auto auto; width: 17px !important; height: 17px !important; transform: translateY(-50%); }
 body.inner-circle-preview .ic-unread-wash { display: none; }
 body.inner-circle-preview .ic-unread-icon { position: static; display: block; width: 17px; height: 17px; }
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key] > div:nth-child(2),
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]:is(:hover,[data-ic-selected="true"],[class*="ui-row-active-background"]) > div:nth-child(2) { padding-right: 22px; background: transparent; }
}
@media (prefers-reduced-motion: reduce) {
 body.inner-circle-preview [data-slot="bots-roster"] [data-roster-key]::before,
 body.inner-circle-preview [data-inner-circle-preview="unread"] { transition: none !important; }
}

`

const MAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2.5" fill="currentColor"/><path d="m3 7 7.93 5.04a2 2 0 0 0 2.14 0L21 7" fill="none" stroke="#29433d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

const OWN = 'data-inner-circle-preview'
const CHAT = 'data-inner-circle-chat'

// Native registry identity only. A label or matching transcript is never proof.
export function canonicalMatch(profiles, session, hint, connectionId) {
  if (!session) return null
  const matches = (profiles || []).filter(p => p.canonical_session?.id === session || p.canonical_session?.resolved_id === session)
  if (matches.length !== 1 || !matches[0].name) return null
  const profile = matches[0].name
  if (hint && (hint.connectionId !== connectionId || hint.profile !== profile)) return null
  return {profile, connectionId, session}
}

export function paintChat(document, proof, state) {
  const surfaces = [...document.querySelectorAll('[data-chat-surface]')]
  for (const surface of surfaces) {
    const anchor = surface.getAttribute('data-session-anchor')
    const visible = !surface.closest('[data-pane-hidden]')
    const belongs = proof && state.session === proof.session && visible &&
      (anchor === `session-tile:${proof.session}` ||
        (anchor === 'workspace' && state.focused && state.focused === state.active))
    if (!belongs) {
      surface.removeAttribute(CHAT)
      surface.querySelector(`[${OWN}="profile-header"]`)?.remove()
      continue
    }
    surface.setAttribute(CHAT, '')
    const row = [...document.querySelectorAll('[data-slot="bots-roster"] [data-roster-key]')].find(el =>
      el.getAttribute('data-roster-key') === `${proof.connectionId}::${proof.profile}` ||
      (proof.connectionId === 'local' && el.getAttribute('data-roster-key') === `legacy::${proof.profile}`))
    if (!row) continue
    let header = surface.querySelector(`[${OWN}="profile-header"]`)
    if (!header) {
      header = document.createElement('div')
      header.setAttribute(OWN, 'profile-header')
      const label = document.createElement('div')
      label.className = 'ic-profile-name'
      header.append(label)
      surface.prepend(header)
    }
    const name = (row.getAttribute('aria-label') || proof.profile).split(' · ')[0]
    const label = header.querySelector('.ic-profile-name')
    if (label.textContent !== name) label.textContent = name
    const photo = row.querySelector('img')
    let portrait = header.querySelector('img')
    if (photo) {
      if (!portrait) { portrait = document.createElement('img'); portrait.alt = ''; header.prepend(portrait) }
      if (portrait.src !== photo.src) portrait.src = photo.src
    } else portrait?.remove()
  }
}

export function createRosterControls(ctx) {
  const doc = document
  const win = doc.defaultView
  const storageKey = 'rosterOrder.v1'
  const selector = '[data-slot="bots-roster"] [data-roster-key]'
  const keyOf = row => row.getAttribute('data-roster-key')
  let orders = ctx.storage.get(storageKey, {})
  if (!orders || typeof orders !== 'object' || Array.isArray(orders)) orders = {}
  const owned = new Map()
  const overlays = new Set()
  let dragging = null, marker = null, selectedKey = null
  const canOrder = Boolean(win?.CSS?.supports?.('reading-flow', 'grid-rows'))
  const announcement = doc.createElement('div')
  announcement.setAttribute('data-ic-roster-live', '')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)'
  doc.body.append(announcement)

  function read(el, name, kind) {
    return kind === 'style' ? el.style.getPropertyValue(name) : kind === 'text' ? el.textContent : el.getAttribute(name)
  }
  function write(el, name, value, kind = 'attribute') {
    const id = `${kind}:${name}`
    if (!owned.has(el)) owned.set(el, new Map())
    const fields = owned.get(el)
    if (!fields.has(id)) fields.set(id, {name, kind, before: read(el, name, kind), value})
    fields.get(id).value = value
    if (read(el, name, kind) === value) return
    if (kind === 'style') el.style.setProperty(name, value)
    else if (kind === 'text') el.textContent = value
    else el.setAttribute(name, value)
  }
  function restore(stylesOnly = false) {
    for (const [el, fields] of owned) {
      for (const [id, field] of fields) {
        if (stylesOnly && field.kind !== 'style') continue
        if (read(el, field.name, field.kind) === field.value) {
          if (field.kind === 'style') field.before ? el.style.setProperty(field.name, field.before) : el.style.removeProperty(field.name)
          else if (field.kind === 'text') el.textContent = field.before
          else field.before === null ? el.removeAttribute(field.name) : el.setAttribute(field.name, field.before)
        }
        fields.delete(id)
      }
      if (!fields.size) owned.delete(el)
    }
  }
  function group(row) {
    if (!row?.matches?.(selector)) return null
    const grid = row.parentElement
    const rows = [...grid.children]
    const section = grid.closest('[data-slot="bots-section"]')?.querySelector('[data-section-id]')?.getAttribute('data-section-id')
    // Mixed group-chat grids keep native order until they have stable row keys.
    if (!section || !rows.every(item => item.hasAttribute('data-roster-key'))) return null
    const source = keyOf(row).split('::')[0]
    if (rows.some(item => keyOf(item).split('::')[0] !== source)) return null
    return {grid, rows, scope: JSON.stringify([section, source])}
  }
  function ordered(info) {
    const stored = Array.isArray(orders[info.scope]) ? orders[info.scope].filter(key => typeof key === 'string') : []
    return [...new Set([...stored, ...info.rows.map(keyOf)])]
  }
  function paint() {
    for (const [el] of owned) if (!el.isConnected) owned.delete(el)
    for (const el of overlays) if (!el.isConnected) overlays.delete(el)
    const grids = new Set()
    for (const row of doc.querySelectorAll(selector)) {
      const info = group(row)
      write(row, 'data-ic-selected', String(keyOf(row) === selectedKey))
      const avatar = row.querySelector(':scope > div:first-child')
      const ready = Boolean(avatar?.firstElementChild?.matches('img,svg,span') && !avatar.firstElementChild.hasAttribute(OWN))
      if (ready && !avatar.querySelector(`[${OWN}="unread"]`)) {
        const overlay = doc.createElement('span')
        overlay.setAttribute(OWN, 'unread')
        overlay.setAttribute('aria-hidden', 'true')
        overlay.innerHTML = `<span class="ic-unread-wash"></span><span class="ic-unread-icon">${MAIL}</span>`
        avatar.append(overlay)
        overlays.add(overlay)
      }
      const dot = [...row.querySelectorAll(':scope > div:nth-child(2) span')].find(el =>
        el.classList.contains('rounded-full') && (el.classList.contains('size-1.5') || el.classList.contains('size-1')))
      const unread = Boolean(dot?.classList.contains('bg-(--ui-success)') && dot.getAttribute('role') === 'status')
      const quiet = Boolean(dot && (dot.classList.contains('bg-(--ui-text-quaternary)') || dot.classList.contains('border-(--ui-text-quaternary)')))
      if (dot) write(dot, 'data-ic-native-dot', unread ? 'unread' : quiet ? 'quiet' : 'active')
      write(row, 'data-ic-notice-ready', String(ready))
      write(row, 'data-ic-unread', String(ready && unread && keyOf(row) !== selectedKey))
      const status = row.querySelector('[role="status"][aria-label]')?.getAttribute('aria-label') || 'Quiet / already read'
      const help = `${row.getAttribute('aria-label') || ''}\n${status}. The envelope means a new unread reply, not online presence.${info && canOrder ? '\nDrag within this folder to reorder. Alt+Up / Alt+Down also moves a bot.' : ''}`
      write(row, 'title', help)
      if (!canOrder || !info || grids.has(info.grid) || !Array.isArray(orders[info.scope])) continue
      grids.add(info.grid)
      const list = ordered(info)
      write(info.grid, 'reading-flow', 'grid-rows', 'style')
      for (const item of info.rows) write(item, 'order', String(list.indexOf(keyOf(item))), 'style')
    }
    paintAges()
  }
  function paintAges() {
    if (!queryClient?.getQueriesData || !coarseElapsed || !translateNow) return
    const latest = new Map()
    for (const [, snapshot] of queryClient.getQueriesData({queryKey: ['hermes-bots', 'roster']})) {
      for (const bot of snapshot?.profiles || []) {
        const key = `${bot.connectionId || 'legacy'}::${bot.name}`
        if ((latest.get(key)?.at || -1) <= (snapshot.fetchedAt || 0)) latest.set(key, {at: snapshot.fetchedAt || 0, bot})
      }
    }
    for (const row of doc.querySelectorAll(selector)) {
      const bot = latest.get(keyOf(row))?.bot
      const timestamp = Math.max(bot?.canonical_session?.last_active || 0, bot?.last_session?.last_active || 0, bot?.worker_session?.last_active || 0)
      const age = row.querySelector(':scope > div:nth-child(2) > div:first-child > span:last-child')
      if (!age || !timestamp) continue
      const {unit, value} = coarseElapsed(Date.now() - timestamp * 1000)
      const label = unit === 'second' ? translateNow('sidebar.row.ageNow') : `${value}${translateNow(`sidebar.row.${unit === 'day' ? 'ageDay' : unit === 'hour' ? 'ageHour' : 'ageMin'}`)}`
      write(age, '', label, 'text')
      write(age, 'title', `Last recorded activity: ${new Date(timestamp * 1000).toLocaleString()}`)
    }
  }
  function clear() {
    marker?.removeAttribute('data-ic-drop-edge')
    marker = null
  }
  function commit(info, list) {
    const next = {...ctx.storage.get(storageKey, {}), [info.scope]: list}
    ctx.storage.set(storageKey, next)
    if (JSON.stringify(ctx.storage.get(storageKey, {})[info.scope]) !== JSON.stringify(list)) {
      host.notify?.({kind: 'error', message: 'Could not save the bot order. Please try again.'})
      return false
    }
    orders = next
    paint()
    return true
  }
  function target(event) {
    const row = event.target.closest?.('[data-roster-key]')
    const info = group(row)
    if (!dragging || !dragging.row.isConnected || !info || info.grid !== dragging.grid || row === dragging.row) return null
    const rect = row.getBoundingClientRect()
    const gallery = win.getComputedStyle(info.grid).gridTemplateColumns.trim().split(/\s+/).length > 1
    const rtl = win.getComputedStyle(info.grid).direction === 'rtl'
    const before = gallery ? (event.clientX < rect.left + rect.width / 2) !== rtl : event.clientY < rect.top + rect.height / 2
    return {...info, row, before, edge: gallery ? (before !== rtl ? 'left' : 'right') : (before ? 'top' : 'bottom')}
  }
  const listeners = {
    dragstart(event) {
      clear()
      const row = event.target.closest?.('[data-roster-key]'), info = group(row)
      dragging = canOrder && info ? {...info, row, key: keyOf(row)} : null
      if (dragging) announcement.textContent = `Moving ${row.getAttribute('aria-label')?.split(' · ')[0]}. Drop before or after a bot in this folder.`
    },
    dragover(event) {
      const info = target(event)
      clear()
      if (!info || !event.dataTransfer?.types.includes('application/x-hermes-bot-key')) return
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'move'
      marker = info.row
      marker.setAttribute('data-ic-drop-edge', info.edge)
    },
    drop(event) {
      const info = target(event), source = dragging
      clear()
      dragging = null
      if (!info || event.dataTransfer?.getData('application/x-hermes-bot-key') !== source.key) return
      event.preventDefault()
      event.stopPropagation()
      const list = ordered(info).filter(key => key !== source.key)
      list.splice(list.indexOf(keyOf(info.row)) + (info.before ? 0 : 1), 0, source.key)
      if (commit(info, list)) announcement.textContent = `${source.row.getAttribute('aria-label')?.split(' · ')[0]} moved ${info.before ? 'before' : 'after'} ${info.row.getAttribute('aria-label')?.split(' · ')[0]}.`
    },
    dragend() { clear(); dragging = null },
    keydown(event) {
      if (event.key === 'Escape') { clear(); dragging = null; return }
      if (!canOrder || !event.altKey || event.ctrlKey || event.metaKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return
      const row = event.target.closest?.('[data-roster-key]'), info = group(row)
      if (!info) return
      const list = ordered(info), visible = list.filter(key => info.rows.some(item => keyOf(item) === key))
      const index = visible.indexOf(keyOf(row)), other = visible[index + (event.key === 'ArrowUp' ? -1 : 1)]
      if (!other) return
      event.preventDefault(); event.stopPropagation()
      const a = list.indexOf(keyOf(row)), b = list.indexOf(other)
      ;[list[a], list[b]] = [list[b], list[a]]
      if (commit(info, list)) {
        announcement.textContent = `${row.getAttribute('aria-label')?.split(' · ')[0]} moved ${event.key === 'ArrowUp' ? 'up' : 'down'}.`
        row.scrollIntoView?.({block: 'nearest', inline: 'nearest'})
      }
    }
  }
  for (const [type, listener] of Object.entries(listeners)) doc.addEventListener(type, listener, true)
  return {
    paint,
    select(route) { selectedKey = route ? `${route.connectionId}::${route.profile}` : null },
    reset() { ctx.storage.set(storageKey, {}); orders = {}; restore(true); paint() },
    dispose() {
      for (const [type, listener] of Object.entries(listeners)) doc.removeEventListener(type, listener, true)
      clear(); dragging = null; restore(); announcement.remove(); overlays.forEach(el => el.remove()); overlays.clear()
    }
  }
}

export default {
  id: 'inner-circle-preview',
  name: 'Inner Circle Preview',
  description: 'Experimental sage chat styling and a responsive portrait roster.',
  defaultEnabled: false,
  register(ctx) {
    let disposed = false, revision = 0, proof = null, frame = 0
    const read = atom => atom?.get?.()
    const session = () => read(host.state.focusedStoredSessionId)
    const connection = () => read(host.state.connectionId)
    let hideSessions = ctx.storage.get('hideSessions', false)
    const style = document.createElement('style')
    style.setAttribute(OWN, 'style')
    style.textContent = CSS_TEXT
    document.head.append(style)
    document.body.classList.add('inner-circle-preview')
    document.body.classList.toggle('ic-hide-sessions', hideSessions)
    const rosterControls = createRosterControls(ctx)
    function paint() {
      frame = 0
      if (disposed) return
      rosterControls.select(proof?.session === session() ? {connectionId: proof.connectionId, profile: proof.profile} : null)
      rosterControls.paint()
      paintChat(document, proof, {session: session(), focused: read(host.state.focusedSessionId), active: read(host.state.activeSessionId)})
    }
    function schedule() { if (!disposed && !frame) frame = requestAnimationFrame(paint) }
    async function refresh() {
      const generation = ++revision, stored = session(), sourceKey = connection()
      if (!stored) { proof = null; schedule(); return }
      try {
        const sources = (await host.connections()).filter(c => sourceKey ? c.id === sourceKey : c.primary)
        // Remote sources are deliberately stock in this first local-only preview.
        if (sources.length !== 1 || sources[0].kind !== 'local') {
          if (generation === revision && !disposed) { proof = null; schedule() }
          return
        }
        const result = await host.request('profiles.list', {include_sessions: true})
        if (disposed || generation !== revision || session() !== stored || connection() !== sourceKey) return
        proof = canonicalMatch(result.profiles, stored, read(host.state.focusedSessionOwner), sources[0].id)
        schedule()
      } catch {
        if (!disposed && generation === revision) { proof = null; schedule() }
      }
    }
    const observer = new MutationObserver(records => {
      if (records.some(r => !r.target.closest?.(`[${OWN}]`) &&
        ((r.type === 'attributes' && (r.attributeName !== 'class' || r.target.closest?.('[data-roster-key]'))) || r.type === 'characterData' ||
          [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType !== 1 || !n.hasAttribute(OWN))))) schedule()
    })
    observer.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['src', 'aria-label', 'class', 'data-session-anchor', 'data-pane-hidden']})
    for (const atom of [host.state.focusedStoredSessionId, host.state.focusedSessionOwner, host.state.connectionId]) {
      if (atom?.listen) ctx.onDispose(atom.listen(() => { proof = null; schedule(); void refresh() }))
    }
    for (const atom of [host.state.focusedSessionId, host.state.activeSessionId]) {
      if (atom?.listen) ctx.onDispose(atom.listen(schedule))
    }
    ctx.setInterval(() => { schedule(); void refresh() }, 15000)
    if (queryClient?.getQueryCache) ctx.onDispose(queryClient.getQueryCache().subscribe(event => {
      if (event.query?.queryKey?.[0] === 'hermes-bots' && event.query.queryKey[1] === 'roster') schedule()
    }))
    ctx.register({id: 'roster-order', area: PALETTE_AREA, data: {
      id: 'inner-circle-preview.roster-order', label: 'Inner Circle Preview: reset custom bot order',
      run: () => rosterControls.reset()
    }})
    ctx.register({id: 'sessions', area: PALETTE_AREA, data: {
      id: 'inner-circle-preview.sessions', label: 'Inner Circle Preview: show or hide Sessions',
      run: () => {
        hideSessions = !hideSessions
        ctx.storage.set('hideSessions', hideSessions)
        document.body.classList.toggle('ic-hide-sessions', hideSessions)
        if (!hideSessions) host.revealPane?.('sessions')
      }
    }})
    ctx.onDispose(() => {
      disposed = true; revision++
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      rosterControls.dispose()
      style.remove()
      document.querySelectorAll(`[${OWN}]`).forEach(el => el.remove())
      document.querySelectorAll(`[${CHAT}]`).forEach(el => el.removeAttribute(CHAT))
      document.body.classList.remove('inner-circle-preview', 'ic-hide-sessions')
    })
    void refresh()
  }
}
