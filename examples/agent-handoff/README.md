# TMPA Agent Handoff Demo

This executable demo reconstructs the same delivery twice:

1. the developer submits a result and reviews its own `done` claim;
2. an independent QA actor reviews and accepts the delivery.

Run it from the repository root:

```bash
npm ci
npm run demo
```

For machine-readable output:

```bash
npm run demo -- --json
```

The first case is rejected with `SOD_VIOLATION` and remains in `review`. The second becomes authoritative, accepted, and `done`. Both cases contain the same agent claim; the governance evidence is what changes the result.

The demo uses the public TMPA Core S1.0 Reference Reader. It is illustrative reference behavior, not a claim about independent certification or the unpublished full CodeFlowMu product.
