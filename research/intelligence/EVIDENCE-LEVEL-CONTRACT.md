# Research Intelligence Evidence-Level Contract

Status: Active  
Applies to: `research/intelligence/runs/**/**/**-intelligence.json`

Every Signal `evidenceLevel` MUST use exactly one value registered in `research/intelligence/REGISTRY.json`:

- `official_announcement`
- `official_documentation`
- `official_staff_confirmation`
- `peer_reviewed_or_primary_research`
- `merged_maintainer_change`
- `reproducible_community_report`
- `unverified_discussion`

## Write-time rule

Discovery MUST validate every Signal against the Registry enum before committing the Intelligence Run. A descriptive alias is not a valid value, even when its meaning appears obvious.

Examples of forbidden aliases:

- `official_release_changelog` — use `official_announcement` for an official release note or changelog.
- `primary_research_preprint` — use `peer_reviewed_or_primary_research` for an arXiv or other primary research preprint.

An invalid value MUST block the Discovery result commit. It must not be deferred until the VitePress / Pages build.

## Incident record

On 2026-08-09, one official changelog Signal and four primary-research preprint Signals used descriptive aliases rather than Registry values. The five values were canonicalized before Queue triage, and the one-time repair workflow was removed immediately after verification.
