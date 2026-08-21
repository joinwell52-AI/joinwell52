# Why Is the Agent Still Editing the Old Project? Safely Rebinding an Execution Chain

![The execution chain changes identity at an isolation seam from inactive Project A and terminates only in the larger Project B root](../../../staging/publication-candidates/2026-08-20-project-root-switch-cover.png)

You switch the interface from project A to B, but the agent still patches A. Tests run in B while build output keeps contaminating A. Every local step looks successful; the delivery now combines two projects.

The model did not necessarily forget a name. The application had competing versions of “current project” in the UI, runtime, tool processes, watchers, and child-process working directories. A safe switch is therefore an ordered execution-chain rebind: stop new side effects in the old root, persist the new root, rebuild every project-scoped component from one binding plan, and verify that tasks and evidence land together. This article also covers Windows handles, symlink aliases, and draining failures that a selector cannot solve.

## “Current project” is not one string

A local agent application commonly uses a project root in at least seven places:

1. runtime configuration and session startup;
2. MCP servers or other tool subprocesses;
3. watchers observing code and coordination artifacts;
4. agent terminals and child-process working directories;
5. task admission and submission records;
6. FCoP lifecycle state;
7. runtime logs and execution evidence.

Switch six and leave one behind, and the system can produce a convincing cross-project fiction: code changes in A, a passing test in B, and a report attached to B’s task. Each local operation succeeded. The combined delivery is invalid.

The [Node.js child-process documentation](https://nodejs.org/api/child_process.html) establishes one low-level fact: a child has an explicit `cwd`; without one, it inherits the parent’s current working directory, and a missing directory produces `ENOENT`. A UI label cannot retroactively change a process that is already running.

VS Code’s [multi-root workspace documentation](https://code.visualstudio.com/docs/editing/workspaces/multi-root-workspaces) gives another warning: an extension that has not adopted multi-root APIs may still operate only on the first folder. [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust) evaluates newly added folders separately. Presence in a workspace, the root an extension uses, and the folder’s trust status are distinct facts.

## Maintain one active project root

CodeFlowMu’s [`project-registry.ts`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/project-registry.ts) stores the active project and builds a runtime binding plan. The plan assigns one root to the runtime, MCP configuration, watchers, and Cursor agent working directory. A diagnostic compares the expected root, instance root, writer-lock root, and component bindings; disagreement produces `ACTIVE_PROJECT_BINDING_MISMATCH`.

That is safer than allowing every component to query “current project” independently. Component A can read A just before a switch while component B reads B just after it. Both values were current when read; the system is still split.

A single immutable plan avoids that race:

```text
active project root = D:/work/project-b

Runtime root   ─┐
MCP root       ─┤
Watcher root   ─┼─ all must equal project-b
Agent cwd      ─┤
Writer lock    ─┘
```

Equality should mean normalized path identity, not merely similar text. Windows adds case, separator, junction, and “business root versus its `fcop/` directory” complications.

Symlinks add another trap. `D:/work/app` and `D:/links/app` may refer to the same directory, and package managers such as pnpm use links extensively. The tested implementation mainly uses absolute resolution and business-root normalization; this article found no evidence that every binding is canonicalized through `fs.realpathSync.native()`. A hardened design should retain both the user-facing logical path and the operating-system real path, compare the latter for authority, and reject a missing target rather than guessing from strings.

## Bind each request to an immutable context

Even after the process has an active project, a long request needs a stable context. Otherwise, a mid-request switch can make the first half read A and the second half write evidence to B.

[`ProjectExecutionContext`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/project/ProjectExecutionContext.ts) creates an immutable object at the request boundary. It binds the business project, runtime instance, data root, task-admission root, task-submission root, lifecycle root, and evidence root. Downstream components receive that object instead of rediscovering the project. A mismatched expected root raises `PROJECT_EXECUTION_CONTEXT_MISMATCH`.

This protects request-local consistency. It does not complete a hot switch. Old requests can still hold old contexts, which is why active sessions must be handled first.

## Stop the old world before constructing the new one

The current public switch route lives in [`web-panel.ts`](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/web-panel.ts). With switch-time reload enabled, its sequence is:

```text
1. Validate that the target exists and is not the protected installation source root
2. Cancel active agent sessions
3. If any session cannot stop, return a conflict and do not switch
4. Stop the old runtime
5. Persist the new active project and root
6. Apply project-scoped options
7. Invalidate and rebuild ledger state for the new root
8. Schedule shell/runtime reload
9. Let the UI wait until health reports the target projectRoot
```

![Project rebinding closes old effects, persists the new root, rebuilds all bindings, and verifies one root; draining, handle probes, and real-path checks are marked as recommended enhancements](../../../staging/publication-candidates/2026-08-20-project-root-switch-figure-1.png)

*Figure 1. Execution-chain rebinding sequence. The solid main path summarizes the current public implementation; the dashed draining, Windows-handle, and real-path checks are recommendations, not existing end-to-end functionality.*

The decisive step is not refreshing the UI. It is closing the channels through which old-project work can continue producing effects.

This should not be called an atomic transaction. If persistence fails, the implementation restores the previous active-project identifier and attempts to restore the previous instance root. It cannot retract a request already sent to an external service, and it cannot prove that every third-party tool has discarded an in-memory path cache.

The accurate description is ordered stop, persist, rebuild, and verify, with bounded compensation.

## Six failure modes deserve separate treatment

### The target disappeared

The registry still contains B, but its directory has moved or been deleted. The current route refuses the switch. Startup resolution can fall back to an available instance root and emit a diagnostic.

Fallback itself is risky if the UI still says B. A control surface should show the effective root and the fallback reason, not only a friendly project name.

### An old session will not stop

An agent may be waiting for a streamed model response, a build, or a long-running tool. The current switch route requests emergency cancellation and preserves the old project if any session cannot stop. That is correct fail-closed behavior, but it is not a complete graceful-drain protocol.

A stronger target sequence closes task admission, asks in-flight work to cancel cooperatively, allows a bounded grace window for writes and child processes, and then rechecks sessions, processes, and write leases. Timeout must not become success. Forced termination should be a last resort only for owned processes, after recording a dirty-state marker that requires repair or isolation before resuming.

If projects must run concurrently, separate runtime instances are cleaner than rapidly moving one global active root.

### Persistence fails

Memory has selected B, but the registry or instance record cannot be updated. The current implementation restores the old active identifier and attempts to write the old root back. That narrows the split window, but logs and a health check still need to confirm recovery.

### Component roots disagree

The runtime says B while MCP still says A. Choosing the newest timestamp or taking a majority vote would hide the contradiction. The system should stop writes, report the mismatch, and let an authorized operator restart or restore.

This follows TMPA’s conflict-preservation rule: contradictory facts should remain visible rather than being smoothed into a probabilistic answer.

### Windows handles remain open

A cancellation acknowledgement does not prove that Git, a compiler, watcher, or child tool released its directory handles. Later cleanup or reconstruction can fail with `EBUSY`, `EPERM`, or access-denied errors. The 27 tests used here do not inject handle-retention faults.

Treat process stop and resource release as separate checks. Track owned children, use bounded backoff to probe active processes, watchers, leases, and critical paths, and preserve the old root when release cannot be established. Do not kill unrelated same-name processes or delete runtime directories while handle ownership is unknown.

### Different paths resolve to the same directory

Case, junctions, symlinks, mount aliases, and an accidental `fcop/` subdirectory can make string comparison lie in either direction. The current suite covers part of Windows normalization and `fcop/` handling, not universal symlink equivalence. Real-path identity should participate in registration, binding plans, and health checks; resolution failure should block the switch.

## A switch must not silently initialize the target

A newly selected project may lack FCoP assets or other runtime projections. Automatically copying them during a switch looks convenient, but selection and initialization carry different authority. Selection changes what the application observes; initialization writes into the target repository.

CodeFlowMu regression tests explicitly require project switching not to perform an unapproved Open-edition projection repair. Initialization belongs to a separate plan and administrator decision.

Otherwise, “open project B” silently becomes “modify project B,” which is especially unsafe for a freshly cloned external repository.

## What 27 passing tests establish

For this article we pinned CodeFlowMu Open commit `ed5634c718b9e238c44bb70851020c9793546fe6` in an isolated worktree and ran the runtime context and shell switch suites. The result was **27 of 27 tests passing**.

They cover immutable binding of task, submission, lifecycle, and evidence roots; normalization of an `fcop/` input without creating `fcop/fcop`; writer behavior during initialization; active-project registration; protection of the installation source root; missing or corrupt registry fallback; a shared binding plan for runtime, MCP, watchers, and Cursor working directory; consistent UI switch entry points; and the absence of unapproved projection repair during a switch.

The tests establish behavior of the pinned implementation. They do not prove that arbitrary third-party MCP servers, IDE extensions, or operating-system processes discard cached paths. They also do not cover high-frequency concurrent switches, graceful-drain timeout, Windows `EBUSY` handle retention, or symlink-alias races.

## A switch acceptance checklist

Before switching:

1. Normalize and record the old and target absolute roots.
2. Reject the installation source root, unsafe parent roots, and missing targets.
3. List active sessions and components holding write leases.
4. Separate “select this project” from “initialize files in this project.”
5. Resolve the logical path to a real path and block missing, protected, or aliased targets.

During switching:

6. Close new task admission, then give old work a bounded drain window.
7. Recheck sessions, owned subprocesses, watchers, write leases, and Windows handles.
8. Persist the new root only after stop succeeds.
9. If persistence fails, record the compensation outcome.
10. Rebuild the runtime, MCP, watchers, and agent working directory from one plan.

After switching:

11. Have health report both logical and effective `projectRoot`, not only a project name.
12. Probe the task, lifecycle, and evidence roots.
13. Compare a root digest for every component and block writes on mismatch.
14. Run a temporary task and verify that its task file, code change, and report all land under the new root before resuming consequential work.

Real-path identity, drain windows, handle probes, root digests, and the temporary acceptance task are recommendations from this analysis. They are not all implemented by the current switch route and are not FCoP protocol fields.

## Applicability limits

For a single-folder application with no background processes and no requirement for live switching, closing the application and restarting from the new root can be safer than hot rebind.

For genuine concurrent projects, a single active-root model is insufficient. Give each project its own runtime identity, processes, watchers, and evidence root, then let a higher control plane select which instance to observe.

Network filesystems, containers, and remote development introduce path mapping beyond the Windows-local tests used here. This article does not claim universal filesystem validation.

## Conclusion

When an agent edits the old project, the root cause is often not that the model forgot a name. The application mistook a UI selection for a completed execution-context rebind.

> The current project is not a label. It is a set of root-binding facts that must hold together.

Stop old work, persist the new root, reconstruct every project-scoped component, verify the bindings, and only then resume. Skip one step and the agent may perform the correct operation in the wrong project.

## Primary sources

1. [Node.js Child Process: `cwd`](https://nodejs.org/api/child_process.html)
2. [VS Code Multi-root Workspaces](https://code.visualstudio.com/docs/editing/workspaces/multi-root-workspaces)
3. [VS Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
4. [CodeFlowMu ProjectExecutionContext, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/packages/codeflowmu-runtime/src/project/ProjectExecutionContext.ts)
5. [CodeFlowMu project-registry, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/project-registry.ts)
6. [CodeFlowMu web-panel switch route, pinned commit](https://github.com/joinwell52-AI/CodeFlowMu-open/blob/ed5634c718b9e238c44bb70851020c9793546fe6/codeflowmu-shell/src/web-panel.ts)
7. [TMPA Core Specification S1.0, pinned commit](https://github.com/joinwell52-AI/joinwell52/blob/ae27de71b1a8809c2bd69acedc1482570d55a322/docs/public/releases/tmpa/v1.0/artifacts/tmpa-core-specification-s1.0-zh.md)

Accessed 2026-08-20.
