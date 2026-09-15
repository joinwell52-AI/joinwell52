"""Run pinned Realtime code with local recording tools and the upstream approval suite."""
import ast, asyncio, json, os, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SDK=ROOT/'external/openai-agents-python-5029-head'
if len(sys.argv)<2:
    records=[]
    for mode in ['head','old-method']:
        p=subprocess.run([sys.executable,__file__,mode],capture_output=True,text=True,encoding='utf8',timeout=180)
        records.append({'mode':mode,'exit_code':p.returncode,'output':p.stdout,'stderr':p.stderr})
    print(json.dumps(records,ensure_ascii=False));raise SystemExit()
sys.path[:0]=[str(SDK/'src'),str(SDK)]
os.chdir(SDK)
import agents.realtime.session as module
if sys.argv[1]=='old-method':
    source=(ROOT/'external/openai-agents-python-5029-base/src/agents/realtime/session.py').read_text(encoding='utf8')
    cls=next(n for n in ast.parse(source).body if isinstance(n,ast.ClassDef) and n.name=='RealtimeSession')
    fn=next(n for n in cls.body if isinstance(n,ast.AsyncFunctionDef) and n.name=='_function_needs_approval')
    ns={};exec(compile(ast.fix_missing_locations(ast.Module(body=[fn],type_ignores=[])),'<pinned-base-method>','exec'),module.__dict__,ns)
    module.RealtimeSession._function_needs_approval.__code__=ns[fn.name].__code__
from agents.realtime.agent import RealtimeAgent
from agents.realtime.model_events import RealtimeModelToolCallEvent
from agents.tool import function_tool
from tests.realtime.session_test_support import RecordingRealtimeModel
async def matrix():
    rows=[]
    async def async_false(*args):return False
    values=[('false',False),('true',True),('string-always','always'),('integer-one',1),('null',None),('object',{}),('callable-false',lambda *a:False),('callable-true',lambda *a:True),('callable-null',lambda *a:None),('async-false',async_false)]
    for label,value in values:
        effects=[]
        def record_effect()->str:
            """Record a synthetic local effect."""
            effects.append('called');return 'recorded'
        tool=function_tool(record_effect);tool.needs_approval=value
        session=module.RealtimeSession(RecordingRealtimeModel(),RealtimeAgent(name='synthetic',tools=[tool]),None,run_config={'async_tool_calls':False})
        error=None
        try:await session._handle_tool_call(RealtimeModelToolCallEvent(name=tool.name,call_id='synthetic-call',arguments='{}'))
        except Exception as e:error={'type':type(e).__name__,'message':str(e)}
        rows.append({'setting':label,'tool_invocations':len(effects),'pending_approvals':len(session._pending_tool_calls),'error':error})
    return rows
print('MATRIX_JSON='+json.dumps(asyncio.run(matrix())))
import pytest
raise SystemExit(pytest.main(['tests/realtime/test_session_approvals.py','-q','-o','addopts=']))
