# Q-20260908-01 — Durable Agent Memory Needs Migration Evidence Before Model Upgrades Can Inherit It

- Runtime date: 2026-09-08 (Asia/Shanghai)
- Queue signal: SIG-20260908-003
- Primary research source: https://arxiv.org/html/2609.05339v1
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`
- Authoritative control-source commit: `3fb9416db906076aa2272477c5b3a4702b82b1dc`
- Generated Reading Prompt: `v1.0.0` / SHA-256 `9ad93d7f4cd7859fc0b32fa9b3b9e2b836a177c889addcc67d0b4fdc3261d7b5`

## Research Question

When a long-lived agent changes its model or embedding stack, may it inherit an existing memory store merely because the bytes remain durable, or must that memory cross a new migration-admission boundary supported by evidence about semantic retrieval, provenance and recovery behavior?

## Source-Completeness and Comparison Gate

The complete primary study, **Does Your Agent’s Memory Survive a Model Upgrade? A Controlled Study of Memory Portability**, was read across its problem formulation, experimental design, preregistered hypotheses, representation and model-swap matrix, migration results, diagnostic loss decomposition, repair experiments, auditability appendix and limitations. The study itself contains designed comparative evidence across memory representations, writer/reader directions, embedding versions, mixed versus full re-indexing, and store-only versus raw-history-assisted repair; this satisfies the comparative-evidence gate for the selected primary-research object without treating a secondary summary as evidence.

## Scope

The paper isolates a practical migration problem that is often hidden by the word “persistent.” It constructs synthetic but controlled agent histories and asks whether memory written under one model or embedding configuration can still support correct downstream answers after components are swapped.

Four memory representations are compared:

1. **LC-RAW** — raw interaction history retained directly.
2. **RAG** — chunked history retrieved through a vector index.
3. **NOTES** — free-form compressed notes written by a model.
4. **KG-fixed** — a fixed-schema subject–predicate–object representation.

The study separates the **writer** that constructs memory, the **reader** that consumes it, and the **embedder** used by vector retrieval. That separation matters because a model upgrade can change one or several of these identities at once.

The controlled dataset contains 48 synthetic histories with 160 exact-answer questions per history. Randomized identifiers are used to reduce contamination from pretrained knowledge, and the full histories fit within both tested reader context windows with headroom. The principal writer/reader models are Llama-3.1-8B-Instruct and Qwen2.5-7B-Instruct-1M. The embedding migration compares BAAI/bge-large-en v1.0 and v1.5; both emit 1024-dimensional vectors, which deliberately tests the false assumption that matching dimensions imply compatibility.

## Mechanism: Why Physical Durability Is Not Semantic Portability

A persistent memory object has at least two layers of identity:

- **physical representation identity** — files, notes, triples, chunks and vectors still exist;
- **semantic interpretation identity** — the current writer/reader/embedder stack still interprets and retrieves those stored facts in a sufficiently compatible way.

The experiment shows these can diverge. A byte-identical note store may behave differently when read by another model. A vector index may remain structurally valid while its vectors no longer inhabit the same semantic space as newly embedded queries. A fixed schema can remain comparatively stable when its stored facts are already normalized into representation slots, but that stability depends on the task and schema.

This means “memory survived the upgrade” cannot be proven by file existence, database integrity, vector dimension, or successful deserialization alone.

## Experimental Evidence

### Fixed-schema memory is highly portable in this workload

KG-fixed is nearly invariant to writer identity in the tested task. The aggregate writer effect is approximately `+0.0004 ± 0.0020`, with Llama and Qwen own/inherited accuracies remaining close to each other. This is the strongest portability result in the paper.

The bounded interpretation is not that knowledge graphs are universally portable. The schema is tailored to the synthetic workload and the access path differs from free-form notes. What the experiment does establish is that **explicit representation contracts can reduce model-specific interpretation drift when the required facts fit the schema**.

### Free-form NOTES show strong directional asymmetry

The most important result is hidden by symmetric averaging. When Llama reads its own NOTES the reported accuracy is about `0.3762`; when it inherits Qwen-written NOTES accuracy rises to about `0.4753`, a `+9.91` percentage-point change. In the opposite direction, Qwen drops from about `0.4719` on its own NOTES to `0.3391` on Llama-written NOTES, a `-13.28` point change.

Those directions partially cancel in a pooled symmetric statistic. The preregistered symmetric writer-swap hypothesis therefore is not supported even though one migration direction is materially harmful.

This is a direct warning for runtime migration gates: **compatibility is directional**. A→B passing does not imply B→A passing, and a mean across directions can erase the exact failure that matters operationally.

### Same vector dimension does not imply embedding compatibility

The paper compares a partial 50/50 mixed index with a full re-embedding migration. The mixed index captures only about `+4.96` points of an approximately `+11.90` point full-reembedding gain, leaving most of the achievable improvement unrealized. The preregistered comparison between full re-embedding and the mixed index is supported by a large margin; the reported estimate is about `+6.95` percentage points with Holm-adjusted significance.

The mechanism is straightforward: two embedding versions can return vectors with identical dimensions while mapping semantic neighborhoods differently. A mixed index therefore creates a structurally homogeneous but semantically heterogeneous search space.

For a runtime, **vector shape is a storage contract, not a semantic compatibility contract**.

### Failure localization separates write, retrieval and read losses

The study does not stop at end-task accuracy. It estimates where loss is introduced.

For NOTES, memory construction accounts for roughly `0.467 ± 0.014` of a pooled deficit near `0.584`, descriptively about 80% of the gap and still larger in the worst direction. Style-only rewrites do not repair the lost facts reliably and can remove identifiers.

For the simple RAG pipeline, retrieval contributes roughly `0.364 ± 0.012` of a deficit near `0.450`. When the correct stored chunks are supplied directly, answer accuracy rises into roughly the `0.88–0.95` range, showing that many failures occur before the reader sees the necessary evidence.

This supports a useful migration diagnostic: a failed memory test should distinguish **construction loss**, **retrieval/index loss**, and **reader interpretation loss** rather than treating all wrong answers as one generic “memory failure.”

## Recovery Evidence

The repair experiments compare retained raw source history with store-only recovery.

For NOTES, store-only repair does not reach the paper’s 90%, 95% or 99% recovery targets across the 48 histories. Retaining raw history creates a real recovery path, but the outcome is model-dependent: when Qwen repairs a Llama→Qwen migration, 34/48 histories reach 90%, 28/48 reach 95%, and 22/48 reach 99%; with Llama as the repairer, none reaches those targets.

For RAG, full re-embedding from retained raw content reaches the stated targets across all 48 histories in both directions, with very small normalized recovery cost in the experiment. KG-fixed rebuilding is likewise close to universal in this workload.

Two boundaries follow:

- retaining raw provenance/source material can make recovery possible;
- **having a recovery source is not itself proof that the chosen recovery procedure will succeed**.

A production system therefore needs to preserve both a recovery source and evidence that the current repair procedure is valid for the specific migration direction.

## Preregistered and Follow-up Evidence

The paper records a signed hypothesis lock before collection. Among the planned tests:

- a >5 point symmetric NOTES writer-swap penalty was **not** supported;
- full re-embedding beating a mixed index by >5 points was supported;
- a >5 point symmetric NOTES-versus-KG writer-swap difference was **not** supported;
- raw-history-assisted repair beating store-only at matched budgets by >5 points was supported.

The authors later run bootstrap analyses that lead to the same qualitative decisions, but they correctly identify this as follow-up because it was added after inspecting the original t-test results. The distinction is relevant to evidence grading: the main bounded conclusions do not need the follow-up analysis to stand.

## Migration Contract Suggested by the Evidence

The study supports treating a model or embedding upgrade as a memory migration, not as transparent continuity. A minimal migration evidence packet should identify at least:

### Representation identity

Memory format, schema version, chunking procedure, indexing procedure and any compression/writer prompt that materially shaped the stored representation.

### Producer and consumer identities

Writer model/version, reader model/version, embedding model/version and migration direction. Compatibility evidence should be directional rather than inferred from a symmetric average.

### Semantic probe set

A fixed, source-grounded test set that measures whether relevant facts are still retrieved and correctly interpreted after the migration. Storage checks alone are insufficient.

### Provenance and recoverability

A durable link from derived memory back to protected source material, where policy permits retention, plus a tested reconstruction/re-embedding procedure.

### Mixed-state prohibition or isolation

If old and new semantic indexes are incompatible, partial migration should not silently create one authoritative mixed store. The runtime should either complete the migration, isolate generations, or fail closed until compatibility is proven.

## Important Non-Findings and Contradictions

The source does **not** support several stronger claims:

- It does not show that all free-form notes fail across model changes; one migration direction improves.
- It does not show that all knowledge graphs are portable; the fixed schema is workload-specific.
- It does not show that retaining raw history guarantees recovery; repair is strongly model-dependent for NOTES.
- It does not show that a newer embedding is always better; it shows that mixing embedding spaces can be harmful and full re-embedding is the safer tested migration procedure.
- It does not justify replacing end-to-end evaluation with representation-level checks; the value of the diagnostics is to localize failure, not to eliminate task-level validation.

## Evidence Strength

The evidence is unusually useful for a migration-governance question because it is controlled, direction-aware, exact-answer scored, and explicitly separates write/read/embed identities. The primary study contains designed comparisons and recovery experiments rather than only observational anecdotes. It also preserves code/settings/model/tokenizer/random-seed and store-checksum information for auditability.

## Limits and Unknowns

- Histories are synthetic and structurally cleaner than enterprise digital-employee memory.
- Only one cross-family model pair under roughly 10B parameters is tested.
- The fixed KG schema is tailored to the task and should not be generalized to arbitrary semantic stores.
- RAG uses one deliberately simple chunk/retrieval pipeline without reranking or query rewriting.
- Repair success is model- and direction-dependent.
- The study focuses on semantic answer portability, not authorization, privacy, retention policy, multi-tenant leakage, transactionality or exactly-once side effects.
- Production memory may mix episodic state, credentials, preferences, procedural knowledge and external records whose migration requirements differ from the experiment.

## Unresolved Questions

1. What minimum semantic probe suite should a digital employee run before a new model version may inherit old long-term memory?
2. Should memory compatibility be certified per direction `(old stack → new stack)` rather than by a global memory-format label?
3. How should mixed old/new embeddings be quarantined or versioned during an online migration that cannot be completed atomically?
4. Which memory classes must retain source provenance, and which must be destructively summarized for privacy or policy reasons?
5. How should a runtime distinguish migration failure from ordinary model-capability regression?
6. When a memory representation is schema-bound, how should schema evolution itself be admitted and recovered?

## Reading Conclusion

The selected evidence supports a bounded conclusion: **durability admission and migration compatibility are different gates.** A memory store that physically survives a model or embedding upgrade should not automatically become authoritative memory for the new runtime. The migration needs direction-specific evidence that the new writer/reader/embedder stack still retrieves and interprets the stored facts correctly, with explicit provenance and a tested recovery route. Full re-embedding is required when embedding spaces change in this experiment; mixed indexes should not be treated as compatible merely because their dimensions match. Retaining raw source materially improves some recovery paths, but it does not substitute for proving the current repair procedure. Analysis may therefore treat memory inheritance as a governed migration transition while preserving the study’s synthetic-workload and model-pair limits.
