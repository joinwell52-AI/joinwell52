---
title: "Every Agent Passed Its Check. Why Can the System Still Be Unsafe?"
date: '2026-09-07'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当每个数字员工都通过自己的局部安全检查时，还需要什么证据才能说明不可信影响无法沿消息、共享状态、委派权限或恢复路径抵达受保护效果？"
summary: "A systematization covering 197 multi-agent security works makes a critical distinction explicit: local passes do not establish end-to-end safety. The security object is the complete authority-to-effect path, including observation coverage, intervention reach, trust assumptions, alternate routes, and recovery after propagation."
sources:
  - research/analysis/Q-20260907-01-authority-to-effect-path-closure.md
item_id: "Q-20260907-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-07-local-safety-does-not-close-path-editorial-v2.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-07-local-safety-does-not-close-path-editorial-v2.webp"
  kicker="Digital Employee · Daily Research"
  title="Every Agent Passed Its Check. Why Can the System Still Be Unsafe?"
  summary="A systematization covering 197 multi-agent security works makes a critical distinction explicit: local passes do not establish end-to-end safety. The security object is the complete authority-to-effect path, including observation coverage, intervention reach, trust assumptions, alternate routes, and recovery after propagation."
  version="Q-20260907-01"
  status="Daily Runtime V5 · 2026-09-07"
  languageHref="/zh/digital-employee/2026-09-07-local-safety-does-not-close-path"
  languageLabel="中文"
/>

# Every Agent Passed Its Check. Why Can the System Still Be Unsafe?

Imagine a multi-agent system in which every local check succeeds. The sender passes an input gate. An intermediary reads only authorized data. A tool call is permitted by policy. The final executor also remains within its declared scope. Step by step, everything looks valid.

Now change one detail: low-authority information enters shared memory, gets compressed into a summary that no longer carries its origin, and later influences a high-authority agent that invokes a privileged tool. Every local transition can still appear compliant while the final effect violates the purpose of the original authorization.

That is the core trap in multi-agent security: **treating individually safe workers as evidence that the overall system is safe.** A same-day research object based on a systematization of 197 multi-agent security works, plus a separate audit of 44 evaluation works, suggests a different security object. What matters is not only whether each node behaved locally, but whether the complete path from an influence origin to a protected effect is actually closed.

## Local compliance proves a local proposition

A worker-level check usually answers a narrow question: was this message allowed, was this file in scope, did this model output trigger a rule, was this tool target authorized? Those checks matter, but multi-agent effects are relational.

Influence may travel through an original message, shared state, a summary, an intermediate judgment, delegated authority, and finally a tool action. If provenance is lost, meaning changes at a handoff, or a low-authority input becomes wrapped in a high-authority agent's conclusion, the resulting action can be locally valid yet globally unsafe.

Local safety therefore answers, "Was this hop allowed under its local rule?" System safety must also answer, "Where did the influence originate, what transformed it, which principals carried it across authority boundaries, and why did it become eligible to produce this effect?"

These are different proof obligations.

## Five evidence gaps exposed by the systematization

The primary study organizes multi-agent security around cross-principal execution paths, six interaction interfaces, and eight recurring attack paths. It evaluates defenses through fields including path target, observation, intervention, trust boundary, and recovery.

The practical value of those fields is that they prevent one positive local test from silently standing in for the whole route:

| Evidence question | What it actually establishes | What a local PASS does not establish |
|---|---|---|
| Path target | Which system-level risk and route segment the control intends to break | That no alternate route exists |
| Observation | Which messages, principals, state, or traces the control can see | That unseen routes are absent |
| Intervention | What the control can block, rewrite, quarantine, revoke, or repair | That seeing a problem is enough to stop it |
| Trust boundary | Which identities, logs, topology, and membership assumptions must remain valid | That implicit trust is harmless |
| Recovery | How derivative state and authority are found, repaired, revoked, and re-verified | That containing the original source restores the system |

This is also why "we blocked the malicious sender" can be only the middle of an incident. Once influence has propagated, the system may still contain derived memories, artifacts, credentials, delegated rights, spawned principals, or external effects created under that influence.

## The security claim should bind an origin-to-effect lineage

A governed runtime can represent a minimal provenance-preserving chain:

`influence origin → admitted message or artifact → state and principal transformations → delegated authority → protected effect`

The point is not to preserve every hidden reasoning token. It is to preserve enough durable evidence to answer responsibility and authorization questions: who introduced the influence, which transformations changed or preserved its meaning, which intermediary carried it into a new authority domain, what delegated right made the final effect reachable, and which parts of the route the current controls could actually observe and interrupt.

This changes the meaning of a tool-permission check. The runtime should not ask only whether "Agent X may call Tool Y." It should also ask how the authority for this particular call became reachable. If a privileged call was shaped indirectly by a low-authority source through shared state, a compliant tool invocation does not automatically imply a compliant influence path.

This does not require one omniscient central monitor. Centralized visibility can itself create privacy, concentration, and control-plane risk. The governance requirement is explicit coverage and explicit blind spots, not a mandatory architecture.

## Alternate routes are the hard part

Blocking one known path does not prove that a protected effect is unreachable. If the same influence can travel through another set of principals, another shared-state channel, another tool permission, or a recovery replay, the path is not closed.

System-level safety therefore needs alternate-route awareness. When membership, topology, routing, or tool permissions change, does the old safety judgment still hold? Which routes are directly observed, and which are merely assumed not to exist? If one relationship is removed, does the modified system still preserve a meaningful security proposition that can be compared with the original?

The same-day analysis treats relation-removal counterfactuals as a bounded tool. Where the task remains meaningful, removing a relationship can expose a hidden assumption that "this was the only route." Such a test does not automatically prove causality, but it can reveal incomplete closure claims.

## Containment is not recovery

A crucial distinction in multi-agent incidents is often compressed into one status: containment and recovery are not the same state.

Containment asks whether influence can continue to spread. Recovery asks whether already affected memories, artifacts, credentials, delegated rights, principals, and effects have been identified, revoked or repaired, and re-verified as trustworthy. If the original sender is isolated but the system continues to consume a contaminated summary or delegated credential, the influence remains operational.

A mature incident model should therefore be able to say, "The source is contained, but derivative state has not yet been recovered." Preserving that uncertainty is more accurate than prematurely returning the system to a green state.

## Does more logging automatically mean more safety?

No. Full traceability has costs: privacy exposure, storage, centralized control risk, and the possibility that provenance records themselves can be forged or contaminated. The goal should be minimum sufficient evidence, not indiscriminate collection.

Likewise, a global observer is not automatically superior to local controls. A global view may cover more routes but depend on coarser data and stronger trust assumptions. Local controls may have richer context but miss alternate paths. What must remain durable is the declared observation boundary, intervention reach, trust dependency, and residual blind spot.

## The engineering consequence for digital employees

For long-lived digital employees, several facts should survive beyond the model context:

- provenance and authorization context across messages, summaries, shared state, and handoffs;
- intermediate principals and delegation relationships behind privileged effects;
- observation and intervention coverage for system-level controls;
- safety judgments that must be revalidated after membership, topology, routing, or permission changes;
- derivative artifacts, credentials, authority, and principals that remain unresolved after containment.

None of this produces a universal safety architecture. It moves the proof obligation to the correct layer: **do not ask only whether each agent passed its own check; ask whether the complete authority-to-effect path is observable and interruptible under stated trust assumptions, whether alternate routes have been assessed, and whether propagated state can actually be recovered.**

## Evidence boundary and open questions

The current evidence is a systematization and evaluation audit, not an end-to-end proof of any production runtime. A 197-work corpus provides broad coverage but cannot exhaust fast-changing deployment practice, and the five evidence dimensions are an analytical framework rather than a mechanically verified universal standard.

Open questions include how to preserve trustworthy provenance through context compression without over-collecting sensitive data; whether dynamic systems can test alternate-route closure online; which protected effects require prevention rather than compensating recovery; and how to obtain sufficient path evidence without building a high-risk omniscient control plane.

**Evidence and sources:**

- [Multi-Agent Systems Security Systematization](https://arxiv.org/html/2609.00595v1)
