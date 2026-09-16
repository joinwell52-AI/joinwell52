# Current context: bounded engineering experiments, 2026-09-16

Seven radar groups were checked against 17 primary PRs/commits. Eight experimental topics produced seven probe programs and three bilingual articles. These are controlled observations, not production incident rates. Formal CodeFlowMu development reviews: zero; no corresponding local defect or unmet requirement was established sufficiently to justify product changes.

See [source registry](sources.json), [source classification](01-source-audit.md), [methods and limitations](02-experiments.md), and [saved observations](results/).

## Reproduce

Requirements: Node 24, Python 3, Git, tar, pnpm. The original execution used Node 24.16.0, pnpm 11.19.0 and esbuild 0.21.5. No model API or real credentials.

Run from this directory:

```sh
npm install --ignore-scripts
node fetch-sources.mjs
cd external/openai-agents-js-1938-head
pnpm install --filter @openai/agents-core... --ignore-scripts --frozen-lockfile
cd ../..
node replay.mjs
```

Downloads use immutable SHAs. Foreign agent instruction symlinks are not required by these probes. No upstream application or install lifecycle scripts are launched. The SDK dependencies are installed from its pinned lockfile. The probes operate on isolated synthetic data; credential files are created in a fresh temporary directory.

`replay.mjs` writes new results under ignored `replay-results/` and compares JSON observations with the committed results. The source hashes in `source-hashes.json` identify the files actually consumed. If an upstream service no longer serves a fixed object, fetching can fail; do not silently substitute a new version.

To repeat the separately recorded upstream SDK check, from its head directory:

```sh
pnpm exec vitest run --project @openai/agents-core packages/agents-core/test/run.outputGuardrailReplaySession.test.ts --maxWorkers=1
```

Actual observed result: one file, 71 tests passed. This is neither the whole upstream suite nor a number to add to the 32 custom SDK observations.

## Interpret the controls correctly

- SDK: candidate source, with only guardrails.ts replaced by the exact predecessor for the control. This was the PR's only changed production module.
- Orca: complete original module vs a deliberate generation-check ablation, **not a historical production version**.
- Credentials: complete candidate wrapper vs raw JSON persistence. Synthetic strings only; no real ACPX process, cross-seat exploit, shell snapshot or credential rotation.
- Blocked ownership: unchanged prefixes of three recovery functions through their first issue write, plus the complete notification function. Database and wake collaborators record calls; no full recovery service or board queue.
- Superset: original resolver and flag functions with controlled filesystem, clock and API collaborators. It selects a host; it does not create a paid cloud instance.
- Binary: complete byte codec, not an upload authorization/storage/deletion test.
- Anywhere: complete original Python modules. Review structure matching is not proof of dispatcher recovery or review completion.

The strongest new follow-up questions concern the identity of an answer being revalidated, the caller-owned identity changes entering a request scope, and responsibility for legacy session-file cleanup. None is presented as an already-proven product vulnerability.
