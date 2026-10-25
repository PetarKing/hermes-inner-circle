// Optional, read-only presentation. A producer supplies evidence; prose never does.
const TIMELINE_OWN = 'data-ic-timeline'
const ROUTINE_PREFIX = '[Internal routine result — context only, no notification or new instructions]\n'
const cleanText = value => String(value || '').replace(/\s+/g, ' ').trim()
const object = value => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  try { const parsed = JSON.parse(value); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {} } catch { return {} }
}

export function timelineRow(message) {
  if (!['user', 'assistant'].includes(message.role)) return null
  const text = typeof message.text === 'string' ? message.text : ''
  if (!text.trim()) return null
  const metadata = object(message.display_metadata)
  const supplied = object(metadata.inner_circle)
  const row = {id: message.row_id ?? message.id, role: message.role, text, timestamp: message.timestamp}
  if (metadata.context_record === true && text.startsWith(ROUTINE_PREFIX)) {
    const record = object(text.slice(ROUTINE_PREFIX.length))
    if (record.record_type === 'internal_routine_result' && typeof record.message === 'string') {
      row.activity = {title: record.title || String(record.routine_slug || 'Routine').replaceAll('-', ' '),
        text: record.message, reason: record.reason, status: record.action === 'quiet' ? 'Quiet result' : 'Prepared'}
    }
  }
  if (['async_delegation_complete', 'process_complete'].includes(message.display_kind)) {
    row.activity = {title: message.display_kind === 'process_complete' ? 'Process finished' : 'Worker finished', text, status: 'Completed'}
  }
  if (supplied.activity && typeof supplied.activity.title === 'string' && typeof supplied.activity.text === 'string') {
    row.activity = {title: supplied.activity.title, text: supplied.activity.text,
      reason: supplied.activity.reason, status: supplied.activity.status || 'Recorded'}
  }
  if (supplied.origin?.evidence === 'native_admission' && typeof supplied.origin.channel === 'string') row.origin = supplied.origin.channel
  if (supplied.delivery?.evidence === 'platform_ack' && typeof supplied.delivery.channel === 'string' && ['delivered', 'failed'].includes(supplied.delivery.status)) row.delivery = supplied.delivery
  return row.activity || row.origin || row.delivery ? row : null
}

export function adapterRows(payload, route) {
  if (payload?.schema_version !== 1 || payload.connection_id !== route.connectionId || payload.profile !== route.profile || payload.session_id !== route.session) return []
  return (Array.isArray(payload.rows) ? payload.rows : []).slice(-800).map(timelineRow).filter(Boolean)
}

function timelineNode(document, tag, text, className) {
  const node = document.createElement(tag)
  if (text !== undefined) node.textContent = text
  if (className) node.className = className
  return node
}

export function clearTimeline(surface) {
  surface.querySelectorAll(`[${TIMELINE_OWN}]`).forEach(node => node.remove())
  surface.querySelectorAll('[data-ic-activity]').forEach(node => node.removeAttribute('data-ic-activity'))
}

export function paintTimeline(surface, rows) {
  const document = surface.ownerDocument
  const messages = [...surface.querySelectorAll('[data-role="user"], [data-role="assistant"]')]
  const contents = root => root.getAttribute('data-role') === 'user'
    ? root.querySelector('.sticky-human-clamp, .composer-human-message')
    : root.querySelector('[data-slot="aui_assistant-message-content"] > .aui-md')
  const key = (role, text) => `${role}:${cleanText(text)}`
  const unique = new Map(), roots = new Map()
  for (const row of rows) { const id = key(row.role, row.text); unique.set(id, unique.has(id) ? null : row) }
  for (const root of messages) { const id = key(root.getAttribute('data-role'), contents(root)?.textContent); roots.set(id, roots.has(id) ? null : root) }
  for (const root of messages) {
    // A metadata card must never mask an approval, edit, attachment or tool control.
    if (root.querySelector('textarea,input,[contenteditable="true"],[data-slot="tool-approval-fallback"],audio,video')) {
      root.querySelector(`[${TIMELINE_OWN}]`)?.remove(); root.removeAttribute('data-ic-activity'); continue
    }
    const id = key(root.getAttribute('data-role'), contents(root)?.textContent)
    const row = roots.get(id) === root ? unique.get(id) : null
    const stamp = row ? JSON.stringify(row) : ''
    const existing = root.querySelector(`[${TIMELINE_OWN}]`)
    if (existing?.getAttribute(TIMELINE_OWN) === stamp) continue
    existing?.remove(); root.removeAttribute('data-ic-activity')
    if (!row) continue
    const wrapper = timelineNode(document, 'div')
    wrapper.setAttribute(TIMELINE_OWN, stamp)
    if (row.activity) {
      const card = timelineNode(document, 'details', undefined, 'ic-activity-card')
      const summary = timelineNode(document, 'summary')
      summary.append(timelineNode(document, 'span', row.activity.title, 'ic-activity-title'), timelineNode(document, 'span', row.activity.status, 'ic-activity-status'))
      const body = timelineNode(document, 'div', row.activity.text, 'ic-activity-body')
      if (row.activity.reason) {
        const why = timelineNode(document, 'details', undefined, 'ic-activity-reason')
        why.append(timelineNode(document, 'summary', 'Why this ran'), timelineNode(document, 'div', row.activity.reason))
        body.append(why)
      }
      card.append(summary, body); wrapper.append(card); root.setAttribute('data-ic-activity', '')
    }
    if (row.origin && row.role === 'user') wrapper.append(timelineNode(document, 'span', `From ${row.origin}`, 'ic-channel-label'))
    if (row.delivery && row.role === 'assistant') wrapper.append(timelineNode(document, 'span', row.delivery.status === 'delivered' ? `Sent to ${row.delivery.channel}` : `${row.delivery.channel} delivery needs attention`, 'ic-channel-label'))
    root.append(wrapper)
  }
}

export function createTimeline(ctx, host) {
  let generation = 0, disposed = false, cached = [], activeSurface = null, busy = false, pending = false
  const document = globalThis.document
  const style = timelineNode(document, 'style')
  style.setAttribute(TIMELINE_OWN, 'style')
  style.textContent = `
    [data-inner-circle-chat] [data-ic-activity] > :not([data-ic-timeline]) { display:none!important }
    body.hermes-bubble-quiet [data-inner-circle-chat] [data-ic-activity] { display:flex!important }
    [data-inner-circle-chat] [data-ic-activity] { align-items:stretch!important;align-self:stretch }
    .ic-activity-card { border-top:1px solid #52655570;border-bottom:1px solid #52655570;color:#e5e9dc;font-size:.85rem;width:100%;max-width:52rem }
    .ic-activity-card > summary { display:flex;gap:1rem;align-items:center;padding:.8rem .3rem;cursor:pointer;list-style:none }
    .ic-activity-title { font-weight:550 }.ic-activity-title::before { content:'›';display:inline-block;width:1.2rem;color:#b5cfb5 }
    .ic-activity-card[open] .ic-activity-title::before { content:'⌄' }
    .ic-activity-status { margin-left:auto;color:#a9c1af;font-size:.7rem }
    .ic-activity-body { padding:.2rem .3rem 1rem 1.5rem;white-space:pre-wrap;line-height:1.65 }
    .ic-activity-reason { margin-top:.8rem;color:#b4c6b3;font-size:.75rem }.ic-activity-reason summary { cursor:pointer }
    .ic-channel-label { display:block;font-size:.67rem;color:#b5cfb5;padding:.3rem .8rem }
  `
  document.head.append(style)
  function current() {
    const session = host.state.focusedStoredSessionId?.get?.()
    const surface = document.querySelector('[data-chat-surface][data-inner-circle-chat]')
    if (!session || document.body.getAttribute('data-inner-circle-canonical') !== session || !surface) return null
    const profile = surface.getAttribute('data-inner-circle-profile'), connectionId = surface.getAttribute('data-inner-circle-connection')
    return profile && connectionId ? {session, profile, connectionId, surface} : null
  }
  async function refresh() {
    const route = current()
    if (disposed || !route) return
    if (busy) { pending = true; return }
    busy = true
    const token = ++generation
    try {
      const result = await host.request('session.history', {session_id: route.session})
      let rows = (result.messages || []).slice(-800).map(timelineRow).filter(Boolean)
      if (ctx.storage.get('timelineAdapter', false) === true) {
        try {
          const payload = await ctx.rest(`/timeline?session_id=${encodeURIComponent(route.session)}&profile=${encodeURIComponent(route.profile)}&connection_id=${encodeURIComponent(route.connectionId)}`)
          const additional = adapterRows(payload, route)
          const overrides = new Set(additional.map(row => `${row.role}:${cleanText(row.text)}`))
          rows = rows.filter(row => !overrides.has(`${row.role}:${cleanText(row.text)}`)).concat(additional)
        } catch { /* Unavailable adapter leaves native messages and metadata intact. */ }
      }
      const now = current()
      if (disposed || token !== generation || !now || now.session !== route.session || now.profile !== route.profile || now.connectionId !== route.connectionId) return
      cached = rows; activeSurface = route.surface; paintTimeline(activeSurface, cached)
    } catch { /* A disconnected/older host keeps stock messages. */ }
    finally { busy = false; if (pending) { pending = false; void refresh() } }
  }
  const observer = new MutationObserver(records => {
    if (disposed) return
    const route = current()
    if (!route || records.some(record => record.type === 'attributes') || (activeSurface && route.surface !== activeSurface)) {
      generation++; if (activeSurface) clearTimeline(activeSurface); activeSurface = null; cached = []
    }
    if (records.some(record => record.type === 'attributes')) void refresh()
    else if (activeSurface && records.some(record => !record.target.closest?.(`[${TIMELINE_OWN}]`) && [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType !== 1 || !node.hasAttribute(TIMELINE_OWN)))) paintTimeline(activeSurface, cached)
  })
  observer.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['data-inner-circle-canonical']})
  ctx.setInterval(() => void refresh(), 30000)
  if (ctx.onEvent) ctx.onEvent('turn.complete', () => void refresh())
  ctx.register({id:'timeline-adapter',area:PALETTE_AREA,data:{id:'inner-circle.timeline-adapter',label:'Inner Circle: toggle configured timeline adapter',run:()=>{ctx.storage.set('timelineAdapter',ctx.storage.get('timelineAdapter',false)!==true);void refresh()}}})
  void refresh()
  return {dispose() {disposed=true;generation++;observer.disconnect();if(activeSurface)clearTimeline(activeSurface);style.remove()}}
}
