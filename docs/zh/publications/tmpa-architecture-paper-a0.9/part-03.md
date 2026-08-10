当前作者运行的 S0.6 证据包为 `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip`，随 [Implementation Case I0.8](/zh/publications/implementation-case-i0.8) 发布，并可从[公开证据路径](/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip)下载。其 SHA-256 为 `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`。早期 S0.4/S0.5 语料库继续作为不可变历史基线保留。除非经过独立重跑，这些材料都属于作者生成证据。

# 数据可用性

本文不公开生产业务数据。NL2SQL Worked Material 是说明性治理重建，而不是生产数据逐字导出。一致性 Fixture 和选定实现证据包含在作者生成语料库中；未来公开发布必须保留脱敏、版本、来源与 Checksum 信息。

# 利益冲突与作者生成证据

论文作者同时是 TMPA、FCoP 与 CodeFlowMu 的发起者和主要开发者。这种关系带来自我评估与选择偏差风险。本文区分 specified、implemented、demonstrated 与 independently adopted 声明；当前基线由作者运行，不构成独立验证或生态采用。

# 作者贡献

朱卫：概念提出、架构设计、研究方法、软件与协议开发、证据整理、调查、论文写作及公开工件维护。本单作者贡献声明不表示被评估系统已经获得独立验证。

# 伦理与隐私声明

本架构研究不报告人类受试者实验，也不公开生产业务数据。Worked Example 与一致性 Fixture 均为技术工件。未来任何涉及员工、组织行为、用户表现、访谈或敏感运行记录的研究，都必须另行处理适用的审查、知情同意、访问控制、数据最小化、保留和脱敏要求。

# References

[1] Model Context Protocol. “Specification 2026-07-28.” Final specification revision, 28 July 2026. `https://modelcontextprotocol.io/specification/2026-07-28`.

[2] A2A Protocol Project, Linux Foundation. “A2A Protocol Ships v1.0.” 2026. `https://a2a-protocol.org/latest/announcing-1.0/`.

[3] World Wide Web Consortium. “PROV-DM: The PROV Data Model” and “Constraints of the PROV Data Model.” W3C Recommendations, 2013. `https://www.w3.org/TR/prov-dm/`. Accessed 2026-07-30.

[4] Martin Fowler. “CQRS.” 2011. `https://martinfowler.com/bliki/CQRS.html`. Accessed 2026-07-30.

[5] Scott Chacon and Ben Straub. “Git Internals — Git Objects.” *Pro Git*, second edition. `https://git-scm.com/book/en/v2/Git-Internals-Git-Objects`. Accessed 2026-07-30.

[6] Linux Foundation. “Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md.” 9 December 2025. `https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation`. Accessed 2026-07-30.

[7] FCoP Project. “FCoP — File-based Coordination Protocol,” tag `v3.2.5`, commit `b3dc23439c6aaa6a6b3765655b87e5924e0257f9`. GitHub, 2026. `https://github.com/joinwell52-AI/FCoP/tree/v3.2.5`.

[8] FCoP Project. “FCoP v3 Specification,” `spec/fcop-v3-spec.md`, tag `v3.2.5`, 2026. `https://github.com/joinwell52-AI/FCoP/blob/v3.2.5/spec/fcop-v3-spec.md`.

[9] FCoP Project. Protocol Rules, machine-readable schemas, and architecture decisions, tag `v3.2.5`, 2026. `https://github.com/joinwell52-AI/FCoP/tree/v3.2.5/spec`.

[10] FCoP Project. `fcop` and `fcop-mcp` reference-implementation packages, tag `v3.2.5`, 2026. `https://github.com/joinwell52-AI/FCoP/tree/v3.2.5/src`; these packages implement the protocol and are not the protocol definition.

[11] Official MCP Registry. `io.github.joinwell52-AI/fcop`, `fcop-mcp` server entry, 2026. Accessed 2026-07-30.

[12] FCoP Project. “FCoP 3.2.5 Release Notes.” 2026. `https://github.com/joinwell52-AI/FCoP/blob/v3.2.5/docs/releases/3.2.5.md`.

[13] CodeFlowMu. “TMPA Browser” 在线公开演示。`https://demo.chedian.cc/`。访问于 2026-07-29。因 Build 与数据集没有不可变标识，本来源仅作界面说明，不纳入可复现评估；锁定的 CodeFlowMu 声明使用 [28]。

[14] FCoP Project. “ADR-0031: Governance Alert Layer (GAL).” Accepted 2026-05-11; tag `v3.2.5`. `https://github.com/joinwell52-AI/FCoP/blob/v3.2.5/adr/ADR-0031-governance-alert-layer.md`.

[15] FCoP Project. “ADR-0032: `fcop_audit()` — Protocol-to-Inspection Compiler.” Accepted 2026-05-12; tag `v3.2.5`. `https://github.com/joinwell52-AI/FCoP/blob/v3.2.5/adr/ADR-0032-fcop-audit-protocol-inspection.md`.

[16] FCoP Project. “FCoP Three-Layer Semantic Execution Chain Model.” Tag `v3.2.5`, 2026. `https://github.com/joinwell52-AI/FCoP/blob/v3.2.5/adr/FCoP-semantic-execution-chain.md`.

[17] Yi Nian, Aojie Yuan, Haiyue Zhang, Jiate Li, and Yue Zhao. “Auditable Agents.” arXiv:2604.05485, 2026. `https://arxiv.org/abs/2604.05485`. Accessed 2026-07-30.

[18] Mirja Kühlewind and Henk Birkholz. “An Architecture for Auditing AI Agent Delegation and Interactions.” Internet-Draft `draft-kuehlewind-audit-architecture-00`, Work in Progress, 18 May 2026. `https://datatracker.ietf.org/doc/draft-kuehlewind-audit-architecture/00/`. Accessed 2026-07-30.

[19] Google Cloud. “Register Agents.” Agent Registry documentation, updated 27 July 2026. `https://docs.cloud.google.com/agent-registry/register-agents`. Accessed 2026-07-30.

[20] Krti Tallam. “Authorization Propagation in Multi-Agent AI Systems: Identity Governance as Infrastructure.” arXiv:2605.05440, 2026. `https://arxiv.org/abs/2605.05440`.

[21] Maurits Kaptein, Vassilis-Javed Khan, and Andriy Podstavnychy. “Runtime Governance for AI Agents: Policies on Paths.” arXiv:2603.16586, 2026. `https://arxiv.org/abs/2603.16586`.

[22] Mert Cemri et al. “Why Do Multi-Agent LLM Systems Fail?” arXiv:2503.13657, version 3, 2025. `https://arxiv.org/abs/2503.13657`.

[23] OECD. “Empowering SMEs in the Age of AI: The 2026 OECD D4SME Survey.” *OECD SME and Entrepreneurship Papers*, No. 78, OECD Publishing, Paris, 13 April 2026. DOI: `10.1787/bf5a9816-en`. `https://www.oecd.org/en/publications/empowering-smes-in-the-age-of-ai_bf5a9816-en.html`. Accessed 2026-07-30.

[24] Infocomm Media Development Authority, Singapore. “Singapore's Digital Economy at 18.6% of GDP, up from 14.9% in 2019; Growth Fuelled by Accelerating Digitalisation and AI Adoption across Sectors and Firms.” 6 October 2025. `https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2025/singapore-digital-economy`. Accessed 2026-07-30.

[25] SaigeAgent / 小典 AI 项目。《多 AI 角色协同架构规划》。作者报告的私有项目档案，2026 年 3 月。当前没有固定公开快照；本引用仅披露作者陈述的设计谱系，不纳入评估语料、研究问题结果或一致性声明。

[26] Christian Schroeder de Witt. “Open Challenges in Multi-Agent Security: Towards Secure Systems of Interacting AI Agents.” arXiv:2505.02077, 2025. `https://arxiv.org/abs/2505.02077`. Accessed 2026-07-30.

[27] Richard Kang and Yudho Diponegoro. “Governance Gaps in Agent Interoperability Protocols: What MCP, A2A, and ACP Cannot Express.” arXiv:2606.31498, 2026. `https://arxiv.org/abs/2606.31498`. Accessed 2026-07-30.

[28] TMPA Project. “Implementation Case I0.8: CodeFlowMu V1.6.0 against TMPA Core S0.6.” Package `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810`, captured 10 August 2026. SHA-256 `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`; author-run product evidence and self-contained public reproducer. Independent rerun remains required.

[29] Zexun Wang. “Proof-Carrying Agent Actions: Model-Agnostic Runtime Governance for Heterogeneous Agent Systems.” arXiv:2606.04104, 2026. `https://arxiv.org/abs/2606.04104`. Accessed 2026-07-31.

[30] Rafflesia Khan, Declan Joyce, and Mansura Habiba. “AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI.” arXiv:2512.03180, 2025. `https://arxiv.org/abs/2512.03180`. Accessed 2026-07-31.

[31] National Institute of Standards and Technology. “Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile.” NIST AI 600-1, July 2024; updated April 2026. `https://doi.org/10.6028/NIST.AI.600-1`.

[32] Leslie Lamport. “Time, Clocks, and the Ordering of Events in a Distributed System.” *Communications of the ACM*, 21(7), 558–565, 1978. DOI: `10.1145/359545.359563`.

[33] K. Mani Chandy and Leslie Lamport. “Distributed Snapshots: Determining Global States of Distributed Systems.” *ACM Transactions on Computer Systems*, 3(1), 63–75, 1985. DOI: `10.1145/214451.214456`.

[34] Alan R. Hevner, Salvatore T. March, Jinsoo Park, and Sudha Ram. “Design Science in Information Systems Research.” *MIS Quarterly*, 28(1), 75–105, 2004. DOI: `10.2307/25148625`.

[35] Ken Peffers, Tuure Tuunanen, Marcus A. Rothenberger, and Samir Chatterjee. “A Design Science Research Methodology for Information Systems Research.” *Journal of Management Information Systems*, 24(3), 45–77, 2007. DOI: `10.2753/MIS0742-1222240302`.

[36] Zijie Zhuang et al. “From Trajectories to Evidence: Auditable Experimental Records for Industrial Research Agents.” arXiv:2608.05235, 2026. `https://arxiv.org/abs/2608.05235`.

[37] CodeFlowMu Project. “CodeFlowMu V1.4–V1.5 TMPA × FCoP × 应用统一架构”，`docs/TMPA-GOVERNANCE.md`。GitHub，2026。`https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`。
