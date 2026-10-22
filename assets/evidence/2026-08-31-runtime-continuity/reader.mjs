// Research-only evidence reader. No product imports, network, or external writes.
import {createHash} from 'node:crypto';
export const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function readAt(envelopes,{owner,cutoff,manifest}) {
  const accepted=[],rejected=[];
  for(const e of envelopes){
    let reason=null;
    if(e.owner!==owner)reason='wrong_owner';
    else if(!Number.isInteger(e.available_at)||e.available_at>cutoff)reason='after_cutoff';
    else if(manifest[e.id]!==digest(e))reason='integrity_or_unregistered';
    if(reason)rejected.push({id:e.id,reason});else accepted.push(e);
  }
  const latest=kind=>accepted.filter(e=>e.kind===kind).sort((a,b)=>b.available_at-a.available_at)[0];
  const record=latest('approval-snapshot'), effect=latest('effect-snapshot');
  const count=effect?new Set(effect.body.effects.map(e=>e.effect_id)).size:null;
  return {cutoff,approval_status:record?.body.status??'unknown',effect_count:count,
    effect_observed:count===null?'unknown':count>0?'yes':'not_observed',
    duplicate_observed:count===null?'unknown':count>1?'yes':'not_observed',
    accepted:accepted.map(e=>e.id),rejected};
}
// Deliberately invalid comparator: ignores owner, cutoff, and manifest.
export function naiveRead(envelopes){
 const e=envelopes.filter(e=>e.kind==='effect-snapshot').sort((a,b)=>b.available_at-a.available_at)[0];
 return {duplicate_observed:e?(e.body.effects.length>1?'yes':'not_observed'):'unknown'};
}
