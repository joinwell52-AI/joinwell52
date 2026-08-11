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

### Article Layout Gate

The rendered candidate must read as a finished research publication in this order:

```text
top editorial cover
title and lead
article body
contextual Inline Figures and tables
references
```

The candidate is **NEEDS REVISION** when `## Cover`, `## Figure`, `## Visualization`, `## 题图`, `## 文中图` or `## 解释图` exists merely as an image container. The Article Cover is a page-level publication element, and Inline Figures belong beside the argument they explain.

### Visuals

- a dedicated editorial Article Cover exists;
- the Article Cover passes Skill 06 Cover Gate and remains meaningful at thumbnail scale;
- the cover communicates one strong editorial proposition without requiring the reader to inspect small labels, arrows, legends or state transitions;
- a cover whose primary composition is a workflow, lifecycle, architecture stack, state machine, comparison table, dense node graph or other explanatory schematic is **NEEDS REVISION**;
- Inline Figures are optional (`0..N`) and are generated only when the article benefits from visual explanation;
- the Article Cover and every Inline Figure are separate assets and the same visual is not reused to satisfy both roles;
- Inline Figures may contain technical labels, arrows and structural detail, but must be readable and evidence-traceable;
- every Inline Figure is placed near the relevant argument and has a matching caption and source statement;
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
5. it is visually distinct from every explanatory Inline Figure.

If any of these fail, the publication candidate must return to Visualization for a new cover. Do not promote a body diagram into the cover slot as a shortcut.

### Inline Figure Gate

PASS when either:

1. no Inline Figure is needed and the article records that decision; or
2. each required Inline Figure is contextually placed, captioned, source-labeled, terminology-consistent and readable at the required page widths.

A precise Inline Figure does not compensate for a weak cover, and an attractive cover does not compensate for missing visual explanation when the argument genuinely requires it.

### Evidence

- major factual statements are traceable;
- references are complete and accessible;
- tables and diagrams identify their evidence basis;
- uncertainty and limitations are visible.

### Publishing

- `column + category + date` are valid;
- article paths are correct;
- website build succeeds;
- the static Article Layout Validator passes;
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
