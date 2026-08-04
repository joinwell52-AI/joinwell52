# Research Intelligence Runs

Daily files in this directory are generated or initialized by:

```bash
node scripts/research-intelligence.mjs initialize --date YYYY-MM-DD
```

A newly initialized file remains `Waiting`. The Research Runtime Queue worker must replace waiting counts and decisions with actual scan coverage, signals, triage outcomes and the verified GitHub commit.

Never backfill a run as `Completed` merely because the Queue task executed. Coverage and three-column decisions are required.
