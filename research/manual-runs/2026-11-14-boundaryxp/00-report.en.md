# BoundaryXP 7+1: review of public research materials

Date: 2026-11-14. Pinned source: [BoundaryXP](https://github.com/joinwell52-AI/BoundaryXP) main `6740e8764eff75c8966297f930690ad8192f854a`; Wei Zhu's preprint, English v1.2 / Chinese r23, [DOI 10.5281/zenodo.24072738](https://doi.org/10.5281/zenodo.24072738). This is a review and selected rerun of saved research material, not a new product model analysis or a real business incident.

## Case and question

The [RT044 report](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-383.en.md) and [saved result JSON](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/results/R389-383.json) record one parent, six child tasks, and ten queries. The parent requires safety review A before startup D; TEST adds D→packaging B, LAB adds B→testing C, and SAFETY adds C→the same A. KP shows the parent is satisfiable. KT/KL/KF show each added child edge is separately satisfiable with the parent. KJ reports the joint graph as `VIOLATED`. Event identity comes from the task's same-round, single-occurrence source, not a guessed alias. The report concerns planned constraints, not observed actions.

Controls: [RT042](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-381.en.md) finds no overlap between 10:00–11:00 and 11:00–12:00 when half-open resource intervals release at 11:00; [L23-050](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/demo/reports/R389-153.en.md) cannot uniquely bind “he will confirm” to the required final owner. The examples separate a known conflict, a within-bounds plan, and unresolved identity.

## Rerun and observations

Clone the pinned public commit with `docs/paper/materials/evidence-r18/` project, result, and `STATISTICS-VERIFIED.json` files, then run:

```text
python -B docs/paper/materials/analysis625/analyze.py
python -B docs/paper/materials/analysis625/witness_checks.py
python -B docs/paper/materials/case-r17/verify_math.py
```

All three commands exited 0. The classification script verifies project and result hashes and returns 625 groups, 3,219 task nodes, and 3,469 queries, including 3,257 queries involving multiple 7+1 views and 900 binding multiple target nodes; there are 518 exact source-structure groups. See the [analysis and scripts](https://github.com/joinwell52-AI/BoundaryXP/tree/main/docs/paper/materials/analysis625). Six selected mathematical witnesses passed. All nine saved EN20-007 computations passed independent checks; known cost is at least EUR 6,400 against a EUR 6,000 cap, a minimum excess of EUR 400. See the [case and independent script](https://github.com/joinwell52-AI/BoundaryXP/tree/main/docs/paper/materials/case-r17).

The [original statistics](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/paper/materials/evidence-r18/SOURCE-REPORT.md) report 625/625 agreement among saved whole-case verdicts, current annotations, and aggregate calculator verdicts. At item level, nine comparisons differ and three calculations were unfinished. The annotations include revisions, and exact source structures repeat. Neither whole-case agreement nor the number of project records estimates accuracy on unseen independent tasks. The rerun does not invoke the workbench, model, or natural-language interpretation.

## MCP verification scope

The downloaded [0.4.0-rc.6 GitHub Release](https://github.com/joinwell52-AI/BoundaryXP/releases/tag/mcp-v0.4.0-rc.6) tgz had SHA-256 `D243EEAB864A99770DBF7258BC3B64DF2D674FF31CDAA97871747E606FE3C1B2`, matching the release. Its `package.json` identifies Windows x64, Node ≥22.18, and rc.6. This round did not execute a new MCP stdio call. The 18-tool / 10-resource and install checks are [release-record claims](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/RELEASE.md); operation boundaries come from the [tool reference](https://github.com/joinwell52-AI/BoundaryXP/blob/main/docs/mcp/TOOLS.md).

The preprint's formal guarantees require source alignment, identity, interpretation, and exact query encoding. The [implementation note](https://github.com/joinwell52-AI/BoundaryXP/blob/main/protocol/IMPLEMENTATION.md) distinguishes the draft.2 method baseline from current workbench runtime materials. Boundary findings do not grant business decisions or execution authorization. The public package excludes the original private Core source; this review makes no end-to-end product accuracy claim.
