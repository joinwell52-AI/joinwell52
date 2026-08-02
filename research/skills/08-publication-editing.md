# Skill 08 — Publication Editing

## Purpose

Apply the final quality gate before a Research Note is committed and published.

## Required checks

### Research

- source discovery completed;
- relevance decision recorded;
- primary sources read;
- fact, vendor claim and inference separated;
- at least one clear research judgment present.

### Writing

- required metadata is valid;
- Summary, Source, Observation, Discussion, Engineering Impact, Future Work and References are present;
- title and summary accurately represent the article;
- Chinese and English versions preserve the same substance.

### Visuals

- article cover exists;
- at least one meaningful diagram, table or structured visual exists for substantial notes;
- visual labels and terminology match the article;
- every visual has a source note;
- no invented quantitative data is used.

### Evidence

- major factual statements are traceable;
- references are complete and accessible;
- tables and diagrams identify their evidence basis;
- uncertainty and limitations are visible.

### Publishing

- `column + category + date` are valid;
- article paths are correct;
- website build succeeds;
- changes enter Git history;
- no manual count or chronological list is edited;
- TMPA publication content is not changed from the Research Notes workflow.

## Release decision

```text
PASS
  all required checks satisfied

NEEDS REVISION
  content is useful but one or more required checks fail

REJECT
  weak relevance, insufficient evidence, fabricated data or unsupported conclusions
```

No Git commit means no official delivery.
