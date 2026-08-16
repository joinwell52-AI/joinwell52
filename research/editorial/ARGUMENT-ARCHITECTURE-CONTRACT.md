# Argument Architecture Contract V1

## Purpose

`argument-architecture/v1` records how a qualified Article Brief will move a reader from the opening problem to an evidence-bounded conclusion. It is not a fixed outline and is not a public article.

Canonical Production work path:

`research/runtime/production-work/YYYY/MM/DD/<itemId>/argument-architecture.json`

## Required shape

```json
{
  "schema": "argument-architecture/v1",
  "date": "YYYY-MM-DD",
  "itemId": "Q-...",
  "coreProposition": "Must exactly match the approved Article Brief proposition",
  "openingMove": {
    "type": "event | anomaly | contradiction | failure | question | bounded-judgment",
    "purpose": "Why this opening creates the reader's problem",
    "evidenceRefs": []
  },
  "argumentNodes": [
    {
      "nodeId": "A1",
      "question": "What question does this node answer?",
      "claim": "What bounded claim advances the article?",
      "evidenceRefs": [],
      "reasoningRole": "phenomenon | mechanism | comparison | evidence | counterargument | boundary | consequence | engineering-implication",
      "readerProgress": "What the reader can understand after this node",
      "visualNeed": "none | optional | material"
    }
  ],
  "counterpoint": {
    "required": true,
    "claim": "Strongest relevant counterpoint or alternative explanation",
    "responseBoundary": "What the available evidence can and cannot answer"
  },
  "endingStrategy": {
    "type": "judgment | limitation | open-question | implications | unresolved",
    "purpose": "What logical work the ending performs"
  }
}
```

## Rules

- A formal article requires at least two content-bearing argument nodes.
- `nodeId` values are unique within the article.
- Every node must advance the core proposition by adding evidence, reasoning, comparison, a boundary, a counterpoint, or a consequence.
- Nodes are not required to map one-to-one to Markdown sections.
- Registry modules remain semantic labels and research-side recommendations; they do not dictate the final heading sequence.
- The opening should establish Hook → Problem → Core Proposition within the opening portion of the article.
- A mechanical conclusion is not required. The ending may be a limitation, unresolved question or bounded judgment.
- Argument Architecture may reorganize Production presentation but must not change the Research Object's evidence identities or unsupported boundaries.