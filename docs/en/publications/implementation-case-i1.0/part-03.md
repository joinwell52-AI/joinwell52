# 9. Three-Valued Governance Interpretation

TMPA keeps semantic judgment separate from view classification:

| Judgment | Typical view | Meaning |
|---|---|---|
| `valid` | authoritative | Required evidence and applicable rules establish the conclusion. |
| `invalid` | quarantined / rejected | A deterministic violation excludes the affected evidence or action from authoritative use. |
| `undetermined` | partial / disputed / pending_human | Evidence is missing or conflicting, or an authorized human decision is still required. |

The V1.8.0 run makes this separation observable. A wrong-type, self-issued, or otherwise unauthorized approval remains preserved but cannot satisfy C07. A missing reference in C09 leaves the dependent claim `undetermined` rather than silently complete. An unauthorized resolution in C12 remains evidence but is `invalid` as a resolving act. Integrity failure in C08 quarantines the covered content while preserving its source record. These are governance judgments over evidence; they are not semantic truth judgments about the world.

# 10. Evidence Integrity and Publication Audit

The formal archive contains 891 entries and 889 files. All 889 files are covered by its internal SHA-256 manifest, and the outer ZIP SHA-256 is `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`. Publication audit verified:

- safe ZIP paths and structural integrity;
- 889/889 internal SHA-256 entries;
- strict UTF-8 decoding for 884 text files;
- successful parsing of all 190 JSON files;
- byte identity for the four published S1.0 Schemas and the remaining normative inputs;
- product Reader invocation without Reference Reader substitution;
- Schema-valid C01–C14 result envelopes;
- recomputation of all fourteen manifest digests, fourteen result digests, 71 mandatory assertions, the aggregate result digest, and the input-bundle digest;
- preservation of pre-fix failures, remediation notes, raw commands, exit status, dependency locks, source snapshot, and patch.

No recomputed digest or assertion differed from the archive record. This audit establishes internal consistency and traceability of the submitted package; it is not an independent product rerun or certification.

# 11. Limitations

1. The product and regression evidence is author-run. No independent organization has certified or adopted the implementation.
2. The CodeFlowMu evidence commit was local-only at capture time and was not a public tag or release. The archive carries a complete source snapshot and patch for inspection.
3. The evidence worktree was tracked-clean, but the original mother worktree was dirty and changing. Claims are bound to the isolated evidence worktree and fixed commit.
4. The reduced reproducer demonstrates the conformance slice, not every private deployment dependency or operational environment of CodeFlowMu.
5. Runtime retains one skipped test; the FCoP reference implementation retains two skipped tests. Neither skip is counted as a C01–C14 product result.
6. C11 evaluates a fixed fixture set and declared permutations; it is not a formal proof over arbitrary graphs, encodings, filesystems, or hostile platforms.
7. C08 demonstrates governance-object integrity handling, not model truthfulness, actor authentication, installer integrity, or Byzantine resilience.
8. Full-suite performance, representative SME burden, comparative baselines, cross-profile portability, and independent deployment remain open empirical questions.
9. WP-13 is a bounded governance and evidence-admission case, not a hallucination-elimination benchmark.

# 12. Claim Ledger

| Claim | I1.0 disposition |
|---|---|
| TMPA Core S1.0 defines C01–C14 | **Specified** |
| CodeFlowMu V1.8.0 contains corresponding product mechanisms | **Implemented** |
| The exact product bundle records 14/14 PASS | **Demonstrated** |
| The archive preserves inputs, source, commands, outputs, failures, and hashes | **Demonstrated** |
| The reduced conformance slice ran successfully in the captured clean reproducer | **Demonstrated** |
| CodeFlowMu is universally conformant for arbitrary inputs and deployments | **Not claimed** |
| The result has been independently rerun, certified, or adopted | **Not demonstrated** |
| TMPA theory is proved by the implementation | **Prohibited conclusion** |
| WP-13 proves hallucination elimination | **Prohibited conclusion** |

# 13. Engineering Conclusion

I1.0 establishes a release-grade, exact-input engineering baseline for TMPA Core S1.0. CodeFlowMu V1.8.0 passes all fourteen mandatory criteria through its own product Adapter and Reader path, records 71 mandatory assertions, and preserves the regression, remediation, source, dependency, and integrity trail needed to inspect the result. The S1.0 frozen candidate baseline and the later product execution remain separately identifiable.

The result strengthens evidence that TMPA can guide a concrete engineering system. It does not make CodeFlowMu the authority that defines TMPA, and it does not convert engineering success into proof of the theory. The dependency direction remains: A1.0 states the architecture theory; S1.0 defines normative behavior; FCoP supplies the coordination protocol; CodeFlowMu implements and consumes the governance projection; I1.0 reports the bounded evidence.

# Artifact Availability

The formal archive is [tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip](/evidence/tmpa/i1.0/tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip). The adjacent file `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811.zip.sha256` records `9b92b06c3e46c8019362f55075be4ed066cb7a9c0d9859945b6c3b7de8840d04`.

The run is registered in the [S1.0 external-run registry](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s1.0/external-runs/20260811-codeflowmu-v1.8.0). Earlier I0.6–I0.8 packages remain immutable historical evidence at their versioned paths. Git history is the publication history; no parallel paper database has editorial authority.

# References

[1] TMPA Project. “TMPA Core Specification S1.0,” frozen candidate commit `942cbb097eb3d662662f96a2269818ec9d7ca2ed`. GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A1.0.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” reference implementation commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.8.0 S1.0 Product Conformance,” evidence commit `c1e1f724293e8048fc3a956b6f6df8cf83f54830`, 2026.

[5] TMPA Project. “I1.0 CodeFlowMu V1.8.0 S1.0 Evidence,” package `tmpa-i1.0-codeflowmu-v1.8.0-s1.0-evidence-20260811`, 2026.

[6] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” 2026.

[7] CodeFlowMu Project. “TMPA Governance: Theory-to-Engineering Relation,” `docs/TMPA-GOVERNANCE.md`. GitHub, 2026. `https://github.com/joinwell52-AI/codeflowmu/blob/main/docs/TMPA-GOVERNANCE.md`.
