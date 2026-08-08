# Runtime Projection Contract V1.0

Status: Active  
Applies to: Research Runtime Center V5 daily operations page and its date-switchable history view  
Authoritative facts: `research/runtime/records/**` and `research/intelligence/runs/**`

## Purpose

The Runtime UI is a projection of durable Runtime facts, not an independent state store. A shift is not considered publicly represented correctly merely because its JSON was committed. The visible bilingual page, historical replay, build output and deployed site must preserve the same facts.

## 1. Bilingual completeness

For `runtime-shift-result/v2`, the visible fields are:

- Input
- Work Result
- Output
- Next
- Metrics
- Evidence
- Artifacts

If a durable top-level localized field such as `input_zh`, `workResult_zh`, `output_zh` or `next_zh` exists, the projection MUST preserve it exactly. It MUST NOT be replaced by the English sibling during build or live refresh.

For structured V2 objects that do not contain a dedicated localized prose field, the Chinese UI MUST render a deterministic structural Chinese summary rather than silently falling back to an English instruction or serializing the object.

`[object Object]` and raw JSON object dumps are invalid UI projection results.

## 2. Date isolation

The Runtime page is time-addressable through `?date=YYYY-MM-DD`.

For a selected date X:

- Daily Runtime facts MUST come from date X.
- Research Intelligence column decisions MUST come from date X.
- Shift results, Metrics, Evidence and Artifacts MUST come from date X.
- Missing historical data MUST NOT fall back to today's record.
- Duplicate Runtime records for the same family and date are invalid.

## 3. Live versus historical behavior

Live refresh is allowed only when `selectedDate === today`.

Historical dates are replay views. They must remain bound to the frozen generated records for the selected date and must not be overwritten by current-day network refreshes.

## 4. Source preservation

Projection code may normalize representation for readability, but it MUST NOT mutate the authoritative Runtime JSON. In particular:

- source `*_zh` fields are preserved;
- source status is preserved;
- source Metrics values are preserved;
- Evidence and Artifact targets are preserved;
- structured facts may be summarized for display without changing their source objects.

## 5. Build gate

`npm run docs:build` MUST execute the Runtime Projection Contract verifier.

The verifier checks at minimum:

1. every V2 visible field becomes readable text;
2. durable localized fields survive projection exactly;
3. Metrics, Evidence and Artifacts are projected into displayable objects;
4. historical Runtime dates are unique;
5. Research Intelligence historical map keys match each run's own date;
6. Chinese and English Runtime content both exist in the built site;
7. intelligence-source detail routes exist in both languages;
8. legacy Runtime history invariants remain valid.

A failed contract check blocks Pages publication.

## 6. Deployment completion

A page change is complete only when all of the following are true:

`main commit → Runtime projection gate → VitePress build → generated-site verification → gh-pages publish → deployed artifact verification`

A source commit without successful Pages deployment is not a completed public-page change.

## 7. Intelligence source detail projection

The Runtime Intelligence Radar links to the readable bilingual source-detail table rather than directly exposing raw Registry JSON as the primary human interface.

The source list itself remains governed by:

`research/intelligence/REGISTRY.json`

The readable table is a presentation layer over that Registry and must not become an independent Watchlist.
