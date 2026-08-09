# 8. Three-Valued Governance Interpretation

TMPA keeps semantic judgment separate from view classification:

| Judgment | Typical view | Meaning |
|---|---|---|
| `valid` | authoritative | Required evidence and applicable rules establish the conclusion. |
| `invalid` | quarantined / rejected | A deterministic violation excludes the affected evidence or action. |
| `undetermined` | partial / disputed / pending_human | Evidence is missing or conflicting, or an authorized human decision is still required. |

This distinction is visible in I0.7. Missing acceptance in C06 does not make the work false; it leaves completion undetermined and prevents state advancement. The unauthorized C12 decision is preserved as evidence but is invalid as a conflict-resolving authority act. C08 quarantines tampered covered content while retaining the failed source in the manifest. The Reader therefore reconstructs both usable facts and the reasons other evidence was excluded or deferred.

# 9. Reproducibility and Evidence Quality

The formal V1.4.1 archive contains 68 files. Its outer SHA-256 is `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`. Archive integrity, the internal payload manifest, strict UTF-8 decoding, JSON and JSONL parsing, and the bundled verification script pass. A redaction scan covered 65 text files and reported no findings.

The package preserves:

- fixed source identities and checkout state;
- dependency lockfiles and environment metadata;
- exact commands with exit codes and durations;
- raw stdout/stderr and structured run summaries;
- the 15-assertion external product fixture;
- the C01–C14 matrix and canonical actual outputs;
- source excerpts for the S0.5 projection and Reader;
- an internal SHA-256 manifest and evidence verifier.

One metadata limitation is explicit: `environment.json` records npm as unavailable because the collector did not resolve the executable name, although the recorded Windows commands invoke `npm.cmd` successfully and their logs and exit codes are present. This limits the captured npm-version claim; it does not change the executed test verdicts.

# 10. Limitations

1. The result is author-run on fixed commits and a fixed bundle; no independent party has rerun or certified it.
2. Runtime retains one skipped test, and FCoP retains two historical-example skips under the migrated layout.
3. Shell testing used an isolated instance after native initialization; generated files are recorded separately from the source commit.
4. C08 demonstrates governance-object integrity handling, not installer self-protection, identity authentication, or factual truth.
5. C11 covers four fixed sources and all 24 input permutations; it is not a formal proof for arbitrary source counts or adversarial environments.
6. The package is not a claim of representative SME performance, comparative superiority, Byzantine resilience, or third-party adoption.
7. WP-13 is a bounded governance case, not a hallucination-elimination benchmark.
8. The evidence capture itself created no paper publication, push, release, or tag; those publication acts are governed separately by repository history.

# 11. Claim Ledger

| Claim | I0.7 disposition |
|---|---|
| TMPA Core S0.5 defines C01–C14 | **Specified** |
| CodeFlowMu V1.4.1 contains corresponding product mechanisms | **Implemented** |
| The locked author-run bundle records 14/14 product PASS | **Demonstrated** |
| The result has been independently rerun or certified | **Not demonstrated** |
| TMPA has been independently adopted by another organization | **Not demonstrated** |
| WP-13 proves hallucination elimination | **Prohibited conclusion** |

# 12. Engineering Conclusion

I0.7 advances the Implementation Case from I0.6's mixed local product baseline to a clean, publicly retrievable CodeFlowMu V1.4.1 source lock and a complete product-level C01–C14 execution. The formal result is 14 PASS / 0 FAIL under the fixed bundle. The two failures observed in V1.4.0 are closed by preserving the separation between lifecycle and acceptance and by requiring authorized conflict resolution.

The result is meaningful engineering evidence because it preserves exact sources, commands, outputs, criterion observations, limitations, and repair history. Its boundary is equally important: it demonstrates implementation behavior; it does not prove TMPA theory, certify every CodeFlowMu deployment, or establish independent adoption. FCoP remains the protocol layer, CodeFlowMu the application layer, and WP-13 a bounded governance case.

# Artifact Availability

The formal I0.7 evidence archive is [tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip](/evidence/tmpa/i0.7/tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip). The adjacent file `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809.zip.sha256` records `06f34ce7c6b5008b9adeedc45f68541ce5f3ecff6613c80ff3bb05a12fa61b34`.

The V1.4.0 12 PASS / 2 FAIL archive is retained as pre-repair historical evidence but is not published as the formal I0.7 main package. The historical I0.6 package and WP-13 V3 remain available at their versioned paths. Git history is the publication history; no parallel paper database has editorial authority.

# References

[1] TMPA Project. “TMPA Core Specification S0.5.” GitHub, 2026.

[2] TMPA Project. “TMPA Architecture Paper A0.7.” GitHub, 2026.

[3] FCoP Project. “FCoP — File-based Coordination Protocol,” version 3.2.4, commit `da79dfefd99f597c9e422ce9edec22157f915a21`. GitHub, 2026.

[4] CodeFlowMu Project. “CodeFlowMu V1.4.1,” commit `1cd403537136b3e915c4646cd306983eaca1d2ce`. GitHub, 2026.

[5] CodeFlowMu Project. “WP-13 Multi-Agent Fact-Check Publication Evidence V3.” GitHub, 2026.

[6] TMPA Project. “I0.7 CodeFlowMu V1.4.1 Evidence,” package `tmpa-i0.7-codeflowmu-v1.4.1-evidence-20260809`, 2026.
