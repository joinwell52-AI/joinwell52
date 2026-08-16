# Figure Plan Contract V1

## Purpose

`article-figure-plan/v1` decides visual work before prose production completes. Visuals are part of the argument, not decoration.

Canonical path:

`research/runtime/production-work/YYYY/MM/DD/<itemId>/figure-plan.json`

## Required shape

```json
{
  "schema": "article-figure-plan/v1",
  "date": "YYYY-MM-DD",
  "itemId": "Q-...",
  "cover": {
    "coreProposition": "Approved Article Brief proposition",
    "visualMetaphor": "One article-level editorial metaphor",
    "semanticObject": "Dominant visual subject",
    "compositionIntent": "Landscape editorial composition intent",
    "mustNotShow": []
  },
  "inlineFigures": [
    {
      "figureId": "F1",
      "argumentNodeId": "A2",
      "purpose": "What understanding this figure improves",
      "visualType": "architecture | workflow | mechanism | comparison | timeline | lifecycle | evidence-map | quantitative-chart",
      "proposition": "What the visual itself explains",
      "sourceBasis": [],
      "mustShow": [],
      "mustNotShow": [],
      "productionMethod": "svg | html | table | chart | generated-image",
      "captionIntent": "What the adjacent bilingual caption must establish",
      "required": true
    }
  ]
}
```

## Visual Argument Gate

Every Inline Figure must bind to an existing `argumentNodeId`. If no argument node needs a visual, `inlineFigures: []` is valid and preferred over manufactured decoration.

Use the deletion test: if removing a proposed figure does not materially increase the difficulty of understanding its argument node, the figure is normally unnecessary.

## Production method

Prefer deterministic visuals for exact relationships:

- architecture, workflow, lifecycle, mechanism, evidence map → SVG or deterministic renderer;
- strict text comparisons → HTML/table;
- quantitative chart → only from reliable sourced numerical data;
- generated image → editorial metaphor or a genuinely visual conceptual explanation.

The Article Cover remains a separate editorial role. It must never be reused as an Inline Figure, and a technical diagram must never be promoted into the cover merely because it already exists.

## Consistency

Figure terminology, proposition, caption, source basis and article terminology must agree in Chinese and English. Figure order in the candidate must agree with this plan.