"""Offline AG2 v1.3.2 turn-boundary comparison; no model API or credentials.

Usage: python probe_turn.py PATH_TO_AG2_CHECKOUT
The checkout must be at v1.3.2 and contain comparison parent 3399e3ef.
"""
import ast
import asyncio
import __future__
import importlib
import json
from pathlib import Path
import subprocess
import sys

CHECKOUT = Path(sys.argv[1]).resolve()
EXPECTED = "bf76b9cb6607936a7c240b1efc1811d8bd422de6"
PARENT = "3399e3ef2e339f6c64f7fc8d27eaed09662846a4"
head = subprocess.check_output(["git", "-C", str(CHECKOUT), "rev-parse", "HEAD"], text=True).strip()
assert head == EXPECTED, f"expected AG2 v1.3.2 source {EXPECTED}, got {head}"
sys.path.insert(0, str(CHECKOUT))


async def compare(old=False):
    from ag2 import Agent, ToolResult, tool
    from ag2.events import ToolCallEvent, ToolResultEvent
    from ag2.testing import TestConfig, TrackingConfig

    module = importlib.import_module("ag2.agent")
    original = module._execute_turn
    if old:
        source = subprocess.check_output(
            ["git", "-C", str(CHECKOUT), "show", f"{PARENT}:ag2/agent.py"]
        ).decode("utf-8")
        tree = ast.parse(source)
        body = [node for node in tree.body
                if isinstance(node, ast.AsyncFunctionDef) and node.name == "_execute_turn"]
        assert len(body) == 1
        code = compile(ast.Module(body=body, type_ignores=[]), "ag2/agent.py",
                       "exec", flags=__future__.annotations.compiler_flag)
        exec(code, module.__dict__)
    try:
        @tool
        def escalate() -> ToolResult:
            """Hand the ticket to a person."""
            return ToolResult("Ticket escalated.", final=True)

        config = TrackingConfig(TestConfig(
            ToolCallEvent(name="escalate", arguments="{}"), "Your order shipped."
        ))
        agent = Agent("probe", config=config, tools=[escalate])
        async with agent.run("I need a person.") as run:
            @run.stream.where(ToolResultEvent).subscribe
            async def inject(_event):
                run.enqueue("What about my order?")
            reply = await run.result()
        return {"reply": reply.body, "model_calls": config.mock.call_count}
    finally:
        module._execute_turn = original


old = asyncio.run(compare(old=True))
current = asyncio.run(compare())
assert old == {"reply": "Your order shipped.", "model_calls": 2}
assert current == {"reply": "Ticket escalated.", "model_calls": 1}
print(json.dumps({"ag2_commit": head, "comparison_parent": PARENT,
                  "old_function_on_current_runtime": old, "current": current,
                  "limitation": "Only _execute_turn is replaced; this is not a full old-release run."}, indent=2))
