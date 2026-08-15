# Skill 06 — Research Visualization

## Purpose

Convert research structure and evidence into clear visual explanations without inventing data.

The visual is part of the research evidence surface. Treat composition, cropping, terminology and responsive rendering as publication requirements, not decoration.

## Mandatory visual-role separation

Every substantial Research Note must distinguish two different visual jobs:

1. **Article Cover** — an editorial title image that creates recognition, visual tension and a memorable concept before the reader enters the article;
2. **Inline Figure / In-article Figure** — an explanatory diagram, table, chart, workflow, lifecycle or architecture visual inserted where the article uses it to explain evidence or mechanism.

The same asset MUST NOT satisfy both roles.

A visual that requires the reader to inspect arrows, boxes, labels, legends, small text or state transitions in order to understand it is an **Inline Figure**, not an Article Cover.

## Visual package

Every Daily Research Note must include:

1. exactly one dedicated editorial Article Cover;
2. zero or more Inline Figures selected by explanatory need;
3. a meaningful comparison when multiple products, papers or mechanisms are discussed.

`Inline Figures: 0..N` is valid. Do not create a technical figure merely to satisfy an asset count. When a table or the prose already explains the mechanism clearly, an additional Inline Figure is unnecessary.

Use a numeric chart only when reliable quantitative data exists.

## Cover Gate — editorial title image

Default Daily Research Cover Direction:

```text
formal editorial technology cover with cinematic lighting,
controlled contrast, strong focal hierarchy,
one dominant visual metaphor, low information density,
professional research-publication tone
```

The cover is the page's first visual entrance. It should use light, space, subject and editorial metaphor to communicate the article theme before the reader enters the body.

The cover must communicate one strong concept at thumbnail scale. It is not responsible for explaining the complete mechanism.

A valid cover should:

- use one dominant semantic object, scene, tension or visual metaphor derived from the article;
- remain recognizable when reduced to a small card or feed thumbnail;
- communicate the article theme even if internal explanatory text is unreadable;
- use little or no text beyond a short title, kicker or single key phrase;
- prioritize composition, focal hierarchy, silhouette, contrast and editorial atmosphere over information density;
- feel like the opening image of a serious technology or research publication, not a slide, architecture chart or dashboard screenshot.
- establish a clear foreground/midground/background relationship or another strong spatial hierarchy;
- use controlled color and lighting rather than flat iconography or cartoon-like symbols.

The Article Cover is a generated raster editorial asset, not a code-drawn visual. Production persists the article-specific Cover Brief, while a separate isolated cover-worker invocation uses ChatGPT cloud built-in image generation and persists the accepted raster plus `cover-generation-receipt/v1`; neither path calls the OpenAI Image API or requires an API-key Secret. Production never invokes image generation from its Runtime conversation. If the isolated worker cannot produce a valid receipt and raster asset, Production cannot mark `coverGate` as `PASS` and must follow governed recovery/terminal policy rather than substituting a hand-authored SVG, CSS composition, diagram or icon card.

SVG remains valid for an Inline Figure when the article needs a precise explanatory diagram. It is forbidden as the page-level Article Cover.

A cover MUST be rejected when its primary composition is any of the following:

- boxes connected by arrows;
- a workflow or lifecycle diagram;
- an architecture stack or layer map;
- a comparison table or matrix;
- a labeled state machine;
- a dense node network;
- a technical figure whose meaning depends on reading multiple labels;
- a body figure enlarged and reused as the title image.

If the research proposition is itself architectural, translate it into an editorial visual metaphor for the cover and place the exact architecture diagram inside the article as an Inline Figure when the body needs it.

### Thumbnail acceptance test

Before approving a cover, render or inspect it at approximately `320px` wide.

Reject it if:

- the central idea disappears at thumbnail size;
- the reader must zoom or read small labels to understand the image;
- it looks primarily like documentation, a slide, a schematic or an internal engineering diagram;
- visual interest depends mainly on text rather than composition.

## Inline Figure Gate — explanatory visual

Inline Figures may use the full grammar of technical explanation:

- Architecture diagram: layers, responsibilities and interfaces;
- Workflow diagram: ordered work and decision stages;
- Lifecycle diagram: states, transitions and authority;
- Comparison table: products, mechanisms, scope and limitations;
- Timeline: version or industry evolution;
- Data table or chart: sourced measurements, counts or evaluation results.

Inline Figures should optimize for precision, traceability and explanatory value rather than cover-like visual impact. They must be inserted next to the argument they explain, followed by a matching caption and source statement, and remain readable on mobile screens.

## Source labels

Every visual must state one of:

- `Source: <identified source>`;
- `Sources: <identified sources>`;
- `Research Center synthesis based on cited official sources`;
- `Research Center architecture proposal`.

For an editorial cover, the source note may appear in article metadata or the visual manifest rather than as prominent text inside the artwork. Inline Figures must keep their source basis visible in the adjacent caption or figure content.

## Rules

- Do not create decorative charts from subjective scores.
- Do not convert qualitative comparisons into fake numerical precision.
- Do not copy a vendor diagram without permission or attribution.
- Prefer original diagrams that synthesize cited material.
- Keep visual terminology identical to the article terminology.
- Ensure diagrams remain readable on mobile screens.
- Never reuse an Inline Figure as the Article Cover merely because it already exists.
- Never create fixed Markdown sections named `## Cover`, `## Figure` or `## Visualization` merely to contain image assets.
- Never treat an Inline Figure as a second publication object; it is part of the article body.

## Article-cover workflow

1. Extract the article's single editorial proposition: what should the reader feel or recognize before reading, not what complete mechanism must be explained?
2. Choose one semantic object, scene or visual metaphor that embodies that proposition.
3. Choose a cover mode deliberately:
   - portrait editorial cover: `720×900` or `800×1040`;
   - landscape editorial cover: `1600×900`, `1376×768` or `960×600`;
   - do not mix portrait composition with a landscape canvas.
4. Write an article-cover brief with one positive physical/spatial visual scene plus complete editorial art direction. Keep negative constraints only in `reviewExclusions`; never append them to `sanitizedPrompt`. Persist the brief under the same-date Production-work path.
5. Hand exactly one persisted brief to a separate isolated cover-worker invocation. That worker may read only the brief, the Cover Generation Receipt V1 contract and destination metadata; it must not receive Runtime, recovery or batch context.
6. The isolated worker invokes ChatGPT cloud built-in image generation with exactly the positive `sanitizedPrompt`, inspects the generated image and performs bounded article-only retries when necessary.
7. The isolated worker runs the Thumbnail acceptance test and persists the accepted raster plus `cover-generation-receipt/v1`.
8. Production verifies the receipt, current brief hash, raster signature and accepted-asset hash, then copies the exact accepted bytes into the candidate cover path.
9. Render the actual article page and approve the cover only after responsive QA.

## Mandatory safe area

- Keep every title, number, logo, label, rule and explanatory line inside the central safe area.
- Reserve at least `8%` of canvas height at the top and bottom and `7.5%` of canvas width at the left and right.
- Decorative shapes may bleed. Semantic content may not bleed or touch the canvas edge.
- Never rely on CSS cropping to hide unfinished composition.
- Never position oversized letters partly outside the viewBox.
- Keep the lowest semantic text at least `10%` above the bottom edge because captions and browser scaling expose this region differently.

## Responsive acceptance gate

Render the complete article page, not the SVG alone, at all of these widths:

- desktop: `1440×900`;
- compact desktop/tablet: `1024×768`;
- mobile: `390×844`.

Reject and revise the visual if any of the following occurs:

- a title, number, icon or footer line is clipped;
- text crosses the image boundary or becomes hidden behind article metadata;
- the browser applies `object-fit: cover` to semantic content;
- portrait artwork is forced into a landscape crop;
- the visual requires zooming to understand its primary proposition;
- light and dark themes produce insufficient contrast.

Record the three rendered screenshots as visual QA evidence before publication.

## Anti-template rules

- Reject generic gradient cards, arbitrary grids, glowing orbs, circuitry, humanoid robots and decorative node networks unless the article's argument requires them.
- Do not use a giant acronym as the main image merely to fill space.
- Do not repeat one cover composition across unrelated articles by changing only the title and color.
- Prefer a distinctive semantic object derived from the article, but express it editorially on the cover rather than diagrammatically.
- Use Research Center typography and palette as constraints, then vary composition according to the research proposition.
- A responsibility boundary, evidence ledger, queue, lifecycle, handoff, control plane or runtime state may inspire the cover metaphor; the literal labeled diagram belongs inside the article.
