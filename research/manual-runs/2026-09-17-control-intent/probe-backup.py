import importlib.util,json,tempfile,sys,subprocess,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def load(mode):
 p=ROOT/f'external/anywhere-{mode}/scripts/merge_settings.py';s=importlib.util.spec_from_file_location('merge_'+mode,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def canonical(o):return (json.dumps(o,indent=2,ensure_ascii=False)+'\n').encode()
rows=[]
with tempfile.TemporaryDirectory(prefix='research-backup-') as tmp:
 for mode in ['base','head']:
  m=load(mode)
  for case in ['27-identical','12-format-rewrites','real-change','first-install','empty-refusal','8-concurrent-identical']:
   d=Path(tmp)/mode/case;d.mkdir(parents=True);target=d/'settings.json';shared=d/'shared.json'
   old=canonical({'setting':'old','userOnly':'retain'});current=canonical({'setting':'new','userOnly':'retain'})
   if case!='first-install':target.write_bytes(old)
   shared.write_bytes(canonical({'setting':'new'}));codes=[]
   codes.append(m.main(['probe',str(target),str(shared)]));before=target.stat().st_mtime_ns
   if case=='27-identical':
    for _ in range(27):codes.append(m.main(['probe',str(target),str(shared)]))
   elif case=='12-format-rewrites':
    for _ in range(12):
     target.write_bytes(json.dumps(json.loads(current),separators=(',',':')).encode());codes.append(m.main(['probe',str(target),str(shared)]))
   elif case=='real-change':
    shared.write_bytes(canonical({'setting':'third'}));codes.append(m.main(['probe',str(target),str(shared)]))
   elif case=='empty-refusal':
    target.write_bytes(b'{}');shared.write_bytes(b'{}');codes.append(m.main(['probe',str(target),str(shared)]))
   elif case=='8-concurrent-identical':
    procs=[subprocess.Popen([sys.executable,str(ROOT/f'external/anywhere-{mode}/scripts/merge_settings.py'),str(target),str(shared)],stdout=subprocess.PIPE,stderr=subprocess.PIPE) for _ in range(8)]
    for p in procs:p.communicate();codes.append(p.returncode)
   backups=[p.read_bytes() for p in d.glob('settings.json.bak-*')]
   rows.append({'mode':mode,'case':case,'calls':len(codes),'return_codes':codes,'retained_backups':len(backups),'distinct_backup_bytes':len(set(backups)),'old_generation_retained':old in backups,'copies_of_current':sum(b==target.read_bytes() for b in backups),'mtime_unchanged_after_initial_merge':target.stat().st_mtime_ns==before,'final':json.loads(target.read_bytes())})
assert next(r for r in rows if r['mode']=='base' and r['case']=='27-identical')['old_generation_retained']==False
assert next(r for r in rows if r['mode']=='head' and r['case']=='27-identical')['retained_backups']==1
assert next(r for r in rows if r['mode']=='head' and r['case']=='12-format-rewrites')['old_generation_retained']==False
print(json.dumps({'method':'Unmodified complete original Python module via main(), real Windows temporary files and original locks. Synthetic settings only. Concurrent case uses eight processes. Formatting case deliberately rewrites equivalent JSON before each merge, not a reported production incident.','rows':rows},indent=2))
