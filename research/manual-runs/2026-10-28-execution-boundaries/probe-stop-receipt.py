"""Independent synthetic probe: SDK cancellation versus an accepted remote mutation.

The detached coroutine models an external service that has already accepted a
request. It is intentionally not an HTTP or production integration test.
"""

import asyncio
import json

from openai.types.responses import ResponseCustomToolCall

from agents import Agent, CustomTool, RunHooks, Runner, UserError
from agents.decorators import tool
from agents.run_internal import tool_execution
from agents.testing import ScriptedModel, function_call


async def main() -> None:
    completed_end = asyncio.Event()
    release_completed = asyncio.Event()
    remote_accepted = asyncio.Event()
    release_remote_commit = asyncio.Event()
    remote_committed = asyncio.Event()
    native_cancelled = asyncio.Event()
    selected_failure = asyncio.Event()
    calls: list[str] = []

    original_drain = (
        tool_execution._FunctionToolBatchExecutor._raise_failure_after_draining_siblings
    )

    async def mark_selection(self, failure):
        selected_failure.set()
        return await original_drain(self, failure)

    tool_execution._FunctionToolBatchExecutor._raise_failure_after_draining_siblings = (
        mark_selection
    )
    tool_execution._FUNCTION_TOOL_POST_INVOKE_WAIT_SECONDS = 5

    async def remote_worker() -> None:
        await release_remote_commit.wait()
        remote_committed.set()

    @tool
    async def completed() -> str:
        return "prior output"

    @tool(failure_error_function=None)
    async def fail() -> str:
        await completed_end.wait()
        await remote_accepted.wait()
        raise ValueError("selected failure")

    class Hooks(RunHooks):
        async def on_tool_end(self, context, agent, tool, result):
            if tool is completed:
                completed_end.set()
                await release_completed.wait()

    async def invoke(context, value):
        calls.append(value)
        if value == "active":
            remote_accepted.set()
            asyncio.create_task(remote_worker())
            try:
                await asyncio.Event().wait()
            except asyncio.CancelledError:
                native_cancelled.set()
                raise
        return "queued result"

    native = CustomTool(name="native", description="synthetic", on_invoke_tool=invoke)
    requests = [
        function_call("completed", {}, call_id="completed"),
        function_call("fail", {}, call_id="failed"),
        ResponseCustomToolCall(
            type="custom_tool_call", name="native", call_id="active", input="active"
        ),
        ResponseCustomToolCall(
            type="custom_tool_call", name="native", call_id="queued", input="queued"
        ),
    ]
    agent = Agent(
        name="stop-receipt-probe",
        model=ScriptedModel([requests]),
        tools=[completed, fail, native],
    )
    run_task = asyncio.create_task(Runner.run(agent, "go", hooks=Hooks()))
    try:
        await asyncio.wait_for(selected_failure.wait(), 3)
        await asyncio.wait_for(native_cancelled.wait(), 3)
        at_failure = {
            "active_started": "active" in calls,
            "queued_started": "queued" in calls,
            "active_cancelled": native_cancelled.is_set(),
            "remote_accepted": remote_accepted.is_set(),
            "remote_committed": remote_committed.is_set(),
        }
        release_completed.set()
        try:
            await asyncio.wait_for(run_task, 3)
        except UserError:
            pass
        release_remote_commit.set()
        await asyncio.wait_for(remote_committed.wait(), 3)
        after_remote = {
            "queued_started": "queued" in calls,
            "remote_committed": remote_committed.is_set(),
        }
        assert at_failure == {
            "active_started": True,
            "queued_started": False,
            "active_cancelled": True,
            "remote_accepted": True,
            "remote_committed": False,
        }
        assert after_remote == {"queued_started": False, "remote_committed": True}
        print(json.dumps({"at_failure": at_failure, "after_remote": after_remote}))
    finally:
        release_completed.set()
        release_remote_commit.set()
        if not run_task.done():
            run_task.cancel()
        await asyncio.gather(run_task, return_exceptions=True)


if __name__ == "__main__":
    asyncio.run(main())
