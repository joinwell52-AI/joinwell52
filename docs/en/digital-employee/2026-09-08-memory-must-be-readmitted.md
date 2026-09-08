---
title: "Memory Still Exists; That Does Not Make It Inheritable"
date: '2026-09-08'
column: digital-employee
category: daily
article_type: technical-analysis
edition: research-center
research_question: "当数字员工更换模型、读写方式或嵌入模型后，需要哪些证据，才能让原有持久记忆成为新运行环境的权威记忆？"
summary: "A controlled study shows that intact files, readable formats, and matching vector dimensions do not guarantee that a changed model stack will retrieve and interpret old memory consistently. Robust upgrades should separate storage integrity, semantic compatibility, recoverability, and activation authority."
sources:
  - research/analysis/Q-20260908-01-memory-migration-admission.md
item_id: "Q-20260908-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-08-memory-must-be-readmitted-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-08-memory-must-be-readmitted-cover.png"
  kicker="Digital Employee · Daily Research"
  title="Memory Still Exists; That Does Not Make It Inheritable"
  summary="A controlled study shows that intact files, readable formats, and matching vector dimensions do not guarantee that a changed model stack will retrieve and interpret old memory consistently. Robust upgrades should separate storage integrity, semantic compatibility, recoverability, and activation authority."
  version="Q-20260908-01"
  status="Daily Runtime V5 · 2026-09-08"
  languageHref="/zh/digital-employee/2026-09-08-memory-must-be-readmitted"
  languageLabel="中文"
/>

# Memory Still Exists; That Does Not Make It Inheritable

After a model upgrade, a digital employee restarts. The database opens, file hashes are unchanged, and vectors still have 1,024 dimensions. Conventional integrity checks pass, so the system immediately adopts the old memory.

The hidden problem is that **unchanged bytes do not guarantee that the new stack retrieves and interprets the same meaning.** A controlled study of agent-memory portability reports that moving free-form memory between models can help in one direction and hurt in the reverse direction. Mixing embeddings from two versions with the same dimensionality also fails to reproduce the full benefit of rebuilding the index.

The core proposition is: **physical persistence, semantic compatibility, recoverability, and activation authority are four distinct states. After a material model, writer, reader, or embedding change, durable memory must be re-admitted before it becomes authoritative for the new runtime.**

## Byte Continuity Is Not Meaning Continuity

Storage systems answer deterministic questions well: does the file exist, can the database be parsed, does the record match its schema, and are vector shapes consistent? Those checks matter, but they observe physical form.

Operational memory also depends on construction, retrieval, and interpretation. A writer decides how facts are compressed. An embedder defines similarity in vector space. A reader turns retrieved material into an answer. A change at any layer can alter the meaning available from physically unchanged data.

This is not ordinary corruption. The data can remain intact while the semantic contract changes. If a runtime exposes only one “memory available” flag, a storage check silently substitutes for both semantic evidence and an activation decision.

## Migration Direction Cannot Be Averaged Away

The primary study captured by the same-date Research Object compares four memory representations, two writer-reader models, two embedding versions, directional swaps, and several recovery methods.

Free-form notes show pronounced directionality. The study reports that one cross-model reading direction improves by about 9.91 percentage points relative to the corresponding self-note condition, while the reverse direction declines by about 13.28 points. A symmetric average can cancel improvement and harm, producing a mild-looking number that cannot govern either real migration.

Embedding migration exposes a similar issue. Both examined embedding versions produce 1,024-dimensional vectors, yet a 50/50 mixed index captures only part of the improvement from full re-embedding. In the reported comparison, full migration exceeds the mixed condition by about 6.95 percentage points.

These numbers belong to the study's synthetic workload and model pair; they are not enterprise thresholds. They are sufficient to reject a weaker assumption: shared format or dimensionality alone does not establish semantic compatibility. Admission evidence must bind the exact direction—for example, memory produced by an old writer and embedder being consumed by a new reader and embedder.

## Four States Cannot Be Compressed into Available

A robust migration record preserves at least four facts.

| State | Question answered | What it cannot replace |
|---|---|---|
| Storage integrity | Is the representation present, parseable, and well formed? | Whether the new stack preserves meaning |
| Semantic compatibility | Does this exact migration direction pass source-grounded probes? | Whether failure can be repaired |
| Recoverability | Is an allowed source retained, and has the repair path been tested? | Whether activation is authorized |
| Activation authority | May the new runtime use this memory generation after technical and policy checks? | Technical evidence of compatibility |

A memory generation can therefore be intact but quarantined, recoverable but not yet compatible, or technically compatible but barred by privacy, retention, or authorization policy. Explicit states prevent deterministic infrastructure from making semantic and governance decisions it cannot observe.

## The Minimum Migration Evidence Packet

An auditable migration packet should record more than “upgrade succeeded.” At minimum, it binds:

- the representation, schema version, and memory generation;
- old writer, new reader, and old/new embedder identities;
- the exact migration direction rather than a global compatibility label;
- a fixed source-grounded semantic probe set, thresholds, results, and failures;
- provenance to recoverable source where policy allows retention;
- repair procedure and version, plus results for this direction;
- the owner and evidence behind the final activation decision.

During embedding changes, old and new semantic spaces should be isolated or explicitly versioned unless the mixed construction has been shown fit for its intended use. The study does not establish that every mixed index is invalid. It establishes that matching vector shape is far too weak to authorize one as authoritative memory.

## Retaining Raw History Is Not a Guaranteed Repair

The study also reports that retained source materially enables several repair paths, and full re-embedding is more consistently recoverable than rewriting free-form notes in its workload. Repair is not automatic, however; outcomes differ across repair models.

Production systems add boundaries the study does not cover. Privacy, retention, and contractual rules may prohibit indefinite raw-history storage. Enterprise memory also includes credentials, preferences, procedural state, and external records, not only question-answer facts. The supported conclusion is therefore not “retain everything forever.” It is that the system must identify its allowed recovery basis and test whether that basis works for the current migration direction.

## Upgrade Completion Needs a Stronger Definition

For a long-lived digital employee, an upgrade should not end when the new process starts or the database opens. A stronger completion condition is: physical data checked, exact migration direction semantically probed, recovery route shown usable, policy gates satisfied, and a separate activation decision issued.

Compatibility evidence also needs freshness. A material change to the model, prompt, schema, embedder, or retrieval policy can invalidate an earlier conclusion. Evidence should bind a component tuple, not permanently label a directory “compatible.”

## Evidence Boundary and Open Questions

The evidence comes from a synthetic workload and a limited model combination. It does not show that fixed-schema knowledge graphs are inherently safe or that free-form memory is generally unreliable. It supplies a migration counterexample and useful diagnostics, not a universal production verdict.

Open questions include how small a semantic probe suite can remain while detecting harmful directional drift; how to isolate generations during partial migration; how to support privacy-preserving recovery when raw source cannot be retained; which changes should automatically expire activation; and how online degradation can distinguish model, retrieval, and memory-migration failures.

Until those questions are answered, the strongest default is: **memory may remain durable, but its right to be inherited must be earned again.**

**Evidence and source:**

- [Primary study of agent-memory portability](https://arxiv.org/html/2609.05339v1)
