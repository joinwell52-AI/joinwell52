# Q-20260831-01 — Standing Permission Policy and Runtime Commitment Authority

- Runtime date: 2026-08-31 (Asia/Shanghai)
- Queue signal: SIG-20260831-010
- Primary source: https://arxiv.org/abs/2608.27443
- Evidence level: `peer_reviewed_or_primary_research`
- Scope: user-authored consequence policies, per-action human approval, reusable preferences, overreach prevention, runtime commitment authority

## Research Question

When an AI agent may take consequential actions, which decisions can safely be captured as reusable standing preferences, and which decisions still require a fresh runtime commitment by the user at the moment of action?

## Problem

A standing permission policy can reduce repeated prompts, but it also moves a decision from the concrete runtime occurrence into an earlier abstract policy-authoring moment. That shift can improve usability while weakening protection if users cannot reliably anticipate the context and consequences of future actions.

The selected research therefore tests a narrower question than whether human-in-the-loop approval is generally useful: whether reusable user-authored policies can substitute for per-action commitment without materially increasing agent overreach.

## Research Results

The paper reports a 113-participant experiment with three supervision designs: per-action HITL, an automatic condition, and a user-authored policy condition. Every participant supervised the same scripted 18-action workday containing seven researcher-designated overreach actions.

The policy interface asked users to configure rules for four consequence categories: spending money, sending or publishing information, deleting information, and accessing private information. Each category could be set to Allow, Ask, or Never. The experiment used a fixed researcher-checked mapping from the 18 actions to those categories, so the user-study comparison was not confounded by a live classifier producing different mappings for different participants.

Reported raw overreach blocking was 59.6% for HITL, 53.9% for the automatic condition, and 39.6% for the policy condition. Required-action completion remained high in all three conditions: 94.1%, 96.9%, and 95.3% respectively. Average prompt counts were 18.0, 10.0, and 10.9.

The adjusted comparison reported the policy condition blocking 20.1 percentage points less overreach than HITL, with a 95% confidence interval of -32.1 to -8.1 points, and 14.5 points less than the automatic condition, with a 95% confidence interval of -25.8 to -3.2. After the authors' multiple-comparison correction, the HITL-versus-policy difference remained the stronger reliable result; the automatic-versus-policy contrast should therefore not be overstated as equally established.

The policy-authoring choices are especially important for the research question. Participants authored 140 category rules: 114 were Ask, 10 Allow, and 16 Never. Thus 81.4% of authored rules preserved a runtime decision rather than settling future cases in advance. Thirty-one of 35 policy participants chose Ask for at least three of four categories, and 16 chose Ask for all four.

Among 245 overreach actions in the policy condition, 199 were routed to Ask. Of those, users approved 133 and denied 66. Fifteen overreach actions were automatically executed under Allow and 31 were blocked under Never. The paper therefore shows that most executed overreach in the policy condition followed an explicit human approval at runtime rather than an automatic standing grant.

## Mechanisms

1. **Consequence-category policy:** future actions inherit a reusable Allow / Ask / Never preference based on the consequence category assigned to the action.
2. **Runtime Ask path:** Ask preserves occurrence-specific user commitment even though the category-level preference was authored earlier.
3. **Standing Allow path:** Allow converts a reusable preference into automatic execution authority for matching future occurrences.
4. **Standing Never path:** Never converts the category rule into an automatic denial boundary.
5. **Fixed experimental mapper:** the main user study holds action-to-category mapping fixed, isolating the supervision-design comparison from classifier variance.
6. **Separate mapper evaluation:** the paper also evaluates a metadata-based consequence mapper, but that component is not the security boundary for the reported user-study comparison.

## Evidence

The primary evidence is arXiv:2608.27443, *Do User-Authored Permission Policies Improve Protection Against AI Agent Overreach?*, submitted 2026-08-27.

The paper includes the participant allocation, 18-action scripted task, seven overreach actions, four consequence categories, raw and adjusted supervision outcomes, policy-rule distribution, and occurrence-level routing results described above.

The authors additionally evaluate a tool-to-consequence mapper over 538 tools from 36 MCP servers with a 120-item human-labeled evaluation set. They report stronger main-action identification than exact consequence-set matching and identify ambiguity as a meaningful failure source. A low-confidence fallback to Ask reduces automatic passing but increases unnecessary prompts. This mapper evidence supports the need for conservative uncertainty handling, but it does not make the mapper an independent authorization boundary.

## Comparisons

Per-action HITL binds the approval to a concrete occurrence and its immediate context, at the cost of more prompts. A standing Allow policy minimizes runtime interruption but commits before the future action and context are fully known. Ask is structurally different from both: it is a reusable preference saying that future matching cases still require occurrence-specific commitment.

The observed participant choices are consistent with that distinction. Most users did not use policy authoring to settle future consequential actions once and for all; they used the policy layer to specify where a later decision should still be required.

## Contradictions and Negative Evidence

The policy interface reduced prompting relative to HITL, yet the policy condition blocked substantially less overreach than HITL. Prompt reduction therefore cannot be treated as evidence that standing policies preserve equivalent protection.

The very high frequency of Ask also contradicts a simple assumption that users mainly want reusable policies to eliminate future approvals. In this experiment, users often expressed a reusable preference for retaining the approval boundary.

The automatic condition and policy condition differed by more than policy authorship alone, so the study does not isolate every causal component of that contrast. The authors explicitly caution against reducing the three experimental conditions to a single factor.

## Limitations

The work used one scripted simulated day rather than real deployed consequences. Participants were recruited online in the United States, and the study does not establish how experts, enterprise operators, or teams with formal approval duties would behave.

The four consequence categories are deliberately coarse. Results do not establish that the same Allow / Ask / Never distribution would hold for a richer enterprise policy language or for domains such as regulated financial approval, infrastructure operations, or healthcare.

The experiment supports differences in overreach blocking under the tested designs, but high required-action completion in all conditions should not be interpreted as proof of statistical equivalence unless the corresponding equivalence test is supplied.

The separate mapper study is metadata-based and does not establish robustness against deceptive metadata, prompt injection, or adversarial tools. The authors do not claim that consequence classification itself is a security boundary.

The study does not prove a universal rule that every consequential action must always require fresh human approval. It establishes that reusable standing policy can materially change protection and that many users explicitly retain runtime Ask for consequential categories.

## Bounded Implication for Analysis

The evidence supports treating **standing preference** and **runtime commitment authority** as separate concepts. A durable user preference can determine whether a class of action is normally allowed, denied, or requires review, but an `Ask` preference is not itself the final authorization for a particular occurrence.

Analysis should therefore examine whether a governed digital-employee architecture needs distinct identities for policy author, policy version, matched consequence class, concrete action occurrence, and final runtime commitment. This Reading does not decide the final architecture or prescribe that every action must use HITL.

## Unresolved Questions

- How should a system determine which consequence classes are eligible for standing Allow versus mandatory occurrence-specific commitment?
- Should a standing Allow expire, require periodic reconfirmation, or be narrowed by amount, recipient, data sensitivity, destination, or other runtime attributes?
- What exact object should a runtime commitment bind to: proposed tool call, normalized effect, transaction digest, external target, or a richer consequence receipt?
- How should a later policy edit or revocation interact with already-prepared but not-yet-executed actions?
- Can the system safely learn user preferences from repeated Ask decisions without silently converting preference evidence into authority?
- How should uncertain consequence classification fail closed without recreating intolerable prompt fatigue?

## Reading Conclusion

The primary study provides direct evidence that reusable permission policies and runtime commitment are not interchangeable. Under the tested design, user-authored policies reduced prompts but blocked less overreach than per-action HITL, while 114 of 140 authored rules still selected Ask. The strongest bounded reading is that a standing policy may encode a reusable preference about how future actions should be handled, whereas a concrete consequential occurrence can still require its own commitment authority. That distinction should be preserved for later Analysis rather than collapsed into a single permission flag.
