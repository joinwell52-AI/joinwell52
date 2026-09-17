import assert from 'node:assert/strict';import {compile,root,read,between} from './probe-lib.mjs';
process.on('uncaughtException',e=>{console.error(e.name+': '+e.message);process.exit(1)});
const harness=`export const state={mode:'ok',lists:0,scopes:[],calls:[]};
export async function toolConnections(user){if(state.mode==='connections-error')throw Error('synthetic unavailable');return state.mode==='none'?[]:[{connection:{userId:user,pluginName:'github',authMethod:'synthetic'},install:{id:'install-'+user,marketplace:'fixture',manifest:{name:'github',version:'1'}},source:null}];}
export async function templateScope(c){state.scopes.push(c.userId);return {principal:c.userId};}
export async function listTools(m,s){state.lists++;if(state.mode==='tools-error')throw Error('synthetic list failure');return [{name:'get_issue'}];}
export async function callTool(m,s,tool,args){state.calls.push({principal:s.principal,tool,args});return {content:'synthetic'};}`;
const plugin={name:'provider-seam',setup(b){b.onResolve({filter:/^@superset\/trpc\/integrations\/plugins$/},()=>({path:'seam',namespace:'synthetic'}));b.onLoad({filter:/.*/,namespace:'synthetic'},()=>({contents:harness,loader:'ts'}));}};
const dir=root+'external/slack-head/apps/api/src/app/api/integrations/slack/events/utils/run-agent';
const m=await compile(`export * from './plugin-tools';export {state} from '@superset/trpc/integrations/plugins';`,dir,[plugin]);
const signal=new AbortController().signal;const load=userId=>m.loadPluginTools({userId,pluginNames:['github'],signal});const rows=[];
const a=await load('A'),b=await load('B');await load('A');rows.push({case:'two-users-repeat-A',listCalls:m.state.lists,principals:m.state.scopes.slice()});
for(const set of [a,b])await m.callPluginTool({context:set.sets.get('github').context,tool:'get_issue',args:{synthetic:true},signal});rows.push({case:'calls-use-own-context',calls:m.state.calls,scopeReads:m.state.scopes.length});
for(const mode of ['connections-error','none','tools-error']){m.state.mode=mode;m.invalidatePluginToolCache();const r=await load('A');rows.push({case:mode,resolved:r.resolved,connectedSets:r.sets.size,toolCount:[...r.sets.values()].reduce((n,x)=>n+x.tools.length,0)});}
const s=await read('external/slack-head/apps/api/src/app/api/integrations/slack/events/utils/run-agent/run-agent.ts');const {PLUGIN_SLACK_TOOLS}=await compile(between(s,'export const PLUGIN_SLACK_TOOLS:', '\nexport function mentionsPlugin'));
rows.push({case:'original-allowlist-membership',counts:Object.fromEntries(Object.entries(PLUGIN_SLACK_TOOLS).map(([k,v])=>[k,v.size])),mergeAllowed:PLUGIN_SLACK_TOOLS.github.has('merge_pull_request'),deleteAllowed:PLUGIN_SLACK_TOOLS.github.has('delete_repository')});
assert.equal(rows[0].listCalls,2);assert.deepEqual(m.state.calls.map(x=>x.principal),['A','B']);assert.equal(rows[2].resolved,false);assert.equal(rows[3].resolved,true);assert.equal(rows[4].connectedSets,1);
console.log(JSON.stringify({method:'Original complete plugin-tools module with synthetic connection/discovery/template/dispatch seam. Original allowlist evaluated separately. No real credentials, plugin servers, Slack messages, model call, or full execution-branch enforcement exercised.',rows},null,2));
