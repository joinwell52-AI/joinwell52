"""Run the pinned upstream notifier with a deterministic remote-client stub.

Place a checkout of langchain-ai/async-deep-agents at commit 6cafef62 in the
async-deep-agents/ subfolder, then run this script with Python 3.10+.
"""

import asyncio
import importlib.util
import json
import os
import sys
import types
from pathlib import Path

CHECKOUT = Path(os.environ.get("ASYNC_DEEP_AGENTS_CHECKOUT", Path(__file__).parent / "async-deep-agents"))
MODULE_PATH = CHECKOUT / "graphs" / "python" / "src" / "middleware" / "completion_notifier.py"


class FakeRuns:
    def __init__(self, fail=False):
        self.fail = fail
        self.calls = []

    async def create(self, **kwargs):
        self.calls.append(kwargs)
        if self.fail:
            raise RuntimeError("synthetic transport failure")
        return {"run_id": "parent-run-1"}


class FakeClient:
    def __init__(self, runs):
        self.runs = runs


def stub_imports(runs):
    for name in ("langchain", "langchain.agents", "langchain.agents.middleware", "langchain.agents.middleware.types", "langgraph_sdk"):
        sys.modules[name] = types.ModuleType(name)
    middleware_types = sys.modules["langchain.agents.middleware.types"]
    middleware_types.AgentMiddleware = type("AgentMiddleware", (), {})
    middleware_types.Runtime = type("Runtime", (), {})
    sys.modules["langgraph_sdk"].get_client = lambda: FakeClient(runs)


def import_upstream():
    spec = importlib.util.spec_from_file_location("pinned_completion_notifier", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


async def exercise(module, runs, parent_thread_id="parent-thread-1"):
    notifier = module.build_completion_notifier(
        parent_thread_id=parent_thread_id,
        parent_assistant_id="supervisor-1",
        subagent_name="researcher",
    )
    state = {"messages": [{"content": "finished the bounded task"}]}
    await notifier.aafter_agent(state, None)
    await notifier.aafter_agent(state, None)
    return {
        "transport_attempts": len(runs.calls),
        "notified_flag": notifier._notified,
        "parent_message_role": runs.calls[0]["input"]["messages"][0]["role"] if runs.calls else None,
        "message_has_job_id": "job_id" in runs.calls[0]["input"]["messages"][0]["content"] if runs.calls else None,
    }


async def main():
    results = {}
    for label, fail, parent_id in (
        ("success", False, "parent-thread-1"),
        ("transport_failure", True, "parent-thread-1"),
        ("missing_parent_identity", False, None),
    ):
        runs = FakeRuns(fail=fail)
        stub_imports(runs)
        module = import_upstream()
        results[label] = await exercise(module, runs, parent_id)
    assert results["success"] == {
        "transport_attempts": 1,
        "notified_flag": True,
        "parent_message_role": "user",
        "message_has_job_id": False,
    }
    assert results["transport_failure"]["transport_attempts"] == 1
    assert results["transport_failure"]["notified_flag"] is True
    assert results["missing_parent_identity"]["transport_attempts"] == 0
    assert results["missing_parent_identity"]["notified_flag"] is False
    print(json.dumps(results, indent=2, sort_keys=True))


if __name__ == "__main__":
    asyncio.run(main())
