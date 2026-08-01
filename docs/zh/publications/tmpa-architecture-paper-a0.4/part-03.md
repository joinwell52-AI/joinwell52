首个作者执行的一致性语料库标识为 `tmpa-draft-v1-c01-c14-20260731`，当前保存在 `tmpa-conformance.zip` 中。它包含 Manifest、标准 Fixture、预期与实际输出、机器可读裁决、Runner、执行日志和 325 文件 SHA-256 证据清单。稳定公开归档、Release Checksum 和独立重跑仍未完成；因此，当前 Package 必须被引用为作者生成证据，而不是独立验证。

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

[28] TMPA Project. “TMPA Draft V1.0 C01–C14 Conformance Corpus.” Corpus ID `tmpa-draft-v1-c01-c14-20260731`, executed 31 July 2026. Author-produced archive `tmpa-conformance.zip`; contains manifest, 325-file SHA-256 evidence inventory, criterion fixtures and expected/actual outputs, machine-readable verdicts, runners, and execution logs. A stable public archive and independent rerun remain required.

[29] Zexun Wang. “Proof-Carrying Agent Actions: Model-Agnostic Runtime Governance for Heterogeneous Agent Systems.” arXiv:2606.04104, 2026. `https://arxiv.org/abs/2606.04104`. Accessed 2026-07-31.

[30] Rafflesia Khan, Declan Joyce, and Mansura Habiba. “AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI.” arXiv:2512.03180, 2025. `https://arxiv.org/abs/2512.03180`. Accessed 2026-07-31.

---


## R30 Theoretical Consolidation

This revision incorporates the stabilized TMPA theory from R26–R29: textual protocols are treated as dual-semantic surfaces carrying both prescriptive and evidentiary meaning; probabilistic agent interpretation is separated from deterministic governance validation; working agents are formed through organizational enablement; and governance reconstruction adopts explicit valid, invalid, and undetermined judgments.


## R31 Theoretical Alignment: Three-Valued Governance Logic

TMPA distinguishes governance judgment from presentation view. The semantic judgment space is intentionally three-valued: valid, invalid, and undetermined. Unlike binary authorization models that force every observation into approval or denial, TMPA preserves unresolved governance states as first-class outcomes. Incomplete evidence, conflicting evidence, and pending human decisions remain visible without creating false certainty.

Agents may produce interpretations and evidence through probabilistic execution; deterministic governance rules determine whether the resulting state is sufficiently established.
