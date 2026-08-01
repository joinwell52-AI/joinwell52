# 13. Engineering Conclusion

The pinned corpus converts broad engineering history into a testable baseline. Against fixed versions, two criteria pass directly, eight have partial product evidence, and four were not run at product-reader level. The result is stronger than an unversioned demonstration but weaker than complete or independent conformance.

The products already contain many write-side and local-control mechanisms; the largest shared gap is deterministic read-side normalization. A read-only evidence-graph adapter, followed by product execution of C08, C10, C11, and C12, is the shortest path from scattered engineering evidence to a stronger implementation claim. Quantified SME deployment cost and independent reproduction remain separate empirical requirements.

# Artifact Availability

The author-produced conformance archive is stored as `tmpa-conformance.zip`. It contains the manifest, evidence inventory, fixtures, runners, expected and actual outputs, result records, and logs. A stable public archive is pending.

# Data Availability

The public demonstration exposes selected governance views. Private business data, credentials, and sensitive operational records are not included. The corpus uses selected test paths, hash inventories, and compact fixtures rather than exporting private production data.

# Competing Interests and Provenance

The author is the originator or principal developer of TMPA, FCoP, and CodeFlowMu and is involved in the XiaoDian AI lineage. All baseline results are author-produced. This relationship increases the need for fixed versions, preserved failures, and independent reproduction.

# References

[1] FCoP Project. “FCoP — File-based Coordination Protocol,” repository README and architecture stack. GitHub, 2026. `https://github.com/joinwell52-AI/FCoP`.

[2] FCoP Project. “FCoP Runtime Specification · Single-Page Complete Edition,” 1.2.x specification line, 2026.

[3] FCoP Project. “FCoP IPC Envelope” and related machine-readable JSON Schemas, `spec/schemas/`, 2026.

[4] Python Package Index. `fcop` and `fcop-mcp` distributions, 2026.

[5] Official MCP Registry. `io.github.joinwell52-AI/fcop`, `fcop-mcp` server entry, 2026.

[6] FCoP Project. “ADR-0031: Governance Alert Layer (GAL).” Accepted 2026-05-11.

[7] FCoP Project. “ADR-0032: `fcop_audit()` — Protocol-to-Inspection Compiler.” Accepted 2026-05-12.

[8] CodeFlowMu. “TMPA Browser” public demonstration. `https://demo.chedian.cc/`. Snapshot observed 2026-07-29.

[9] TMPA Project. “TMPA Draft V1.0 C01–C14 Conformance Corpus.” Corpus ID `tmpa-draft-v1-c01-c14-20260731`, executed 2026-07-31. Author-produced archive `tmpa-conformance.zip`.

# Appendix A. FCoP End-to-End Artifact Example

A TASK is created by PM, claimed and executed by DEV, followed by a separate DEV REPORT and an independent QA REVIEW. The QA review may return `needs_human` when technical verification passes but production activation changes an authorization boundary.

The reader reconstructs:

```text
TASK created by PM
  ├─ claimed and executed by DEV
  ├─ REPORT submitted by DEV
  ├─ REVIEW issued by QA: needs_human
  ├─ judgment: undetermined
  ├─ view: pending_human
  ├─ authorized human approval or rejection evidence
  └─ final judgment: valid or invalid
```

The `needs_human` node remains in the graph and is queryable. Downstream objects depending on it remain `undetermined` until an authorized decision object resolves the state. The authoritative record is the source set and transitions, not the rendered view. Reordering input files must not change the reconstructed graph or issue set.

## I0.3 Theory-to-Implementation Alignment

FCoP is evaluated as a protocol realization of TMPA concepts; CodeFlowMu is evaluated as an engineering system combining protocol roles with Skills, tools, runtime execution, recovery, and interfaces. The report distinguishes probabilistic agent execution evidence from deterministic validation mechanisms, and demonstrated behavior from full Core conformance.
