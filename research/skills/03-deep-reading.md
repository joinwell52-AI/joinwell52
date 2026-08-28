# Skill 03 — Deep Reading

## Purpose

Read selected material deeply enough to answer the **research problem**, not merely summarize the source event that triggered it.

Deep Reading must identify facts, failures, findings, mechanisms, limitations, comparisons and unresolved questions relevant to governed digital employees and multi-agent systems.

## Input boundary

Consume only Queue-selected Research Objects that passed Skill 02 admission.

If the selected object is actually only a Release, changelog, routine commit or announcement with no independent research question, return it upstream as an admission defect instead of turning it into an update summary.

## Reading procedure

1. Restate the selected research question without relying on a vendor/version name.
2. Read the complete primary material, not only the headline, release note, abstract or vendor summary.
3. Identify the underlying problem being addressed.
4. Extract architecture, workflow, lifecycle, identity, authority, task ownership, evidence, recovery and evaluation mechanisms where relevant.
5. Identify observed failures, regressions, negative results and known limitations.
6. Extract measured findings, benchmark results or reproducible observations.
7. Follow implementation, issue, benchmark, paper, specification or incident evidence needed to understand the mechanism.
8. Compare with at least one relevant alternative sample or prior Research Object when the research question is general rather than system-specific.
9. Mark unsupported promotional claims and missing evidence.
10. Preserve contradictions and counterexamples instead of forcing consensus.

## Research-value extraction

Every Reading Result should answer as many of these as the evidence supports:

### Failure
What failed, became unsafe, scaled poorly, deadlocked, leaked authority, duplicated effects or produced misleading completion evidence?

### Finding
What did the source actually discover or measure?

### Mechanism
What concrete design caused, prevented or mitigated the behavior?

### Implication
What general question does this raise for governed digital employees? Keep implications bounded; Analysis owns the final judgment.

## Cross-sample rule

A product/platform event may be the starting evidence, but a general research question should not remain trapped inside that product.

Examples:

- delegation authority → compare more than one delegation model when possible;
- checkpoint/recovery → distinguish state restoration from authority restoration;
- human approval → compare what object/occurrence the approval binds to;
- A2A/interoperability → examine task, identity, credential, artifact and responsibility boundaries;
- multi-agent coordination → look for topology, resource-contention or failure evidence beyond a single framework.

If no comparison evidence is available, record that limitation explicitly.

## Evidence classes

```text
Fact
  directly stated and verifiable from the source

Vendor Claim
  reported by a vendor but not independently validated

Research Result
  supported by an identified method, dataset, benchmark or experiment

Reproducible Engineering Evidence
  supported by implementation, test, issue reproduction, trace or incident evidence

Inference
  analysis made by the Research Center from evidence

Unknown
  not established by available evidence
```

## Output

```yaml
reading_notes:
  research_question:
  research_themes:
  samples:
  problem:
  facts:
  vendor_claims:
  failures:
  findings:
  mechanisms:
  evidence:
  comparisons:
  contradictions:
  limitations:
  unresolved_questions:
```

## Hard rules

- Do not convert a vendor claim into an independent fact.
- Do not infer implementation details that the source does not disclose.
- Do not write a “what changed in version X” summary as the Reading Result.
- A Release note may identify evidence, but the underlying mechanism and research problem are the object of reading.
- Preserve negative evidence and failed mechanisms; they are first-class research value.
