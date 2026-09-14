"""Execute pinned upstream dispatch tests, with only CLI output simulated."""
import importlib.util,json,sys,unittest,io,os
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'runs';OUT.mkdir(exist_ok=True)
def load(path,name):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
cases=['test_error_status_publishes_fallback_with_the_backend_error','test_error_status_keeps_worker_result_and_exits_nonzero','test_trailing_status_free_result_event_cannot_erase_an_error','test_success_status_publishes_normally','test_result_event_without_status_publishes_normally']
records=[]
for version in ['base','head']:
    m=load(ROOT/'sources/code/3c94f45/head/tests/test_dispatch_task_agy.py','tests_'+version)
    m.DISPATCH=ROOT/f'sources/code/3c94f45/{version}/skills/prun/scripts/dispatch-task-agy.py'
    for name in cases:
        log=io.StringIO();suite=unittest.TestSuite([m.DispatchTaskAgyIntegrationTests(name)]);r=unittest.TextTestRunner(stream=log,verbosity=2).run(suite)
        text=log.getvalue().replace(str(ROOT),'<study>');(OUT/f'dispatch-{version}-{name}.log').write_text(text,encoding='utf8')
        records.append({'version':version,'test':name,'passed':r.wasSuccessful(),'failures':len(r.failures),'errors':len(r.errors)})
# The quota suite includes isolated cache fixtures; no actual provider is called.
m=load(ROOT/'sources/code/050ee0b/head/tests/test_dispatch_task_agy.py','quota_tests')
names=[n for n in unittest.defaultTestLoader.getTestCaseNames(m.DispatchTaskAgyUnitTests) if n not in ['test_copy_stream_writes_each_chunk_before_eof']]
for name in names:
    log=io.StringIO();r=unittest.TextTestRunner(stream=log,verbosity=2).run(unittest.TestSuite([m.DispatchTaskAgyUnitTests(name)]))
    (OUT/f'quota-{name}.log').write_text(log.getvalue().replace(str(ROOT),'<study>'),encoding='utf8')
    records.append({'version':'quota-head','test':name,'passed':r.wasSuccessful(),'failures':len(r.failures),'errors':len(r.errors)})
(OUT/'dispatch.json').write_text(json.dumps({'python':sys.version,'method':'Original upstream tests; original dispatcher subprocess; fixture CLI, temporary files, no real Agy or live quota read','observations':records},indent=2)+'\n',encoding='utf8')
print(json.dumps(records,indent=2))
