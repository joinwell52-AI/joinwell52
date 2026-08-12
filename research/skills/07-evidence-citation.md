# Skill 07 — Evidence & Citation V2

## Purpose

Make every material fact, claim, comparison, table, diagram, and conclusion traceable while keeping evidence identity, independence, and claim strength explicit.

## Citation requirements

- Cite primary sources close to supported claims.
- Preserve a complete, readable citation surface through references, footnotes, or equivalent source notes.
- Include title, publisher or organization, document type, stable URL, and publication/update date when available.
- Link tables and diagrams to their source basis.
- Never allow one citation to support a broader claim than the source establishes.

## Claim identity before prose

Assign every material claim one identity:

| Identity | Required treatment |
|---|---|
| `public-fact` | State only what is directly verifiable. |
| `source-reported-claim` | Attribute the claim to its source. |
| `our-observation` | Identify the observing process and scope. |
| `our-interpretation` | Use inference language and preserve alternatives. |
| `internal-experimental-evidence` | Name the first-party environment and say that it is not independent. |
| `independent-evidence` | Name the independent actor and exact reproduced, tested, criticized, or adopted claim. |
| `hypothesis` | State the testable proposition and missing evidence. |
| `open-question` | Do not convert the question into a conclusion. |

## Non-equivalence gate

Enforce all five:

```text
Publication ≠ Validation
Citation ≠ Endorsement
Peer Review ≠ Proof
Self-reported Evidence ≠ Independent Evidence
Implementation Success ≠ General Validity
```

DOI and Zenodo facts normally establish persistent identity, stable citation, discoverability, and version traceability. They do not establish correctness, peer review, academic recognition, or independent validation.

## Language calibration

Allowed strength is defined per evidence identity in `research/editorial/EDITORIAL-ARCHITECTURE.json`. Avoid `proves`, `validates the theory`, `confirms general validity`, `已证明`, `已验证该理论`, and `获得学术认可` unless the evidence supports that exact narrowly defined statement.

Preferred bounded forms include:

- `The official documentation states...`;
- `The source reports...`;
- `We observed in this implementation...`;
- `This internal evidence supports bounded feasibility but is not independent validation.`;
- `The Research Center interprets this as...`;
- `Available evidence does not establish...`;
- `This remains to be independently validated.`

## Table evidence

Each material comparison cell identifies whether it is a documented capability, visible implementation, reported result, internal observation, independent evidence, Research Center interpretation, or unknown information.

## Rules

- Never fabricate a source, date, metric, quotation, reproduction, adoption, or independent actor.
- Do not cite a secondary article when an accessible primary source exists.
- Vendor performance claims remain vendor claims unless independent evidence examines the same claim.
- First-party project, experiment, evaluation, and implementation records remain internal evidence unless a third party is responsible for the evidence.
- Broken or inaccessible references must be replaced, bounded, or returned upstream before publication.
