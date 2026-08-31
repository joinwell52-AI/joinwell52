# Q-20260831-02 — Instruction-Privilege Provenance Across Context Reconstruction

- Runtime date: 2026-08-31 (Asia/Shanghai)
- Queue signal: SIG-20260831-009
- Primary source: https://arxiv.org/abs/2608.27299
- Evidence level: `peer_reviewed_or_primary_research`
- Scope: coding-agent harnesses, context reconstruction, instruction roles, provenance, privilege escalation, automatic permission review

## Research Question

When an Agent harness serializes, persists, reconstructs, hands off, or reviews context, which provenance and privilege facts must remain authoritative so attacker-controlled low-privilege content cannot later be mistaken for user or system authority?

## Problem

Agent systems routinely move information between tool outputs, persisted goals, scheduled tasks, skill files, conversation history, and reviewer prompts. If the reconstruction layer preserves only message text and assigns a stronger conversational role during rehydration, the system can transform low-privilege attacker content into an instruction that downstream components treat as user-authorized.

The selected research is therefore not a generic prompt-injection question. It isolates a control-plane failure: **privilege escalation caused by context transformation that loses original principal/provenance information**.

## Research Results

The paper evaluates six coding-agent harnesses against 13 attack objectives spanning confidentiality, integrity, availability, and remote-code-execution-style effects. In the tested full-access tool-to-user escalation setting, all 13 attack objectives succeeded across all six harnesses.

Three evaluated harnesses support an automatic permission-review configuration: Claude Code, Codex, and Qwen Code. Under that review mode, the paper reports all 13 attack objectives succeeding in each of those three harnesses when low-privilege attacker-controlled content is reconstructed as user-level instruction.

The comparison baseline is important. Under the same automatic-review setting, conventional prompt-injection / role-confusion attempts without the context privilege transformation achieved 0/13 success for those three harnesses in the reported experiment, while the privilege-escalation path succeeded. This separates the observed failure from a claim that the reviewer simply approves every risky request.

The paper reports that the automatic reviewer can recognize a command as dangerous yet still approve it because the reconstructed context makes the command appear to have been requested by the user. The reviewer therefore evaluates risk under a corrupted authority model: the semantic danger may be visible while the origin of the instruction has already been upgraded.

Across the broader tool-to-user evaluation, post-escalation attack success is reported at a high mean level, with per-harness reliability varying. Tool-to-system-effective escalation is also demonstrated, but with lower per-attempt reliability than the tool-to-user path. These results support the existence of the mechanism in the tested harnesses without establishing that every system or every context path is equally vulnerable.

## Threat Model and Mechanisms

The attacker begins with content at a lower privilege level, such as attacker-controlled repository material exposed through a tool or data channel. The attacker does not need to begin with direct user- or system-level instruction authority.

The demonstrated mechanism has four steps:

1. **Low-privilege origin:** attacker-controlled content enters through a tool/data boundary.
2. **Context persistence or transformation:** the harness records that content in a goal, task, skill, history, or other durable/reconstructed representation.
3. **Role elevation on reconstruction:** the same content is later emitted into a user-level or system-effective instruction position without preserving an enforceable record of its lower-privilege origin.
4. **Downstream trust:** an Agent or permission reviewer reasons over the reconstructed role and therefore attributes stronger authority to the content than the original principal possessed.

The paper uses a unified privilege framing in which tool-origin content is below user authority, which is below system-effective authority. The central failure is not merely that text moved; it is that the harness changed the effective privilege associated with that text.

## Persistence, Goals, Tasks, and Skills

The evaluation includes paths where attacker-controlled content is persisted into goals or scheduled tasks and later reintroduced. The paper tests goal/scheduled-task paths across multiple harnesses and attack objectives rather than limiting the finding to a single immediate tool-response prompt.

The authors also discuss skill-like mechanisms where instruction bodies or metadata can be injected into stronger context positions. This broadens the provenance problem from conversational history to reusable capability/configuration artifacts.

Automatic-review behavior differs by harness and execution path. Some review contexts omit a reconstructed task or remove a goal before review, so the exact attack path and reviewer visibility are system-specific. That variation is evidence against treating one prompt layout as a universal model of the vulnerability.

## Evidence

Primary evidence is arXiv:2608.27299, *When Context Gets Root: Privilege Escalation in LLM Harnesses*, submitted 2026-08-27.

The paper provides the six-harness evaluation, 13 attack objectives, automatic-review subset, task/goal persistence paths, instruction-role transformations, and per-path attack measurements. The experimental design deliberately starts attacks from lower-privilege tool/repository-controlled content to distinguish instruction-privilege escalation from an attacker who already possesses user-level authority.

The reported plain-text attack payloads are not presented as sophisticated obfuscation. That design choice helps isolate the context-privilege transformation itself, although it also means the study does not map the full space of adaptive attacks or defenses.

## Comparisons

A message-role-only authorization model asks, in effect, “Is this content currently in a user message?” A provenance-aware model asks, “Which principal originally supplied this instruction, through which boundary, under what privilege, and has any trusted authority explicitly upgraded it?”

The paper's automatic-review result shows why those questions differ. A reviewer can correctly identify a dangerous operation and still approve it if the harness has already relabeled attacker content as user intent. Risk classification cannot repair lost authority provenance after the fact.

This resembles a confused-deputy boundary more than a conventional content-filter failure: the downstream reviewer is asked to exercise legitimate authority on behalf of a principal whose identity has been misrepresented by the reconstruction layer.

## Contradictions and Negative Evidence

The automatic permission reviewer is not simply useless: the 0/13 baseline result for conventional attacks in the reported subset shows that review can reject risky requests when authority context remains distinguishable. The failure appears after the harness transforms provenance.

The study therefore contradicts a common assumption that adding a second LLM reviewer is sufficient to secure high-impact actions. If both working Agent and reviewer consume the same privilege-corrupted reconstructed context, they can agree on a false authority premise.

At the same time, the experiments do not prove that every serialized context transformation causes escalation. Some harness paths omit or remove the relevant reconstructed object before review, changing the attack surface.

## Limitations

The evidence covers six coding-agent harnesses and the specific tested context mechanisms. It does not establish a universal vulnerability across every Agent SDK, hosted platform, enterprise policy engine, or human approval workflow.

The paper demonstrates empirical privilege loss and exploitation, but this Reading should not invent an implementation-level mitigation that the source does not specify. In particular, cryptographic provenance, signed context envelopes, capability tokens, and taint systems are possible architectural responses, not results proven by this paper.

The evaluation begins with attacker-controlled repository/tool content. Other origins such as compromised connectors, malicious users with partial rights, model-generated persistent memory, or cross-tenant artifacts require separate study.

Attack success measures demonstrate exploitable outcomes under the experiment's access modes; they do not quantify real-world base rates, organization-specific blast radius, or the probability that an arbitrary production deployment will expose the same path.

## Bounded Implication for Analysis

The evidence supports preserving origin and privilege as **side metadata with authority semantics**, rather than inferring authority solely from the message role used after reconstruction. Serialization, persistence, handoff, scheduled execution, skill loading, and permission review are all candidate boundaries where that metadata can be lost.

Analysis should examine whether a governed Runtime needs a non-forgeable chain connecting instruction text to original principal, origin channel, privilege class, transformation history, and any explicit trusted privilege transition. A later reviewer should be able to distinguish “the user said this” from “attacker-controlled content is currently displayed in a user-role slot.”

This Reading does not decide the exact representation or cryptographic mechanism.

## Unresolved Questions

- What minimum provenance tuple must survive context serialization and reconstruction: principal, source object, channel, privilege, generation, signature, or all of these?
- Which components are allowed to perform an explicit privilege upgrade, and what durable evidence must that transition create?
- How should provenance compose when multiple instructions are merged, summarized, compacted, or synthesized by another Agent?
- Can a permission reviewer reliably evaluate an action when some contributing context has unknown or partially lost provenance, or must that condition fail closed?
- How should long-lived goals and scheduled tasks bind to the authority that created them when the originating session no longer exists?
- What happens when a trusted user quotes or deliberately adopts low-privilege content: how is intentional endorsement distinguished from automatic role relabeling?
- How can legacy harness history be migrated without silently assigning stronger privilege to old untyped context records?

## Reading Conclusion

The paper provides direct evidence that context reconstruction can become an authorization vulnerability when it upgrades low-privilege attacker content into user- or system-effective instruction without preserving its original authority provenance. Across the tested coding harnesses, this transformation defeats automatic permission review in cases where ordinary prompt-injection baselines are rejected. The bounded architectural lesson for later Analysis is that message role after reconstruction is not sufficient proof of instruction authority; origin and privilege must remain independently inspectable across persistence, handoff, and review boundaries.
