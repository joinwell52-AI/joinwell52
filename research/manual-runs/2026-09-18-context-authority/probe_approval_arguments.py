"""Bounded probe through the original OpenAI Agents Runner and tool entry."""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Any

from pydantic import BaseModel, field_validator

parser = argparse.ArgumentParser()
parser.add_argument("--repo", required=True)
parser.add_argument("--version", required=True)
parser.add_argument("--commit", required=True)
cli = parser.parse_args()
repo = Path(cli.repo).resolve()
sys.path.insert(0, str(repo))

import agents
from agents import Agent, RunConfig, Runner
from agents.decorators import tool
from agents.testing import ScriptedModel
from tests.test_responses import get_function_tool_call, get_text_message


def scripted_agent(function_tool: Any, arguments: str) -> Agent:
    model = ScriptedModel()
    model.extend([[get_function_tool_call(function_tool.name, arguments, call_id="call_test")], [get_text_message("done")]])
    return Agent(name="probe", model=model, tools=[function_tool])


async def run_case(label: str, function_tool: Any, arguments: str, policy_seen: list, effects: list):
    result = await Runner.run(scripted_agent(function_tool, arguments), "go", run_config=RunConfig(tracing_disabled=True))
    return {
        "case": label,
        "raw_arguments": json.loads(arguments),
        "interrupted_for_manual_approval": bool(result.interruptions),
        "conditional_policy_calls": len(policy_seen),
        "conditional_policy_last_input": policy_seen[-1] if policy_seen else None,
        "effects": list(effects),
        "final_output": result.final_output,
    }


async def main() -> None:
    rows = []
    for label, arguments in [("explicit_unchanged_safe", '{"environment":"safe"}'), ("explicit_unchanged_protected", '{"environment":"protected"}'), ("omitted_default_protected", "{}")]:
        policy_seen: list[dict[str, Any]] = []
        effects: list[str] = []

        async def policy(_ctx, params, _id):
            policy_seen.append(dict(params))
            return params.get("environment") == "protected"

        @tool(strict_mode=False, needs_approval=policy)
        async def operation(environment: str = "protected") -> str:
            effects.append(environment)
            return environment

        rows.append(await run_case(label, operation, arguments, policy_seen, effects))

    for label, arguments in [("explicit_integer", '{"count":1}'), ("string_to_integer_coercion", '{"count":"1"}')]:
        policy_seen = []
        effects: list[int] = []

        async def policy(_ctx, params, _id):
            policy_seen.append(dict(params))
            return False

        @tool(strict_mode=False, needs_approval=policy)
        async def operation(count: int) -> str:
            effects.append(count)
            return str(count)

        rows.append(await run_case(label, operation, arguments, policy_seen, effects))

    validation_calls: list[str] = []

    class Request(BaseModel):
        target: str

        @field_validator("target")
        @classmethod
        def lower(cls, value: str) -> str:
            validation_calls.append(value)
            return value.lower()

    globals()["Request"] = Request
    policy_seen = []
    effects: list[str] = []

    async def policy(_ctx, params, _id):
        policy_seen.append(dict(params))
        return False

    @tool(strict_mode=False, needs_approval=policy)
    async def operation(request: Request) -> str:
        effects.append(request.target)
        return request.target

    row = await run_case("application_validator_transform", operation, '{"request":{"target":"PROD"}}', policy_seen, effects)
    row["validation_calls_before_manual_decision"] = list(validation_calls)
    rows.append(row)
    print(json.dumps({
        "schema": "approval-argument-probe/v1",
        "upstream": "openai/openai-agents-python",
        "version": cli.version,
        "commit": cli.commit,
        "agents_source": str(Path(agents.__file__).resolve()),
        "cases": rows,
        "boundary": "ScriptedModel and original Runner/tool path; no live model or external effect. An interruption means explicit approval is required, not that approval was granted.",
    }, indent=2))


if __name__ == "__main__":
    asyncio.run(main())

