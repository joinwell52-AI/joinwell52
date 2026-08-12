# Editorial Architecture V2 regression

This prospective regression re-runs the V2 editorial selection logic against the three most recent 2026-08-11 Research Objects without modifying their published or archived V1 articles.

The fixtures test three distinct article types and module sequences:

1. external-industry Research Brief with no first-party project reference and an independently reframed Community Edition;
2. open-source Technical Analysis that ends with an unresolved mechanism;
3. general Engineering Insight that distinguishes source-reported behavior from explicitly internal operational evidence and ends with limitations.

The manifest also contains positive and negative bilingual claim-language cases for DOI, Zenodo, publication, and peer-review status. Run:

```bash
npm run publication:editorial:validate
```

These are test artifacts, not release candidates and not public articles.
