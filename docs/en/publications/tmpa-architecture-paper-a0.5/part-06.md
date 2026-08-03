## 8.4 Threats to Validity

**Construct validity.** C01–C14 operationalize governance structure and reconstruction behavior. They do not directly measure factual truth, human usefulness, productivity, or organizational accountability. A criterion pass must not be interpreted as success on those external constructs.

**Internal validity.** The author selected the architecture, systems, cases, and evidence mappings and also ran the baseline. Version differences and retrospective mapping from historical artifacts to later criteria can affect the result. Fixed revisions, hashes, explicit prerequisites, and separate product and fixture verdicts reduce—but do not remove—this risk.

**External validity.** The principal implementation is a file-based profile, the case set is small, and much of the observed execution is project-local. The findings may not transfer unchanged to database-backed, highly distributed, regulated, adversarial, or high-throughput deployments.

**Conclusion validity.** The verdict counts are descriptive results for selected paths. They are not statistical estimates, evidence of full conformance, or causal comparisons with chat, event-log, workflow-engine, or database alternatives.

**Reproducibility.** The current corpus is author-produced. A stable public archive, release checksum, executable reproduction command, environment declaration, and independent rerun remain necessary.

## 8.5 Limitations and Falsification Conditions

TMPA's central claims should remain open to disconfirmation:

| Claim | Evidence that would weaken or refute it |
|---|---|
| equal source sets permit deterministic reconstruction | conforming readers produce different canonical graph or issue outputs for the same profile and source set |
| durable textual evidence improves responsibility recovery | controlled recovery tasks perform no better than relevant alternatives, or cannot identify responsibility and missing evidence reliably |
| the architecture can operate with minimal infrastructure | required correctness depends on an undeclared coordination database, broker, global clock, or centralized mutable log |
| the SME-first profile is operationally feasible | deployment, maintenance, storage, or human-discipline costs outweigh measured governance benefits in representative SME use |
| the semantics are portable across profiles | independent implementations cannot preserve object, authority, lifecycle, conflict, and reconstruction semantics across different storage substrates |

## 8.6 Publication and Reproducibility Boundary

A0.5 is the theoretical architecture paper. Core S0.4 is the normative source, and Implementation Case I0.3 is the engineering-evidence source. The paper may summarize those companion artifacts but must not silently redefine their meaning.

Before external submission, the corpus requires a stable public archive, pinned source revisions, an executable reproduction command, and at least one independent rerun. Low-resource deployment measurements remain a separate release requirement for the SME feasibility claim.
# 9. Conclusion

TMPA is an **SME-first, minimal-infrastructure textual-message multi-agent asynchronous process architecture**. Text carries durable work and state; each work item has one stable primary carrier; each published object has one writer and belongs to a local serial stream; independent streams progress asynchronously; and aggregation plus deterministic reading reconstructs the partial-order process, responsibility, lifecycle, conflict, recovery, and audit view.

The architecture arose through **practice → method → theory**: XiaoDian AI exposed the multi-role coordination problem, original TMPA identified the textual asynchronous method, FCoP extracted and matured its reusable file-coordination and review subset, CodeFlowMu supplied downstream application feedback, and this paper formalized the resulting objects, invariants, assurance boundaries, and conformance criteria. The early pipeline establishes origin, not retroactive Core conformance.

A0.5 answers RQ1 and RQ2 at the architectural level and provides a first pinned, author-run baseline for RQ3. Against fixed FCoP `3.2.4` and CodeFlowMu `V1.2.3` revisions, **two criteria pass, eight remain partial, and four were not run at product-reader level**. No criterion with a direct gating test failed, but that statement is limited to the executed paths and must not be read as zero-failure full conformance. Selected suites recorded 222 FCoP tests, 73 CodeFlowMu tests, and 4 non-gating XiaoDian auditor tests passing. All 14 fixture oracles matched expected outputs, but this does not substitute for product execution of C08, C10, C11, and C12 or independent validation.

The decisive remaining question is RQ3: whether an organization can sustain the responsibility, review, recovery, and evidence benefits of TMPA in an ordinary project environment at acceptable resource and discipline cost. That claim still requires a stable public corpus, product-level evidence-graph adapters, low-resource deployment and recovery measurements, baseline comparisons, representative use, and independent reproduction. TMPA also does not by itself establish authenticated identity, strong isolation, protected storage, Byzantine resilience, factual truth of participant claims, or ecosystem adoption.

---
# Artifact Availability

The first author-run conformance corpus is identified as `tmpa-draft-v1-c01-c14-20260731` and is currently preserved as `tmpa-conformance.zip`. It contains the manifest, criterion fixtures, expected and actual outputs, machine-readable verdicts, runners, execution logs, and a 325-file SHA-256 evidence inventory. A stable public archive, release checksum, and independent rerun remain pending; the current package must therefore be cited as author-produced evidence rather than independent validation.
# Data Availability

The paper does not publish production business data. The worked NL2SQL material is an illustrative governance reconstruction rather than a verbatim production export. Conformance fixtures and selected implementation evidence are included in the author-produced corpus; any future public release must preserve redaction, version, provenance, and checksum information.
# Competing Interests and Author-Produced Evidence

The paper author is also the originator and principal developer of TMPA, FCoP, and CodeFlowMu. This relationship creates self-evaluation and selection risks. The paper separates specified, implemented, demonstrated, and independently adopted claims; the current baseline is author-run and does not constitute independent validation or ecosystem adoption.
# References

[1] Model Context Protocol. “Specification.” `https://modelcontextprotocol.io/specification/`. Accessed 2026-07-30.

[2] A2A Protocol Project, Linux Foundation. “Agent2Agent Protocol,” Version 1.0 documentation and specification, 2026. Accessed 2026-07-30.

[3] World Wide Web Consortium. “PROV-DM: The PROV Data Model” and “Constraints of the PROV Data Model.” W3C Recommendations, 2013. `https://www.w3.org/TR/prov-dm/`. Accessed 2026-07-30.

[4] Martin Fowler. “CQRS.” 2011. `https://martinfowler.com/bliki/CQRS.html`. Accessed 2026-07-30.

[5] Scott Chacon and Ben Straub. “Git Internals — Git Objects.” *Pro Git*, second edition. `https://git-scm.com/book/en/v2/Git-Internals-Git-Objects`. Accessed 2026-07-30.

[6] Linux Foundation. “Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md.” 9 December 2025. `https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-agentic-ai-foundation`. Accessed 2026-07-30.

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

[31] National Institute of Standards and Technology. “Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile.” NIST AI 600-1, July 2024; updated April 2026. `https://doi.org/10.6028/NIST.AI.600-1`.
