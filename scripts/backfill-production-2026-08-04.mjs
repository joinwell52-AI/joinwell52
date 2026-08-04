#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs'

const runtimePath = 'research/runtime/2026/08/2026-08-04-runtime.md'
let text = readFileSync(runtimePath, 'utf8').replace(/\r\n/g, '\n')

if (text.includes('# Stage 4 — Research Runtime Production')) {
  console.log('Production backfill already applied.')
  process.exit(0)
}

function replaceFrontmatter(key, value) {
  const pattern = new RegExp(`^${key}:.*$`, 'm')
  if (!pattern.test(text)) throw new Error(`Missing frontmatter key: ${key}`)
  text = text.replace(pattern, `${key}: ${JSON.stringify(value)}`)
}

replaceFrontmatter('latest_task', 'Research Runtime Production')
replaceFrontmatter('github_commit', '95ed499dfb157489960b9b8155030de88c635e96')
replaceFrontmatter('github_status', 'Completed')
replaceFrontmatter('commit_verify', 'Completed')
replaceFrontmatter('lifecycle', 'Q-W003-01 remains Analysis; Production eligibility review completed with 0 eligible objects; Publication remains Waiting')
replaceFrontmatter('output', 'Research Runtime Production executed and Skipped with 0 Publication Candidates; upstream lifecycle gates were preserved.')
replaceFrontmatter('task_production', 'Skipped')

text = text.replace(
  'Three Research Operating System V2 runtime stages have completed on 2026-08-04:',
  'Four Research Operating System V2 runtime stages have now been executed on 2026-08-04:'
)

text = text.replace(
  '3. **Research Runtime Knowledge** reviewed the evidence-admission boundary, found no new completed and evidence-validated Research Note, preserved `K-20260803-01`, and retained all five architecture candidates at Knowledge.\n',
  '3. **Research Runtime Knowledge** reviewed the evidence-admission boundary, found no new completed and evidence-validated Research Note, preserved `K-20260803-01`, and retained all five architecture candidates at Knowledge.\n4. **Research Runtime Production** performed a governed eligibility review for all three columns and correctly returned `Skipped`: no object had passed the complete upstream Reading and Analysis gates required to create a Publication Candidate.\n'
)

text = text.replace(
  'No Daily Research Note, Architecture promotion, Specification, or scheduled Daily Publication has been created so far today. Research Runtime Production and Research Runtime Publication remain waiting.',
  'No Daily Research Note, Architecture promotion, Specification, or scheduled Daily Publication has been created so far today. Research Runtime Production has executed and is `Skipped` with zero Publication Candidates; Research Runtime Publication remains waiting for the 20:00 release gate.'
)

const stage4 = `# Stage 4 — Research Runtime Production

## Production eligibility result

\`\`\`yaml
production_run:
  scheduled_time: "15:00 Asia/Shanghai"
  actual_execution: "2026-08-04T16:27:00+08:00"
  execution_mode: backfill
  columns_reviewed: 3
  objects_reviewed: 2
  eligible_objects: 0
  candidates_created: 0
  public_files_created: 0
  status: Skipped
\`\`\`

Production read the completed Daily Research Plan, the canonical Queue, the active Analysis object, and the Publication Candidate contract.

### Column and object decisions

- **Digital Employee:** `Q-20260804-11` is only `Selected`; it must complete Skill 03 — Deep Reading and Skill 04 — Research Analysis before Production may write a report.
- **Active Analysis object:** `Q-W003-01` remains blocked from `Analysis → Research Note` until the four-path reconstruction experiment demonstrates deterministic ownership reconstruction, verifier independence, rejection of false success, and duplicate-action prevention.
- **Industry Architecture:** the Daily Research Plan recorded `No Selection`.
- **Open-source Engineering:** the Daily Research Plan recorded `No Selection`.

The correct Production result is therefore not an invented article. It is an explicit, evidence-backed `Skipped` result that preserves the lifecycle gates and exposes why no complete report was produced.

## Production output and verified commit

- Publication Candidate batch: `research/runtime/candidates/2026/08/2026-08-04-candidates.json`
  - status: `Skipped`
  - candidates: `0`
  - evidence commit: `95ed499dfb157489960b9b8155030de88c635e96`
- No bilingual report, cover, public article, index update, or website publication was created.
- The candidate-batch commit was fetched and inspected before the Runtime result was recorded.

## Next governed action

1. Engine must finish the evidence-producing work for `Q-W003-01`, or return it to an earlier state with a specific evidence request.
2. `Q-20260804-11` must begin with Deep Reading and later complete Analysis.
3. A future 15:00 Production run may create a complete bilingual Publication Candidate only after an object passes those upstream gates.

`

const capabilityMarker = '## Capability Release Synchronization — Research Report Production Engine V1.3'
if (!text.includes(capabilityMarker)) throw new Error('Capability release marker not found')
text = text.replace(capabilityMarker, `${stage4}${capabilityMarker}`)

const productionResult = `\`\`\`runtime-result
{
  "task": "production",
  "status": "Skipped",
  "input": "The completed three-column Daily Research Plan, the canonical Queue, Q-W003-01 at Analysis, Q-20260804-11 at Selected, and the Publication Candidate contract.",
  "input_zh": "已完成的三栏研究计划、权威 Research Queue、处于 Analysis 的 Q-W003-01、处于 Selected 的 Q-20260804-11，以及 Publication Candidate 契约。",
  "summary": "Executed the governed Production eligibility review for all three columns; no object passed the upstream gates, so Production correctly created zero candidates and returned Skipped.",
  "summary_zh": "对三个栏目执行了受治理的 Production 准入复核；没有对象通过上游门禁，因此正确生成 0 个出版候选，并以 Skipped 结束。",
  "output": "An empty Publication Candidate batch marked Skipped, exact bilingual blocker reasons, Runtime Record update, and verified GitHub evidence. No public article was created.",
  "output_zh": "标记为 Skipped 的空 Publication Candidate 批次、精确的中英文阻塞原因、Runtime Record 更新与已验证 GitHub 证据；没有创建公开文章。",
  "next": "Complete the Q-W003-01 reconstruction evidence or advance Q-20260804-11 through Deep Reading and Analysis before the next Production attempt.",
  "next_zh": "在下一次 Production 尝试前，完成 Q-W003-01 的重建证据，或将 Q-20260804-11 依次推进 through 深度阅读与研究分析。",
  "reason": "No research object passed the complete Production entry gate. Q-W003-01 remains blocked in Analysis; Q-20260804-11 remains Selected; the other two columns had No Selection.",
  "reason_zh": "没有研究对象通过完整的 Production 准入门禁：Q-W003-01 仍阻塞在 Analysis，Q-20260804-11 仍处于 Selected，另外两个栏目当天均为未选题。",
  "metrics": [
    { "label": "Columns reviewed", "label_zh": "复核栏目", "value": "3" },
    { "label": "Objects reviewed", "label_zh": "复核对象", "value": "2" },
    { "label": "Eligible objects", "label_zh": "合格对象", "value": "0" },
    { "label": "Publication Candidates", "label_zh": "出版候选", "value": "0" },
    { "label": "Public files created", "label_zh": "新增公开文件", "value": "0" }
  ],
  "artifacts": [
    { "label": "Publication Candidate batch", "label_zh": "出版候选批次", "path": "research/runtime/candidates/2026/08/2026-08-04-candidates.json", "commit": "95ed499dfb157489960b9b8155030de88c635e96" },
    { "label": "Daily Research Plan", "label_zh": "三栏研究计划", "path": "research/runtime/plans/2026/08/2026-08-04-plan.json", "commit": "42f3bc62ae3e710d5d5bdd3da0f94498c89a0293" },
    { "label": "Canonical Queue", "label_zh": "权威研究队列", "path": "research/queue/CURRENT.md" }
  ]
}
\`\`\`

`

const logMarker = '## Runtime Log'
if (!text.includes(logMarker)) throw new Error('Runtime Log marker not found')
text = text.replace(logMarker, `${productionResult}${logMarker}`)

text = `${text.trimEnd()}\n| 16:27 | Research Runtime Production | Runtime Started | Running | Loaded the Daily Research Plan, canonical Queue, active Analysis object, selected Digital Employee object, and Publication Candidate contract. |\n| 16:28 | Research Runtime Production | Eligibility Review | Completed | Reviewed all three columns and two relevant objects; no object passed the complete Production entry gate. |\n| 16:29 | Research Runtime Production | Production Result | Skipped | Created zero Publication Candidates and recorded exact blockers instead of manufacturing an article. |\n| 16:30 | Research Runtime Production | Commit Verify | Completed | Candidate batch commit 95ed499dfb157489960b9b8155030de88c635e96 was fetched and inspected. |\n`

writeFileSync(runtimePath, text)
console.log(`Patched ${runtimePath}`)
