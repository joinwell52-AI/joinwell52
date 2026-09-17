"""Offline data audit and original evaluator probe; no model inference."""
import pathlib,json,importlib.util,contextlib,io,tempfile,collections,hashlib,urllib.request
ROOT=pathlib.Path(__file__).resolve().parent
OUT=ROOT/'results';OUT.mkdir(exist_ok=True)
def save(name,obj): (OUT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def load(path): return json.loads(path.read_text(encoding='utf-8'))
spec=importlib.util.spec_from_file_location('upstream_eval',ROOT/'upstream/failure-attribution/Automated_FA/evaluate.py')
ev=importlib.util.module_from_spec(spec);spec.loader.exec_module(ev)
rows=[]
with tempfile.TemporaryDirectory() as td:
    for label,actual,pred in [('exact','1','1'),('substring_forward','1','10'),('substring_reverse','10','1'),('different','2','10')]:
        pathlib.Path(td,'case.json').write_text(json.dumps({'mistake_agent':'Worker','mistake_step':actual}))
        s=io.StringIO()
        with contextlib.redirect_stdout(s): score=ev.evaluate_accuracy({'case.json':{'predicted_agent':'Worker','predicted_step':pred}},td,1)
        rows.append({'case':label,'actual_step':actual,'predicted_step':pred,'upstream_step_accuracy':score[1],'exact_step_accuracy':100.0 if int(actual)==int(pred) else 0.0})
save('attribution-evaluator-controls.json',rows)
dataset=ROOT/'upstream/failure-attribution/Who&When'
records=[]
for path in sorted(dataset.rglob('*.json')):
    d=load(path);h=d['history'];step=str(d['mistake_step'])
    records.append({'file':str(path.relative_to(dataset)).replace('\\','/'),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'agent':d['mistake_agent'],'step':step,'history_length':len(h),'step_integer':step.isdigit(),'step_less_than_history_length':int(step)<len(h) if step.isdigit() else None})
save('attribution-dataset-audit.json',{'count':len(records),'splits':dict(collections.Counter(r['file'].split('/')[0] for r in records)),'records':records})
outputs=[]
for path in sorted((ROOT/'upstream/failure-attribution/Automated_FA').rglob('*.txt')):
    if 'Prediction for' not in path.read_text(encoding='utf-8',errors='replace'):continue
    with contextlib.redirect_stdout(io.StringIO()):predictions=ev.read_predictions(path)
    split='Hand-Crafted' if 'hand' in path.name.lower() else 'Algorithm-Generated' if 'alg' in path.name.lower() else None
    if not split:continue
    ref={pathlib.Path(r['file']).name:r for r in records if r['file'].startswith(split+'/')}
    n=sum(k in ref for k in predictions); substring=exact=0;differences=[]
    for k,p in predictions.items():
        if k not in ref:continue
        a=ref[k]['step'];b=p['predicted_step'];old=a in b;new=a.isdigit() and int(a)==int(b)
        substring+=old;exact+=new
        if old!=new:differences.append({'file':k,'actual':a,'predicted':b})
    outputs.append({'file':str(path.relative_to(ROOT/'upstream/failure-attribution')).replace('\\','/'),'split':split,'reference_count':len(ref),'matched_predictions':n,'substring_correct':substring,'exact_integer_correct':exact,'differences':differences})
save('attribution-published-predictions-audit.json',outputs)
print('Attribution',len(records),'records;',len(outputs),'prediction files;',rows)
# Deliberately bounded, declared sample: immediate AG2 human files only.
mast=ROOT/'upstream/mast';fs=sorted((mast/'traces/AG2').glob('*human.json'))
items=[];counts=collections.Counter()
for f in fs:
    d=load(f);options=d.get('note',{}).get('options',{});positive=[k for k,v in options.items() if str(v).lower()=='yes'];counts.update(positive)
    items.append({'file':str(f.relative_to(mast)).replace('\\','/'),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'correct':d.get('other_data',{}).get('correct'),'positive_labels':positive,'label_count':len(options)})
save('mast-ag2-sample-audit.json',{'selection':'all immediate traces/AG2/*human.json at pinned Git commit, not the entire MAD dataset','count':len(items),'correct_with_positive_labels':sum(x['correct'] is True and bool(x['positive_labels']) for x in items),'label_schema_sizes':dict(collections.Counter(x['label_count'] for x in items)),'positive_counts':dict(counts),'records':items})
print('MAST bounded AG2 sample:',len(items),'correct + process labels:',sum(x['correct'] is True and bool(x['positive_labels']) for x in items))
# Follow the repository's explicit dataset link and pin Hugging Face revision.
rev='95118ac951421753cf1deb87ddea3b01e693c41b'
url=f'https://huggingface.co/datasets/mcemri/MAD/resolve/{rev}/MAD_human_labelled_dataset.json'
raw=urllib.request.urlopen(url,timeout=90).read();(ROOT/'sources/MAD_human_labelled_dataset.json').write_bytes(raw)
data=json.loads(raw)
save('mast-hf-provenance.json',{'revision':rev,'url':url,'sha256':hashlib.sha256(raw).hexdigest(),'count':len(data)})
print('MAST HF',len(data),'records; schema',list(data[0]) if isinstance(data,list) else list(data)[:8])
