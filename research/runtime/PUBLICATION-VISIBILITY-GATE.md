# Publication Visibility Gate V1.0 — Public Discoverability Delivery Gate

**Effective date:** 2026-08-09  
**Applies to:** Research Report Production Engine V2.0 / Runtime Center V5.0  
**Purpose:** prevent a state where the backend reports a successful publication but users cannot find the released articles.

## 1. Publication completion semantics

A `Completed` Publication work result no longer means public delivery is complete. Public delivery requires the entire chain:

```text
Publication Result Completed
→ Release Manifest = Released
→ bilingual source articles exist
→ bilingual VitePress article routes are generated
→ Research indexes can discover every released item
→ matching column indexes can discover every released item
→ required cover / visualization assets exist
→ Pages Build succeeds
→ Publication Visibility Gate PASS
→ Publish gh-pages
→ GitHub Pages deployment succeeds
```

If any gate fails, `gh-pages` must not be updated.

## 2. Visibility Gate

Authoritative checker:

```text
scripts/publication-visibility.mjs
```

It reads the latest formal manifest:

```text
research/runtime/releases/YYYY-MM-DD-publication.json
```

For each `releasedItems[]` entry it verifies:

- Chinese source exists;
- English source exists;
- Chinese public HTML route exists;
- English public HTML route exists;
- `/zh/research/` and `/en/research/` discover the article;
- the matching Digital Employee / Industry Architecture / Open-source Engineering column index discovers the article;
- the manifest-declared cover exists.

If this gate fails, Pages Verify fails and `Publish gh-pages branch` is skipped.

## 3. Today's releases surface

The Observation Notes index includes `TodayPublished`. Same-day formal `category: daily` articles are promoted into a dedicated Today's Releases surface containing the date, release count, column, title, summary and direct article route.

The historical list remains newest-first, but same-day delivery no longer depends on a user manually finding an item in history.

## 4. First production validation — 2026-08-09

The first Visibility Gate run intentionally blocked deployment because its initial checker assumed the wrong VitePress clean-URL artifact shape (`slug/index.html`). The site actually uses `cleanUrls: true` and emits `slug.html`. The gate was corrected to inspect the real build contract.

Pages Run #235 then passed the full chain:

```text
Build VitePress site: success
Verify generated site: success
Publication Visibility Gate: PASS
Publish gh-pages branch: success
```

The gate reported:

```text
PASS 2026-08-09: 3 released items are routable and discoverable in both languages.
```

The deployed Chinese Observation Notes index visibly shows `Today's releases / 今日发布` with all three same-day articles.

## 5. Invariant

> **An article that cannot be found through an official public entry point is not a completed public delivery.**

This invariant is a first-class Research Report Production Engine V2.0 production constraint alongside ordered Runtime gates, Running leases and completion-driven reconciliation.
