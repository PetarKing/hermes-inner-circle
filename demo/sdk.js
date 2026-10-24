// Browser-only demo of the public SDK contract. No Hermes connection or messages.
export const PALETTE_AREA = 'palette'
export const demoProfiles = [
  ['sebastian','Sebastian','Household','sebastian'],['tanya','Tanya','Household','tanya'],
  ['finance','Anastasia','Household','anastasia'],['moriarty','Moriarty','Household','moriarty'],['ram','Ram','Household','ram'],
  ['kurisu','Kurisu','Build & launch','kurisu'],['himmel','Himmel','Build & launch','himmel'],
  ['ranpo','Ranpo','Culture & world','ranpo'],['rimuru','Rimuru','Culture & world','rimuru'],
  ['maomao','Maomao','Wellbeing','maomao'],['ayanokoji','Ayanokōji','Wellbeing','ayanokoji']
].map(([name,title,folder,asset],i)=>({name,title,folder,asset,connectionId:'local',canonical_session:{id:'showcase-'+name,last_active:Date.now()/1000-((i+1)*120)}}))
function atom(initial) { let value=initial; const listeners=new Set();return {get:()=>value,listen:fn=>{listeners.add(fn);return()=>listeners.delete(fn)},set(next){value=next;listeners.forEach(fn=>fn(next))}} }
export const host = {
  state:{focusedStoredSessionId:atom('showcase-sebastian'),focusedSessionOwner:atom(null),connectionId:atom('local'),focusedSessionId:atom('showcase-sebastian'),activeSessionId:atom('showcase-sebastian')},
  connections:async()=>[{id:'local',kind:'local',primary:true}],
  request:async(method)=>{if(method!=='profiles.list')throw new Error('Demo supports registry reads only');return {profiles:demoProfiles}},
  notify:({message})=>{document.querySelector('[data-demo-announcement]').textContent=message},
  revealPane:()=>{}
}
export function selectDemoBot(profile) { const id='showcase-'+profile; host.state.focusedSessionId.set(id);host.state.activeSessionId.set(id);host.state.focusedStoredSessionId.set(id) }
export const queryClient={getQueriesData:()=>[[['hermes-bots','roster','local'],{fetchedAt:Date.now(),profiles:demoProfiles}]],getQueryCache:()=>({subscribe:()=>()=>{}})}
export function coarseElapsed(delta) { return delta<60000?{unit:'second',value:0}:delta<3600000?{unit:'minute',value:Math.floor(delta/60000)}:delta<86400000?{unit:'hour',value:Math.floor(delta/3600000)}:{unit:'day',value:Math.floor(delta/86400000)} }
export function translateNow(key) { return {ageNow:'now',ageMin:'m',ageHour:'h',ageDay:'d'}[key.split('.').at(-1)]||key }
