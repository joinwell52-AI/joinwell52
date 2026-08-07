# 9. Three-Valued Governance Interpretation

TMPA separates semantic judgment from view classification:

| Judgment | Typical view | Meaning |
|---|---|---|
| `valid` | authoritative | Required evidence and applicable rules establish the conclusion. |
| `invalid` | quarantined / rejected | A deterministic violation excludes the affected evidence or action. |
| `undetermined` | partial / disputed / pending_human | Required evidence is missing, conflicting, or awaiting authorized human decision. |

FCoP and CodeFlowMu already expose many source facts needed by this model, but I0.6 does not claim that either product emits the complete S0.5 canonical graph, issue set, judgment, and view for every criterion. Reference Reader PASS establishes an executable interpretation; product verdicts describe the current projection and execution gap.

# 10. Reproducibility and Evidence Quality

The V2 archive contains 125 ZIP entries and 122 payload hashes. Its archive CRC, payload SHA-256 manifest, 45 JSON files, relevant JSONL, strict UTF-8 decoding after documented normalization, filename safety, absolute-path scan, and credential scan pass. All V1/V2 raw log files are byte-identical; V2 changes only summaries, matrix language, validation metadata, and the explicit encoding boundary.

The strongest reproducible statements are:

- the S0.5 Reference Reader produced 14/14 PASS on its fixed synthetic fixtures;
- the listed FCoP and CodeFlowMu test counts and failures are preserved in raw logs;
- WP-13 V3 passed its internal package validation;
- the C01–C14 product matrix follows the declared strict rule that one failed mandatory assertion prevents PASS.

The package is author-produced local evidence. It is not signed, independently timestamped, independently rerun, or a stable public CodeFlowMu release snapshot.

# 11. Limitations

1. FCoP and CodeFlowMu are maintained by project participants; this creates author and implementation bias.
2. The CodeFlowMu source worktree was dirty and local-only, despite isolated execution.
3. C08, C11, and C12 lack exact product execution.
4. C01, C03–C06, C09, C10, and C13 lack complete canonical product output.
5. C02 and C07 retain executed failures.
6. XiaoDian AI had no fixed S0.5 package and was NOT RUN.
7. No evidence establishes representative SME performance, adoption cost, comparison baselines, broad fault recovery, Byzantine resilience, or third-party adoption.
8. U+FFFD characters in two normalized FCoP logs limit byte-level forensic claims.

# 12. Engineering Roadmap

1. Close FCoP `parent` persistence/readback and release-surface snapshots, then rerun the full v3.2.5-equivalent suite.
2. Adjudicate the CodeFlowMu `ADMIN/PM` prompt contract, implement the approved product-or-test change, and rerun the complete Runtime suite.
3. Publish a retrievable clean CodeFlowMu candidate or reproduction snapshot.
4. Implement maintained FCoP and CodeFlowMu S0.5 projection adapters.
5. Execute C08, C11, and C12 and complete canonical outputs for all PARTIAL criteria.
6. Establish a fixed XiaoDian evidence package before making new S0.5 claims.
7. Obtain independent reruns and preserve all deviations.

# 13. Engineering Conclusion

I0.6 advances the Implementation Case from the historical S0.4 baseline to a fresh S0.5 author-run evidence baseline. The result is intentionally mixed: the Reference Reader passes all 14 synthetic criteria, while product evidence contains one PASS, eight PARTIAL, three NOT RUN, and two FAIL. This is stronger and more informative than a success-only demonstration because it identifies specific implementation and projection gaps without weakening the normative contract.

FCoP remains the protocol layer; its packages are the reference implementation. CodeFlowMu remains the downstream application. WP-13 supplies a bounded multi-agent governance case showing that persistent evidence and separated roles can contain an unverified completion claim. None of these engineering observations proves the TMPA theory, full product conformance, or independent adoption.

# Artifact Availability

The complete V2 evidence archive is available at [tmpa-i0.6-local-evidence-20260806-v2.zip](/evidence/tmpa/i0.6/tmpa-i0.6-local-evidence-20260806-v2.zip), SHA-256 `c55cb41fb90f63216fafe6e5b552f4917e56910d120d3b51486f96eba066c2d0`. Reviewable matrix, test-summary, source-inventory, validation, and redaction metadata are stored under [`research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.5/external-runs/20260806-local-evidence-v2).

The historical S0.4 corpus remains at [`research/conformance/tmpa-core-s0.4`](https://github.com/joinwell52-AI/joinwell52/tree/main/research/conformance/tmpa-core-s0.4). WP-13 V3 remains at `/evidence/tmpa/i0.5/`. Git history is the publication version history; no separate paper archive has editorial authority.

# References

[1] TMPA Project. “TMPA Core Specification S0.5.” GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.7.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” tag v3.2.5, commit `b3dc23439c6aaa6a6b3765655b87e5924e0257f9`. GitHub, 2026.

[4] CodeFlowMu Project. Local isolated evidence snapshot based on commit `c4ebc146cb8ef0409a4c9eb571a8f2432ade3bd0`, version `0.3.0-alpha`, captured 2026-08-07.

[5] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3,” commit `609571ddb22d1fbb2bfb5e54692c07beeef4cf23`, 2026.

[6] TMPA Project. “I0.6 Local Engineering Evidence V2,” package `tmpa-i0.6-local-evidence-20260806-v2`, 2026.
