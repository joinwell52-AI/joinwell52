# What may another AI inherit? Public experiment record

Date: 2026-11-05 (Asia/Shanghai). This follows the day's [observations O1/O2/O17/O22 and analyses A1/A2/A4/A6](../../../docs/en/runtime/daily-intelligence/2026-11-05.md). The four upstream projects were **not** connected into one production workflow. Each result is limited to the fixed entry point below.

## Provenance and environment

| Object | Fixed source | Executed path |
| --- | --- | --- |
| AG2 | [v1.3.0](https://github.com/ag2ai/ag2/releases/tag/v1.3.0) | Python 3.12.10, `ag2==1.3.0`, variable merge and child derivation |
| LangGraph | [1.2.20](https://github.com/langchain-ai/langgraph/releases/tag/1.2.20) | Python 3.12.10, `langgraph==1.2.20`, in-memory checkpoint |
| Paradev | [desktop-v2.0.5](https://github.com/ParadevAI/Paradev/releases/tag/desktop-v2.0.5), commit `624219c3c6a5428aec38b5f13f040cc0fc087010` | Node 24.22.1, original `targetPlan.ts` with three dependency stubs |
| Anthropic cookbook | [dreaming PR #959](https://github.com/anthropics/claude-cookbooks/pull/959), commit `ce8b2629efe8b24048b127b4c79af1e9cbab93d4` | `memory_distill_utils.py` and 11 example transcripts |
| CodeFlowMu | [commit `0d2d4e7`](https://github.com/joinwell52-AI/codeflowmu/tree/0d2d4e742ef2f3cb48e3ce09cc47f0c03053dc5f) | Actual execution-contract builder and comparator; six focused test files |

The host was Windows. Paradev 2.0.5 had no Windows release asset. This run did not include an AG2 model conversation, Paradev desktop/cloud dispatch, or a paid Anthropic Managed Agents distillation.

## Inputs and observations

1. **Delegated data:** A root AG2 scope held `LOCAL`, `COPIED`, and `SHARED` values and spawned two child scopes. The child could not see `LOCAL`; mutating its `COPIED` value left the parent and sibling at `0`; updating `SHARED` made both observe `1`. Creating a new shared key below the root raised `ScopeError`. The [probe](probes/ag2_scopes.py) tests the variable API, not full model-driven delegation or synchronization.
2. **Pending answer:** A LangGraph state graph interrupted twice and produced different IDs. Unknown and already-consumed IDs raised `UnknownInterruptError`; two valid replies yielded `yes-plan/yes-exec`. The [probe](probes/langgraph_resume.py) enables the private `__pregel_strict_resume` key and uses an in-memory checkpointer. It does not establish the default behavior of a remote graph.
3. **Workspace and session:** The original Paradev `targetPlan` ran with small dependency stubs. Reusing a workspace without requesting continuation left the agent session fresh. Requesting continuation without a pinned workspace enabled reuse. When the old target was already reusable, changing hosts kept the reuse and continuation flags while returning the new host for verification. The [probe](probes/paradev_target.mjs) tests planning, not host verification or prior authorization.
4. **Memory input:** The Anthropic helper loaded 11 example transcripts. Its list-price estimate was `$0.7005`, an estimate rather than a bill. Empty input, zero budget and 506 files were rejected. In a synthetic thread fixture, a still-running analyzer did not count toward completed input coverage. The [probe](probes/dreaming_preflight.py) did not invoke a model or write a memory store; without a platform export, the completion check is weaker than an `end_turn` record.
5. **CodeFlowMu today:** The real session-contract functions returned distinct conflicts for host, workspace, role and governance-tool changes; an unchanged input returned none. The [probe](probes/codeflowmu_contract.mjs) tests the comparator only. Six focused CodeFlowMu test files at the pinned commit passed **77/77** tests: operation approval (15), session contract (4), governance approval (20), PM review readiness (3), task command (26), and dependency gate (9). They show, among other things, that a worker report does not itself make a PM decision, `REPORT done` does not satisfy `requires_success`, stale task rounds/revisions are rejected, and technical automation needs a scoped grant. The total is a sum of different suites, not a reliability rate.

One older `V2ComprehensiveClosure.e2e.test.ts` fixture stopped in this Windows environment when a Python call returned non-JSON stderr. It is **excluded** from the 77 passes and is not treated as evidence of a product defect.

## Claim boundaries

| Supported claim | Evidence | Does not establish |
| --- | --- | --- |
| Child data has distinct inheritance semantics | AG2 variable probe | CodeFlowMu has or lacks the same named scopes; full agent behavior |
| A pending answer can bind to an interrupt ID | LangGraph local strict-resume probe | Every deployment rejects stale answers by default; CodeFlowMu UI is fully covered |
| Workspace reuse and session continuation can be modeled separately | Paradev planner probe | Authorization survives a host change; Windows desktop is validated |
| Memory ingestion can check inputs, budget and coverage | Cookbook preflight probe | The generated memory is correct, reviewed or safely reversible |
| CodeFlowMu has several existing role and authority boundaries | Six CodeFlowMu suites and contract probe | A complete UI-to-tool takeover has been validated |

**Formal development reviews: 0.** The focused CodeFlowMu checks show relevant boundaries already exist; the remaining questions require a real PM→worker→reviewer takeover path. **External comments: 0.** No limited local probe was sent upstream without a readable English evidence page.

## Reproduce

Use the versions above, isolated environments with `ag2==1.3.0`, `langgraph==1.2.20`, and `anthropic>=2,<3`. The Paradev and CodeFlowMu arguments are paths to local checkouts at the stated commits.

```text
python probes/ag2_scopes.py
python probes/langgraph_resume.py
node probes/paradev_target.mjs <Paradev checkout>
python probes/dreaming_preflight.py <claude-cookbooks checkout>
node --experimental-transform-types probes/codeflowmu_contract.mjs <CodeFlowMu checkout>
```

The six CodeFlowMu test files are in its fixed commit under `packages/codeflowmu-runtime/src/`: `approval/__tests__/OperationApprovalService.test.ts`, `session/__tests__/SessionExecutionContract.test.ts`, `approval/__tests__/GovernanceApprovalService.test.ts`, `pm/__tests__/pmWorkerReviewReadiness.test.ts`, `governance/__tests__/TaskCommandKernel.test.ts`, and `scheduler/__tests__/TaskDependencyGate.test.ts`. Run each with `node --experimental-transform-types --test <file>`.

Probe SHA-256: `ag2_scopes.py` `7917224f7f4a4883b55ae27df9de6cb129ebf9bfdde519c7dc5e6a3e46fca99`; `langgraph_resume.py` `56da70953e1f940d7d8d54352990145d8b7c5412de09c6a2199fa3cfb88762a0`; `paradev_target.mjs` `75a30609e33deca6dd9f182698c76ff6e0a528bb35fbf0b9e84555c67a2f6138`; `dreaming_preflight.py` `dd0d7e589334dae8b55fc334858591c822aa31a3ce48bc8abd89c020fd32eea6`; `codeflowmu_contract.mjs` `962274785bdfcaba505d13c83fe9e5dfe149f6ed51afdba9be6322ba4d012ca`.
