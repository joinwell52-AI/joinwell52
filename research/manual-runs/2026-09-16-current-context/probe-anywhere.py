import importlib.util,json,os,tempfile,time,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def load(path,name):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
rows=[]
cases=[('lead14',.20,{'5h':.34,'weekly':.34},False,0),('lead15',.20,{'5h':.35,'weekly':.35},False,0),('lead15decimal',.50,{'5h':.65,'weekly':.65},False,0),('partial',.20,{'5h':1},False,0),('empty-partial',0,{'5h':.4},False,0),('pinned',.20,{'5h':1,'weekly':1},True,0),('weekly-empty',.20,{'5h':1,'weekly':0},False,0),('override-old',.20,{'5h':1,'weekly':1},False,3600)]
with tempfile.TemporaryDirectory(prefix='research-quota-') as tmp:
 path=Path(tmp)/'quota.json';os.environ['AGY_QUOTA_CACHE']=str(path)
 for mode in ['base','head']:
  m=load(ROOT/f'external/anywhere-agents-91c64c1-{mode}/skills/prun/scripts/dispatch-task-agy.py','quota_'+mode)
  for name,own,other,pinned,age in cases:
   groups=[{'name':label,'buckets':[{'window':w,'remaining_fraction':f,'reset_time':'2099-01-01T00:00:00Z'} for w,f in values.items()]} for label,values in [('Gemini Models',{'5h':own,'weekly':own}),('Claude and GPT models',other)]]
   path.write_text(json.dumps({'usage':{'groups':groups}}),encoding='utf8');os.utime(path,(time.time()-age,time.time()-age))
   model,note,blocked=m.quota_route(m.DEFAULT_MODEL,pinned) if mode=='head' else m.quota_route(m.DEFAULT_MODEL)
   rows.append(dict(mode=mode,case=name,selected_model=model,blocked=bool(blocked),note=note,override_age_seconds=age))
 del os.environ['AGY_QUOTA_CACHE']
review=load(ROOT/'external/anywhere-agents-a566f92-head/skills/implement-review/scripts/dispatch-gemini.py','review_head')
complete='<!-- Round 6 -->\nVerification status: VERIFIED\nCommit verdict: PASS\n'
texts={'complete':complete,'missing-verdict':complete.replace('Commit verdict: PASS',''),'wrong-round':complete.replace('Round 6','Round 5'),'closed-backtick':'```text\n'+complete+'```','tilde-quote':'~~~text\n'+complete+'~~~','unclosed-backtick':'```text\n'+complete,'unverified-block':complete.replace('VERIFIED','UNVERIFIED').replace('PASS','BLOCK'),'explicit-draft':'DRAFT ONLY, NOT FINISHED\n'+complete}
reviewrows=[{'case:k':k,'structure_accepted':review.has_review_structure(v,6),'backend_failure':review.failure_reason('ERROR','UNAVAILABLE 503')} for k,v in texts.items()]
assert [r['selected_model'].startswith('claude') for r in rows if r['mode']=='head']==[False,True,True,False,True,False,False,True]
assert [r['structure_accepted'] for r in reviewrows]==[True,False,False,False,True,True,True,True]
print(json.dumps({'method':'Unchanged original Python modules. quota_route reads synthetic JSON snapshots; no provider invocation. has_review_structure is a parsing probe, not dispatcher recovery or verifier execution. Custom cache freshness belongs to caller.','quota':rows,'review_structure':reviewrows},indent=2))
