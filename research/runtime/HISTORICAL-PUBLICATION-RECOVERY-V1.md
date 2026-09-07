# Explicit historical Publication recovery

An owner-requested release of an already completed prior-date candidate batch may
use `runtime-publication-historical-recovery/v1`. This is a manual recovery of the
original publication shift, not a timer wake, date migration or new Production run.

Persist a request under `research/runtime/publication-recovery-requests/` with
`date`, `source=manual-recovery`, `requestMode=terminal-recovery`,
`allowTerminalReopen=true`, `requestedAt`, `reason`, `sourceCommit`, current
`promptIdentity`, `candidateBatchSha256`, and `wakeReceipt`. The wake records the
actual date/time and `recoveryRuntimeDate` identifies the prior date. Both request
and wake must be fetched from main before admission.

`scripts/runtime-publication-historical.mjs --request <path>` checks current
Scheduler/Control/Prompt identity, every required source, prior-date ordering,
Completed and GitHub-verified Production, exact candidate batch bytes, no parallel
active worker, and current recovery/time limits. It may reopen Waiting, Blocked
or Failed Publication, but never Completed. It persists an actual-time Execution
Slot Opened and Worker Claimed bound to the request and wake. Preserve old terminal
events and commits. Never backdate events or change candidate dates.

Fetch and verify that claim before releasing. Pass the same request as
`--recovery-request` to `runtime-publication-release-current.mjs`; it rechecks the
request, source identities, freshness and exact durable claim. The stable
Publication execution request may carry `recoveryRequest`; the Actions bridge
passes it through and uses `allow_historical=true` for finalization.

All existing Publication editorial, evidence, bilingual, build, asset and deployed
visibility gates remain mandatory. No new research, rewriting, date relabeling or
Community Edition authorization is granted. After release, finalize and verify
the original runtime date through the normal Shift Finalization path.
