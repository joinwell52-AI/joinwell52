# Skill 06 — Research Visualization V2.2

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

A valid cover uses one dominant semantic object, scene, tension or visual metaphor derived from the approved Article Brief and `figure-plan.json#cover`. It must remain recognizable near 320px width, use no readable body text, and feel like the opening image of a serious technology publication rather than a slide, dashboard or generic diagram.

Reject covers whose primary composition is boxes-and-arrows documentation, architecture stacks, comparison tables, state machines, dense node networks, flat bar-chart furniture or enlarged body figures.

### 15:00 Production premium baseline standard

The 15:00 Production baseline remains deterministic and non-cloud so Production can finish reliably, but **it is no longer a low-aesthetic placeholder**. `scripts/generate-baseline-cover.mjs` must render a `1600×900` premium editorial raster using the same visual family expected from high-quality generated covers.

The baseline visual family is:

- deep navy / indigo background with restrained vignette and generous negative space;
- one article-specific hero metaphor, not a generic chart;
- translucent glass-like panels, bounded frames, gates, attached modules, trajectories or evidence branches only when they express the article's own proposition;
- thin cyan / blue luminous structure with at most one controlled secondary accent such as violet, teal or amber;
- subtle bloom, depth, sparse particles and perspective guides; no noisy decoration;
- no title text, labels, logos, monitoring widgets or fake metrics inside the raster;
- clear foreground/background hierarchy and a composition that still reads when displayed as a small card cover.

The deterministic generator must preferentially consume this same item's `figure-plan.json#cover.visualMetaphor`, `semanticObject` and `compositionIntent`. Title and column identity are fallback inputs only. Two unrelated articles must not receive the same composition with only a color change.

At minimum the generator must distinguish semantic composition families such as:

- foreground completion vs continuing owned work → terminal/path composition;
- copied configuration vs singular live identity → layered-copy-to-core composition;
- permission/authority bound to an attachment or scope → attached-authority composition;
- multiple causal hypotheses/evidence paths → branching-evidence composition;
- queue/claim/handoff/lease transfer → handoff composition.

A baseline that degrades to the old pattern of **three flat vertical blocks plus a circle/ball and a diagonal line** is visually insufficient even if it is technically a valid PNG. Likewise reject arbitrary glowing orbs, bars or grids that do not encode the article's approved metaphor.

The separate 16:00 Cover Upgrade remains optional and non-blocking. It should inherit the same visual family and the approved `coreProposition`, `visualMetaphor`, `semanticObject`, `compositionIntent` and exclusions from Production planning, while using richer image-generation capability when available. The 16:00 worker is an enhancement, not permission for the 15:00 baseline to be ugly.

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
