import json

from ag2.scopes import Scope, ScopeError, ScopedValue, derive_child_variables, merge_variables

root = merge_variables({
    "private": ScopedValue({"n": 0}, Scope.LOCAL),
    "copied": ScopedValue({"n": 0}, Scope.COPIED),
    "shared": ScopedValue({"n": 0}, Scope.SHARED),
})
a = derive_child_variables(root)
b = derive_child_variables(root)
before = {
    "private_in_child": "private" in a,
    "copied_same_object": a["copied"] is root["copied"],
    "shared_same_object": a["shared"] is root["shared"],
}
a["copied"]["n"] = 1
a["shared"] = {"n": 1}
after = {
    "parent_copied": root["copied"]["n"],
    "sibling_copied": b["copied"]["n"],
    "parent_shared": root["shared"]["n"],
    "sibling_shared": b["shared"]["n"],
}
try:
    a["new_shared"] = ScopedValue(1, Scope.SHARED)
    child_new_shared = "accepted"
except ScopeError as exc:
    child_new_shared = type(exc).__name__
assert before == {"private_in_child": False, "copied_same_object": False, "shared_same_object": True}
assert after == {"parent_copied": 0, "sibling_copied": 0, "parent_shared": 1, "sibling_shared": 1}
assert child_new_shared == "ScopeError"
print(json.dumps({"before": before, "after": after, "child_new_shared": child_new_shared}, indent=2))
