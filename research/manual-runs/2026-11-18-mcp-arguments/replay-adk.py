"""Bounded replay of the exact McpInstructionProvider class from two pinned ADK blobs.

Set ADK_REPO to a checkout with both commits, then run: python replay-adk.py
No real credential, MCP network service, or model is involved.
"""

import ast
import asyncio
import json
import os
import subprocess
import sys
from types import SimpleNamespace

REPO = os.environ["ADK_REPO"]
PATH = "src/google/adk/agents/mcp_instruction_provider.py"
BEFORE = "13b6ae89cc2d8a55388bc638b97c8ec03bd80401"
AFTER = "889ddd3134df1dd1a626205ee78811950dec2a5c"
SYNTHETIC = "SYNTHETIC-CREDENTIAL-NOT-A-REAL-SECRET"


class FakeSession:
    def __init__(self):
        self.declared = [SimpleNamespace(name="user:email"), SimpleNamespace(name="adk_oauth2_credential")]
        self.list_calls = 0
        self.calls = []

    async def list_prompts(self):
        self.list_calls += 1
        return SimpleNamespace(prompts=[SimpleNamespace(name="sample", arguments=self.declared)])

    async def get_prompt(self, name, arguments=None):
        self.calls.append({"name": name, "arguments": arguments})
        return SimpleNamespace(messages=[SimpleNamespace(content=SimpleNamespace(type="text", text="instruction"))])


class FakeManager:
    sessions = []

    def __init__(self, **_kwargs):
        self.session = FakeSession()
        self.sessions.append(self.session)

    async def create_session(self):
        return self.session

    def _begin_session_use(self):
        pass

    def _end_session_use(self):
        pass


def exact_class(revision):
    source = subprocess.check_output(["git", "-C", REPO, "show", f"{revision}:{PATH}"], text=True)
    node = next(n for n in ast.parse(source).body if isinstance(n, ast.ClassDef) and n.name == "McpInstructionProvider")
    namespace = {"__name__": "adk_bounded_replay", "sys": sys,
                 "InstructionProvider": object, "MCPSessionManager": FakeManager}
    exec(compile("from __future__ import annotations\n" + ast.unparse(node),
                 f"{revision}:{PATH}", "exec"), namespace)
    return namespace["McpInstructionProvider"]


async def run(revision, *, supplied=False, arguments=None):
    FakeManager.sessions.clear()
    kwargs = {"arguments": arguments} if supplied else {}
    provider = exact_class(revision)(object(), "sample", **kwargs)
    context = SimpleNamespace(state={"user:email": "person@example.test",
                                     "adk_oauth2_credential": SYNTHETIC, "locale": "zh-CN"})
    await provider(context)
    session = FakeManager.sessions[-1]
    return {"list_prompts_calls": session.list_calls, "arguments": session.calls[0]["arguments"]}


async def main():
    cases = {
        "before_default": await run(BEFORE),
        "after_default": await run(AFTER),
        "after_static": await run(AFTER, supplied=True, arguments={"locale": "zh-CN"}),
        "after_callable": await run(AFTER, supplied=True,
                                    arguments=lambda ctx: {"locale": ctx.state["locale"]}),
        "after_explicit_secret": await run(AFTER, supplied=True,
                                           arguments=lambda ctx: {"credential": ctx.state["adk_oauth2_credential"]}),
    }
    assert cases["before_default"]["arguments"] == {"user:email": "person@example.test", "adk_oauth2_credential": SYNTHETIC}
    assert cases["before_default"]["list_prompts_calls"] == 1
    assert cases["after_default"] == {"list_prompts_calls": 0, "arguments": None}
    assert cases["after_static"]["arguments"] == {"locale": "zh-CN"}
    assert cases["after_callable"]["arguments"] == {"locale": "zh-CN"}
    assert cases["after_explicit_secret"]["arguments"] == {"credential": SYNTHETIC}
    print(json.dumps({"assertions_passed": 6, "cases": cases}, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
