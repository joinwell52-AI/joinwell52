---
schema: "research-analysis/v1"
id: "AN-20260831-02"
date: "2026-08-31"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260831-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260831-02-instruction-privilege-provenance-context-reconstruction.md"
output_contract: "Research Object"
research_object: "Reconstructed Role Is Not Authority Provenance"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Reconstructed Role Is Not Authority Provenance

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-31 Reading Result for Q-20260831-02. The evidence is the primary research reported in arXiv:2608.27299 across six coding-agent harnesses and 13 attack objectives. The conclusion concerns preservation of instruction origin and privilege across serialization, persistence, reconstruction, handoff and review. It does not claim that every Agent harness is vulnerable, and it does not treat any proposed cryptographic or taint-tracking design as experimentally proven by the source.

本对象只分析 Q-20260831-02 的 2026-08-31 当日已完成 Reading Result。证据来自 arXiv:2608.27299 报告的一手研究，覆盖 6 个 Coding-agent Harness 与 13 个攻击目标。结论讨论 Instruction Origin 与 Privilege 在序列化、持久化、重建、Handoff 与 Review 过程中的保持问题；不主张所有 Agent Harness 都存在同样漏洞，也不把加密 Provenance 或 Taint Tracking 等候选设计当作论文已经实验证明的方案。

```yaml
analysis:
  research_questions:
    - id: "RQ1"
      question: "Which authority facts must survive context transformation so a downstream Agent or permission reviewer can distinguish original user authority from low-privilege content that merely occupies a user- or system-effective slot after reconstruction?"
      question_zh: "Context Transformation 必须保留哪些权威事实，才能让下游 Agent 或 Permission Reviewer 区分真实用户权威与仅在重建后占据 User/System-effective Slot 的低权限内容？"
  research_themes: ["authorization provenance", "context reconstruction", "privilege escalation", "permission review", "confused deputy", "agent harness governance"]
  subject_kind: ["governance-problem", "failure-mode", "architecture-mechanism"]
  samples: ["six coding-agent harnesses evaluated in arXiv:2608.27299"]

  research_value:
    failures:
      - "A reconstruction layer can preserve instruction text while silently upgrading its effective privilege."
      - "A downstream reviewer can correctly identify semantic danger yet still approve an action when the harness has already corrupted the authority premise."
      - "Authorization based only on the current message role allows persistence, summarization or handoff to become an unintended privilege-transition mechanism."
    findings:
      - "The study reports all 13 attack objectives succeeding across all six tested harnesses in the unrestricted tool-to-user escalation setting."
      - "For Claude Code, Codex and Qwen Code under automatic permission review, the study reports all 13 objectives succeeding when low-privilege attacker content is reconstructed as user-level instruction."
      - "In the reported automatic-review comparison, conventional prompt-injection or role-confusion attempts without the context privilege transformation achieved 0/13, separating the escalation mechanism from a reviewer that simply approves every risky request."
      - "Goal, scheduled-task and skill-like persistence paths expand the provenance problem beyond immediate conversational history."
    mechanisms:
      - "Low-privilege content enters through a tool or data boundary."
      - "Persistence or context transformation stores the content in goals, tasks, skills or history."
      - "Reconstruction emits the content into a stronger conversational or system-effective position without preserving enforceable original privilege."
      - "The downstream Agent or reviewer trusts the reconstructed role and exercises legitimate authority on behalf of the wrong principal."
    implications:
      - "Instruction role after reconstruction should be treated as presentation/context position, not proof of original authority."
      - "Authorization-sensitive context needs independently inspectable provenance and privilege metadata that survives transformations."
      - "Any intentional privilege upgrade should be an explicit governed transition rather than an incidental side effect of serialization or prompt assembly."

  evidence_claims:
    - id: "E1"
      identity: "source-reported-claim"
      claim: "The primary study reports successful tool-to-user privilege escalation for all 13 tested attack objectives across six harnesses in the full-access setting."
      claim_zh: "一手研究报告：在 Full-access Setting 中，6 个 Harness 的 13 个 Tool-to-user Privilege-escalation 攻击目标全部成功。"
      source: "research/reading/Q-20260831-02-instruction-privilege-provenance-context-reconstruction.md"
      strength: "primary research result; bounded to tested harnesses and settings"
      independent: false
    - id: "E2"
      identity: "source-reported-claim"
      claim: "Under automatic permission review for three tested harnesses, the context-privilege transformation succeeds where the reported conventional baseline is 0/13."
      claim_zh: "在 3 个带 Automatic Permission Review 的测试 Harness 中，Context-privilege Transformation 成功，而报告中的传统基线为 0/13。"
      source: "research/reading/Q-20260831-02-instruction-privilege-provenance-context-reconstruction.md"
      strength: "comparative primary research result"
      independent: false
    - id: "E3"
      identity: "source-reported-claim"
      claim: "The study includes persistence and reconstruction paths through goals, scheduled tasks and skill-like mechanisms."
      claim_zh: "研究覆盖通过 Goal、Scheduled Task 与 Skill-like Mechanism 进行持久化和重建的路径。"
      source: "research/reading/Q-20260831-02-instruction-privilege-provenance-context-reconstruction.md"
      strength: "reported mechanism coverage"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "Context reconstruction is an authority-bearing transformation whenever it can alter the privilege assigned to instruction content."
      claim_zh: "只要 Context Reconstruction 能改变 Instruction Content 被赋予的 Privilege，它就属于携带权威含义的 Transformation。"
      source: "E1,E2,E3"
      strength: "bounded architecture interpretation"
      independent: false
    - id: "I2"
      identity: "our-interpretation"
      claim: "A high-impact authorization gate should consume original-principal provenance and any explicit privilege-transition evidence, not rely solely on the role label present in the reconstructed prompt."
      claim_zh: "高影响 Authorization Gate 应消费 Original-principal Provenance 与显式 Privilege-transition Evidence，而不能只依赖重建 Prompt 中当前的 Role Label。"
      source: "E1,E2"
      strength: "governance implication; representation remains open"
      independent: false

  observations:
    - "The reviewer failure is downstream of provenance loss: adding another reviewer does not repair an authority premise already corrupted by the reconstruction layer."
    - "The same text can carry different authorization meaning depending on who supplied it and how any privilege upgrade was authorized."
    - "Persistence mechanisms are control-plane boundaries when they can change how authority is reconstructed later."
  observations_zh:
    - "Reviewer Failure 发生在 Provenance 丢失之后：如果 Reconstruction Layer 已经污染 Authority Premise，再增加一个 Reviewer 也无法自动修复。"
    - "同一段文本会因原始提供者和 Privilege Upgrade 是否得到授权而具有不同的 Authorization Meaning。"
    - "只要持久化机制会改变后续权威重建方式，它就属于 Control-plane Boundary。"

  comparisons:
    - "Role-only authorization asks what role the content has now; provenance-aware authorization asks which principal originated it, through which boundary, under what privilege, and whether a trusted transition explicitly upgraded that privilege."
    - "Content-risk review and authority validation answer different questions: an operation can be recognized as dangerous while still being incorrectly attributed to an authorized user."
  comparisons_zh:
    - "Role-only Authorization 询问内容现在是什么 Role；Provenance-aware Authorization 还要询问原始 Principal、进入边界、原始 Privilege，以及是否存在可信显式升级。"
    - "Content-risk Review 与 Authority Validation 回答不同问题：系统可以识别某操作危险，却仍错误地把它归因于已授权用户。"

  contradictions:
    - "The reported 0/13 conventional baseline under automatic review contradicts the idea that the reviewer is simply ineffective against every risky instruction."
    - "A second LLM reviewer cannot be treated as an independent authorization boundary if it consumes the same privilege-corrupted reconstructed context as the working Agent."
  contradictions_zh:
    - "Automatic Review 下报告的传统基线 0/13，与‘Reviewer 对任何危险指令都无效’的说法相矛盾。"
    - "如果第二个 LLM Reviewer 与工作 Agent 消费同一份 Privilege-corrupted Context，就不能把它当作独立 Authorization Boundary。"

  counterarguments:
    - "Role labels remain useful for prompt composition and conversational semantics; the problem is treating them as sufficient authorization evidence after lossy transformation."
    - "A trusted user may deliberately quote, adopt or elevate lower-privilege content, so a provenance-aware design still needs an explicit endorsement path rather than permanently tainting all derived text."
  counterarguments_zh:
    - "Role Label 对 Prompt Composition 与对话语义仍有价值；问题在于经过有损 Transformation 后把它当作充分 Authorization Evidence。"
    - "可信用户可能有意引用、采纳或提升低权限内容，因此 Provenance-aware 设计仍需显式 Endorsement Path，而不是永久污染所有派生文本。"

  research_judgment: "Reconstructed message role is not sufficient authority provenance. The reported failures show that a harness can preserve the semantic content of an instruction while upgrading its effective privilege, causing both an Agent and an automatic permission reviewer to act on a false principal assumption. Governed Agent architectures should therefore make original principal, origin channel, privilege class and any trusted privilege transition independently inspectable across persistence, summarization, handoff and reconstruction. Unknown or lost provenance should remain an explicit authority defect for high-impact actions rather than being repaired by assigning a stronger role during prompt assembly. The exact representation—signed envelope, capability record, typed provenance graph or another mechanism—remains an implementation question, not a result established by the paper."
  research_judgment_zh: "重建后的 Message Role 不是充分的 Authority Provenance。报告中的失败说明，Harness 可以在保留 Instruction 语义内容的同时提升其有效 Privilege，使 Agent 与 Automatic Permission Reviewer 都基于错误的 Principal 假设行动。因此，受治理 Agent 架构应让 Original Principal、Origin Channel、Privilege Class 与任何可信 Privilege Transition 在持久化、摘要、Handoff 和 Reconstruction 全程保持可独立检查。对于高影响动作，未知或丢失的 Provenance 应保持为显式 Authority Defect，而不能在 Prompt Assembly 时通过赋予更高 Role 来“修复”。至于具体采用 Signed Envelope、Capability Record、Typed Provenance Graph 或其他表示，仍是实现问题，不是该论文已经证明的结果。"

  general_implications:
    - "Store authority provenance as side metadata with semantics independent of reconstructed prompt role."
    - "Require an explicit, auditable transition when trusted authority intentionally adopts or elevates lower-privilege content."
    - "Treat summarization, compaction, persistence, scheduled rehydration and cross-agent handoff as provenance-preservation boundaries."
    - "Fail closed or require renewed authority evidence when provenance needed for a high-impact decision becomes unknown."
  general_implications_zh:
    - "Authority Provenance 应作为独立 Side Metadata 持久化，其语义不能依赖重建后的 Prompt Role。"
    - "可信 Authority 有意采纳或提升低权限内容时，应产生显式、可审计的 Transition。"
    - "Summary、Compaction、Persistence、Scheduled Rehydration 与 Cross-agent Handoff 都应被视为 Provenance-preservation Boundary。"
    - "高影响决定所需 Provenance 变为未知时，应 Fail Closed 或要求重新取得 Authority Evidence。"

  limitations:
    - "The evidence covers six coding-agent harnesses and specific context-construction mechanisms, not all Agent systems."
    - "The study does not prove a universal mitigation or an optimal provenance representation."
    - "Attack success in the experiment does not establish production base rates or organization-specific blast radius."
    - "Other origins such as compromised connectors, model-generated memory or cross-tenant artifacts require separate evidence."
  limitations_zh:
    - "证据覆盖 6 个 Coding-agent Harness 与特定 Context-construction Mechanism，并非所有 Agent System。"
    - "研究没有证明一种普遍适用的缓解方案或最优 Provenance 表示。"
    - "实验中的攻击成功不等于真实生产 Base Rate 或组织特定 Blast Radius。"
    - "Compromised Connector、Model-generated Memory、Cross-tenant Artifact 等其他来源需要独立研究。"

  open_questions:
    - "What minimum provenance tuple must survive context transformation?"
    - "Which components may explicitly elevate privilege and what durable evidence must that transition create?"
    - "How should provenance compose when multiple instructions are merged, summarized or synthesized?"
    - "How should legacy untyped context be handled without silently granting stronger authority during migration?"
  open_questions_zh:
    - "Context Transformation 至少必须保留什么 Provenance Tuple？"
    - "哪些组件可以显式提升 Privilege，这种 Transition 必须生成什么持久证据？"
    - "多条 Instruction 被合并、摘要或综合时，Provenance 应如何组合？"
    - "Legacy Untyped Context 应如何迁移，才能避免静默赋予更高 Authority？"

  article_type: "technical-analysis"
  selected_modules: ["research-question", "evidence", "technical-analysis", "architecture-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is a general Agent-harness authority-provenance problem and does not depend on a first-party project."
    rationale_zh: "结论属于通用 Agent Harness Authority-provenance 问题，不依赖自有项目。"
```

## Bounded judgment / 有界判断

An instruction's current message role can describe where it appears, but not who originally possessed authority to issue it. Once reconstruction loses that distinction, downstream risk review may operate correctly over the wrong principal. Authority provenance therefore has to survive context transformation independently of prompt-role reconstruction.

Instruction 当前的 Message Role 可以说明它出现在哪里，却不能证明最初是谁拥有发布它的权威。一旦 Reconstruction 丢失这一区分，下游 Risk Review 即使逻辑正确，也可能是在错误 Principal 前提上工作。因此，Authority Provenance 必须独立于 Prompt-role Reconstruction 跨 Context Transformation 保留下来。