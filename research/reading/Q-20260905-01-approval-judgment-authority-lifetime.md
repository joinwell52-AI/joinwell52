# Q-20260905-01 — Approval Judgment Is Not Authority-Bearing Sign-off

- Runtime date: 2026-09-05 (Asia/Shanghai)
- Queue signal: SIG-20260905-002
- Primary policy source: https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/
- Supporting policy documentation: https://docs.github.com/en/copilot/customizing-copilot/configuring-copilot-code-review/configuring-copilot-code-review
- Independent maintainer implementation: https://github.com/openai/codex/commit/87628df77ab1a2622d1193ad835df02ced565bf2
- Evidence level: `official_announcement` + `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

What distinct authority evidence must turn an AI-generated approval judgment into an effective organizational sign-off, and when must that authority expire or be invalidated as the reviewed object, governing policy, root instructions, verified answers, or execution context changes?

## Problem

An AI system can produce a recommendation that sounds like approval without possessing the authority to make that approval operationally effective. A second failure appears after authority has once been granted: an earlier valid approval can remain cached or inherited after the evidence that justified it has changed.

The two selected samples expose these failures at different layers. GitHub Copilot separates review assessment from pull-request approval and from whether that approval may satisfy merge requirements. OpenAI Codex separately versions the root authorization evidence used by Guardian reviews and invalidates an allow when that evidence changes. Together they support a bounded governance rule: **an approval judgment and the authority that makes it effective are different facts, and effective authority needs an explicit freshness boundary.**

## GitHub Copilot: Judgment, Sign-off and Merge Effect Are Separate States

GitHub's 2026-09-01 product contract says every Copilot code review includes an approval assessment in the overview comment. That assessment by itself does **not** count toward pull-request merge requirements. Actual Copilot approval is a separate feature, disabled by default, that administrators must explicitly enable.

The configuration surface then separates another boundary: a repository can permit Copilot to approve pull requests and can separately permit those approvals to count toward merge requirements. Repository administrators may additionally constrain qualifying approvals by file-path globs; an approval counts only when every changed file falls within the allowed scope.

The policy hierarchy is also explicit. Enterprise administrators can disable Copilot approvals globally or delegate the decision to organizations. Organization administrators can enable approvals broadly, delegate to repositories, restrict them to selected repositories, or disable them. Repository administrators then control the repository-level approval and merge-requirement settings within the higher-level policy.

GitHub also defines a freshness transition on the reviewed object. If new commits are pushed after Copilot has approved a pull request, that approval is dismissed in the same way as a human review approval and a new review is required. The significance is not that Copilot behaves like a human in every respect; it is that an approval which was valid against one reviewed state is not treated as indefinitely valid against a changed reviewed state.

A useful state decomposition is therefore:

1. **Assessment** — the AI concludes that the change is acceptable.
2. **Approval capability** — policy permits the AI reviewer to submit an approving review.
3. **Merge authority** — policy permits that approval to satisfy a required-approvals rule.
4. **Scope** — enterprise, organization, repository and optionally file-path policy delimit where that authority applies.
5. **Freshness** — a later commit changes the reviewed object and dismisses the prior approval.

Calling all five states simply “approval” would erase the authorization boundary that the product explicitly preserves.

## Codex Guardian: An Allow Cannot Outlive the Evidence It Evaluated

Codex commit `87628df77ab1a2622d1193ad835df02ced565bf2` addresses a different but complementary problem: delegated Guardian reviews need the current root instructions and verified answers even after the parent context is compacted, and an allow decision must become stale when that root authorization changes.

The implementation builds bounded root-review evidence from retained context while preserving source order and answer scope. Required user instructions are prioritized over optional assistant context so optional material cannot evict the grants or restrictions needed for authorization. When large root instructions are no longer present in the live model window after compaction, Codex can recover the retained instruction from Guardian history by identity. If required root instructions or verified answers cannot be recovered, the retained authorization context is marked incomplete rather than silently assuming authority.

For synchronous and reusable reviews, Codex captures a version of the root authorization evidence. If a review produces `Allow` but the root authorization version has changed before the allow can be used, the allow is cancelled instead of being accepted. The implementation comment captures the intended invariant: a completed approval must not outlive the root evidence it evaluated.

Forking is another authority-sensitive transition. In retained-context mode, worker history is sanitized so parent-only Guardian approvals are removed rather than becoming child-local authority merely because the child inherited conversation history. Tests cover parent compaction, authorization changes during review, retained versus legacy context, oversized evidence, message limits and fork behavior.

This supports a narrower implementation claim than GitHub's organizational policy: **runtime authorization can be treated as versioned evidence, and context operations such as compaction and fork cannot automatically be assumed authority-neutral.**

## Comparative Mechanism

GitHub and Codex are not implementing the same approval system. GitHub governs whether an AI review becomes repository sign-off; Codex governs whether a Guardian review may authorize a runtime action. Their common structure is nonetheless useful:

| Boundary | GitHub Copilot | Codex Guardian |
| --- | --- | --- |
| Judgment | Approval assessment | Guardian review result |
| Authority source | Enterprise / organization / repository policy | Root instructions + verified answers retained as review evidence |
| Effective action | PR approval; optionally counts toward merge rule | Allowed tool/action review may proceed |
| Scope | Policy hierarchy and optional file globs | Bounded root-review evidence and review scope |
| Freshness trigger | New commit dismisses prior approval | Root authorization version changes cancel stale allow |
| Context transition | Reviewed object changes | Parent compaction / worker fork |
| Fail-closed condition | Actual approval disabled unless configured | Missing required retained authorization evidence marks context incomplete |

The cross-sample mechanism can therefore be stated as:

**Authority-bearing approval = judgment + admitted approval capability + explicit scope + fresh authority evidence + continuity with the execution/review context to which the authority was granted.**

This is a reading-level synthesis, not a universal protocol. Different systems may encode those dimensions differently, but neither selected sample supports treating an approval-looking model output as sufficient authority by itself.

## Failure Modes Exposed by the Sources

### Judgment-authority collapse

If an approval assessment is treated as an effective sign-off merely because it says “approve,” the system bypasses the administrator-controlled boundary that decides whether AI may participate in merge governance.

### Authority-scope collapse

If permission to approve is treated as permission to satisfy every merge requirement across every repository or file, the system ignores the narrower policy scope under which authority was granted.

### Stale approval

If a review remains effective after the reviewed commit or root authorization evidence changes, the system applies a judgment to facts it did not actually evaluate.

### Context-derived privilege inheritance

If compaction or worker fork is treated as a transparent copy of authority, a child may inherit parent-only approvals or a reviewer may proceed without the root restrictions and verified answers that justified the original decision.

## Evidence Strength

The GitHub evidence is an official public product contract reinforced by configuration documentation. It is strong for exposed policy behavior and administrator scopes, but it does not expose all internal enforcement code.

The Codex evidence is a merged maintainer change with inspectable implementation and targeted tests. It is stronger for the concrete stale-authorization and context-transition mechanism, but it concerns Guardian runtime authorization rather than organizational pull-request governance.

The comparison is therefore useful precisely because the sources are independent and operate at different layers: one shows policy separation at an organizational approval surface, while the other shows evidence-version invalidation inside an agent runtime.

## Limits and Unknowns

- Neither source proves the real-world identity of the human or administrator who configured the authority, nor does either establish non-repudiation or legal accountability for the resulting action.
- GitHub documents the configuration hierarchy and merge effect but does not, in these sources, expose a general-purpose authorization-evidence version tuple for every policy transition.
- Codex proves bounded root-authorization versioning for Guardian review; it does not establish organization-wide approval policy, repository merge governance, or a named human-principal chain.
- A fresh authorization decision does not prove exactly-once execution of the downstream business effect. Effect identity, idempotency, receipts and compensation remain separate concerns.
- Compaction preservation demonstrates that required authorization evidence can survive one context-reduction mechanism; it does not prove that every context transformation in every agent runtime preserves authority correctly.
- Fork stripping demonstrates that parent-only Guardian approvals are removed in the tested retained-context path; it is not evidence that all delegated systems automatically revoke every inherited privilege.
- GitHub's dismissal on new commits is a reviewed-object freshness rule. It should not be generalized into the claim that every organization must use commit identity as its sole approval version.

## Unresolved Questions

1. What stable authority identity should bind a judgment, its approving principal, its policy scope and the exact reviewed object?
2. Which changes must increment that authority identity: policy edits, principal changes, new evidence, context compaction, fork, model replacement, or target mutation?
3. Should effective approvals carry a machine-verifiable receipt that separately records judgment, authority grant, scope and freshness version?
4. How should an organization distinguish “AI recommended approval,” “AI was authorized to approve,” and “this approval actually satisfied a governance gate” in its audit record?
5. When an authorization becomes stale while an action is already in flight, what cancellation or reconciliation evidence is required before the runtime can claim the old authority had no effect?

## Reading Conclusion

The selected evidence supports a bounded conclusion: an AI approval judgment is not itself authority. GitHub makes the distinction visible by separating assessment, approval capability, merge effect, scope and review freshness; Codex independently shows that a runtime allow must be bound to versioned authorization evidence and invalidated across evidence changes or authority-sensitive context transitions. Analysis may therefore treat **judgment**, **authorization evidence**, **scope**, **freshness**, and **effective sign-off** as separate state dimensions. The sources do not justify a broader claim about human-principal identity, legal accountability, exactly-once effects or a universal approval protocol.
