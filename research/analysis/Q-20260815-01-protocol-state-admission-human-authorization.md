---
schema: "research-analysis/v1"
id: "AN-20260815-01"
date: "2026-08-15"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260815-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260815-01-trusted-session-initialization-hitl-confirmation-boundary.md"
output_contract: "Research Object"
research_object: "Protocol-State Admission and Human Authorization Are Separate Trust Boundaries"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Protocol-State Admission and Human Authorization Are Separate Trust Boundaries

## Governed scope / 受治理范围

This object analyzes only the completed 2026-08-15 Reading Result for Q-20260815-01. Merged maintainer code and regression tests are treated as bounded implementation facts. Broader digital-employee conclusions are explicitly marked as interpretation and do not claim authenticated users, trusted imported history, or general HITL safety.

本对象仅分析 Q-20260815-01 的 2026-08-15 已完成 Reading Result。维护者已合并代码与回归测试只作为有界实现事实使用。更广泛的数字员工判断明确标记为分析解释，不据此声称用户身份已认证、导入历史已可信，或 HITL 已普遍安全。

```yaml
analysis:
  research_question: "What trust boundaries must a resumable digital employee enforce when it imports prior history and later accepts a human confirmation for a tool action?"
  research_question_zh: "可恢复数字员工在导入历史记录、并在之后接收人工工具确认时，必须分别建立哪些信任边界？"

  evidence_claims:
    - id: "E1"
      identity: "public-fact"
      claim: "The selected ADK change validates client-supplied initialization events before session creation and rejects framework-owned runtime markers, non-default runtime actions and reserved HITL protocol function calls while still admitting ordinary text and ordinary tool history."
      claim_zh: "所选 ADK 变更会在创建 Session 之前校验客户端提供的初始化事件，并拒绝框架自有的 Runtime Marker、非默认 Runtime Action 与保留 HITL Protocol Function Call，同时仍允许普通文本与普通工具历史。"
      source: "research/reading/Q-20260815-01-trusted-session-initialization-hitl-confirmation-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E2"
      identity: "public-fact"
      claim: "Confirmation resolution requires the ADK-owned confirmation function name and binds the confirmation to an existing historical original tool call with matching occurrence identity, agent ownership, registered tool, confirmation requirement, name and arguments."
      claim_zh: "Confirmation Resolution 要求使用 ADK 自有的确认函数名，并把确认绑定到历史中真实存在的原始 Tool Call；Occurrence Identity、Agent Ownership、已注册 Tool、Confirmation Requirement、Name 与 Arguments 均需匹配。"
      source: "research/reading/Q-20260815-01-trusted-session-initialization-hitl-confirmation-boundary.md"
      strength: "direct merged-code and regression-test evidence"
      independent: false
    - id: "E3"
      identity: "public-fact"
      claim: "The same source explicitly leaves ordinary imported tool history admissible and does not authenticate the confirmer, establish authorization level, cryptographically prove event provenance, or provide replay-proof/exactly-once resumption."
      claim_zh: "同一来源明确仍允许普通导入 Tool History，并未认证确认者身份、建立其授权级别、以密码学方式证明事件来源，也未提供 Replay-proof 或 Exactly-once Resumption。"
      source: "research/reading/Q-20260815-01-trusted-session-initialization-hitl-confirmation-boundary.md"
      strength: "direct source limitation"
      independent: false
    - id: "I1"
      identity: "our-interpretation"
      claim: "A resumable digital employee should separate at least three gates: history/provenance admission, framework-owned protocol-state admission, and human authorization for a specific action occurrence."
      claim_zh: "可恢复数字员工至少应分离三道门禁：历史/来源准入、框架自有 Protocol State 准入，以及针对具体 Action Occurrence 的人工授权。"
      source: "E1,E2,E3"
      strength: "bounded architectural interpretation"
      independent: false

  observations:
    - "The selected implementation does not treat all historical data as equally dangerous. It preserves ordinary conversation/tool history while preventing imported data from manufacturing framework-owned execution protocol state."
    - "Occurrence binding and authorization answer different questions: the former asks whether the confirmation refers to the right historical action; the latter asks whether the person or authority was entitled to approve it."
    - "Validation-before-persistence narrows the failure surface because rejected protocol state does not first enter a newly created session and get repaired later."
  observations_zh:
    - "所选实现并未把所有历史数据视为同等危险；它保留普通 Conversation/Tool History，同时阻止导入数据伪造框架自有的执行协议状态。"
    - "Occurrence Binding 与 Authorization 回答的是不同问题：前者确认‘这次确认是否对应正确的历史动作’，后者确认‘这个人或权威是否有资格批准该动作’。"
    - "Persistence 之前完成校验会缩小失败面，因为被拒绝的协议状态不会先进入新 Session，再依赖事后修复。"

  comparisons:
    - "Rejecting all imported history would simplify trust reasoning but would also destroy legitimate resumability; selective admission retains useful history while reserving framework-owned state to the runtime."
    - "Matching only a confirmation payload shape or request ID is weaker than binding to the original historical occurrence, because structurally similar calls can otherwise borrow confirmation semantics."
    - "Occurrence binding without confirmer identity can prevent one class of substitution but cannot establish business authorization; identity/role policy remains a separate control plane."
  comparisons_zh:
    - "拒绝所有导入历史会简化信任推理，但也会破坏合法恢复能力；选择性 Admission 可以保留有用历史，同时把框架自有状态保留给 Runtime。"
    - "只匹配 Confirmation Payload 形状或 Request ID，比绑定原始历史 Occurrence 更弱，因为结构相似的 Call 可能借用确认语义。"
    - "只有 Occurrence Binding 而没有确认者身份，可以阻止一类替换攻击，却不能证明业务授权；Identity/Role Policy 仍是独立控制面。"

  counterarguments:
    - "In a single-user trusted-network assistant, external identity and authorization may be intentionally delegated to a surrounding application, so the runtime itself need not solve the entire security stack."
    - "Stronger provenance for every imported ordinary tool event may impose migration and compatibility costs that outweigh the risk for low-impact workloads."
    - "Exact argument matching can be sufficient for a narrow tool-confirmation protocol even when broader cryptographic provenance is absent, provided the surrounding trust boundary is explicit."
  counterarguments_zh:
    - "在单用户、可信网络的 Assistant 中，外部 Identity 与 Authorization 可以有意交给外围应用，因此 Runtime 本身不必解决完整安全栈。"
    - "为每个导入的普通 Tool Event 建立更强 Provenance，可能带来迁移与兼容成本；对低影响业务而言未必划算。"
    - "即使缺少更广泛的密码学 Provenance，只要外围 Trust Boundary 明确，精确 Argument Matching 对狭义工具确认协议也可能已经足够。"

  research_judgment: "Resumability should not collapse historical data, runtime authority and human approval into one trust decision. The stronger architecture is to admit imported history as data under an explicit provenance level, reserve framework-owned protocol state to the runtime, and bind each approval to both the exact action occurrence and an independently authorized confirmer. The selected ADK mechanism demonstrates the first two boundaries and strong occurrence binding, but it does not establish confirmer authorization or trusted ordinary history."
  research_judgment_zh: "可恢复性不应把历史数据、Runtime Authority 与人工批准压缩成一次信任决定。更强的架构应当：以明确 Provenance Level 把导入历史作为数据准入；把框架自有 Protocol State 保留给 Runtime；并把每次 Approval 同时绑定到精确 Action Occurrence 与独立授权的 Confirmer。所选 ADK 机制已经展示前两类边界和较强的 Occurrence Binding，但没有建立 Confirmer Authorization，也没有证明普通导入历史可信。"

  general_implications:
    - "Persisted or imported history should carry an explicit evidence/provenance class rather than being promoted automatically into authoritative runtime state."
    - "Runtime-owned control markers, pause/resume protocol calls and approval state should have a narrower mutation surface than ordinary conversational history."
    - "Human approval records should bind action identity and approver authority separately; structural validity is not sufficient evidence of authorization."
    - "Recovery logic should validate before creating or mutating durable execution state whenever untrusted history can influence control flow."
    - "Audit records should distinguish 'historical event accepted', 'runtime protocol state admitted', and 'authorized approval accepted' as separate facts."
  general_implications_zh:
    - "持久化或导入 History 应携带明确 Evidence/Provenance Class，而不能自动升级成权威 Runtime State。"
    - "Runtime 自有 Control Marker、Pause/Resume Protocol Call 与 Approval State 的可修改面，应比普通对话历史更窄。"
    - "人工 Approval Record 应分别绑定 Action Identity 与 Approver Authority；结构有效并不足以证明授权有效。"
    - "当不可信历史可能影响 Control Flow 时，Recovery Logic 应尽量在创建或修改 Durable Execution State 之前完成校验。"
    - "审计记录应把‘历史事件已接纳’、‘Runtime Protocol State 已准入’与‘已授权 Approval 已接纳’区分为三个事实。"

  limitations:
    - "The evidence is one merged ADK implementation and its tests, not an independent security evaluation of resumable digital employees."
    - "The selected change does not validate every possible initial state field and deliberately admits ordinary tool history."
    - "No evidence here establishes user authentication, role authorization, cryptographic provenance, replay resistance, distributed recovery or exactly-once external effects."
  limitations_zh:
    - "证据来自一个已合并的 ADK 实现及其测试，并不是对可恢复数字员工的独立安全评估。"
    - "所选变更没有校验所有可能的 Initial State 字段，并且有意允许普通 Tool History。"
    - "这里没有证据建立 User Authentication、Role Authorization、Cryptographic Provenance、Replay Resistance、Distributed Recovery 或 Exactly-once External Effect。"

  open_questions:
    - "What provenance level should be attached to imported ordinary tool history so later policy can distinguish replayed client data from runtime-generated evidence?"
    - "What identity/role evidence must accompany a human confirmation before a high-risk tool action is re-admitted?"
    - "How should approval occurrence identity survive durable restart without allowing confirmation replay?"
  open_questions_zh:
    - "导入的普通 Tool History 应附带什么 Provenance Level，才能让后续 Policy 区分客户端重放数据与 Runtime 生成证据？"
    - "高风险 Tool Action 重新准入前，Human Confirmation 必须携带哪些 Identity/Role Evidence？"
    - "Approval Occurrence Identity 应如何跨 Durable Restart 存续，同时避免 Confirmation Replay？"

  article_type: "engineering-insight"
  selected_modules: ["research-question", "evidence-identity", "trust-boundary-analysis", "engineering-implications", "limitations", "open-questions"]
  project_relevance:
    status: "none"
    projects: []
    rationale: "The conclusion is general to resumable agent and digital-employee runtimes; no first-party project is needed to establish the trust-boundary judgment."
    rationale_zh: "该结论适用于可恢复 Agent 与数字员工 Runtime；建立这一信任边界判断不需要引入任何自有项目。"
```

## Bounded judgment / 有界判断

A structurally valid recovery history is not automatically authoritative runtime state, and a structurally valid confirmation is not automatically an authorized approval. The durable design boundary is **history admission → protocol-state admission → occurrence binding → approver authorization**. The selected source establishes the middle mechanisms strongly enough to motivate this separation, while leaving identity, provenance and distributed replay control outside its evidence boundary.

结构有效的恢复历史并不会自动成为权威 Runtime State；结构有效的确认也不会自动成为已授权 Approval。更稳健的持久边界是 **历史准入 → 协议状态准入 → Occurrence Binding → Approver Authorization**。所选来源足以证明其中间机制值得这样分层，但 Identity、Provenance 与分布式 Replay Control 仍明确位于证据边界之外。
