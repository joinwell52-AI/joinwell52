---
title: Credential, concurrency and recovery experiments — evidence guide
date: 2026-09-10
---

# Credential, concurrency and recovery experiments

These are first-party controlled experiments against pinned upstream source, not independent QA or whole-product tests. The public package includes the original probe harnesses, two saved rounds, immutable source URLs and SHA-256 identities.

| Suite | Observation | Boundary |
| --- | --- | --- |
| OpenHands | Claude file callbacks 4→0 and child credential-blob variables 0→4; Codex 4→1 and 0→3 | Original extracted methods and startup slice; fixture provider identity and file callbacks; real Python child with synthetic values; no ACP handshake |
| AG2 | Two-loop local peaks 2/1→1/1, aggregate 3→2 | Original admission method; real threads/loops and waiting synthetic subtasks; five trials per configuration per round |
| Orca | Divergent-index requests: 200→1 at 10ms and 10→3 at 16s | Complete recovery/lookup source modules with store/time/PTY fixtures; no Electron or production crash reproduction |
| Paperclip | Kill request returns before observed exit | One real harmless Node child; no descendant or tool-effect claim |

[Public package](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope) · [Pinned source identities](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/sources/code-manifest.json) · [Detailed method and controls in Chinese](/zh/research/evidence/2026-09-10-authority-scope)

## Reproduction

Fetch this package, run `node fetch-pinned.mjs`, then run the relevant probe with a fresh output number:

```text
python probe-ag2.py 3
python probe-openhands.py 3
node probe-orca.mjs 3
node probe-paperclip.mjs 3
```

The measured interpreters were Python 3.10 and Node 24.16.0. The fetcher verifies the exact source hashes before execution. Upstream source is downloaded from its original repository, not redistributed here. Matplotlib and Pillow are required only for chart generation.

Saved [AG2](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/ag2-1.json), [OpenHands](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/openhands-1.json), [Orca](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/orca-1.json) and [Paperclip](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-10-authority-scope/runs/paperclip-1.json) observations each have a matching second-round file. Do not replace historical rounds while reproducing. Fixed versions and constructed conditions define the supported scope; a current PR may subsequently change.
