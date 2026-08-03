# Skill 06 — Research Visualization

## Purpose

Convert research structure and evidence into clear visual explanations without inventing data.

The visual is part of the research evidence surface. Treat composition, cropping, terminology and responsive rendering as publication requirements, not decoration.

## Minimum visual package

Every substantial Research Note should include:

1. one article cover;
2. one architecture, workflow, lifecycle or relationship diagram;
3. one comparison table when multiple products, papers or mechanisms are discussed.

Use a numeric chart only when reliable quantitative data exists.

## Visual types

- Architecture diagram: layers, responsibilities and interfaces;
- Workflow diagram: ordered work and decision stages;
- Lifecycle diagram: states, transitions and authority;
- Comparison table: products, mechanisms, scope and limitations;
- Timeline: version or industry evolution;
- Data table or chart: sourced measurements, counts or evaluation results.

## Source labels

Every visual must state one of:

- `Source: <identified source>`;
- `Sources: <identified sources>`;
- `Research Center synthesis based on cited official sources`;
- `Research Center architecture proposal`.

## Rules

- Do not create decorative charts from subjective scores.
- Do not convert qualitative comparisons into fake numerical precision.
- Do not copy a vendor diagram without permission or attribution.
- Prefer original diagrams that synthesize cited material.
- Keep visual terminology identical to the article terminology.
- Ensure diagrams remain readable on mobile screens.

## Article-cover workflow

1. Extract the article's single visual proposition: what relationship, boundary, process or claim should the reader understand before reading?
2. Choose a cover mode deliberately:
   - portrait editorial cover: `720×900` or `800×1040`;
   - landscape editorial cover: `1600×900`, `1376×768` or `960×600`;
   - do not mix portrait composition with a landscape canvas.
3. Write a visual brief before drawing: proposition, semantic object, hierarchy, palette, exact text, language and intended canvas.
4. Build one coherent visual system. Use shared geometry, stroke hierarchy and spacing; do not assemble unrelated AI-style decorations.
5. Render the actual article page and approve the cover only after responsive QA.

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
- Prefer a distinctive semantic object derived from the article: responsibility boundary, evidence ledger, queue, lifecycle, handoff, control plane or runtime state.
- Use Research Center typography and palette as constraints, then vary composition according to the research proposition.
