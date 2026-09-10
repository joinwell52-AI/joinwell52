"""Pinned methods and environment-building slice; synthetic secrets only."""
import ast, hashlib, json, os, pathlib, re, subprocess, sys, textwrap
from types import SimpleNamespace as NS
ROOT=pathlib.Path(__file__).parent
def extract(raw,name,indent=0):
    space=' '*indent
    m=re.search(r'^'+space+r'(?:async )?def '+re.escape(name)+r'(?:\[T\])?\(.*?(?=^'+space+r'(?:async )?def |^'+space+r'class |^'+space+r'@|\Z)',raw,re.M|re.S)
    assert m,name
    return textwrap.dedent(m.group()).replace('def filter_profile_secrets[T](', 'def filter_profile_secrets(')
def load_functions(source,names,ns,indent=0):
    for name in names: exec('from __future__ import annotations\n'+extract(source,name,indent),ns)
registry_path=ROOT/'sources/code/registry/acp_providers.py'
tree=ast.parse(registry_path.read_text(encoding='utf-8'))
values={'ACPFileSecretSpec':lambda **kw:NS(**kw),'ACPEnvConflictSpec':lambda **kw:NS(**kw)}
for n in tree.body:
    if isinstance(n,ast.AnnAssign) and isinstance(n.target,ast.Name) and n.target.id.endswith('_FILE_SECRETS'):
        values[n.target.id]=eval(compile(ast.Expression(n.value),str(registry_path),'eval'),values)
provider_node=next(n for n in tree.body if isinstance(n,ast.AnnAssign) and getattr(n.target,'id','')=='ACP_PROVIDERS')
registry={}
for key,call in zip(provider_node.value.args[0].keys,provider_node.value.args[0].values):
    fields={'file_secrets':(),'env_conflicts':(),'api_key_env_var':None,'base_url_env_var':None}
    for kw in call.keywords:
        if kw.arg in ['key','api_key_env_var','base_url_env_var','file_secrets','env_conflicts']:
            fields[kw.arg]=eval(compile(ast.Expression(kw.value),str(registry_path),'eval'),values)
    registry[ast.literal_eval(key)]=NS(**fields)
all_specs=[s for p in registry.values() for s in p.file_secrets]
blob_names=sorted({s.secret_name for s in all_specs})
class ACPProfile:
    def __init__(self,server,refs):self.acp_server=server;self.secret_refs=refs
class OHProfile:
    def __init__(self,refs):self.secret_refs=refs
profile_raw=(ROOT/'sources/code/software-agent-sdk-4931/head/openhands-sdk/openhands/sdk/profiles/resolver.py').read_text(encoding='utf-8')
profile_ns={'ACPAgentProfile':ACPProfile,'get_acp_provider':registry.get}
load_functions(profile_raw,['_acp_credential_channels','allowed_secret_names','filter_profile_secrets'],profile_ns)
class SecretRegistry:
    def __init__(self,secrets): self.secret_sources=secrets
    def get_all_secrets_as_env_vars(self,exclude):return {k:v for k,v in self.secret_sources.items() if k not in exclude}
def run(phase,provider,profile=None):
    path=ROOT/f'sources/code/software-agent-sdk-4927/{phase}/openhands-sdk/openhands/sdk/agent/acp_agent.py'
    raw=path.read_text(encoding='utf-8');ns={'ACP_PROVIDERS':registry}
    load_functions(raw,['_present_file_secret_names','_strip_conflicting_env'],ns,4)
    if phase=='head':load_functions(raw,['_active_file_secrets'],ns,4)
    agent=NS(acp_file_secrets=all_specs,acp_isolate_data_dir=False)
    agent._resolved_provider=lambda:registry.get(provider)
    for name in ['_present_file_secret_names','_strip_conflicting_env','_active_file_secrets']:
        if name in ns:setattr(agent,name,lambda *a,_name=name:ns[_name](agent,*a))
    supplied={name:'SYNTHETIC-NOT-A-CREDENTIAL' for name in blob_names+['ANTHROPIC_API_KEY','PROD_DB_URL']}
    selected=profile_ns['filter_profile_secrets'](profile,supplied) if profile else supplied
    state=NS(secret_registry=SecretRegistry(selected));materialized=[]
    def materialize(state,env):
        specs=agent._active_file_secrets() if phase=='head' else agent.acp_file_secrets
        for spec in specs:
            if spec.secret_name in state.secret_registry.secret_sources:
                materialized.append(spec.secret_name);env[spec.env_var]='SYNTHETIC-PATH-NOT-A-REAL-FILE'
    agent._materialise_file_secrets=materialize
    env_slice=raw[raw.index('        env = default_environment()',raw.index('    def _start_acp_server(')):]
    env_slice=env_slice[:env_slice.index('        command = self.acp_command[0]')]
    local={'self':agent,'state':state,'default_environment':lambda:{'SystemRoot':os.environ.get('SystemRoot','C:/Windows'),'PYTHONHASHSEED':'0'},'os':NS(environ={'PLATFORM_INTERNAL_SENTINEL':'SYNTHETIC'}),'_strip_inherited_npm_env':lambda env:None}
    exec(textwrap.dedent(env_slice),local)
    env=local['env']
    child=json.loads(subprocess.check_output([sys.executable,'-c','import os,json; print(json.dumps(sorted(os.environ)))'],env=env,text=True))
    interesting=set(supplied)|{'PLATFORM_INTERNAL_SENTINEL'}
    return {'phase':phase,'provider':provider,'profile_refs':'not-applied' if profile is None else profile.secret_refs,'profile_kind':None if profile is None else type(profile).__name__,'registry_names':sorted(selected),'file_materialization_callbacks':sorted(materialized),'child_visible_names':sorted(set(child)&interesting),'child_visible_blob_count':len(set(child)&set(blob_names)),'ambient_sentinel_visible':'PLATFORM_INTERNAL_SENTINEL' in child,'source_sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
rows=[run(p,s) for p in ['base','head'] for s in ['claude-code','codex','unrecognized']]
assert [r['child_visible_blob_count'] for r in rows]==[0,0,0,4,3,0]
assert [len(r['file_materialization_callbacks']) for r in rows]==[4,4,4,0,1,4]
for profile in [ACPProfile('claude-code',None),ACPProfile('claude-code',[]),ACPProfile('claude-code',['PROD_DB_URL'])]:rows.append(run('head','claude-code',profile))
assert rows[7]['registry_names']==['ANTHROPIC_API_KEY']
assert rows[8]['registry_names']==['ANTHROPIC_API_KEY','PROD_DB_URL']
assert all(r['ambient_sentinel_visible'] for r in rows)
oh_selected=profile_ns['filter_profile_secrets'](OHProfile([]),{'ANTHROPIC_API_KEY':'SYNTHETIC','PROD_DB_URL':'SYNTHETIC'})
assert oh_selected=={}
rows.append({'phase':'draft-profile-head','profile_kind':'OHProfile','profile_refs':[],'registry_names':[],'kind':'profile filter only; no ACP composition or child execution'})
round=sys.argv[1] if len(sys.argv)>1 else '1';(ROOT/'runs').mkdir(exist_ok=True)
result={'kind':'original extracted methods, original environment-construction slice, AST-derived provider metadata; fixture registry and file-materialization callbacks; real Python child receives synthetic environment; two PRs composed only as a laboratory experiment, not merged SDK','harness_sha256':hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(),'registry_sha256':hashlib.sha256(registry_path.read_bytes()).hexdigest(),'profile_source_sha256':hashlib.sha256(profile_raw.encode()).hexdigest(),'rows':rows}
(ROOT/f'runs/openhands-{round}.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(rows,indent=2))
