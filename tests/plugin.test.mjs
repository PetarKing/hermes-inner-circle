import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'

const source = fs.readFileSync(new URL('../plugin.js', import.meta.url), 'utf8')
  .replace(/^import .* from '@hermes\/plugin-sdk'$/m, 'const {PALETTE_AREA, host, queryClient, coarseElapsed, translateNow} = sdk')
  .replace('export const CSS_TEXT', 'const CSS_TEXT')
  .replace(/export function /g, 'function ')
  .replace('export default {', 'globalThis.plugin = {')
  + '\nglobalThis.hooks = {canonicalMatch, paintChat};'

function setup(host = {state: {}}) {
  const dom = new JSDOM('<body><aside data-slot="bots-roster"><button data-roster-key="local::willow" aria-label="Willow · @willow"><img src="old.svg"></button></aside><main data-chat-surface data-session-anchor="session-tile:canonical"></main></body>', {pretendToBeVisual: true})
  const frames = [], disposers = [], commands = []
  const context = vm.createContext({document: dom.window.document, sdk: {host, PALETTE_AREA:'palette'},
    requestAnimationFrame: fn => {frames.push(fn); return frames.length}, cancelAnimationFrame() {},
    MutationObserver: class {observe() {} disconnect() {}}})
  vm.runInContext(source, context)
  const ctx = {storage: {get: (_,fallback) => fallback, set() {}}, setInterval() {},
    onDispose: fn => disposers.push(fn), register: command => commands.push(command)}
  const flush = () => {while (frames.length) frames.shift()()}
  return {document: dom.window.document, context, hooks: context.hooks, frames, disposers, commands, ctx, flush}
}
const row = {name:'willow', canonical_session:{id:'root',resolved_id:'canonical'}}
const state = {session:'canonical', focused:'focus', active:'focus'}
const proof = {session:'canonical',profile:'willow',connectionId:'local'}

test('only a unique native canonical id or compression tip proves a chat', () => {
  const {hooks} = setup()
  assert.equal(hooks.canonicalMatch([row], 'canonical', null, 'local').profile, 'willow')
  assert.equal(hooks.canonicalMatch([row], 'root', null, 'local').profile, 'willow')
  assert.equal(hooks.canonicalMatch([row], 'side-chat', null, 'local'), null)
  assert.equal(hooks.canonicalMatch([row,row], 'canonical', null, 'local'), null)
  assert.equal(hooks.canonicalMatch([row], 'canonical', {profile:'other',connectionId:'local'}, 'local'), null)
})

test('another visible conversation and hidden panes never borrow the selected chat styling', () => {
  const {document,hooks} = setup()
  const other = document.createElement('section')
  other.dataset.chatSurface = ''; other.dataset.sessionAnchor = 'session-tile:other'
  document.body.append(other)
  hooks.paintChat(document,proof,state)
  assert.equal(document.querySelectorAll('[data-inner-circle-chat]').length,1)
  assert.equal(other.hasAttribute('data-inner-circle-chat'),false)
  document.querySelector('main').setAttribute('data-pane-hidden','')
  hooks.paintChat(document,proof,state)
  assert.equal(document.querySelectorAll('[data-inner-circle-chat]').length,0)
})

test('header follows native avatar/name edits and treats names as inert text', () => {
  const {document,hooks} = setup()
  hooks.paintChat(document,proof,state)
  document.querySelector('aside img').src = 'new.svg'
  document.querySelector('button').setAttribute('aria-label','<script>bad()</script> · @willow')
  hooks.paintChat(document,proof,state)
  assert.equal(document.querySelector('main img').src,'new.svg')
  assert.equal(document.querySelector('main script'),null)
  assert.equal(document.querySelectorAll('[data-inner-circle-preview="profile-header"]').length,1)
})

test('remote sources stay stock and do not trigger a local roster request', async () => {
  let calls=0
  const {context,ctx,flush,document}=setup({state:{focusedStoredSessionId:{get:()=> 'canonical'},connectionId:{get:()=> 'remote'}},
    connections:async()=>[{id:'remote',kind:'ssh'}],request:async()=>{calls++;return {profiles:[row]}}})
  context.plugin.register(ctx)
  await new Promise(r=>setImmediate(r));flush()
  assert.equal(calls,0)
  assert.equal(document.querySelectorAll('[data-inner-circle-chat]').length,0)
})

test('a focus change fences an in-flight registry result', async () => {
  let focused='canonical',resolve
  const {context,ctx,flush,document}=setup({state:{focusedStoredSessionId:{get:()=>focused},connectionId:{get:()=>null}},
    connections:async()=>[{id:'local',kind:'local',primary:true}],request:()=>new Promise(r=>{resolve=r})})
  context.plugin.register(ctx)
  await new Promise(r=>setImmediate(r));focused='other'
  resolve({profiles:[row]});await new Promise(r=>setImmediate(r));flush()
  assert.equal(document.querySelectorAll('[data-inner-circle-chat]').length,0)
})

test('the local proof uses read-only metadata; Sessions stays visible until explicitly toggled', async () => {
  const calls=[]
  const {context,ctx,flush,document,commands}=setup({state:{focusedStoredSessionId:{get:()=> 'canonical'},connectionId:{get:()=>null}},
    connections:async()=>[{id:'local',kind:'local',primary:true}],request:async(method,params)=>{calls.push({method,params});return {profiles:[row]}}})
  context.plugin.register(ctx)
  await new Promise(r=>setImmediate(r));flush()
  assert.equal(document.querySelectorAll('[data-inner-circle-chat]').length,1)
  assert.equal(document.body.classList.contains('ic-hide-sessions'),false)
  assert.deepEqual(JSON.parse(JSON.stringify(calls)),[{method:'profiles.list',params:{include_sessions:true}}])
  commands.find(command => command.id === 'sessions').data.run()
  assert.equal(document.body.classList.contains('ic-hide-sessions'),true)
})

test('disposal fences a late response and removes only owned presentation', async () => {
  let resolve
  const {context,ctx,disposers,flush,document}=setup({state:{focusedStoredSessionId:{get:()=> 'canonical'},connectionId:{get:()=>null}},
    connections:async()=>[{id:'local',kind:'local',primary:true}],request:()=>new Promise(r=>{resolve=r})})
  context.plugin.register(ctx)
  await new Promise(r=>setImmediate(r));disposers.forEach(fn=>fn())
  resolve({profiles:[row]});await new Promise(r=>setImmediate(r));flush()
  assert.equal(document.querySelectorAll('[data-inner-circle-preview],[data-inner-circle-chat]').length,0)
  assert.equal(document.body.classList.contains('inner-circle-preview'),false)
  assert.ok(document.querySelector('main'))
  assert.ok(document.querySelector('aside img'))
})
