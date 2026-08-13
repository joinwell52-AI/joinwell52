# Publication Candidate Contract V2

## Compatibility

`runtime-publication-candidate/v2` applies to new automated Production from 2026-08-12. Historical `v1` batches and released articles remain valid, immutable records and are not upgraded in place.

## Purpose

Production converts eligible Research Objects into complete bilingual Research Center Editions after executing:

```text
Research question and evidence identities
→ Article-type identification
→ Dynamic module selection
→ Skill 05 Research Writing
→ Skill 06 Visualization
→ Skill 07 Evidence & Citation
→ Skill 08 Publication Editing
→ Six pre-publication gates
→ Publication Candidate
```

A candidate is complete release input, not an unfinished draft. Publication may release it but may not repair its research, evidence, structure, language, or editions.

## Canonical path

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

## Batch contract

```json
{
  "schema": "runtime-publication-candidate/v2",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "status": "Completed",
  "sourceTask": "Research Runtime Production",
  "sourceRecord": "research/runtime/records/daily/YYYY/MM/YYYY-MM-DD-daily-runtime.json",
  "updatedAt": "ISO-8601 timestamp",
  "githubCommit": "pending",
  "reason": "Exact English completion reason",
  "reason_zh": "准确的中文完成原因",
  "candidates": []
}
```

Zero-output `Completed` remains valid with an exact bilingual `No Eligible Research Object` reason. `Skipped` is reserved for an explicitly non-applicable shift that was not executed.

## Candidate entry

```json
{
  "column": "industry-architecture",
  "category": "daily",
  "itemId": "Q-...",
  "articleType": "research-brief",
  "researchQuestion": "What can the available evidence answer?",
  "title": "Research Center title",
  "title_zh": "Research Center 中文标题",
  "zhPath": "staging/publication-candidates/...zh.md",
  "enPath": "staging/publication-candidates/...en.md",
  "sections": [
    {
      "module": "what-changed",
      "heading": "What actually changed",
      "heading_zh": "真正发生了什么"
    },
    {
      "module": "what-remains-unclear",
      "heading": "What the release does not establish",
      "heading_zh": "这次发布尚未说明什么"
    }
  ],
  "endingModule": "what-remains-unclear",
  "evidenceClaims": [
    {
      "id": "C1",
      "identity": "source-reported-claim",
      "claim": "The source reports the bounded behavior.",
      "claim_zh": "来源方报告了该限定行为。",
      "source": "Stable source or repository evidence path",
      "strength": "reports",
      "independent": false
    }
  ],
  "projectRelevance": {
    "status": "none",
    "projects": [],
    "rationale": "The external argument is complete without first-party project mapping."
  },
  "communityEdition": {
    "decision": "not-generated",
    "rationale": "No community-specific angle adds value."
  },
  "gates": {
    "researchValue": "PASS",
    "independence": "PASS",
    "evidence": "PASS",
    "structure": "PASS",
    "language": "PASS",
    "bilingualConsistency": "PASS"
  },
  "coverPath": "staging/publication-candidates/...-cover.webp",
  "inlineFigures": [],
  "coverGate": "PASS",
  "inlineVisualGate": "PASS",
  "layoutGate": "PASS",
  "lifecycle": "Publication Candidate",
  "evidenceStatus": "Completed",
  "editingStatus": "Completed"
}
```

## Extensible type and module declarations

Registered types and modules are stored in `research/editorial/EDITORIAL-ARCHITECTURE.json`. A candidate may introduce a new type with:

```json
"articleTypeDefinition": {
  "purpose": "Why this type is distinct",
  "defaultProjectRole": "none"
}
```

A new module uses `moduleDefinitions` keyed by module ID. Extensions do not change the Runtime lifecycle.

## Dynamic section contract

- `sections[]` records the modules actually used and their natural bilingual headings.
- No universal section list or order is required.
- Every declared heading must appear in the matching article language.
- `endingModule` equals the last declared module and may be `limitations`, `what-remains-unclear`, or `open-questions`.
- Empty template sections and forced conclusions fail the Structure Gate.

## Evidence claim contract

Every material claim records a shared bilingual identity and strength. `internal-experimental-evidence` requires `independent=false`; `independent-evidence` requires `independent=true` and a named independent source.

Publication, DOI, Zenodo, indexing, citation, peer review, and formal release are status facts. They cannot be used to infer theory validation, academic endorsement, or general validity. Successful implementation remains bounded implementation evidence.

## Project relevance contract

Allowed statuses are:

- `none`;
- `research-object`;
- `case-evidence`;
- `substantive-relationship`.

If `status=none`, the article and any Community Edition must not insert TMPA, FCoP, or CodeFlowMu. A non-`project-research` article must pass the deletion test. Project names never appear solely for internal linking.

## Community Edition contract

`decision` is `generated`, `not-generated`, or `deferred`. A generated edition records:

```json
{
  "decision": "generated",
  "targetCommunity": "OpenAI Developer Community",
  "title": "Different community title",
  "title_zh": "不同的社区标题",
  "angle": "One community-relevant question",
  "discussionQuestion": "A concrete discussion question",
  "enPath": "staging/community-editions/...en.md",
  "zhPath": "staging/community-editions/...zh.md"
}
```

The title, angle, heading structure, and discussion question differ from the Research Center Edition. The body cannot be an identical copy, generic summary, or advertisement.

## Visual contract

The Article Cover and optional Inline Figures retain the V1.1 role separation and gates. Visuals do not determine article modules. `inlineFigures: []` is valid.

## Completion gate

A V2 candidate is complete only when:

- the research question, type, dynamic sections, evidence identities, and project relevance are declared;
- Chinese and English files exist and use `publication-candidate-article/v2` metadata;
- claim identity and strength are equivalent in both languages;
- all six editorial gates are `PASS`;
- the Article Cover, Inline Visual, and Layout Gates pass;
- any Community Edition is separately framed and machine-valid;
- the candidate is not yet in the public article directory.

The machine validator is `scripts/publication-editorial-validate.mjs`.

## Atomic commit gate

A new candidate is one indivisible commit bundle: the Chinese article, English article, dedicated cover, optional Inline Figures, and the completed same-date candidate-batch record. Production must build the bundle outside the canonical staging path, move all members into place together, stage them together, and run:

```text
npm run publication:bundle:staged
```

The repository pre-commit hook rejects a new candidate when its bilingual counterpart, referenced asset, or completed batch record is absent from the same Git index. Production must not bypass the hook, use `--no-verify`, split a candidate bundle by language, or write candidate members directly through the GitHub Contents API.

## Publication boundary

Publication may copy complete Research Center and authorized Community Edition artifacts to their target surfaces, update metadata and indexes, commit, verify, and release. It must return any failed candidate upstream and must not perform new research, substantive rewriting, evidence repair, type selection, module repair, or claim-strength repair.
