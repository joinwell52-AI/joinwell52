"""Pinned upstream clear tests, plus a single-method predecessor ablation."""
import ast,json,os,subprocess,sys,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parent;SDK=ROOT/'external/sdk-pinned';OUT=ROOT/'runs';OUT.mkdir(exist_ok=True)
selection='test_clear_session_invalidates_response_chain or test_settled_clear_failure_invalidates_response_chain or test_run_compaction_auto_uses_input_after_clear or test_clear_waits_for_in_flight_compaction_and_stays_empty'
if len(sys.argv)>1:
    mode=sys.argv[1];sys.path.insert(0,str(SDK));os.chdir(SDK)
    import agents.memory.openai_responses_compaction_session as module
    if mode=='old-clear':
        tree=ast.parse((ROOT/'sources/code/5000/base/src/agents/memory/openai_responses_compaction_session.py').read_text(encoding='utf8'))
        cls=next(x for x in tree.body if isinstance(x,ast.ClassDef) and x.name=='OpenAIResponsesCompactionSession')
        fn=next(x for x in cls.body if isinstance(x,ast.AsyncFunctionDef) and x.name=='clear_session')
        ns={};exec(compile(ast.fix_missing_locations(ast.Module(body=[fn],type_ignores=[])),'<pinned-base-clear>','exec'),module.__dict__,ns)
        module.OpenAIResponsesCompactionSession.clear_session.__code__=ns['clear_session'].__code__
    import pytest
    raise SystemExit(pytest.main(['tests/memory/test_openai_responses_compaction_session.py','-k',selection,'-q','-o','addopts=','--junitxml='+str(OUT/f'sdk-{mode}.xml')]))
records=[]
for mode in ['fixed','old-clear']:
    p=subprocess.run([sys.executable,__file__,mode],cwd=ROOT,capture_output=True,text=True,encoding='utf8',errors='replace',timeout=180)
    log=(p.stdout+p.stderr).replace(str(ROOT),'<study>').replace(ROOT.as_posix(),'<study>')
    (OUT/f'sdk-{mode}.log').write_text(log,encoding='utf8')
    xml=OUT/f'sdk-{mode}.xml';cases=[]
    if xml.exists():
        for c in ET.parse(xml).iter('testcase'):
            fail=c.find('failure');err=c.find('error');cases.append({'name':c.attrib.get('name'),'passed':fail is None and err is None,'message':(fail.attrib.get('message','') if fail is not None else err.attrib.get('message','') if err is not None else '')})
    records.append({'mode':mode,'exit_code':p.returncode,'cases':cases});print(mode,p.returncode,len(cases));print(log[-700:])
(OUT/'sdk.json').write_text(json.dumps({'python':sys.version,'method':'Pinned full SDK source; original upstream tests; single-method predecessor clear ablation; real SQLite commit/failure for two cases; mocked OpenAI compact endpoint','outcomes':records},indent=2)+'\n',encoding='utf8')
