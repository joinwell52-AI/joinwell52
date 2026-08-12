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

## Reader-facing evidence labels

The stable English identities above are machine-facing schema values. Do not expose them to general readers as unexplained internal codes.

- In Chinese articles, show a plain-language Chinese label first and keep the schema value secondary when useful: `公开一手事实（public-fact）`, `来源陈述（source-reported-claim）`, `本次观察（our-observation）`, `研究解释（our-interpretation）`, `内部实验依据（internal-experimental-evidence）`, `独立证据（independent-evidence）`, `待验证假设（hypothesis）`, `开放问题（open-question）`.
- In English articles, use the readable English name first; a schema value is optional and must not be the only explanation.
- The first evidence legend in an article must explain the practical meaning and boundary, not merely repeat a type name.
- `public-fact` from a project's own public repository is a public primary-source fact, not independent evidence. Say so when independence matters.
- Keep internal claim identifiers such as `E1` or `H1` in Candidate metadata, audit records, or optional footnotes by default. Do not place them in general-reader prose unless repeated cross-reference is genuinely necessary.
- Prefer one reader-facing section named `证据与引用` / `Evidence and sources`. Explain directly what the source shows, what it does not establish, and what the article proposes testing. Label linked material by its actual role when useful: source material that directly supports a fact, contextual reference material, first-party evidence, or independent evidence. Do not call every citation a primary source or direct evidence; a plain `参考资料` / `References` label is sufficient when the distinction is not needed at that point.

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
