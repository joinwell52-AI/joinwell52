"""Bounded probes against pinned upstream code; no LLM/API/tool side effects."""
import pathlib,sys,json,ast,importlib.util,datetime,hashlib,contextlib,io,tempfile
ROOT=pathlib.Path(__file__).resolve().parent;OUT=ROOT/'results';OUT.mkdir(exist_ok=True)
def save(name,obj):
    (OUT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(name,json.dumps(obj.get('summary',{}),ensure_ascii=False),flush=True)
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);sys.modules[name]=m;spec.loader.exec_module(m);return m
def kyvvu():
    import importlib.metadata
    from kyvvu_engine.engine import PolicyEngine
    from kyvvu_engine.schemas import StepType,Verb
    demo=module('exfil_demo',ROOT/'upstream/kyvvu/examples/exfiltration_demo.py')
    policies=demo.load_policies();ctx=demo.make_context()
    b=demo.make_behavior
    gate=b(StepType.step_gate,step_name='review',properties={'guard':{'check_type':'exfiltration_review','result':'pass'}})
    public=b(StepType.step_resource,Verb.GET,properties={'data':{'classification':'public'},'target':{'host':'api.example.com'}})
    private=b(StepType.step_resource,Verb.GET,properties={'data':{'classification':'pii'},'target':{'host':'internal.example.com'}})
    send=b(StepType.step_message,Verb.POST,properties={'target':{'host':'internal.example.com'}})
    cases=[('clean',[public,gate]),('tainted',[private,gate]),('tainted_gate_after',[private,gate,gate]),('no_gate',[public]),('fresh_engine_same_ids',[gate]),('restored_history',[private,gate])]
    rows=[]
    for name,history in cases:
        engine=PolicyEngine();engine.load_policies(policies)
        for step in history:engine.record(step)
        result=engine.evaluate(send,ctx)
        rows.append({'case':name,'action':result.action.value,'history':[s.model_dump(mode='json') for s in history],'violated':[p.name for p in result.policies if p.violated]})
    expected=['allow','block','block','block','allow','block'];assert [r['action'] for r in rows]==expected
    save('kyvvu-paths.json',{'summary':{'engine_version':importlib.metadata.version('kyvvu-engine'),'cases':len(rows),'actions':[r['action'] for r in rows]},'boundary':'Original PolicyEngine + public manifest; in-process evaluation only. Fresh engine is a deliberate missing-history control, not a test of the hosted platform persistence.','cases':rows})
def skill():
    sys.path.insert(0,str(ROOT/'upstream/skill-cli/bbsctl/src'))
    from skillctl.permissions import Guardrails
    from skillctl.permissions.loader import load_permissions
    cases=[('omitted','schema_version: bulbasaur/v1\nskill: probe\n','/workspace/out.txt'),('explicit_empty','skill: probe\nfilesystem:\n  write_paths: []\n','/workspace/out.txt'),('inside','skill: probe\nfilesystem:\n  write_paths: ["/workspace/output/**"]\n','/workspace/output/result.txt'),('outside','skill: probe\nfilesystem:\n  write_paths: ["/workspace/output/**"]\n','/workspace/other.txt'),('dotdot','skill: probe\nfilesystem:\n  write_paths: ["/workspace/output/**"]\n','/workspace/output/../other.txt')]
    rows=[]
    with tempfile.TemporaryDirectory() as td:
        d=pathlib.Path(td)
        for name,yaml,path in cases:
            (d/'permissions.yaml').write_text(yaml,encoding='utf-8');p=load_permissions(d);dec=Guardrails(p).evaluate_write(path)
            rows.append({'case':name,'yaml':yaml,'path':path,'decision':dec.decision.value,'reason':dec.reason})
    assert [r['decision'] for r in rows]==['allow','allow','allow','deny','allow']
    save('skill-permissions.json',{'summary':{'cases':len(rows),'decisions':[r['decision'] for r in rows]},'boundary':'Original YAML loader and Guardrails evaluator; no file operation or runtime adapter was invoked. POSIX strings intentionally follow upstream docs.','cases':rows})
def agentspec():
    sys.path.insert(0,str(ROOT/'upstream/agentspec/src'))
    from rule import Rule
    raw='rule @probe\ntrigger\n PythonREPL\ncheck\n true\nenforce\n stop\nend\n'
    r=Rule.from_text(raw);rows=[]
    for name,action,arg in [('exact_string','PythonREPL','print(1)'),('renamed_string','python_repl','print(1)'),('input_prefix','other','PythonREPL print(1)'),('exact_dict','PythonREPL',{'code':'print(1)'}),('other_dict','other',{'code':'print(1)'}),('finish_none','finish',None)]:
        try: result=r.triggered(action,arg);err=None
        except Exception as e:result=None;err=type(e).__name__
        rows.append({'case':name,'action':action,'input':arg,'triggered':result,'error':err})
    assert [r['triggered'] for r in rows[:4]]==[True,False,True,True]
    save('agentspec-trigger.json',{'summary':{'cases':len(rows),'outcomes':[r['error'] or r['triggered'] for r in rows]},'boundary':'Unmodified Rule.from_text + Rule.triggered and generated parser. No AgentExecutor, model, tools, safety-rate or deployment claim.','raw_rule':raw,'cases':rows})
def stego():
    import numpy as np
    path=ROOT/'upstream/steganography/src/mec.py';tree=ast.parse(path.read_text(encoding='utf-8'))
    selected=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='mec_kocaoglu_np']
    scope={'np':np};exec(compile(ast.Module(body=selected,type_ignores=[]),str(path),'exec'),scope)
    fn=scope['mec_kocaoglu_np'];rng=np.random.default_rng(917)
    def info(m):
        p=m.sum(axis=1);q=m.sum(axis=0);ind=np.outer(p,q);mask=m>0
        return float(np.sum(m[mask]*np.log2(m[mask]/ind[mask])))
    rows=[]
    for n in [2,4,8,16]:
        for i in range(20):
            p=rng.dirichlet(np.ones(n));q=rng.dirichlet(np.ones(n));m=fn(p,q)
            err=float(max(np.max(abs(m.sum(1)-p)),np.max(abs(m.sum(0)-q))))
            assert err<1e-12
            rows.append({'n':n,'trial':i,'marginal_max_error':err,'mutual_information_bits':info(m)})
    p=np.ones(4)/4;m=fn(p,p);ind=np.outer(p,p)
    save('steganography-coupling.json',{'summary':{'cases':len(rows),'max_marginal_error':max(r['marginal_max_error'] for r in rows),'uniform_coupled_information_bits':info(m),'uniform_independent_information_bits':info(ind)},'boundary':'Exact AST-extracted upstream NumPy coupling function; synthetic probability distributions. No LLM generation, agents, steganographic encoder/decoder, key setup or attack trial.','source_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'uniform_joint_matrix':m.astype(float).tolist(),'uniform_independent_matrix':ind.tolist(),'cases':rows})
if __name__=='__main__':
    funcs={'kyvvu':kyvvu,'skill':skill,'agentspec':agentspec,'stego':stego}
    for name in sys.argv[1:] or funcs:
        try: funcs[name]()
        except Exception as e:
            save(name+'-error.json',{'summary':{'error':type(e).__name__,'detail':str(e)}});raise
