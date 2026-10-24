import { PALETTE_AREA, host } from '@hermes/plugin-sdk'

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
body.inner-circle-preview [data-chat-surface][data-inner-circle-chat] [data-slot="aui_assistant-message-content"] > .aui-md:not(:has(pre,table,audio,video)) { width: fit-content; max-width: 72%; }
`

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
    function paint() {
      frame = 0
      if (disposed) return
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
        (r.type === 'attributes' || r.type === 'characterData' ||
          [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType !== 1 || !n.hasAttribute(OWN))))) schedule()
    })
    observer.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['src', 'aria-label', 'data-session-anchor', 'data-pane-hidden']})
    for (const atom of [host.state.focusedStoredSessionId, host.state.focusedSessionOwner, host.state.connectionId]) {
      if (atom?.listen) ctx.onDispose(atom.listen(() => { proof = null; schedule(); void refresh() }))
    }
    for (const atom of [host.state.focusedSessionId, host.state.activeSessionId]) {
      if (atom?.listen) ctx.onDispose(atom.listen(schedule))
    }
    ctx.setInterval(() => void refresh(), 15000)
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
      style.remove()
      document.querySelectorAll(`[${OWN}]`).forEach(el => el.remove())
      document.querySelectorAll(`[${CHAT}]`).forEach(el => el.removeAttribute(CHAT))
      document.body.classList.remove('inner-circle-preview', 'ic-hide-sessions')
    })
    void refresh()
  }
}
