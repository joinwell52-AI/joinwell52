# Publication Candidate Contract V2.1

## Compatibility

The canonical machine schema remains `runtime-publication-candidate/v2` so historical V2 batches remain valid and immutable. Editorial Architecture 2.1 requirements apply only to new automated Production on or after `2026-08-17`.

Historical V1/V2 candidates are not upgraded in place. The already-produced 2026-08-16 batch remains governed by the prior V2 contract because its 15:00 Production completed before this upgrade was merged.

## Purpose

Production converts eligible Research Objects into complete bilingual Research Center Editions through an explicit editorial-planning pipeline:

```text
Research Object
→ Article Brief
→ Editorial Value Gate
→ Argument Architecture
→ Figure Plan
→ Research Writing
→ Evidence & Citation
→ Visual Production
→ Narrative / Editorial Review
→ Publication Candidate
```

A candidate is complete release input, not an unfinished draft. Publication may release it but may not repair research, evidence, structure, narrative, language or editions.

## Canonical batch path

`research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json`

## Candidate planning evidence

For Production dates on or after 2026-08-17 every non-zero candidate records:

```json
{
  "articleBriefPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../article-brief.json",
  "argumentArchitecturePath": "research/runtime/production-work/YYYY/MM/DD/Q-.../argument-architecture.json",
  "figurePlanPath": "research/runtime/production-work/YYYY/MM/DD/Q-.../figure-plan.json"
}
```

The three artifacts must use the same run date and item ID as the candidate.

`articleBriefPath` must resolve to `article-brief/v1` with `editorialDecision=PASS`.

`argumentArchitecturePath` must resolve to `argument-architecture/v1`, have the same `coreProposition` as the Article Brief, and contain at least two unique content-bearing `argumentNodes[]`.

`figurePlanPath` must resolve to `article-figure-plan/v1`. Every planned Inline Figure must bind to a real argument node. `inlineFigures: []` is valid.

## Candidate entry additions

Existing V2 fields remain. New candidates additionally record:

```json
{
  "articleBriefPath": ".../article-brief.json",
  "argumentArchitecturePath": ".../argument-architecture.json",
  "figurePlanPath": ".../figure-plan.json",
  "coreProposition": "One approved evidence-bounded proposition",
  "gates": {
    "editorialValue": "PASS",
    "researchValue": "PASS",
    "independence": "PASS",
    "evidence": "PASS",
    "structure": "PASS",
    "narrative": "PASS",
    "language": "PASS",
    "bilingualConsistency": "PASS",
    "visualArgument": "PASS"
  }
}
```

Existing `coverGate`, `inlineVisualGate` and `layoutGate` remain required.

## Dynamic section contract

`sections[]` records the semantic modules actually used and their natural bilingual headings. Analysis `selected_modules` are research-side recommendations, not a final table of contents. Production may reorganize presentation as long as evidence identity, research judgment and unsupported boundaries are unchanged.

No universal section list or order is required. Empty template sections and forced conclusions fail Structure or Narrative Gate.

## Argument contract

The Article Brief and Argument Architecture define the article's single core proposition and reasoning progression. Final Markdown headings do not need to map one-to-one to argument nodes.

Each major passage should add evidence, reasoning, comparison, a boundary, a counterpoint, a consequence or reader progress. Narrative Gate rejects semantic repetition, generic opening language used in place of an actual problem, and endings that merely repeat the introduction.

## Evidence claim contract

Every material claim records a shared bilingual identity and strength. `internal-experimental-evidence` requires `independent=false`; `independent-evidence` requires `independent=true` and a named independent source.

Publication, DOI, Zenodo, indexing, citation, peer review, and formal release are status facts. They cannot infer theory validation, academic endorsement, or general validity. Successful implementation remains bounded implementation evidence.

## Project relevance contract

Allowed statuses remain `none`, `research-object`, `case-evidence`, and `substantive-relationship`.

For non-project research, the deletion test now has two parts: removing first-party project names must not collapse the argument and must not remove the article's independent value to its target reader.

## Visual contract

The Article Cover and Inline Figures retain strict role separation.

Every new Inline Figure must be declared in `figure-plan.json` and bind to an `argumentNodeId`. Candidate `inlineFigures[]` may not contain orphan visuals. Zero Inline Figures is valid when no argument node materially benefits from visual explanation.

Prefer deterministic SVG/HTML/table rendering for exact structures and generated imagery for editorial metaphor. Quantitative charts require reliable sourced numerical data.

For Production dates on or after 2026-08-15, every candidate still has a same-date canonical PNG baseline cover before Production can complete. The optional 16:00 Cover Upgrade remains non-blocking and may replace only the existing canonical cover path after semantic review.

## Community Edition contract

Existing V2 Community Edition rules remain unchanged: a generated edition must use a named target community, different title, angle, structure and discussion question, and must not be an identical copy or advertisement.

## Completion gate

A new Editorial Architecture 2.1 candidate is complete only when:

- all three planning artifacts exist and are internally consistent;
- Article Brief passes Editorial Value Gate;
- Argument Architecture contains a single proposition and valid reasoning nodes;
- Figure Plan contains only valid argument-bound visuals;
- Chinese and English files exist and preserve the same proposition, evidence strength, reasoning sequence, uncertainty and figure order;
- all nine editorial gates are `PASS`;
- Cover, Inline Visual and Layout gates pass;
- the candidate is not yet in the public article directory.

The machine validator remains `scripts/publication-editorial-validate.mjs` plus the date-gated `scripts/publication-editorial-v21-validate.mjs`. Validators enforce structural facts while semantic quality judgments remain the Production Agent's persisted gate results.

## Atomic commit gate

A new candidate remains one indivisible bundle: Chinese article, English article, deterministic baseline PNG, optional Inline Figures, three required planning artifacts, and the completed same-date candidate batch record.

Production must stage the bundle together and run `npm run publication:bundle:staged`. Do not bypass hooks or split a candidate by language or planning artifact.

## Publication boundary

Publication reads the complete validated candidate and current canonical cover path. It may copy authorized artifacts to release surfaces, update metadata and indexes, commit, verify and release. It must return failed candidates upstream and must not perform new research, substantive rewriting, narrative repair, evidence repair, type selection or claim-strength repair.
