import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import test from 'node:test'

const source = fs.readFileSync(new URL('../plugin.js', import.meta.url), 'utf8')
  .replace(/^import .* from '@hermes\/plugin-sdk'$/m, 'const { PALETTE_AREA, host, queryClient, coarseElapsed, translateNow } = globalThis.sdk')
  .replace('export const CSS_TEXT', 'const CSS_TEXT')
  .replace(/export function /g, 'function ').replace('export default {', 'globalThis.plugin = {')
  + '\nglobalThis.createRosterControls = createRosterControls;'

function setup(saved = new Map(), snapshots = []) {
  const dom = new JSDOM(`<body><aside data-slot="bots-roster">
    <section data-slot="bots-section"><header data-section-id="house"></header><div id="grid" style="display:grid;grid-template-columns:100px 100px"></div></section>
    <section data-slot="bots-section"><header data-section-id="well"></header><div id="other"></div></section>
    </aside><div id="outside"></div></body>`, {pretendToBeVisual:true})
  const {document} = dom.window
  dom.window.CSS = {supports: () => true}
  for (const [id, names] of [['grid',['a','b','c']],['other',['d']]]) {
    for (const name of names) {
      const row = document.createElement('button')
      row.dataset.rosterKey = 'local::'+name
      row.draggable = true
      row.setAttribute('aria-label',name+' · @'+name+' · Ready')
      row.innerHTML = '<div><img></div><div><div><div>Name</div><span>native-age</span></div></div>'
      row.getBoundingClientRect = () => ({left:0,top:0,width:100,height:100,right:100,bottom:100})
      document.querySelector('#'+id).append(row)
    }
  }
  const notices = []
  let now = 1_800_000_000_000
  const context = vm.createContext({document,console,Date: class extends Date {static now(){return now}},sdk:{
    host:{notify: value => notices.push(value)},PALETTE_AREA:'palette',
    queryClient:{getQueriesData: () => snapshots},
    coarseElapsed: delta => delta<60000 ? {unit:'second',value:0} : {unit:'minute',value:Math.floor(delta/60000)},
    translateNow: key => ({ageNow:'now',ageMin:'m',ageHour:'h',ageDay:'d'}[key.split('.').at(-1)])
  }})
  vm.runInContext(source, context)
  const ctx = {storage:{get:(key,fallback)=>saved.has(key)?JSON.parse(saved.get(key)):fallback,set:(key,value)=>saved.set(key,JSON.stringify(value))}}
  const ui = context.createRosterControls(ctx)
  const row = name => document.querySelector(`[data-roster-key="local::${name}"]`)
  function event(type, target, key, options={}) {
    const e = new dom.window.MouseEvent(type,{bubbles:true,cancelable:true,clientX:0,clientY:0,...options})
    Object.defineProperty(e,'dataTransfer',{value:{types:['application/x-hermes-bot-key'],getData:()=>key,dropEffect:'none'}})
    target.dispatchEvent(e)
    return e
  }
  const drag = (from,to,options={}) => {
    event('dragstart',row(from),'local::'+from)
    event('dragover',row(to),'local::'+from,options)
    const result=event('drop',row(to),'local::'+from,options)
    event('dragend',row(from),'local::'+from)
    return result
  }
  const visual = () => [...document.querySelector('#grid').children].sort((a,b)=>Number(a.style.order)-Number(b.style.order)).map(x=>x.dataset.rosterKey)
  return {dom,document,ctx,ui,saved,row,event,drag,visual,notices,setNow:v=>{now=v},now:()=>now}
}

test('drag persists only folder presentation, keeps React source order and sets accessible reading flow',()=>{
  const s=setup()
  assert.equal(s.drag('c','a').defaultPrevented,true)
  assert.deepEqual(s.visual(),['local::c','local::a','local::b'])
  assert.deepEqual([...s.document.querySelector('#grid').children].map(x=>x.dataset.rosterKey),['local::a','local::b','local::c'])
  assert.equal(s.document.querySelector('#grid').style.getPropertyValue('reading-flow'),'grid-rows')
  assert.equal(s.row('d').style.order,'')
  s.ui.dispose()
  const reloaded=setup(s.saved);reloaded.ui.paint()
  assert.deepEqual(reloaded.visual(),['local::c','local::a','local::b'])
  reloaded.ui.dispose()
})

test('cross-folder and external drops stay native; Escape cancels the in-flight move',()=>{
  const s=setup();let nativeDrops=0
  s.row('d').addEventListener('drop',()=>nativeDrops++)
  assert.equal(s.drag('a','d').defaultPrevented,false)
  assert.equal(nativeDrops,1);assert.equal(s.saved.size,0)
  assert.equal(s.event('drop',s.row('b'),'local::a').defaultPrevented,false)
  s.event('dragstart',s.row('c'),'local::c');s.event('dragover',s.row('a'),'local::c')
  assert.equal(s.row('a').getAttribute('data-ic-drop-edge'),'left')
  s.row('c').dispatchEvent(new s.dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}))
  assert.equal(s.row('a').hasAttribute('data-ic-drop-edge'),false)
  assert.equal(s.event('drop',s.row('a'),'local::c').defaultPrevented,false)
  assert.equal(s.saved.size,0);s.ui.dispose()
})

test('list placement, keyboard moves and filtered rosters preserve non-visible saved members',()=>{
  const s=setup();s.document.querySelector('#grid').style.gridTemplateColumns='100px'
  s.drag('a','c',{clientY:90})
  assert.deepEqual(s.visual(),['local::b','local::c','local::a'])
  s.row('a').dispatchEvent(new s.dom.window.KeyboardEvent('keydown',{key:'ArrowUp',altKey:true,bubbles:true,cancelable:true}))
  assert.deepEqual(s.visual(),['local::b','local::a','local::c'])
  s.row('b').remove();s.drag('c','a')
  assert.deepEqual(JSON.parse(s.saved.get('rosterOrder.v1'))['["house","local"]'],['local::b','local::c','local::a'])
  s.ui.dispose()
})

test('a failed storage write leaves native order and reports the failure',()=>{
  const s=setup();s.ctx.storage.set=()=>{}
  s.drag('c','a')
  assert.deepEqual(s.visual(),['local::a','local::b','local::c'])
  assert.equal(s.notices.length,1);s.ui.dispose()
})

test('ages tick from native source-qualified cached timestamps without a click or another RPC',()=>{
  const snapshots=[];const s=setup(new Map(),snapshots)
  snapshots.push([['hermes-bots','roster','local'],{fetchedAt:s.now(),profiles:[
    {connectionId:'local',name:'a',canonical_session:{last_active:s.now()/1000-120}},
    {connectionId:'remote',name:'a',canonical_session:{last_active:s.now()/1000}}
  ]}])
  s.ui.paint();const age=s.row('a').querySelector(':scope > div:nth-child(2) > div > span')
  assert.equal(age.textContent,'2m')
  assert.equal(s.row('b').querySelector(':scope > div:nth-child(2) > div > span').textContent,'native-age')
  s.setNow(s.now()+600000);s.ui.paint();assert.equal(age.textContent,'12m')
  snapshots[0][1].profiles[0].worker_session={last_active:s.now()/1000-20}
  s.ui.paint();assert.equal(age.textContent,'now')
  assert.match(age.title,/Last recorded activity/);assert.match(s.row('a').title,/not online presence/)
  s.ui.dispose();assert.equal(age.textContent,'native-age')
})

test('unload restores only owned styles and hints and leaves later native changes intact',()=>{
  const s=setup();s.row('a').style.order='17';s.ui.paint();s.drag('c','a')
  s.row('b').title='A newer native hint';s.ui.dispose()
  assert.equal(s.row('a').style.order,'17');assert.equal(s.row('b').title,'A newer native hint')
  assert.equal(s.document.querySelector('#grid').style.getPropertyValue('reading-flow'),'')
  assert.equal(s.document.querySelector('[data-ic-roster-live]'),null)
  s.event('dragstart',s.row('b'),'local::b');assert.equal(s.event('drop',s.row('a'),'local::b').defaultPrevented,false)
})


test('selected bot follows verified source and profile and clears on an unresolved owner',()=>{
  const s=setup();s.ui.select({connectionId:'local',profile:'b'});s.ui.paint()
  assert.equal(s.row('b').getAttribute('data-ic-selected'),'true')
  assert.equal(s.row('a').getAttribute('data-ic-selected'),'false')
  s.ui.select({connectionId:'remote',profile:'b'});s.ui.paint()
  assert.equal(s.row('b').getAttribute('data-ic-selected'),'false')
  s.ui.select(null);s.ui.paint();s.ui.dispose()
  assert.equal(s.row('b').hasAttribute('data-ic-selected'),false)
})


function nativeDot(s, row, className, label = 'Finished — unread') {
  const lead = s.document.createElement('span')
  const wrapper = s.document.createElement('span')
  const dot = s.document.createElement('span')
  dot.className = className
  dot.setAttribute('role', 'status'); dot.setAttribute('aria-label', label)
  wrapper.append(dot); lead.append(wrapper)
  row.querySelector(':scope > div:nth-child(2) > div > div').prepend(lead)
  return dot
}

test('native unread updates without opening a bot and preserves working/approval indicators',()=>{
  const s=setup(), row=s.row('a'), photo=row.querySelector('img')
  const dot=nativeDot(s,row,'size-1.5 rounded-full bg-(--ui-success)')
  s.ui.paint()
  assert.equal(row.dataset.icUnread,'true')
  assert.equal(row.querySelectorAll('[aria-hidden="true"] svg').length,1)
  assert.equal(dot.getAttribute('aria-label'),'Finished — unread')
  assert.equal(dot.getAttribute('role'),'status')
  for (const [className,label] of [
    ['bg-(--ui-accent)','Working'],['bg-amber-500','Approval needed'],
    ['border border-(--ui-accent)','Stalled'],['border border-(--ui-text-tertiary)','Background running']
  ]) {
    dot.className='size-1.5 rounded-full '+className
    dot.setAttribute('aria-label',label);s.ui.paint()
    assert.equal(row.dataset.icUnread,'false')
    assert.equal(dot.dataset.icNativeDot,'active')
    assert.equal(dot.getAttribute('aria-label'),label)
  }
  assert.equal(row.querySelector('img'),photo)
  s.ui.dispose()
})

test('the envelope is suppressed only for the selected source-qualified bot',()=>{
  const s=setup(),row=s.row('b')
  nativeDot(s,row,'size-1.5 rounded-full bg-(--ui-success)')
  s.ui.select({connectionId:'local',profile:'b'});s.ui.paint()
  assert.equal(row.dataset.icUnread,'false')
  s.ui.select({connectionId:'remote',profile:'b'});s.ui.paint()
  assert.equal(row.dataset.icUnread,'true')
  s.ui.select(null);s.ui.paint();assert.equal(row.dataset.icUnread,'true')
  s.ui.dispose()
})

test('notification remount/unload preserves native children; unknown avatar markup keeps its native cue',()=>{
  const s=setup(),row=s.row('a'),caption=row.children[1],photo=row.querySelector('img')
  const dot=nativeDot(s,row,'size-1.5 rounded-full bg-(--ui-success)')
  s.ui.paint();const first=row.querySelector('[aria-hidden="true"]')
  first.remove();s.ui.paint()
  assert.notEqual(row.querySelector('[aria-hidden="true"]'),first)
  assert.equal(row.querySelectorAll('svg').length,1)
  const b=s.row('b');b.children[0].replaceChildren(s.document.createElement('canvas'))
  nativeDot(s,b,'size-1.5 rounded-full bg-(--ui-success)');s.ui.paint()
  assert.equal(b.dataset.icNoticeReady,'false');assert.equal(b.dataset.icUnread,'false')
  s.ui.dispose()
  assert.equal(row.children[1],caption);assert.equal(row.querySelector('img'),photo)
  assert.equal(dot.className,'size-1.5 rounded-full bg-(--ui-success)')
  assert.equal(dot.hasAttribute('data-ic-native-dot'),false)
  assert.equal(row.hasAttribute('data-ic-unread'),false)
  assert.equal(row.querySelector('svg'),null)
})
