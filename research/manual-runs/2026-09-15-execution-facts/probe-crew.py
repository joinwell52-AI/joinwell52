"""Execute the four unchanged upstream ToolUsage methods with a local SQLite tool."""
import ast, asyncio, json, sqlite3, tempfile, time
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock
ROOT=Path(__file__).resolve().parent
class Schema:
    @classmethod
    def model_json_schema(cls):return {'properties':{'logical_id':{}}}
class BrokenSchema:
    @classmethod
    def model_json_schema(cls):raise ValueError('synthetic-schema-error')
class StructuredMarker:pass
class Language:
    def errors(self,*a):return '{error}'
    def slice(self,*a):return '{tool_names}'
def load(mode):
    path=ROOT/f'external/crewAI-7458-{mode}/lib/crewai/src/crewai/tools/tool_usage.py'
    tree=ast.parse(path.read_text(encoding='utf8'))
    cls=next(n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=='ToolUsage')
    cls.body=[n for n in cls.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) and n.name in ['use','ause','_use','_ause']]
    error=next(n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=='ToolUsageError')
    ns={'time':time,'json':json,'CrewStructuredTool':StructuredMarker,'sanitize_tool_name':lambda x:x,'I18N_DEFAULT':Language(),'failure_from_exception':lambda e:{'error':str(e)},'detect_tool_failure':lambda x:None}
    prefix=ast.ImportFrom(module='__future__',names=[ast.alias(name='annotations')],level=0)
    exec(compile(ast.fix_missing_locations(ast.Module(body=[prefix,error,cls],type_ignores=[])),str(path),'exec'),ns)
    return ns['ToolUsage']
async def run(mode,route,attempts,scenario):
    C=load(mode)
    with tempfile.TemporaryDirectory(prefix='crew-effect-') as temp:
        db=sqlite3.connect(str(Path(temp)/'effects.sqlite'))
        db.execute('create table effects (id integer primary key, logical_id text)');db.commit()
        calls=[]
        class Tool:
            name='synthetic_write';formatted_description='synthetic SQLite append';result_as_answer=False
            args_schema=BrokenSchema if scenario=='schema-error' else Schema
            def invoke(self,input,config=None):
                calls.append({'attempt':usage._run_attempts,'arguments':dict(input)})
                db.execute('insert into effects(logical_id) values (?)',(input.get('logical_id'),));db.commit()
                if scenario=='effect-then-error':raise RuntimeError('synthetic-response-loss-after-commit')
                return 'ok'
            async def ainvoke(self,input,config=None):return self.invoke(input,config)
            def format_output_for_agent(self,result):return result
        tool=Tool();usage=C.__new__(C)
        usage.tools=[tool];usage.agent=None;usage.task=None;usage.tools_handler=None;usage._run_attempts=1;usage._max_parsing_attempts=attempts
        usage.tools_names=tool.name;usage.function_calling_llm=None;usage._telemetry=Mock();usage._select_tool=lambda name:tool
        usage._check_tool_repeated_usage=lambda **kw:False;usage._check_usage_limit=lambda *a:None;usage._build_fingerprint_config=lambda:None
        usage._format_result=lambda result:result;usage.on_tool_error=lambda **kw:None
        calling=SimpleNamespace(tool_name=tool.name,arguments={'logical_id':'synthetic-1','extra':'filtered-unless-fallback'})
        if route=='sync':result=usage.use(calling,'synthetic_write')
        else:result=await usage.ause(calling,'synthetic_write')
        writes=db.execute('select count(*) from effects').fetchone()[0];db.close()
        return {'mode':mode,'route':route,'attempt_limit':attempts,'scenario':scenario,'invocations':len(calls),'committed_rows':writes,'calls':calls,'result':result}
async def main():
    rows=[]
    for mode in ['base','head']:
        for route in ['sync','async']:
            for attempts,scenario in [(1,'effect-then-error'),(3,'effect-then-error'),(3,'success'),(1,'schema-error')]:rows.append(await run(mode,route,attempts,scenario))
    print(json.dumps({'method':'Unchanged AST-extracted upstream use/ause/_use/_ause. Injected telemetry, selection, cache/usage checks and formatting. Real temporary SQLite commits by a synthetic tool; no remote provider, payment or email.','results':rows},indent=2))
asyncio.run(main())
