# WP-13 Multi-Agent Fact-Check Case

This directory records the publication mapping for the WP-13 field case added by TMPA Implementation Case I0.5. The complete byte-preserved evidence package is published at:

`docs/public/evidence/tmpa/i0.5/wp13-multi-agent-fact-check-publication-evidence-v3.zip`

Outer SHA-256:

`5b5eda3034c822f13421783244b1d0c76a9fa79950bfad0ce61bb8d2e404131c`

## Bounded Claim

The case demonstrates that PM did not convert a completion-meaning subexecution summary into authoritative delivery when exit status, tests, commit, and formal report evidence were unavailable. DEV later completed the same task, and role-separated QA reported 27/27 tests passing with typecheck and diff checks at exit code 0.

The case does not claim elimination of model hallucinations, full TMPA Core S0.4 product conformance, third-party independent validation, runtime authentication of the DEV/QA reports, or terminal lifecycle closure within the evidence snapshot.

## Conformance Treatment

The case strengthens author-produced demonstrated evidence related to C04, C06, C07, C09, and C13. It does not execute a new canonical product-reader criterion, so the I0.4 product verdict baseline is preserved unchanged in I0.5.

Machine-readable boundaries and criterion contributions are recorded in `case-result.json`.
