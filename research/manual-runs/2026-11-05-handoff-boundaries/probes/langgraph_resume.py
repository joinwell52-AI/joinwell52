import json
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

class State(TypedDict, total=False):
    request: str
    result: str

def review(state: State) -> State:
    plan = interrupt({"question": "plan?", "request": state["request"]})
    execution = interrupt({"question": "execution?", "plan": plan})
    return {"result": f"{plan}/{execution}"}

builder = StateGraph(State)
builder.add_node("review", review)
builder.add_edge(START, "review")
builder.add_edge("review", END)
graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "handoff-probe", "__pregel_strict_resume": True}}
events = []

def attempt(name, value):
    try:
        result = graph.invoke(value, config)
        events.append([name, result.get("result"), len(result.get("__interrupt__", ()))])
        return result
    except Exception as exc:
        events.append([name, type(exc).__name__])
        return None

first = attempt("initial", {"request": "ship"})
id1 = first["__interrupt__"][0].id
attempt("unknown", Command(resume={"0" * 32: "yes"}))
second = attempt("answer_plan", Command(resume={id1: "yes-plan"}))
id2 = second["__interrupt__"][0].id
attempt("stale_plan", Command(resume={id1: "again"}))
attempt("answer_execution", Command(resume={id2: "yes-exec"}))
attempt("replay_execution", Command(resume={id2: "again"}))
assert id1 != id2
assert events == [
    ["initial", None, 1], ["unknown", "UnknownInterruptError"],
    ["answer_plan", None, 1], ["stale_plan", "UnknownInterruptError"],
    ["answer_execution", "yes-plan/yes-exec", 0],
    ["replay_execution", "UnknownInterruptError"],
]
print(json.dumps(events, indent=2))
