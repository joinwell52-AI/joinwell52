# Q-20260820-03 — Artifact versions should become visible only after atomic publication

- Runtime date: 2026-08-20
- Column: Open-source Engineering
- Source object: Q-20260820-03
- Primary source: https://github.com/google/adk-python/commit/94475c9a76c7c71246d6f5e4b083b3c3ee6869c0
- Evidence class: Fact for merged code/tests; maintainer claim where explicitly labeled; inference only where labeled
- Evidence level: merged_maintainer_change
- Stage: Skill 03 Deep Reading only

## Problem

A filesystem-backed artifact service must not let readers observe a version directory before both its payload and metadata are complete. The previous Google ADK `FileArtifactService` selected the next version by listing integer directories and then created the final version directory before writing its contents. That created two failure modes: concurrent writers could race for the same version, and an interrupted writer could leave an empty integer-named directory that version discovery treated as the newest published version. The merged change separates reservation/staging from publication.

## Facts

1. `_list_versions_on_disk` treats only directory names that parse as integers as published versions; non-integer names are skipped.
2. The new `_reserve_version_dir` creates the `versions` directory, reads currently visible integer versions and initially chooses one greater than the highest visible version, or zero when none exist.
3. Reservation is represented as a hidden `.{version}.pending` directory.
4. Reservation uses `staging_dir.mkdir()` without `exist_ok`, so concurrent writers trying to reserve the same number are serialized by the filesystem's directory-creation result; a `FileExistsError` advances the writer to the next number.
5. After successfully creating a pending directory, the implementation also checks whether the intended final integer version directory already exists. If it does, the just-created staging directory is removed and the writer advances to another version.
6. The extra final-name check protects a writer whose earlier version listing became stale before publication.
7. Payload content is written inside the pending directory, not the final integer directory.
8. Metadata is also written inside the pending directory after the payload path has been written.
9. Only after payload and metadata writes succeed does the service call `os.replace(staging_dir, version_dir)` to publish the complete directory under its visible integer name.
10. Any `BaseException` during staging removes the writer's own pending directory with `shutil.rmtree(..., ignore_errors=True)` and re-raises the failure.
11. Because pending directory names do not parse as integers, ordinary version discovery ignores them and readers do not treat them as completed versions.
12. The completed on-disk layout remains the same for readers: `versions/{version}/` contains the artifact payload and `metadata.json`.
13. The public artifact-service API is unchanged by the change.
14. A concurrency regression forces two saves to observe the same initial version list. Both complete with distinct versions `[0, 1]`, and both artifacts can subsequently be loaded with their correct content.
15. A failed metadata-write regression verifies that no published version becomes visible, loading returns no artifact and the failed writer's pending directory is removed.
16. A binary-payload regression verifies that binary bytes and MIME type survive the staging-and-publish path and no pending directory remains after successful completion.
17. An abandoned `.0.pending` regression verifies that a subsequent writer skips that reservation and publishes version `1`; the abandoned pending directory is intentionally left in place and is not returned by version discovery.
18. The commit explicitly changes the version-number contract: published versions are no longer guaranteed to be contiguous because an abandoned reservation can permanently hold a number.
19. A stale-version-list regression makes the writer initially believe no published version exists even though version `0` is already present. The new write publishes as version `1`, leaving version `0` unchanged.
20. The maintainer calls out Windows behavior specifically: replacing an existing directory is not relied upon; the implementation checks final-name existence so `os.replace` lands on a name that does not already exist.
21. The guarantee is explicitly limited to process-level faults. Exceptions or signals do not intentionally publish a partially staged version.
22. The implementation does not `fsync` the payload, metadata or parent directory.
23. Because there is no `fsync`, a power loss may make the rename durable before file contents are durable, potentially exposing an empty or incomplete final version after crash recovery.
24. The change does not repair integer version directories left empty by earlier releases.
25. There is deliberately no in-process sweep of pending directories because the process cannot safely distinguish an abandoned reservation from a slow concurrent writer.

## Maintainer claims

The maintainers describe the intended guarantee as publication atomicity against process-level interruption and concurrent saves: a version becomes reader-visible only after the complete staging directory is renamed into place. They explicitly exclude full power-loss durability because no `fsync` protocol is implemented, and they document non-contiguous version numbers as a behavior change. The implementation and regression tests directly support those bounded claims.

## Mechanisms

### Separate reservation identity from published identity

A pending directory owns a candidate version number without being discoverable as a published version. This creates a clean state transition: reserved/in-progress state has a different namespace from completed/readable state.

### Use filesystem create as the concurrency arbiter

Writers do not coordinate through an in-process mutex. They race on creation of the pending directory, and the filesystem permits only one writer to create a given path. Losing writers increment the number and try again. This allows concurrent saves to converge on distinct version reservations even when their initial version lists are identical.

### Stage complete payload and metadata before publication

Both payload and metadata live under the pending path until all writes succeed. Readers using integer-version discovery cannot observe that partially built tree.

### Publish by one rename

`os.replace(staging_dir, version_dir)` is the visibility transition. Under the filesystem assumptions used here, moving the completed directory to the integer name changes discovery from invisible to visible in one directory operation.

### Recheck stale destination identity

The reservation function checks whether the final integer directory already exists after obtaining the pending name. This prevents a writer with a stale initial version list from replacing or colliding with a version that became published concurrently.

### Fail by deleting staging, not repairing published state

Exceptions remove only the current writer's pending tree. The service does not create the final directory until publish time, so ordinary process exceptions do not require repairing a partially published integer directory.

### Prefer safety over contiguous numbering

An abandoned pending directory retains its number because reclaiming it could race with a slow live writer. The design accepts gaps in exchange for avoiding unsafe ownership assumptions.

## Evidence

- `_list_versions_on_disk` accepts only integer directory names, which makes `.{version}.pending` invisible to ordinary readers.
- `_reserve_version_dir` atomically creates a pending directory and advances on collision.
- The reservation path checks for an already-existing final directory before returning the candidate.
- `_save_artifact_sync` writes payload, then metadata, then performs `os.replace` from pending to final.
- The `BaseException` path removes the pending directory and re-raises.
- Regression tests cover concurrent writers, metadata-write failure, binary payload staging, abandoned reservations and stale version listings.
- The source comment documents pending-directory layout and the non-contiguous version property.
- The commit message explicitly documents the no-`fsync` power-loss boundary and the lack of migration repair for older empty version directories.

## Limitations

1. The atomicity claim depends on the semantics of directory creation and rename on the underlying filesystem; it is not a distributed transaction.
2. No `fsync` means the change does not guarantee crash-consistent durability across sudden power loss or storage-controller failure.
3. A pending directory abandoned by a killed process can remain indefinitely and permanently consume its version number.
4. There is no automatic garbage collection of abandoned pending reservations.
5. The implementation does not repair malformed or empty published integer directories created by older versions.
6. The design prevents the demonstrated same-artifact version race, but this note does not establish multi-artifact atomic commits.
7. `os.replace` behavior can vary across filesystems and mount boundaries; the source assumes staging and final paths are within the same version directory hierarchy.
8. Successful rename establishes visibility under the service's directory-discovery scheme; it does not prove that all lower-level bytes have reached durable storage.
9. Gapped version sequences are now valid. Downstream code that incorrectly assumed contiguity may need independent verification even though the public API is unchanged.

## Comparisons

- **Before:** the final integer directory was created first and then populated. A crash could therefore leave a directory that readers already considered published.
- **After:** the incomplete tree uses a non-version namespace and becomes an integer version only through the final rename.
- An in-process mutex could serialize writers in one process but would not address independent processes and would still leave the interrupted-publication problem unless staging were separated from visibility.
- Reusing an abandoned pending number would make version sequences prettier but would require reliable ownership/liveness detection. The merged design intentionally avoids that unsafe reclamation.
- A full durability protocol would additionally synchronize files and directory metadata before/after rename. The maintainers explicitly state that such `fsync` handling is outside this change.

## Unresolved questions

1. What filesystems and mount configurations are officially supported for the atomic-directory rename assumption?
2. Should operators receive tooling to identify and safely garbage-collect pending reservations after proving that no writer owns them?
3. Do consumers anywhere assume versions are contiguous rather than treating the returned/listed version IDs as opaque monotonically increasing identifiers with gaps?
4. Would a future durability mode add `fsync` for payload, metadata, staging directory and parent directory, and how would it be tested under crash injection?
5. How should old empty integer directories created by earlier releases be detected and quarantined without changing valid historical versions?
6. Is multi-process concurrent saving covered by dedicated tests in addition to the in-process threaded concurrency regression?
7. Could the same pending-to-rename publication pattern be factored into a reusable primitive for other filesystem-backed ADK state?

## Reading boundary

This note establishes a merged and tested `FileArtifactService` mechanism: each writer reserves a hidden pending version directory, stages payload and metadata there, publishes it under the visible integer version with one rename, removes failed staging state, tolerates concurrent writers and stale version lists, and intentionally permits gaps from abandoned reservations. The evidence proves process-level publication atomicity for the demonstrated filesystem model, not power-loss durability, distributed transactions, contiguous versioning or automatic recovery of old/abandoned state. Those broader judgments belong to Skill 04 Analysis.
