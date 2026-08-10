# 9. Three-Valued Governance Interpretation

TMPA keeps semantic judgment separate from view classification:

| Judgment | Typical view | Meaning |
|---|---|---|
| `valid` | authoritative | Required evidence and applicable rules establish the conclusion. |
| `invalid` | quarantined / rejected | A deterministic violation excludes the affected evidence or action. |
| `undetermined` | partial / disputed / pending_human | Evidence is missing or conflicting, or an authorized human decision is still required. |

I0.8 makes the separation observable. A wrong-type or self-issued approval is preserved but cannot satisfy C07. A missing reference in C09 leaves the dependent claim undetermined rather than false or complete. An unauthorized C12 resolution remains evidence but is invalid as a resolving act. Integrity failure in C08 quarantines covered content while preserving its source record.

# 10. Evidence Integrity and Publication Preflight

The formal archive contains 195 files; 194 payload files are covered by its internal SHA-256 manifest. Its outer SHA-256 is `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`. Independent publication preflight verified:

- ZIP structural integrity and ASCII-only entry names;
- strict UTF-8 decoding for every file;
- 137 JSON files and 11 JSONL records;
- 194/194 internal SHA-256 entries;
- byte identity for all seven official S0.6 inputs;
- schema-valid C01–C14 result envelopes;
- product Reader invocation without Reference Reader substitution;
- a self-contained reproducer result of 14/14 PASS.

The initial 2026-08-09 candidate archive is not published. It contained semantically identical but checkout-converted CRLF copies of the official inputs, an incorrect manifest-count statement, and no self-contained public rerun path. The corrected 2026-08-10 archive replaces it as the sole I0.8 formal package.

# 11. Limitations

1. The product and full-suite evidence is author-run; no independent organization has certified or adopted the implementation.
2. The CodeFlowMu implementation commit is local and is not represented as a public release, tag, or complete public source tree.
3. The public reproducer exposes the conformance slice, not the entire private CodeFlowMu application or its full Runtime/Shell environment.
4. Runtime retains one skipped test; the FCoP reference implementation retains two migrated-layout historical-example skips.
5. C11 evaluates a fixed fixture set and its declared permutations; it is not a formal proof over arbitrary graphs or hostile platforms.
6. C08 demonstrates governance-object integrity handling, not model truthfulness, identity authentication, installer protection, or Byzantine resilience.
7. Full-suite performance, representative SME burden, comparative baselines, and independent deployment remain open empirical questions.
8. WP-13 is a bounded governance case, not a hallucination-elimination benchmark.

# 12. Claim Ledger

| Claim | I0.8 disposition |
|---|---|
| TMPA Core S0.6 defines C01–C14 | **Specified** |
| CodeFlowMu V1.6.0 contains corresponding product mechanisms | **Implemented** |
| The fixed product bundle records 14/14 PASS | **Demonstrated** |
| The self-contained conformance slice can be publicly rerun | **Demonstrated** |
| The complete private CodeFlowMu application is publicly reproducible | **Not claimed** |
| The result has been independently certified or adopted | **Not demonstrated** |
| WP-13 proves hallucination elimination | **Prohibited conclusion** |

# 13. Engineering Conclusion

I0.8 advances the Implementation Case from an exact S0.5 product result to an exact-input S0.6 product result. CodeFlowMu V1.6.0 passes all fourteen mandatory criteria while directly exposing the S0.6 changes in provenance retention, approval authority, and locale-independent reconstruction. A self-contained reproducer narrows the gap between author-local product evidence and public inspection without misrepresenting the private full application as open or independently validated.

The result strengthens the engineering evidence for TMPA's implementability, not the logical truth of the theory. TMPA theory guides the system design, Core S0.6 fixes the evaluated requirements, FCoP supplies the collaboration and evidence protocol, CodeFlowMu is the application execution and consumption layer under test, and WP-13 is a bounded field case. Independent adoption and broader empirical evaluation remain future work.

# Artifact Availability

The formal I0.8 archive is [tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip](/evidence/tmpa/i0.8/tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip). The adjacent file `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810.zip.sha256` records `3c34514089f08f5957d806f900ab31af1cdae94c08f31a5da046f451b5884fe9`.

I0.7 and its V1.4.1/S0.5 archive remain available at their versioned paths. The rejected I0.8 candidate is not part of the public publication set. Git history is the publication history; no parallel paper database has editorial authority.

# References

[1] TMPA Project. “TMPA Core Specification S0.6,” commit `8989657e8fde6d2e55d7606ae0adacac14fec760`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.9.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” reference implementation commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.6.0 S0.6 Product Conformance,” implementation commit `62440a526a99d2fe55019d8bb95ad2425569fcb4`, 2026.

[5] TMPA Project. “I0.8 CodeFlowMu V1.6.0 S0.6 Evidence,” package `tmpa-i0.8-codeflowmu-v1.6.0-s0.6-evidence-20260810`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “CodeFlowMu V1.4–V1.5 TMPA × FCoP × Application Unified Architecture,” `docs/TMPA-GOVERNANCE.md`. GitHub, 2026. `https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`.
