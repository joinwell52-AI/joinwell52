import pathlib,json,subprocess,os,sys,collections,re,importlib.util,contextlib,io,tempfile,hashlib
ROOT=pathlib.Path(__file__).resolve().parent
def save(name,obj): (ROOT/'results'/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
data=json.loads((ROOT/'sources/MAD_human_labelled_dataset.json').read_text(encoding='utf-8'))
groups={}
for d in data:
    key=d['round'];labels=[a['failure mode'].split('\n')[0].strip() for a in d['annotations']]
    g=groups.setdefault(key,{'records':0,'label_counts':set(),'code_to_titles':{}});g['records']+=1;g['label_counts'].add(len(labels))
    for label in labels:
        m=re.match(r'(\d+\.\d+)\s+(.*)',label)
        if m:g['code_to_titles'].setdefault(m[1],set()).add(m[2])
for g in groups.values():
    g['label_counts']=sorted(g['label_counts']);g['code_to_titles']={k:sorted(v) for k,v in g['code_to_titles'].items()}
save('mast-taxonomy-versions.json',{'count':len(data),'groups':groups,'boundary':'Original released labels and descriptions; no relabeling, model calls or inter-annotator agreement recomputation.'})
print('MAST taxonomy groups',[(k,v['records'],v['label_counts']) for k,v in groups.items()],flush=True)
spec=importlib.util.spec_from_file_location('eval_upstream',ROOT/'upstream/failure-attribution/Automated_FA/evaluate.py');ev=importlib.util.module_from_spec(spec);spec.loader.exec_module(ev)
audit=json.loads((ROOT/'results/attribution-dataset-audit.json').read_text(encoding='utf-8'));collisions=[]
for r in audit['records']:
    if not r['step_integer']:continue
    actual=int(r['step']); alternatives=[p for p in range(r['history_length']) if p!=actual and str(actual) in str(p)]
    if alternatives:collisions.append({'file':r['file'],'actual':actual,'alternative_in_history_range':alternatives[0],'history_length':r['history_length']})
save('attribution-label-collision-surface.json',{'reference_count':len(audit['records']),'records_with_in_range_numeric_substring_collision':len(collisions),'cases':collisions,'boundary':'Constructed alternative indices in range(0, len(history)); not actual model predictions and not proof of published score inflation.'})
with tempfile.TemporaryDirectory() as td:
    d=pathlib.Path(td);ref=d/'ref';ref.mkdir()
    for name,step in [('a.json','1'),('b.json','2')]: (ref/name).write_text(json.dumps({'mistake_agent':'Worker','mistake_step':step}))
    pred=d/'pred.txt';pred.write_text('Prediction for a.json:\nAgent Name: Worker\nStep Number: 10\nPrediction for b.json:\nAgent Name: Worker\nStep Number: 2\n')
    p=subprocess.run([sys.executable,str(ROOT/'upstream/failure-attribution/Automated_FA/evaluate.py'),'--data_path',str(ref),'--eval_file',str(pred)],capture_output=True,text=True,encoding='utf-8')
    save('attribution-cli-control.json',{'returncode':p.returncode,'stdout':p.stdout,'stderr':p.stderr,'strict_integer_accuracy':50.0,'cases':2,'synthetic':True})
    assert p.returncode == 0 and re.search(r'Step Accuracy:\s+100\.00%',p.stdout)
    print('CLI control',p.returncode,p.stdout,p.stderr,flush=True)
tests=[]
for name,cwd,target,extra in [('kyvvu',ROOT/'upstream/kyvvu','tests/agents/test_exfiltration_traces.py',{}),('skill-permissions',ROOT/'upstream/skill-cli/bbsctl','tests/test_permissions.py',{'PYTHONPATH':str(ROOT/'upstream/skill-cli/bbsctl/src')})]:
    env={**os.environ,**extra,'PYTHONUTF8':'1'}
    p=subprocess.run([sys.executable,'-m','pytest','-q',target],cwd=cwd,env=env,capture_output=True,text=True,encoding='utf-8')
    tests.append({'name':name,'command':f'python -m pytest -q {target}','returncode':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
    print(name,'exit',p.returncode,p.stdout[-350:],flush=True)
save('upstream-tests.json',tests)
freeze=subprocess.run([sys.executable,'-m','pip','freeze'],capture_output=True,text=True).stdout.splitlines();save('environment.json',{'python':sys.version,'platform':sys.platform,'packages':freeze})
assert all(x['returncode']==0 for x in tests)
