# Article Brief Contract V1

## Purpose

`article-brief/v1` is the first Production planning artifact. It decides whether a completed Research Object should become a publication and states the reader value before prose is written.

It is stored at:

`research/runtime/production-work/YYYY/MM/DD/<itemId>/article-brief.json`

It is Production evidence, not a public article and not a new Runtime stage.

## Required shape

```json
{
  "schema": "article-brief/v1",
  "date": "YYYY-MM-DD",
  "itemId": "Q-...",
  "researchObjectId": "...",
  "targetAudience": {
    "primary": "Specific professional reader",
    "knowledgeAssumption": "What the reader is expected to know",
    "readerProblem": "Why this reader needs the article"
  },
  "whyNow": "Why the topic is materially worth publishing now",
  "externalHook": {
    "type": "event | anomaly | contradiction | engineering-problem | question | judgment",
    "description": "Evidence-bounded opening opportunity",
    "evidenceRefs": []
  },
  "coreProposition": "One evidence-bounded sentence that the article will argue",
  "originalValue": {
    "type": "new-analysis | synthesis | comparison | model | engineering-judgment | case-inference",
    "description": "What the article adds beyond source restatement"
  },
  "readerTakeaway": "What a qualified reader should understand after reading",
  "evidenceBoundary": {
    "supported": [],
    "unsupported": [],
    "uncertain": []
  },
  "firstPartyRole": {
    "status": "none | research-object | case-evidence | substantive-relationship",
    "rationale": "Why first-party work is or is not relevant"
  },
  "recommendedArticleType": "technical-analysis",
  "editorialDecision": "PASS | DOWNGRADE | REJECT",
  "decisionReason": "Exact bounded reason"
}
```

## Editorial Value Gate

Before article drafting, Production must decide `PASS`, `DOWNGRADE`, or `REJECT`.

`PASS` requires a specific audience, a real reader problem, a single supportable core proposition, sufficient evidence, and original analysis or substantial synthesis beyond the source material.

`DOWNGRADE` means the evidence or maturity does not justify the intended article type but a bounded `research-note` remains useful. Production must update the brief and re-run the gate before drafting.

`REJECT` means no formal candidate is produced for the item. The Research Object remains valid research evidence. Daily publication volume is never a reason to override a rejection.

## Independence test

For non-project research, remove TMPA, FCoP, CodeFlowMu and other first-party project names mentally. The remaining proposition and reader value must still stand. Internal linking, promotion and project visibility are not editorial value.

## Rule

The Research Object is the factual and analytical input. The Article Brief is the editorial qualification layer. It may narrow framing, audience and article type, but it must not invent research claims or raise evidence strength.