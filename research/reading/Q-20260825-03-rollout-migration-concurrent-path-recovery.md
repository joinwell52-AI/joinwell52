# Q-20260825-03 — Startup Rollout Migration Must Rediscover Paths Under Concurrent Mutation

- Runtime date: 2026-08-25 (Asia/Shanghai)
- Queue signal: SIG-20260825-010
- Primary source: https://github.com/openai/codex/commit/465eafacbc2db4ff828cd6d18ed8f25d22e48f53
- Evidence level: `merged_maintainer_change`
- Scope: Codex startup rollout migration, writer-lock contention, archive/compression path movement, busy retry and terminal-failure cursor behavior

## Problem

Startup migration inspects rollout files while other Codex processes can still create, write, archive or compress those same rollouts. A path discovered before lock acquisition can become stale, and a rollout that appears empty before an active writer finishes can be permanently skipped if the migration treats the first observation as final.

## Facts

The selected Codex change represents migration input paths as either a fresh-discovery mode or a known set and adds rediscovery helpers rather than assuming a rollout remains at the path first observed.

If reading the SessionMeta line fails with `NotFound` after discovery, migration looks up the rollout again and retries against its current path. This covers location/suffix changes caused by archive or compression activity.

For an apparently empty rollout in apply mode, migration acquires the writer lock and rereads while holding that lock. This distinguishes a truly empty rollout from one whose writer had created the path but had not yet made SessionMeta durable at the first read.

Writer-lock conflict is treated as a busy outcome rather than a permanent migration failure. Busy rollouts remain eligible for retry on a later startup because the writer may disappear or finish.

The patch also handles a second race: a path can move after SessionMeta was read but before the migration obtains the lock. After lock acquisition, if the path no longer exists, the code rediscovers the current rollout path before proceeding.

Startup bookkeeping keeps busy and terminal failures distinct. Busy work is retried, while ordinary terminal failures remain skipped until a deliberate/manual migration retry and do not hold back the migration cursor indefinitely.

## Vendor Claims

The maintainer change describes hardening startup rollout migration against concurrent updates. The lock-aware reread, path rediscovery, busy retry and failure-classification changes directly support that bounded claim.

## Mechanisms

1. **Rediscoverable path identity:** migration can resolve a rollout's current path rather than binding correctness to a stale filename discovered earlier.
2. **Lock-aware empty check:** apply-mode migration rereads an apparently empty rollout under the writer lock before deciding there is nothing to migrate.
3. **Busy as recoverable state:** lock contention is classified for later retry instead of being converted into a permanent skip.
4. **Post-lock path verification:** migration rechecks path existence after acquiring authority and rediscovers if archive/compression moved the file in the meantime.
5. **Startup retry bookkeeping:** prior busy rollouts are explicitly reconsidered on subsequent startup.
6. **Terminal-failure separation:** permanent failures do not block the global cursor forever, but they remain recorded and require explicit retry rather than being silently forgotten.
7. **Concurrency-focused regression coverage:** the change includes scenarios for active writers, maintenance contention, path movement, busy retries and permanent failure handling.

## Evidence

Primary evidence is merged maintainer commit `465eafacbc2db4ff828cd6d18ed8f25d22e48f53` in `openai/codex`.

The patch introduces rollout path discovery/rediscovery structure, performs writer-lock rereads for empty candidates, retries current-path lookup on `NotFound`, and carries busy migration records forward for later startup attempts.

Tests described in the change cover writer-owned empty rollouts, maintenance contention, rollouts moved by archive/compression, retry of busy records and terminal-failure skip behavior.

## Limitations

This is local/startup migration hardening for Codex rollout files. It is not a generic distributed migration protocol and does not establish consensus or distributed locking across arbitrary storage systems.

Path rediscovery depends on the repository's rollout identity/discovery conventions. It does not guarantee that arbitrary rename patterns outside those conventions can be recovered.

A busy outcome means “retry later,” not “migration completed.” Progress therefore still depends on a later startup or an explicit recovery opportunity.

Terminal failures are prevented from indefinitely blocking the cursor, but that does not repair the failed rollout; operator/manual retry can still be required.

The change protects migration coordination around the demonstrated file lifecycle. It does not imply transactional rollback of unrelated filesystem or external side effects.

## Comparisons

A naive migration treats discovery as a snapshot: find a path, inspect it once, then act. Under concurrent archive/compression/writer activity, that snapshot becomes stale before authority is obtained. The hardened path instead treats discovery as provisional and validates the resource again at the point where migration owns the writer lock.

This is a useful runtime pattern for mutable file-backed work: identity should survive path movement, and observations made before lock acquisition must be revalidated after authority is obtained.

## Unresolved Questions

- Is rollout identity stable enough to detect every supported archive/compression transition without accidental cross-file matching?
- How long can a rollout remain busy before operators need explicit visibility or escalation?
- Can terminal failures expose structured reasons and a safe targeted retry command rather than relying on broad manual migration?
- Are there additional races between post-lock migration writes and later maintenance operations that need the same rediscovery discipline?

## Reading Conclusion

The selected Codex change hardens startup rollout migration by treating pre-lock path and emptiness observations as provisional. It rereads under writer authority, rediscovers rollouts when archive/compression moves them, retries lock-busy cases on later startup and separates recoverable busy state from terminal failure. The defensible conclusion is concurrency-safe recovery for the demonstrated local rollout migration lifecycle, not general distributed transaction safety.
