---
title: "Evidence: read effects and acceptance order"
outline: deep
---

<ArticleTableScroll language="en" />

# Companion evidence: read effects and acceptance order

Status: authorized by the user for bilingual publication on September 6, 2026. This is research evidence, not product safety acceptance or independent QA.

## Claim mapping

| Claim | Record set | Scope |
|---|---|---|
| GET changes fixture business state; redirects change the request chain | observations.json / http / H0–H3 | Deliberately constructed loopback service, not a third-party incident |
| Separate processes exchange a synthetic marker through a shared service | H4, H5 | Channel existence, not autonomous collusion or tenant access control |
| Native gate allows shell GET but requires approval for POST | G1, G2, G6 | Fixed function followed by real loopback curl, not a full Host session |
| Role capabilities reject unregistered tools and absent capabilities | G3–G5 | Inner-policy ALLOW alone does not establish reachability |
| Replay order changes the transparent reducer's result | observations.json / order / O0–O6 | Two rounds of forced ordering and fresh-process disk reads, not race frequency |
| Formal commands and roles already have relevant checks | baseline-1.log, baseline-2.log | 31 unit/contract tests per round, not release acceptance |

## Reading the ordering experiment

- O0–O6 use equally authoritative inputs within one experimental scope, not a real business authorization service or a cross-user privilege hierarchy.
- The Chinese article translates output `allow / deny / unknown` as 允许 / 禁止 / 未知 and input `revoke` as 撤销. Observation values are unchanged.
- Both readers filter unaccepted input in O4. Unknown in O5/O6 follows our invalid-sequence rule, not Codex's legacy compatibility behavior.
- The cutoff uses acceptance sequence; it does not validate all timestamp, visibility, or access-control boundaries in a real system.
- The bilingual editorial revision on September 6, 2026 adds no experiments and changes no raw observations. The 14 ordering observations and 31 existing tests per round remain tied to the September 5 baseline.

## Check and rerun commands

`node check.mjs` checks exported observations, controls, repeatability, and the file manifest. It does not rerun product code or certify safety.

`node probe-order.mjs` independently reruns the ordering fixture with Node, writing local fixtures/runs. It invokes neither a model nor a real business authorization service.

`probe-http.mjs` is the actual probe with its hardcoded product root replaced by the `CODEFLOWMU_SOURCE_ROOT` environment variable. Running it requires authorized access to the fixed CodeFlowMu source, its existing tsx loader, and Windows curl.exe. This package does not duplicate product source. Invoke Node with `--import` pointing to that environment's tsx loader. The server binds only to 127.0.0.1 and mutates only synthetic fixture state.

Without the product source, readers can check exported observations and rerun the standalone ordering experiment, but cannot claim to have rerun the Native gate.

## Version, de-identification, and revisions

- Fixed commit: `c008d9db91a21136fc61a4f60314e22db395d5d2`; file hashes appear in observations.json.
- Both rounds of all 13 HTTP/gate scenarios and seven ordering scenarios are retained. Forty observations are not an accuracy score.
- Temporary paths, ports, PIDs, and full context objects are removed. Distinct-process evidence is retained as a boolean. Raw JSON hashes map provenance but do not reconstruct unpublished inputs.
- The first HTTP launch failed on Windows ESM import syntax before any experiment ran; a file URL corrected the launcher.
- An early G6 wrote G1's existing value. The final probe uses a separate namespace and distinguishes handler execution from value changes. Article tables use only the final two rounds.
- Early ordering output did not distinguish received and accepted fields. The selected export does and includes cutoff checks.
- Codex retains recording-order legacy compatibility. Our unknown result for missing/duplicate sequences is a control, not a copy of that behavior.

No real Host restart, production incident dataset, independent QA, product fix, or development authorization is claimed.

## Download and language

[中文](/zh/research/evidence/2026-09-05-read-effects-acceptance-order) · [Complete evidence ZIP](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/read-effects-order-evidence.zip). Extract, enter the evidence directory, and run `node check.mjs`. Keep the complete directory; the script alone is insufficient.

- [baseline-1.log](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/baseline-1.log)
- [baseline-2.log](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/baseline-2.log)
- [check.mjs](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/check.mjs)
- [manifest.json](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/manifest.json)
- [observations.json](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/observations.json)
- [probe-http.mjs](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/probe-http.mjs)
- [probe-order.mjs](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/probe-order.mjs)
- [README.en.md](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/README.en.md)
- [README.zh.md](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/README.zh.md)
- [sources.json](https://joinwell52-ai.github.io/joinwell52/assets/read-effects-order-20260905/evidence/sources.json)
