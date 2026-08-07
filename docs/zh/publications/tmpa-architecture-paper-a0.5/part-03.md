当前作者运行的 S0.5 证据包标识为 `tmpa-i0.6-local-evidence-20260806-v2`，随 [Implementation Case I0.6](/zh/publications/implementation-case-i0.6) 发布。可直接审阅的元数据位于 [`research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2)。S0.4 语料库继续作为不可变历史基线保留；二者均须引用为作者生成证据，而不是独立验证。

# 数据可用性

本文不公开生产业务数据。NL2SQL Worked Material 是说明性治理重建，而不是生产数据逐字导出。一致性 Fixture 和选定实现证据包含在作者生成语料库中；未来公开发布必须保留脱敏、版本、来源与 Checksum 信息。

# 利益冲突与作者生成证据

论文作者同时是 TMPA、FCoP 与 CodeFlowMu 的发起者和主要开发者。这种关系带来自我评估与选择偏差风险。本文区分 specified、implemented、demonstrated 与 independently adopted 声明；当前基线由作者运行，不构成独立验证或生态采用。

# References

[1] Model Context Protocol. “Specification.” `https://modelcontextprotocol.io/specification/`. Accessed 2026-07-30.

[2] A2A Protocol Project, Linux Foundation. “Agent2Agent Protocol,” Version 1.0 documentation and specification, 2026. Accessed 2026-07-30.

[3] World Wide Web Consortium. “PROV-DM: The PROV Data Model” and “Constraints of the PROV Data Model.” W3C Recommendations, 2013. `https://www.w3.org/TR/prov-dm/`. Accessed 2026-07-30.

[4] Martin Fowler. “CQRS.” 2011. `https://martinfowler.com/bliki/CQRS.html`. Accessed 2026-07-30.

[5] Scott Chacon and Ben Straub. “Git Internals — Git Objects.” *Pro Git*, second edition. `https://git-scm.com/book/en/v2/Git-Internals-Git-Objects`. Accessed 2026-07-30.

[6] Linux Foundation. “Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md.” 9 December 2025. `https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation`. Accessed 2026-07-30.

[7] FCoP Project. “FCoP — File-based Coordination Protocol,” repository README and architecture stack. GitHub, 2026. `https://github.com/joinwell52-AI/FCoP`. Accessed 2026-07-30. A release tag or commit hash is required for the submission snapshot.

[8] FCoP Project. “FCoP Runtime Specification · Single-Page Complete Edition,” 1.2.x specification line, 2026. Repository artifact; submission snapshot to be pinned by release tag or commit hash.

[9] FCoP Project. “FCoP IPC Envelope” and related machine-readable JSON Schemas, `spec/schemas/`, 2026. Repository artifact; submission snapshot to be pinned by release tag or commit hash.

[10] Python Package Index. `fcop` and `fcop-mcp`, version 1.2.1 distributions, 2026. Accessed 2026-07-30.

[11] Official MCP Registry. `io.github.joinwell52-AI/fcop`, `fcop-mcp` server entry, 2026. Accessed 2026-07-30.

[12] FCoP Project. “fcop + fcop-mcp 1.2.1 Release Notes,” including `FCoPGovernanceMiddleware` and append-only governance events, 2026. Release artifact.

[13] CodeFlowMu. “TMPA Browser” public demonstration. `https://demo.chedian.cc/`. Snapshot observed 2026-07-29; build and dataset identity remain to be fixed for a reproducible submission artifact.

[14] FCoP Project. “ADR-0031: Governance Alert Layer (GAL).” Accepted 2026-05-11. Repository artifact; submission snapshot to be pinned.

[15] FCoP Project. “ADR-0032: `fcop_audit()` — Protocol-to-Inspection Compiler.” Accepted 2026-05-12. Repository artifact; submission snapshot to be pinned.

[16] FCoP Project. “FCoP Three-Layer Semantic Execution Chain Model.” Canonical project reference, 2026. Repository artifact; submission snapshot to be pinned.

[17] Yi Nian, Aojie Yuan, Haiyue Zhang, Jiate Li, and Yue Zhao. “Auditable Agents.” arXiv:2604.05485, 2026. `https://arxiv.org/abs/2604.05485`. Accessed 2026-07-30.

[18] Mirja Kühlewind and Henk Birkholz. “An Architecture for Auditing AI Agent Delegation and Interactions.” Internet-Draft `draft-kuehlewind-audit-architecture-00`, Work in Progress, 18 May 2026. `https://datatracker.ietf.org/doc/draft-kuehlewind-audit-architecture/00/`. Accessed 2026-07-30.

[19] Google Cloud. “Register Agents.” Agent Registry documentation, updated 27 July 2026. `https://docs.cloud.google.com/agent-registry/register-agents`. Accessed 2026-07-30.

[20] Krti Tallam. “Authorization Propagation in Multi-Agent AI Systems: Identity Governance as Infrastructure.” arXiv:2605.05440, 2026. `https://arxiv.org/abs/2605.05440`.

[21] Maurits Kaptein, Vassilis-Javed Khan, and Andriy Podstavnychy. “Runtime Governance for AI Agents: Policies on Paths.” arXiv:2603.16586, 2026. `https://arxiv.org/abs/2603.16586`.

[22] Mert Cemri et al. “Why Do Multi-Agent LLM Systems Fail?” arXiv:2503.13657, version 3, 2025. `https://arxiv.org/abs/2503.13657`.

[23] OECD. “Empowering SMEs in the Age of AI: The 2026 OECD D4SME Survey.” *OECD SME and Entrepreneurship Papers*, No. 78, OECD Publishing, Paris, 13 April 2026. DOI: `10.1787/bf5a9816-en`. `https://www.oecd.org/en/publications/empowering-smes-in-the-age-of-ai_bf5a9816-en.html`. Accessed 2026-07-30.

[24] Infocomm Media Development Authority, Singapore. “Singapore's Digital Economy at 18.6% of GDP, up from 14.9% in 2019; Growth Fuelled by Accelerating Digitalisation and AI Adoption across Sectors and Firms.” 6 October 2025. `https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2025/singapore-digital-economy`. Accessed 2026-07-30.

[25] SaigeAgent / XiaoDian AI Project. “多 AI 角色协同架构规划” [Multi-AI Role Collaboration Architecture Plan]. Phase 3 architecture planning document, version 1.2, first dated 21 March 2026 and updated 28 March 2026. Project archive. Section 7.0 introduces “Text-Message Multi-AI Parallel Architecture” and records the original one-task-one-carrier, textual-message, asynchronous-request, multi-role pipeline, and audit-trace design. A fixed public or archival snapshot is required before external submission.

[26] Christian Schroeder de Witt. “Open Challenges in Multi-Agent Security: Towards Secure Systems of Interacting AI Agents.” arXiv:2505.02077, 2025. `https://arxiv.org/abs/2505.02077`. Accessed 2026-07-30.

[27] Richard Kang and Yudho Diponegoro. “Governance Gaps in Agent Interoperability Protocols: What MCP, A2A, and ACP Cannot Express.” arXiv:2606.31498, 2026. `https://arxiv.org/abs/2606.31498`. Accessed 2026-07-30.

[28] TMPA Project. “I0.6 Local Engineering Evidence V2.” Package `tmpa-i0.6-local-evidence-20260806-v2`, captured 7 August 2026. `research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2/`; author-produced Reference Reader, FCoP, CodeFlowMu, and WP-13 results. Independent rerun remains required.

[29] Zexun Wang. “Proof-Carrying Agent Actions: Model-Agnostic Runtime Governance for Heterogeneous Agent Systems.” arXiv:2606.04104, 2026. `https://arxiv.org/abs/2606.04104`. Accessed 2026-07-31.

[30] Rafflesia Khan, Declan Joyce, and Mansura Habiba. “AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI.” arXiv:2512.03180, 2025. `https://arxiv.org/abs/2512.03180`. Accessed 2026-07-31.

[31] National Institute of Standards and Technology. “Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile.” NIST AI 600-1, July 2024; updated April 2026. `https://doi.org/10.6028/NIST.AI.600-1`.
