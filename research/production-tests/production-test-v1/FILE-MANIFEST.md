# Research OS Engine Production Test V1 — File Manifest

This manifest freezes the publication package presented to the release gate.

## Counts

- Daily research objects: 3
- Academic research objects: 3
- English Research Notes: 6
- Simplified Chinese Research Notes: 6
- Dedicated cover assets: 6
- Production governance records: 4, including this manifest
- Files added before the pull request: 22
- Existing files modified or deleted: 0

## Research Notes

### English

1. `docs/en/digital-employee/2026-08-02-computer-use-action-state-loop.md`
2. `docs/en/digital-employee/2026-08-02-osworld-execution-verification.md`
3. `docs/en/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md`
4. `docs/en/industry/2026-08-02-nist-ai-rmf-operating-loop.md`
5. `docs/en/engineering/2026-08-02-manager-handoff-ownership-models.md`
6. `docs/en/engineering/2026-08-02-swe-bench-verified-quality.md`

### Simplified Chinese

1. `docs/zh/digital-employee/2026-08-02-computer-use-action-state-loop.md`
2. `docs/zh/digital-employee/2026-08-02-osworld-execution-verification.md`
3. `docs/zh/industry/2026-08-02-a2a-mcp-interoperability-boundaries.md`
4. `docs/zh/industry/2026-08-02-nist-ai-rmf-operating-loop.md`
5. `docs/zh/engineering/2026-08-02-manager-handoff-ownership-models.md`
6. `docs/zh/engineering/2026-08-02-swe-bench-verified-quality.md`

## Covers

1. `docs/public/assets/covers/daily-computer-use-loop.svg`
2. `docs/public/assets/covers/daily-a2a-mcp-boundaries.svg`
3. `docs/public/assets/covers/daily-manager-handoff.svg`
4. `docs/public/assets/covers/academic-osworld.svg`
5. `docs/public/assets/covers/academic-nist-ai-rmf.svg`
6. `docs/public/assets/covers/academic-swe-bench-verified.svg`

## Production records

1. `research/production-tests/production-test-v1/QUEUE.md`
2. `research/production-tests/production-test-v1/RUNTIME-RECORD.md`
3. `research/production-tests/production-test-v1/REPORT.md`
4. `research/production-tests/production-test-v1/FILE-MANIFEST.md`

## Release rule

The manifest is accepted only if the pull-request changed-file list matches these 22 additive files and the VitePress site build passes.