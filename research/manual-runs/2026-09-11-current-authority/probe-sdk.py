"""Run the upstream resume regressions, optionally ablating only the fixed helper."""
import ast
import hashlib
import json
import os
from pathlib import Path
import platform
import subprocess
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
SDK = ROOT / 'external' / 'sdk-pinned'
RUNS = ROOT / 'runs'
RUNS.mkdir(exist_ok=True)
if len(sys.argv) == 1:
    outcomes = []
    for mode in ('fixed', 'base-helper'):
        run = subprocess.run([sys.executable, str(Path(__file__).resolve()), mode], capture_output=True, text=True, encoding='utf-8', errors='replace')
        (RUNS / f'sdk-{mode}.log').write_text(run.stdout + run.stderr, encoding='utf-8')
        xml = RUNS / f'sdk-{mode}.xml'
        cases = []
        if xml.exists():
            for case in ET.parse(xml).iter('testcase'):
                failure = case.find('failure')
                cases.append({'name': case.attrib['name'], 'failed': failure is not None, 'message': failure.get('message') if failure is not None else None})
        outcomes.append({'mode': mode, 'exit_code': run.returncode, 'cases': cases})
        print(mode, run.returncode, len(cases), 'cases')
        if (mode == 'fixed' and run.returncode != 0) or not cases:
            print((run.stdout + run.stderr)[-7000:])
    source = json.loads((ROOT / 'sources/openai-agents-python-4947.json').read_text(encoding='utf-8'))
    report = {'python': platform.python_version(), 'head': source['head_sha'], 'base_helper_commit': source['base_sha'], 'method': 'Original 10 upstream regressions on pinned SDK. Base-helper ablation replaces only get_unsent_tool_call_ids_for_interrupted_state.__code__ with the predecessor function; all other runtime and tests identical. ScriptedModel records input; no real API or network delivery acknowledgement.', 'outcomes': outcomes}
    (RUNS / 'sdk.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    assert len(outcomes[0]['cases']) == 10 and not any(c['failed'] for c in outcomes[0]['cases'])
    assert len(outcomes[1]['cases']) == 10 and all(c['failed'] for c in outcomes[1]['cases'])
    sys.exit(0)

mode = sys.argv[1]
os.chdir(SDK)
sys.path.insert(0, str(SDK))
sys.path.insert(0, str(SDK / 'src'))
import agents.run_internal.agent_runner_helpers as helpers

if mode == 'base-helper':
    source = (ROOT / 'sources/sdk-base-helper.py').read_text(encoding='utf-8')
    parsed = ast.parse(source)
    function = next(n for n in parsed.body if isinstance(n, ast.FunctionDef) and n.name == 'get_unsent_tool_call_ids_for_interrupted_state')
    namespace = dict(helpers.__dict__)
    exec(compile(ast.Module(body=[function], type_ignores=[]), '<pinned-predecessor-helper>', 'exec'), namespace)
    helpers.get_unsent_tool_call_ids_for_interrupted_state.__code__ = namespace[function.name].__code__

import pytest
sys.exit(pytest.main([
    '-q', '--tb=short',
    'tests/test_run_impl_resume_paths.py::test_resumed_server_managed_run_sends_tool_not_found_output',
    'tests/test_run_impl_resume_paths.py::test_resumed_server_managed_run_sends_each_tool_output_once',
    'tests/test_server_conversation_tracker.py::test_hydrate_from_state_preserves_unsent_output_without_a_pending_tool_run',
    f'--junitxml={RUNS / f"sdk-{mode}.xml"}',
]))
