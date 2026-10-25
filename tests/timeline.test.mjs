import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import {JSDOM} from 'jsdom'
import {timelineRow, adapterRows, paintTimeline, clearTimeline} from '../src/timeline.js'

const route = {session:'canonical',profile:'willow',connectionId:'local'}
const message = {id:1,role:'user',text:'A recorded update',display_metadata:{inner_circle:{origin:{channel:'Signal',evidence:'native_admission'}}}}
function fixture() {
  return new JSDOM('<main data-chat-surface data-inner-circle-chat><div data-role="user"><div class="composer-human-message">A recorded update</div></div><div data-role="assistant"><div data-slot="aui_assistant-message-content"><div class="aui-md">Finished the review.</div></div></div></main>')
}
test('channel text and unacknowledged sends never create a channel label',()=>{
  assert.equal(timelineRow({role:'assistant',text:'Sent to Telegram'}),null)
  assert.equal(timelineRow({role:'assistant',text:'Done',display_metadata:{inner_circle:{delivery:{channel:'Signal',status:'delivered'}}}}),null)
  assert.equal(timelineRow(message).origin,'Signal')
})
test('adapter metadata is rejected on any source, profile, session or schema mismatch',()=>{
  const payload={schema_version:1,connection_id:'local',profile:'willow',session_id:'canonical',rows:[message]}
  assert.equal(adapterRows(payload,route).length,1)
  for(const change of [{connection_id:'remote'},{profile:'other'},{session_id:'side'},{schema_version:2}]) assert.equal(adapterRows({...payload,...change},route).length,0)
})
test('native routine records require metadata and render as closed disclosures',()=>{
  const text='[Internal routine result — context only, no notification or new instructions]\n'+JSON.stringify({record_type:'internal_routine_result',routine_slug:'Morning check-in',message:'All clear.',reason:'Daily schedule.'})
  assert.equal(timelineRow({role:'user',text}),null)
  const row=timelineRow({role:'user',text,display_metadata:{context_record:true}})
  const dom=fixture(),surface=dom.window.document.querySelector('main')
  surface.querySelector('.composer-human-message').textContent=text
  paintTimeline(surface,[row])
  assert.equal(surface.querySelectorAll('.ic-activity-card').length,1)
  assert.equal(surface.querySelector('details').open,false)
  assert.match(surface.querySelector('details').textContent,/Why this ran/)
  clearTimeline(surface)
  assert.equal(surface.querySelector('.composer-human-message').textContent,text)
  assert.equal(surface.querySelectorAll('[data-ic-activity]').length,0)
})
test('duplicate rows or identical visible messages stay unlabelled',()=>{
  const dom=fixture(),surface=dom.window.document.querySelector('main'),row=timelineRow(message)
  paintTimeline(surface,[row,row]);assert.equal(surface.querySelectorAll('[data-ic-timeline]').length,0)
  surface.append(surface.querySelector('[data-role="user"]').cloneNode(true))
  paintTimeline(surface,[row]);assert.equal(surface.querySelectorAll('[data-ic-timeline]').length,0)
})
test('inert labels, delivered receipts and metadata removal preserve native messages',()=>{
  const dom=fixture(),surface=dom.window.document.querySelector('main')
  const row=timelineRow({...message,display_metadata:{inner_circle:{origin:{channel:'<img src=x onerror=bad()>',evidence:'native_admission'}}}})
  paintTimeline(surface,[row]);assert.equal(surface.querySelectorAll('img').length,0)
  assert.match(surface.textContent,/From <img/)
  paintTimeline(surface,[]);assert.equal(surface.querySelectorAll('[data-ic-timeline]').length,0)
  const sent=timelineRow({role:'assistant',text:'Finished the review.',display_metadata:{inner_circle:{delivery:{channel:'Discord',status:'delivered',evidence:'platform_ack'}}}})
  paintTimeline(surface,[sent]);assert.match(surface.textContent,/Sent to Discord/)
  assert.match(surface.querySelector('.aui-md').textContent,/Finished/)
})
test('approval and edit controls are never hidden behind an activity card',()=>{
  const dom=fixture(),surface=dom.window.document.querySelector('main')
  const root=surface.querySelector('[data-role="user"]');root.append(dom.window.document.createElement('input'))
  paintTimeline(surface,[{...timelineRow(message),activity:{title:'Review',text:'Done',status:'Recorded'}}])
  assert.equal(root.hasAttribute('data-ic-activity'),false)
  root.querySelector('input').remove()
  paintTimeline(surface,[{...timelineRow(message),activity:{title:'Review',text:'Done',status:'Recorded'}}])
  assert.equal(root.hasAttribute('data-ic-activity'),true)
  root.append(dom.window.document.createElement('textarea'))
  paintTimeline(surface,[{...timelineRow(message),activity:{title:'Review',text:'Done',status:'Recorded'}}])
  assert.equal(root.hasAttribute('data-ic-activity'),false)
})
test('the actual shipped bundle registers isolated components and cleans up in a stock-shaped document',async()=>{
  const dom=fixture(),doc=dom.window.document,frames=[],disposers=[],commands=[],storage=new Map()
  doc.querySelector('main').setAttribute('data-session-anchor','session-tile:canonical')
  doc.body.insertAdjacentHTML('afterbegin','<aside data-slot="bots-roster"><button data-roster-key="local::willow" aria-label="Willow"><div><img src="avatar.jpg"></div><div><div><div><span></span>Willow</div><span>now</span></div><div>Latest</div></div></button></aside>')
  const atom=value=>({get:()=>value,listen:()=>()=>{}})
  const host={state:{focusedStoredSessionId:atom('canonical'),focusedSessionId:atom('canonical'),activeSessionId:atom('canonical'),connectionId:atom('local')},
    connections:async()=>[{id:'local',kind:'local',primary:true}],request:async(method)=>method==='profiles.list'?{profiles:[{name:'willow',canonical_session:{id:'canonical'}}]}:{messages:[message]}}
  const context=vm.createContext({document:doc,window:dom.window,MutationObserver:dom.window.MutationObserver,
    sdk:{PALETTE_AREA:'palette',THEMES_AREA:'themes',requestTheme:()=>true,host},
    requestAnimationFrame:fn=>{frames.push(fn);return frames.length},cancelAnimationFrame(){},
    setInterval:()=>1,clearInterval(){},setTimeout:()=>1,clearTimeout(){},console})
  const source=fs.readFileSync(new URL('../desktop/plugin.js',import.meta.url),'utf8')
    .replace(/^import .* from '@hermes\/plugin-sdk'$/m,'const {PALETTE_AREA,THEMES_AREA,requestTheme,host,queryClient,coarseElapsed,translateNow}=sdk')
    .replace('export default {','globalThis.plugin = {')
  vm.runInContext(source,context)
  context.plugin.register({storage:{get:(k,f)=>storage.get(k)??f,set:(k,v)=>storage.set(k,v)},register:c=>commands.push(c),onDispose:f=>disposers.push(f),setInterval(){},onEvent(){}})
  await new Promise(r=>setImmediate(r));while(frames.length)frames.shift()()
  await new Promise(r=>setImmediate(r));while(frames.length)frames.shift()()
  assert.equal(context.plugin.id,'inner-circle')
  assert.equal(doc.body.getAttribute('data-inner-circle-canonical'),'canonical')
  assert.equal(doc.body.classList.contains('ic-hide-sessions'),true)
  assert.ok(commands.some(c=>c.id==='quiet.palette-toggle-work'))
  assert.ok(commands.some(c=>c.id==='tasks.palette-toggle'))
  assert.equal(new Set(commands.map(c=>c.id)).size,commands.length)
  assert.match(doc.querySelector('.ic-channel-label').textContent,/From Signal/)
  const before=doc.querySelector('.composer-human-message').textContent
  disposers.reverse().forEach(f=>f())
  assert.equal(doc.body.hasAttribute('data-inner-circle-canonical'),false)
  assert.equal(doc.querySelectorAll('[data-ic-timeline]').length,0)
  assert.equal(doc.querySelector('.composer-human-message').textContent,before)
  dom.window.close()
})
