# Skill 03 — Deep Reading

## Purpose

Read selected material deeply enough to identify facts, claims, mechanisms, limitations and unresolved questions.

## Reading procedure

1. Read the complete primary source, not only the headline or abstract.
2. Identify the product or research problem being addressed.
3. Extract the architecture, workflow, lifecycle, authority and evaluation mechanisms.
4. Compare the new material with earlier versions and similar systems.
5. Mark unsupported promotional claims and missing evidence.
6. Record relevant quotations only when necessary and within citation limits.

## Evidence classes

```text
Fact
  directly stated and verifiable from the source

Vendor Claim
  reported by the vendor but not independently validated

Research Result
  supported by an identified method, dataset or experiment

Inference
  analysis made by the Research Center from multiple sources

Unknown
  not established by available evidence
```

## Output

```yaml
reading_notes:
  problem:
  facts:
  vendor_claims:
  mechanisms:
  evidence:
  limitations:
  comparisons:
  unresolved_questions:
```

## Rule

Do not convert a vendor claim into an independent fact. Do not infer implementation details that the source does not disclose.
