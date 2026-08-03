# Research Queue — Current State

- **Repository:** `joinwell52-AI/joinwell52`
- **Operating system:** Research Operating System V2
- **Execution engine:** Research Runtime Engine
- **Last governed Engine transition:** 2026-08-03
- **Last Queue Stage run:** 2026-08-03
- **Lifecycle:** `Signal → Candidate → Queue → Selected → Reading → Analysis → Research Note → Knowledge → Architecture → Specification → Publication → Release`

## Queue policy

Each Engine run may advance an eligible item by exactly one lifecycle transition. No item may skip a stage. Evidence insufficiency returns an item to `Queue` with a blocker and explicit next action.

The Queue Stage may discover signals, normalize candidates, score relevance, update evidence and blockers, and promote only qualified candidates to `Selected`. Selection does not authorize Reading or publication; the Engine controls later transitions.

Historical labels such as `Hold`, `Backlog`, `Deferred`, and `Rejected` are scheduling decisions rather than additional Research OS lifecycle states. Deferred work is represented as `Queue` with a blocker. Rejected signals are retained in queue history but excluded from the current work table.

## Current queue

| ID | Research object | Priority | Current state | Evidence basis | Blocker | Next governed action |
|---|---|---:|---|---|---|---|
| Q-W003-01 | WorkBoundaryContract and OwnershipLedger | P0 | **Reading** | Weekly 003 plus three evidence-validated Daily 003 notes | None at Reading entry | Perform boundary-field comparison and decide `Reading → Analysis` in a later Engine run. |
| Q-W003-02 | CompletionVerifier and EvidenceEnvelope | P0 | Selected | Weekly 003 queue decision and completion/evidence gaps across all three Daily notes | Minimal ownership dimensions should be stabilized first | Open a bounded Deep Reading package after Q-W003-01 establishes the boundary baseline. |
| Q-W003-03 | Human authority lifecycle node | P0 | Selected | Weekly 003 autonomy-versus-authority contradiction; GitHub agent action approvals, confidence, rationale, intents, and enterprise managed settings | Authority fields and ownership transition semantics remain coupled to Q-W003-01; approval UI is not itself a security boundary | Open Deep Reading focused on permission enforcement, approval, resume, timeout, rejection, rationale, and cross-client policy evidence. |
| Q-20260803-09 | Multi-horizon Digital Employee execution and evaluation | P0 | **Selected** | Microsoft Research CORPGEN paper and official research summary | No Queue blocker; source claims still require formal Reading and evidence validation | Invoke Skill 03 — Deep Reading on MHTE benchmark design, architecture mechanisms, ablations, artifact-based evaluation, and applicability to Research Runtime and CodeFlowMu. |
| Q-W003-04 | Comparative boundary experiment | P1 | Queue | Weekly 003 engineering sequence | Experiment contract depends on Q-W003-01 through Q-W003-03 | Refine scope after the semantic objects reach Analysis. |
| Q-W003-05 | A2A–FCoP external bridge | P2 | Queue | Weekly 003 reprioritization; GitHub MCP stateless-core and conformance-test signal | Ownership and acceptance semantics are not stable; MCP transport evidence does not define external delegation accountability | Remain queued; reconsider after boundary contract analysis. |
| Q-W003-06 | General MCP skills/tasks integration | P2 | Queue | Weekly 003 reprioritization; GitHub MCP stateless-core, extension, and conformance-test signal | Host-side work contract is not stable | Remain queued; do not start implementation research until ownership, authority, evidence, and acceptance contracts are defined. |
| Q-W003-07 | Unrestricted computer-use runtime | P2 | Queue | Weekly 003 reprioritization | Controlled local case and deterministic validator are not defined | Remain queued; begin only with a bounded application case. |
| Q-20260803-10 | Agentic work adoption, duration, and organizational governance | P2 | Queue | OpenAI economic-research summary and internal usage measurements | Underlying paper, sampling method, task-duration estimator, and independent comparison have not been extracted | Retrieve the primary paper and methodology; then rescore for possible selection. |
| Q-W003-08 | Full Digital Employee Studio | P3 | Queue | Weekly 003 reprioritization | Runtime semantic proof is incomplete | Remain queued until the control-plane model is tested. |

## Queue Stage decision — 2026-08-03

```yaml
queue_run:
  signals_registered: 6
  new_candidates: 2
  new_selected: 1
  new_deferred_to_queue: 1
  evidence_enriched_existing_objects: 3
  rejected_signals: 1
  research_notes_created: 0
  publications_created: 0
```

### New qualified selection

```yaml
selection:
  item_id: Q-20260803-09
  item: Multi-horizon Digital Employee execution and evaluation
  priority: P0
  from: Signal
  normalized_through: Candidate and Queue triage
  to: Selected
  primary_object: paper
  next_skill: Skill 03 — Deep Reading
  publication_created: false
```

Q-20260803-09 was selected because the primary paper is available, the research question is bounded, and the topic directly tests the Research Center’s Digital Employee, Runtime Queue, memory isolation, dependency management, reprioritization, and completion-evidence assumptions.

### Evidence enrichment without lifecycle advancement

- `Q-W003-03` received two official GitHub signals covering approval suggestions, confidence, rationale, intent records, and centrally managed policy. It remains `Selected` because authority semantics depend on the active ownership baseline.
- `Q-W003-05` and `Q-W003-06` received current MCP stateless-core and conformance evidence. They remain `Queue` because protocol transport and conformance do not settle ownership, authority, retry, acceptance, or completion.

### Deferred and rejected signals

- `Q-20260803-10` remains in `Queue` pending methodology extraction and independent comparison.
- The ChatGPT Work product announcement was rejected as a standalone candidate. It remains only in the signal register for provenance.

## Source trace

### Existing research basis

- `docs/en/research/weekly/weekly-003.md`
- `docs/zh/research/weekly/weekly-003.md`
- `research/weekly-synthesis/2026-08-02/RUN-RECORD.md`
- `research/production-tests/production-test-v1/REPORT.md`
- `research/production-tests/production-test-v1/RUNTIME-RECORD.md`
- `research/reading/Q-W003-01-work-boundary-contract.md`

### Queue Stage records

- `research/queue/signals/2026-08-03.md`
- `research/queue/history/2026-08-03-queue-stage.md`

## Next Engine action

The active Engine item remains Q-W003-01. On the next eligible Engine run, it may move from `Reading` to `Analysis` only when the reading record is checked against the five boundary types and the minimal invariant set can be stated without unsupported implementation assumptions. Otherwise it must return to `Queue` with a specific evidence request.

The new Q-20260803-09 selection must wait for a later Engine allocation. Queue Stage selection must not bypass the active Reading item or invoke publication work directly.
