# Skill 06 — Research Visualization V2.1

## Purpose

Convert research structure and evidence into clear visual explanations without inventing data. Visuals are part of the argument, not decoration.

## Mandatory visual-role separation

Every substantial Research Note distinguishes two visual jobs:

1. **Article Cover** — editorial title image that creates recognition, visual tension and a memorable concept before the reader enters the article;
2. **Inline Figure** — explanatory diagram, table, chart, workflow, lifecycle or architecture visual inserted where the article uses it to explain evidence or mechanism.

The same asset MUST NOT satisfy both roles.

## Figure Plan authority

For Editorial Architecture 2.1 Production, visual work consumes `article-figure-plan/v1`. Every Inline Figure must declare:

- `figureId`;
- `argumentNodeId`;
- `purpose`;
- `visualType`;
- `proposition`;
- `sourceBasis`;
- `productionMethod`;
- `captionIntent`.

The referenced `argumentNodeId` must exist in the same article's `argument-architecture/v1`.

`inlineFigures: []` is valid. Never create a figure merely to satisfy an asset count.

## Visual Argument Gate

Before approving an Inline Figure, ask:

> If this figure were removed, would understanding its bound argument node become materially harder?

If not, normally delete the figure.

Reject:

- decorative AI imagery inside the article;
- orphan figures with no argument-node binding;
- repeated diagrams that add no explanatory value beyond nearby prose;
- fake quantitative precision;
- copied vendor diagrams without permission or attribution.

## Production method selection

Use deterministic visuals when exact relationships matter:

- architecture, workflow, lifecycle, mechanism, state transition, evidence map → SVG or deterministic renderer;
- strict textual comparison → HTML/table;
- quantitative chart → only with reliable sourced numerical data;
- generated image → editorial metaphor or genuinely visual conceptual explanation.

Principle:

`Precise relationship → deterministic visual`

`Editorial metaphor → generated visual`

## Article Cover

The cover communicates one strong article-level concept at thumbnail scale. It is not responsible for explaining the complete mechanism.

A valid cover should use one dominant semantic object, scene, tension or visual metaphor derived from the approved Article Brief and Figure Plan. It should remain recognizable near 320px width, use little or no text, and feel like the opening image of a serious technology publication rather than a slide or dashboard.

Reject covers whose primary composition is boxes and arrows, workflow diagrams, architecture stacks, comparison tables, state machines, dense node networks or enlarged body figures.

The 15:00 Production baseline remains a deterministic PNG produced by `scripts/generate-baseline-cover.mjs`. It guarantees a complete candidate and is not judged by high-end generated-illustration standards.

The separate 16:00 Cover Upgrade remains optional and non-blocking. Its article-specific brief should inherit the approved `coreProposition`, `visualMetaphor`, `semanticObject`, `compositionIntent` and exclusions from Production planning rather than reinterpreting the Runtime prompt.

## Inline Figure gate

Inline Figures may use the full grammar of technical explanation:

- architecture diagram;
- workflow diagram;
- lifecycle diagram;
- mechanism diagram;
- comparison table;
- timeline;
- evidence map;
- sourced data chart.

Each figure is inserted next to the reasoning node it explains, followed by a matching bilingual caption and source statement. Terminology must match the article and remain readable on mobile screens.

## Source labels

Every visual must state one of:

- `Source: <identified source>`;
- `Sources: <identified sources>`;
- `Research Center synthesis based on cited official sources`;
- `Research Center architecture proposal`.

For an editorial cover, the source note may appear in metadata or the visual manifest. Inline Figures keep source basis visible in the adjacent caption or figure content.

## Safe area and responsive gate

Keep semantic content inside the existing safe-area rules and validate complete article rendering at:

- 1440×900;
- 1024×768;
- 390×844.

Reject clipping, unreadable semantic text, incorrect object-fit cropping, insufficient contrast or figures that require zooming to understand their primary proposition.

## Anti-template rules

Reject generic gradient cards, arbitrary grids, glowing orbs, circuitry, humanoid robots and decorative node networks unless the article's argument specifically requires them. Do not repeat one cover composition across unrelated articles by changing only title and color.

A responsibility boundary, evidence ledger, queue, lifecycle, handoff, control plane or runtime state may inspire the cover metaphor; the literal labeled diagram belongs inside the article when its argument node needs it.
