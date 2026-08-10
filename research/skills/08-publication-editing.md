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

- a dedicated editorial Article Cover exists;
- the Article Cover passes Skill 06 Cover Gate and remains meaningful at thumbnail scale;
- the cover communicates one strong editorial proposition without requiring the reader to inspect small labels, arrows, legends or state transitions;
- a cover whose primary composition is a workflow, lifecycle, architecture stack, state machine, comparison table, dense node graph or other explanatory schematic is **NEEDS REVISION**;
- at least one meaningful Article Figure, table or structured visual exists for substantial notes;
- the Article Cover and Article Figure are separate assets and the same visual is not reused to satisfy both requirements;
- explanatory Figures may contain technical labels, arrows and structural detail, but must be readable and evidence-traceable;
- visual labels and terminology match the article;
- every visual has a source note or an equivalent visual-manifest source record;
- no invented quantitative data is used;
- desktop, compact-desktop/tablet and mobile rendering have passed visual QA.

### Cover Gate

PASS only when all are true:

1. the image works as a title image before the article is read;
2. it has a clear focal hierarchy and one dominant semantic object, scene or visual metaphor;
3. it remains recognizable at approximately `320px` wide;
4. its meaning does not depend on reading multiple internal labels;
5. it is visually distinct from the explanatory body Figure.

If any of these fail, the publication candidate must return to Visualization for a new cover. Do not promote a body diagram into the cover slot as a shortcut.

### Figure Gate

PASS only when substantial technical claims that benefit from visual explanation have an appropriate body Figure, table or structured visual with a clear evidence basis.

A precise body Figure does not compensate for a weak cover, and an attractive cover does not compensate for a missing explanatory Figure.

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
