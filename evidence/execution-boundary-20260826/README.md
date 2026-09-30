# Execution Boundary Four Cases — Public Sanitized Data Package

Version: 2026-08-26-public-v1

This package is a sanitized, public summary of four CodeFlowMu engineering case studies. It lets readers check every cited count against its test scope and stated limitations. It is not a source-code release, a security audit, an uptime report, or a raw runtime-log export.

## Files

- `cases.csv` — one row per case with aggregate observations and evidence limits.
- `summary.json` — machine-readable form of the same aggregate facts.

## Sanitization

Removed: task contents, prompts, personal identities, absolute paths, process identifiers, credentials, raw logs, private source code, and private-evidence locations. Case labels A1–A4 replace internal identifiers.

## Reading rule

Each pass count belongs only to its named test collection. Counts must not be added into a single success rate. A passing result supports only the checked command, environment, or snapshot; it does not establish system-wide reliability or security.

## Source boundary

The underlying first-party evidence remains access-restricted. This public package preserves the article-facing aggregation, chronology class, test scope, and unsupported-claim boundaries, but it is not independently replayable evidence.
